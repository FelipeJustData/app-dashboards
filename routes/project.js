const express = require('express')
const router = express.Router()
const Customer = require("../models/Customer")
const Project = require("../models/Projects")
const Dashboard = require("../models/Dashboards")
const { eAdmin } = require("../helpers/eAdmin")
const { eUser } = require("../helpers/eUser")
const User_Permissions = require("../models/User_Permissions")
const { error } = require('console')

// Página inicial de projetos
// List All Projects
router.get('/', eUser, (req, res) => {
    if (req.user.typ_user == "Administrador") {
        Project.findAll().then((projects) => {
            res.render('projects/projects', { projects: projects })
        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar projetos " + error)
            res.redirect("/")
        })
    }
    else {
        User_Permissions.findAll({ where: { id_user: req.user.id_user } })
            .then((userPermissions) => {
                // Coleta os IDs dos projetos permitidos
                const projectIds = userPermissions.map(permission => permission.id_project);

                // Busca os projetos correspondentes aos IDs coletados
                Project.findAll({ where: { id_project: projectIds } })
                    .then((projects) => {
                        res.render("projects/projects", { user: req.user, projects: projects });
                    })
                    .catch((error) => {
                        req.flash("error_msg", "Erro ao listar projetos - " + error);
                        res.redirect("/");
                    });
            })
            .catch((error) => {
                req.flash("error_msg", "Erro em permissões do usuário - " + error);
                res.redirect("/");
            });

        /*
        User_Permissions.findAll({ where: { id_user: req.user.id_user } })
            .then((userPermissions) => {
                // Coleta os IDs dos projetos permitidos
                const projectIds = userPermissions.map(permission => permission.id_project);

                // Busca os projetos correspondentes aos IDs coletados
                Project.findAll({ where: { id_project: projectIds } })
                    .then((projects) => {
                        Customer.findAll({where: {id_customer: projects.id_customer}})
                        .then((customers) => {
                            res.render("projects/projects", { user: req.user, customers: customers });
                        })
                        .catch((error) => {
                            req.flash("error_msg", "Erro ao listar clientes - "+ error)
                        })
                        
                    })
                    .catch((error) => {
                        req.flash("error_msg", "Erro ao listar projetos - " + error);
                        res.redirect("/");
                    });
            })
            .catch((error) => {
                req.flash("error_msg", "Erro em permissões do usuário - " + error);
                res.redirect("/");
            });*/
    }
})

// List All Projects
router.get('/:id', eUser, (req, res) => {
    if (req.user.typ_user == "Administrador") {
        Project.findAll().then((project) => {
            Dashboard.findAll().then((dashboards) => {
                res.render('projects/view', { project: project, dashboards: dashboards })
            })
                .catch((error) => {
                    eq.flash("error_msg", "Erro ao listar dashborads " + error)
                    res.redirect("/")
                })

        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar projetos " + error)
            res.redirect("/")
        })
    }
    else {
        User_Permissions.findAll({ where: { id_user: req.user.id_user } })
            .then((userPermissions) => {
                // Coleta os IDs dos projetos permitidos
                const projectIds = userPermissions.map(permission => permission.id_project);

                // Busca os projetos correspondentes aos IDs coletados
                Project.findByPk(req.params.id)
                    .then((project) => {
                        Dashboard.findAll({ where: { id_project: req.params.id } })
                            .then((dashboards) => {
                                res.render("projects/view", { user: req.user, project: project, dashboards: dashboards });
                            })
                            .catch((error) => {
                                req.flash("error_msg", "Erro ao listar dashboards - " + error);
                                res.redirect("/");
                            })

                    })
                    .catch((error) => {
                        req.flash("error_msg", "Erro ao listar projetos - " + error);
                        res.redirect("/");
                    });
            })
            .catch((error) => {
                req.flash("error_msg", "Erro em permissões do usuário - " + error);
                res.redirect("/");
            });
    }
})


// List All Projects by customer
router.get('/customer/:id', (req, res) => {
    Customer.findOne({ where: { id_customer: req.params.id } }).then((customer) => {
        Project.findAll({ where: { id_customer: req.params.id } }).then((projects) => {
            res.render('projects/view', { projects: projects, customer: customer })
        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar projetos " + error)
            res.redirect("/")
        })
    }).catch((error) => {
        req.flash("error_msg", "Erro ao listar Cliente " + error)
        res.redirect("/")
    })

})

// Add Project
router.get("/add", (req, res) => {
    Customer.findAll().then((customers) => {
        res.render("projects/addproject", { customers: customers })
    }).catch((error) => {
        req.flash("error_msg", "Erro ao listar clientes " + error)
        res.redirect("/")
    })

})

router.post("/new", (req, res) => {
    const newProject = {
        nam_project: req.body.nam_project,
        des_autoplay: req.body.des_autoplay,
        des_autoplay_timing: req.body.des_autoplay_timing,
        des_project_image_desktop: req.body.des_project_image_desktop,
        des_project_image_mobile: req.body.des_project_image_mobile,
        dat_expiration: req.body.dat_expiration,
        des_principal_color: req.body.des_principal_color,
        des_secundary_color: req.body.des_secundary_color,
        des_menu_color: req.body.des_menu_color,
        des_options_colors: req.body.des_options_colors,
        id_customer: req.body.customer
    }

    Project.create(newProject).then(() => {
        //console.log("Usuário cadastrado com sucesso")
        req.flash("success_msg", "Projeto cadastrado com sucesso")
        res.redirect("/projects/")
    }).catch((error) => {
        req.flash("error_msg", "Erro ao cadastrar projeto -" + error)
        res.redirect("/projects/add")
    })
})

router.get('/get-dashboards/:projectIds', (req, res) => {
    const projectIds = req.params.projectIds.split(','); // Obtenha os IDs dos projetos selecionados

    Dashboard.findAll({ where: { id_project: projectIds } }).then((dashboards) => {
        res.json(dashboards)
    }).catch((error) => {
        res.status(500).json({ error: "Error ao buscar dashboards" })
    })
});


module.exports = router