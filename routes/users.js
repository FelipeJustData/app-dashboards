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
const Favorite = require('../models/Favorite')
const { Op } = require('sequelize');
const multer = require("multer");
const { storage } = require('../config/multerConfig');
const upload = multer({ storage: storage('usuario') });

// Rota para listar todos os usuários
router.get('/users', eAdmin, (req, res) => {
    User.findAll().then((users) => {
        res.render("users/users", { users: users })
    }).catch((error) => {
        req.flash("error_msg", "Erro ao lista usuários " + error)
        res.redirect("/admin")
    })

})

// Rota para exibir o formulário para adicionar novo usuário
router.get("/register", eAdmin, (req, res) => {
    Projects.findAll().then((projects) => {
        res.render("users/register", { projects: projects })
    }).catch((error) => {
        req.flash("error_msg", "Nenhum projeto cadastrado - " + error)
        res.redirect("/users/users")
    })

})

// Salvar novo usuário
router.post('/users/new', eAdmin, upload.single('photo_user'), async (req, res) => {
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
                const photoUser = req.file.filename


                const newUser = {
                    name_user: req.body.name,
                    email_user: req.body.email,
                    password_user: req.body.password,
                    typ_user: req.body.user_type,
                    is_just: is_just,
                    photo_user: photoUser
                }

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password_user, salt, (error, hash) => {
                        if (error) {
                            req.flash("error_msg", "Erro ao criptografar senha - " + error)
                            res.redirect("/home")
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
            styles: [{ src: "/styles/pages/users.css" }]
        });
    } catch (error) {
        req.flash("error_msg", "Erro ao carregar dados de usuário - " + error);
        res.redirect("/users/users");
    }
});

// Rota para exibir o formulário de edição de perfil usuário
router.get('/users/perfil/:id', eUser, async (req, res) => {
    try {
        const userId = req.params.id;
        const userEdit = await User.findByPk(userId);

        if (!userEdit) {
            req.flash("error_msg", "Usuário não encontrado");
            return res.redirect("/users/users");
        }

        res.setHeader('Cache-Control', 'no-cache');
        res.render("users/editperfil", {
            userEdit,
            styles: [{ src: "/styles/pages/users.css" }]
        });
    } catch (error) {
        req.flash("error_msg", "Erro ao carregar dados de usuário - " + error);
        res.redirect("/users/users");
    }
});

// Rota para processar a edição do usuário e permissões 
router.post('/users/perfil/:id', eUser, upload.single('photo_user'), async (req, res) => {
    try {
        const userId = req.params.id;
        const photoUser = req.file.filename
        const password = req.body.password

        if (password) {

            var errors = []

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
                res.render("users/editperfil/", {
                    errors: errors, userEdit: req.user,
                    styles: [{ src: "/styles/pages/users.css" }]
                })
            }
            else {

                const updateUser = {
                    password_user: req.body.password,
                    photo_user: photoUser
                }

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(updateUser.password_user, salt, async (error, hash) => {
                        if (error) {
                            req.flash("error_msg", "Erro ao criptografar senha - " + error)
                            res.redirect("/users/users/perfil/" + req.params.id)
                        }
                        else {
                            updateUser.password_user = hash
                            // Atualizar os dados do usuário (nome, email, senha, etc.)
                            await User.update(
                                updateUser,
                                {
                                    where: { id_user: userId },
                                }
                            );
                        }
                    })
                })
            }

        } else {
            User.update(
                { photo_user: photoUser },
                {
                    where: { id_user: userId },
                }
            );
        }
        req.flash("success_msg", "Usuário atualizado com sucesso");
        res.redirect(`/users/users/perfil/${req.params.id}`);
    } catch (error) {
        req.flash("error_msg", "Erro ao atualizar usuário - " + error);
        res.redirect(`/users/users/perfil/${req.params.id}`);
    }
});

