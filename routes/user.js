const express = require('express')
const router = express.Router()
const User = require("../models/User")
const bcrypt = require('bcryptjs')
const passport = require("passport")
const { eAdmin } = require("../helpers/eAdmin")
const { eUser } = require("../helpers/eUser")
const Customer = require('../models/Customer')
const Projects = require('../models/Projects')
const Dashboards = require('../models/Dashboards')
const User_Permissions = require('../models/User_Permissions')
const { Op } = require('sequelize');

// List All Users
router.get('/users', eAdmin, (req, res) => {
    User.findAll().then((users) => {
        res.render("users/users", { users: users })
    }).catch((error) => {
        req.flash("error_msg", "Erro ao lista usuários " + error)
        res.redirect("/admin")
    })

})


router.get("/register", (req, res) => {
    Projects.findAll().then((projects) => {
        res.render("users/register", { projects: projects })
    }).catch((error) => {
        req.flash("error_msg", "Nenhum projeto cadastrado - " + error)
        res.redirect("/users/users")
    })

})



// Add new User
router.post('/users/new', (req, res) => {
    var errors = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ texto: "Nome inválido" })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        errors.push({ texto: "Email inválido" })
    }

    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        errors.push({ texto: "Senha inválido" })
    }

    if (req.body.password.length < 4) {
        errors.push({ texto: "Senha muito curta" })
    }

    if (req.body.password != req.body.password2) {
        errors.push({ texto: "Senhas diferentes, tente novamente" })
    }

    if (errors.length > 0) {
        res.render("users/register", { errors: errors })
    }
    else {

        User.findOne({ where: { email_user: req.body.email } }).then(async (user) => {
            if (user) {
                req.flash("error_msg", "Email já cadastrado")
                res.redirect("/users/register")
            } else {
                const is_just = Boolean(req.body.CheckJust)

                const newUser = {
                    name_user: req.body.name,
                    email_user: req.body.email,
                    password_user: req.body.password,
                    typ_user: req.body.user_type,
                    is_just: is_just
                }

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password_user, salt, (error, hash) => {
                        if (error) {
                            req.flash("error_msg", "Erro ao criptografar senha - " + error)
                            res.redirect("/")
                        }
                        else {
                            newUser.password_user = hash
                            User.create(newUser).then(async (newUser) => {

                                const projects = req.body.project_permissions
                                const dashboards = req.body.dashboard_permissions

                                // Para cada projeto selecionado, crie um registro na tabela 'user_permissions' associando o usuário ao projeto
                                if (projects && projects.length > 0) {
                                    for (const projectId of projects) {
                                        if (!isNaN(parseFloat(projectId)) && isFinite(projectId)) {
                                            if (dashboards) {
                                                for (const dashboardId of dashboards) {
                                                    const dashboard = await Dashboards.findOne({ where: { id_project: projectId, id_dashboard: dashboardId } });
                                                    if (dashboard) {
                                                        await User_Permissions.create({
                                                            id_user: newUser.id_user,
                                                            id_project: projectId,
                                                            id_dashboard: dashboardId,
                                                            des_dashboard_access: true,
                                                            des_project_access: true
                                                        })
                                                    }
                                                }

                                            } else {
                                                await User_Permissions.create({
                                                    id_user: newUser.id_user,
                                                    id_project: projectId,
                                                    des_dashboard_access: false,
                                                    des_project_access: true
                                                })
                                            }
                                        }

                                    }
                                }

                                req.flash("success_msg", "Usuário cadastrado com sucesso")
                                res.redirect("/users/users")
                            }).catch((error) => {
                                req.flash("error_msg", "Erro ao cadastrar usuário " + error)
                                res.redirect("/users/register")
                            })

                        }
                    })
                })
            }
        }).catch((error) => {
            req.flash("error_mag", "Error interno - " + error)
        })
    }
})
/*
// Search User by ID
router.get("/users/edit/:id", eAdmin, (req, res) => {
    User.findOne({ where: { id_user: req.params.id } }).then((user) => {
        res.render("users/editusers", { user: user })
    }).catch((error) => {
        req.flash("error_msg", "Usuário não existe - " + error)
        res.redirect("/users/users")
    })
})

// Save Edit User
router.post("/users/edit", (req, res) => {

    User.update({
        name_user: req.body.name,
        email_user: req.body.email,
        typ_user: req.body.user_type
    }, {
        where: { id_user: req.body.id }
    }).then(() => {
        req.flash("success_msg", "Usuário editado com sucesso")
        res.redirect("/users/users")
    }).catch((error) => {
        req.flash("error_msg", "Erro ao editar usuário - " + error)
        res.redirect("/users/users")
    })
})
*/
// Rota para exibir o formulário de edição de usuário e permissões
router.get('/users/edit/:id', eAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const userEdit = await User.findByPk(userId);

        if (!userEdit) {
            req.flash("error_msg", "Usuário não encontrado");
            return res.redirect("/users/users");
        }

        // Buscar as permissões do usuário
        const userPermissions = await User_Permissions.findAll({ where: { id_user: userId } });

        // Buscar todos os projetos e dashboards disponíveis
        const projects = await Projects.findAll();
        const dashboards = await Dashboards.findAll();

        res.render("users/editusers", {
            userEdit,
            userPermissions,
            projects,
            dashboards,
        });
    } catch (error) {
        req.flash("error_msg", "Erro ao carregar dados de usuário - " + error);
        res.redirect("/users/users");
    }
});