// Rota para processar a edição do usuário e permissões 
router.post('/users/edit/:id', eAdmin, upload.single('photo_user'), async (req, res) => {

    try {
        const userId = req.params.id;
        const photoUser = req.file.filename        

        // Atualizar os dados do usuário
        await User.update(
            {
                name_user: req.body.name,
                email_user: req.body.email,
                typ_user: req.body.user_type,
                photo_user: photoUser
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
        res.redirect(`/users/edit/${req.params.id}`);
    }
});

// Rota para processar a edição de permissões 
router.post('/users/editpermission/:id', eAdmin, async (req, res) => {
    const userId = req.params.id;
    try {

        // Atualizar os dados do usuário
        await User.update(
            {
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

        try {
            if (projectPermissions && dashboardPermissions) {
                for (const projectId of projectPermissions) {
                    for (const dashboardId of dashboardPermissions) {
                        const dashboard = await Dashboards.findByPk(dashboardId);
                        if (dashboard && dashboard.id_project == projectId) {
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
        } catch (error) {
            req.flash("error_msg", "Erro ao cadastrar usuário" + error);
            res.redirect("/users/users");
        }
        req.flash("success_msg", "Permissão do usuário atualizado com sucesso");
        res.redirect("/users/users");
    } catch (error) {
        req.flash("error_msg", "Erro ao atualizar usuário - " + error);
        res.redirect(`/users/edit/${userId}`);
    }
});

// Rota para deletar usuário
router.post("/users/delete", eAdmin, (req, res) => {
    const userId = req.body.id;

    // Encontre e exclua todas as permissões associadas ao usuário
    User_Permissions.destroy({ where: { id_user: userId } })
        .then(() => {
            // Excluir o  usuário
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

// Exibir tela de login
router.get("/login", (req, res) => {
    if (!req.user) {
        res.render("users/login", { styles: [{ src: "/styles/pages/login.css" }] })
    } else {
        res.redirect("/")
    }
})

// Rota para realizar o login do usuário
router.post("/login", (req, res, next) => {

    const rememberMe = Boolean(req.body.rememberMe);

    passport.authenticate("local", {
        successRedirect: "/home/",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);

    if (rememberMe) {
        // Configuração do tempo de expiração do cookie (30 dias)
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; 
    }
})

// Logout
router.get("/logout", (req, res) => {
    req.logout(function (error) {
        if (error) {
            return next(error)
        }
        req.flash("succes_msg", "Deslogado com sucesso")
        res.redirect("/")
    })
})

// Permissões do usuário
// Rota para exibir as persmissões do usuário por ID do usuário
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
            dashboards
        });
    } catch (error) {
        req.flash("error_msg", "Erro ao carregar dados de usuário - " + error);
        res.redirect("/users/users");
    }
})

//Rota para atualizar as permissões do usuário
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

// Rota para listar todos os usuários e suas permissões
router.get('/users-permissions', async (req, res) => {
    try {
        const usersWithPermissions = await User.findAll({
            include: [
                {
                    model: Projects,
                    attributes: ['nam_project'],
                    include: [
                        {
                            model: User_Permissions,
                            attributes: ['des_project_access']
                        }
                    ]
                },
                {
                    model: Dashboards,
                    attributes: ['title'],
                }
            ]
        });

        res.render('users-permissions', { usersWithPermissions });
    } catch (error) {
        console.error('Erro ao buscar dados dos usuários:', error);
        res.status(500).send('Erro ao buscar dados dos usuários.');
    }
});

// Adicionar conteúdo aos favoritos
router.post('/favorites', eUser, async (req, res) => {
    const favorited = {
        id_user: req.user.id_user,
        id_project: req.body.id_project
    };

    try {
        const favorite = await Favorite.create(favorited);
        res.json(favorite);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao adicionar aos favoritos' });
    }
});

// Remover conteúdo dos favoritos
router.delete('/favorites', eUser, async (req, res) => {
    const userId = req.user.id_user;
    const contentId = req.body.id_project;

    try {
        await Favorite.destroy({ where: { id_user: userId, id_project: contentId } });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao remover dos favoritos' });
    }
});

module.exports = router;