// Rota para processar a edição do usuário e permissões 
router.post('/users/edit/:id', eAdmin, async (req, res) => {
    try {
        const userId = req.params.id;

        // Atualizar os dados do usuário (nome, email, senha, etc.)
        await User.update(
            {
                name_user: req.body.name,
                email_user: req.body.email,
                typ_user: req.body.user_type,
            },
            {
                where: { id_user: userId },
            }
        );

        // Remover todas as permissões existentes para o usuário
        await User_Permissions.destroy({
            where: { id_user: userId },
        });

        // Adicionar as novas permissões com base no formulário
        const projectPermissions = req.body.project_permissions;
        const dashboardPermissions = req.body.dashboard_permissions;

        if (projectPermissions && dashboardPermissions) {
            for (const projectId of projectPermissions) {
                for (const dashboardId of dashboardPermissions) {
                    const dashboard = await Dashboards.findByPk(dashboardId);

                    if (dashboard && dashboard.id_project === projectId) {
                        await User_Permissions.create({
                            id_user: userId,
                            id_project: projectId,
                            id_dashboard: dashboardId,
                            des_dashboard_access: true,
                            des_project_access: true,
                        });
                    }
                }
            }
        }

        req.flash("success_msg", "Usuário atualizado com sucesso");
        res.redirect("/users/users");
    } catch (error) {
        req.flash("error_msg", "Erro ao atualizar usuário - " + error);
        res.redirect(`/users/edit/${userId}`);
    }
});


// Delete User
router.post("/users/delete", eAdmin, (req, res) => {
    const userId = req.body.id;

    // Passo 1: Encontre e exclua todas as permissões associadas ao usuário
    User_Permissions.destroy({ where: { id_user: userId } })
        .then(() => {
            // Passo 2: Agora você pode excluir o próprio usuário
            return User.destroy({ where: { id_user: userId } });
        })
        .then(() => {
            req.flash("success_msg", "Usuário deletado com sucesso, juntamente com suas permissões");
            res.redirect("/users/users");
        })
        .catch((error) => {
            req.flash("error_msg", "Erro ao deletar o usuário - " + error);
            res.redirect("/users/users");
        });
});

// LOGIN
router.get("/login", (req, res) => {
    res.render("users/login",{styles: [{src:"/styles/pages/login.css"}]})
})

router.get("/login/:name", (req, res) => {
    Customer.findOne({ where: { name: req.params.name } }).then((customer) => {
        res.render("users/login", { customer: customer })
    })
})

router.post("/login", (req, res, next) => {
    if (req.body.name_customer) {
        passport.authenticate("local", {
            successRedirect: "/admin/customers/" + req.body.name_customer,
            failureRedirect: "/login/" + req.body.name_customer,
            failureFlash: true
        })(req, res, next)
    } else {
        passport.authenticate("local", {
            successRedirect: "/home/",
            failureRedirect: "/users/login",
            failureFlash: true
        })(req, res, next)
    }
})

// LOGOUT
router.get("/logout", (req, res) => {
    req.logout(function (error) {
        if (error) {
            return next(error)
        }
        req.flash("succes_msg", "Deslogado com sucesso")
        res.redirect("/")
    })
})

module.exports = router


//PERMISSIONS
// Search User by ID
router.get("/users/permissions/:id", eAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const userEdit = await User.findByPk(userId);

        if (!userEdit) {
            req.flash("error_msg", "Usuário não encontrado");
            return res.redirect("/users/users");
        }

        // Buscar as permissões do usuário
        const userPermissions = await User_Permissions.findAll({ where: { id_user: userId } });

        // Buscar todos os projetos e dashboards disponíveis
        const projects = await Projects.findAll();
        const dashboards = await Dashboards.findAll();

        res.render("users/permissions", {
            userEdit,
            userPermissions,
            projects,
            dashboards,
        });
    } catch (error) {
        req.flash("error_msg", "Erro ao carregar dados de usuário - " + error);
        res.redirect("/users/users");
    }
})


router.post("/users/permissions", eAdmin, async (req, res) => {
    try {
        const userId = req.params.id;

        // Atualizar os dados do usuário (nome, email, senha, etc.)
        await User.update(
            {
                name_user: req.body.name,
                email_user: req.body.email,
                typ_user: req.body.user_type,
            },
            {
                where: { id_user: userId },
            }
        );

        // Remover todas as permissões existentes para o usuário
        await User_Permissions.destroy({
            where: { id_user: userId },
        });

        // Adicionar as novas permissões com base no formulário
        const projectPermissions = req.body.project_permissions;
        const dashboardPermissions = req.body.dashboard_permissions;

        if (projectPermissions && dashboardPermissions) {
            for (const projectId of projectPermissions) {
                for (const dashboardId of dashboardPermissions) {
                    const dashboard = await Dashboards.findByPk(dashboardId);

                    if (dashboard && dashboard.id_project === projectId) {
                        await User_Permissions.create({
                            id_user: userId,
                            id_project: projectId,
                            id_dashboard: dashboardId,
                            des_dashboard_access: true,
                            des_project_access: true,
                        });
                    }
                }
            }
        }

        req.flash("success_msg", "Usuário atualizado com sucesso");
        res.redirect("/users/users");
    } catch (error) {
        req.flash("error_msg", "Erro ao atualizar usuário - " + error);
        res.redirect(`/users/edit/${userId}`);
    }
})