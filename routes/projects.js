const express = require('express')
const router = express.Router()
const Customer = require("../models/Customer")
const Project = require("../models/Projects")
const Dashboard = require("../models/Dashboards")
const { eAdmin } = require("../helpers/eAdmin")
const { eUser } = require("../helpers/eUser")
const User_Permissions = require("../models/User_Permissions")
const { error } = require('console')
const multer = require("multer");
const { storage } = require('../config/multerConfig');
const upload = multer({ storage: storage('projeto') });
const { Op } = require('sequelize');
const Favorite = require('../models/Favorite')
const ProjectView = require("../models/ProjectView")
const db = require("../db/db")

// Lista todos os projetos
router.get('/', eUser, async (req, res) => {
    if (req.user.typ_user == "Administrador") {

        try {
            // Lógica para aplicar os filtros
            const filterOptions = req.query;

            const filterConditions = {};

            if (filterOptions.status) {
                filterConditions.des_status = filterOptions.status;
            }

            if (filterOptions.expirationDate) {
                filterConditions.dat_expiration = filterOptions.expirationDate;
            }

            if (filterOptions.client) {
                filterConditions.id_customer = filterOptions.client;
            }

            var projects = await Project.findAll({
                where: filterConditions
            })          

            // Carregue os clientes com base nos projetos
            const customers = await Customer.findAll({
                where: { id_customer: projects.map(project => project.id_customer) }
            });

            const uniqueCustomers = await Customer.findAll();

            const favorites = await Favorite.findAll({
                where: { id_user: req.user.id_user, id_project: projects.map(project => project.id_project) }
            });

            // Associe os clientes aos projetos com base no id_customer
            projects.forEach(project => {
                const customer = customers.find(customer => customer.id_customer == project.id_customer);
                const favorite = favorites.find(favorite => favorite.id_project == project.id_project)
                project.customer = customer;
                project.favorite = favorite
            });

            // Renderiza a view
            res.render("projects/projects", { 
                user: req.user, 
                customers: uniqueCustomers, 
                projects: projects, 
                styles: [{ src: "/styles/pages/projects.css" }],
                scripts: [{ src: "/js/projects.js" }]
            });
        } catch (error) {
            req.flash("error_msg", "Erro ao listar projetos - " + error);
            res.redirect("/home");
        }
    }
    else {
       await User_Permissions.findAll({ where: { id_user: req.user.id_user } })
            .then(async (userPermissions) => {
                // Coleta os IDs dos projetos permitidos
                const projectIds = userPermissions.map(permission => permission.id_project);

                // Lógica para aplicar os filtros
                const filterOptions = req.query;

                const filterConditions = {};

                if (filterOptions.status) {
                    filterConditions.des_status = filterOptions.status;
                }

                if (filterOptions.expirationDate) {
                    filterConditions.dat_expiration = filterOptions.expirationDate;
                }

                if (filterOptions.client) {
                    filterConditions.id_customer = filterOptions.client;
                }

                // Busca os projetos correspondentes aos IDs coletados
               await Project.findAll({ where: { id_project: projectIds, ...filterConditions } })
                    .then(async (projects) => {
                        // Carregue os clientes com base nos projetos
                        const customers = await Customer.findAll({
                            where: { id_customer: projects.map(project => project.id_customer) }
                        });

                        const favorites = await Favorite.findAll({
                            where: { id_user: req.user.id_user, id_project: projects.map(project => project.id_project) }
                        });

                        // Associe os clientes aos projetos com base no id_customer
                        projects.forEach(project => {
                            const customer = customers.find(customer => customer.id_customer == project.id_customer);
                            const favorite = favorites.find(favorite => favorite.id_project == project.id_project)
                            project.customer = customer;
                            project.favorite = favorite
                        });

                        // Renderiza a view
                        res.render("projects/projects", { user: req.user, 
                            projects: projects, 
                            styles: [{ src: "/styles/pages/projects.css" }],
                            scripts: [{ src: "/js/projects.js" }]
                        });
                    })
                    .catch((error) => {
                        req.flash("error_msg", "Erro ao listar projetos - " + error);
                        res.redirect("/home");
                    });
            })
            .catch((error) => {
                req.flash("error_msg", "Erro em permissões do usuário - " + error);
                res.redirect("/home");
            });
    }
});

// List Save Projects
router.get('/saves', eUser, async (req, res) => {
    try {

        const favorites = await Favorite.findAll({
            where: { id_user: req.user.id_user }
        });

        // Recupere os projetos que você deseja exibir n
        const projects = await Project.findAll({
            where: { id_project: favorites.map(project => project.id_project) }
        });

        // Carregue os clientes com base nos projetos
        const customers = await Customer.findAll({
            where: { id_customer: projects.map(project => project.id_customer) }
        });

        // Associe os clientes aos projetos com base no id_customer
        projects.forEach(project => {
            const customer = customers.find(customer => customer.id_customer == project.id_customer);
            project.customer = customer;
        });

        res.render("projects/saves", { user: req.user, projects: projects, styles: [{ src: "/styles/pages/projects.css" }] });
    } catch (error) {
        req.flash("error_msg", "Erro ao listar projetos - " + error);
        res.redirect("/home");
    }


});

// List Recentes Projects
router.get('/recents', eUser, async (req, res) => {
    try {

        // Obtém as últimas 4 visualizações do usuário
        const recentViews = await ProjectView.findAll({
            attributes: ['id_project', [db.Sequelize.fn('MAX', db.Sequelize.col('createdAt')), 'latestView']],
            where: { id_user: req.user.id_user },
            order: [[db.Sequelize.fn('MAX', db.Sequelize.col('createdAt')), 'DESC']],
            group: ['id_project'],
        });

        // Obtém os projetos associados às visualizações
        const recentProjects = await Promise.all(
            recentViews.map(async (view) => {
                const project = await Project.findByPk(view.id_project);
                return project;
            })
        );

        // Recupere os projetos que você deseja exibir no carousel
        const projects = await Project.findAll();

        // Carregue os clientes com base nos projetos
        const customers = await Customer.findAll({
            where: { id_customer: projects.map(project => project.id_customer) }
        });

        const favorites = await Favorite.findAll({
            where: { id_user: req.user.id_user, id_project: projects.map(project => project.id_project) }
        });

        // Associe os clientes aos projetos recentes com base no id_customer
        recentProjects.forEach(project => {
            const customer = customers.find(customer => customer.id_customer == project.id_customer);
            const favorite = favorites.find(favorite => favorite.id_project == project.id_project)
            project.customer = customer;
            project.favorite = favorite
        });

        res.render("projects/recents", { user: req.user, projects: recentProjects, styles: [{ src: "/styles/pages/projects.css" }] });
    } catch (error) {
        req.flash("error_msg", "Erro ao listar projetos - " + error);
        res.redirect("/home");
    }


});

// Visualiza projeto
router.get('/view/:id', eUser, async (req, res) => {
    try {
        const idProject = req.params.id

        if (req.user.typ_user === "Administrador") {
            const project = await Project.findByPk(idProject);
            const dashboards = await Dashboard.findAll({ where: { id_project: idProject } });

            const customer = await Customer.findByPk(project.id_customer);

            project.customer = customer;

            dashboards.forEach(dashboard => {
                dashboard.project = project
            })

            res.render('projects/view', { 
                project, 
                dashboards, 
                styles: [{ src: "/styles/pages/projects.css" }],
                scripts: [{ src: "/js/viewproject.js" }]
            });
        } else {
            const userPermissions = await User_Permissions.findAll({ where: { id_user: req.user.id_user } });
            const dashboardIds = userPermissions.map(permission => permission.id_dashboard);

            if (dashboardIds.length == 0) {
                req.flash("error_msg", "Você não tem permissão para acessar os dashboards deste projeto.");
                return res.redirect("/projects");
            }

            const project = await Project.findByPk(req.params.id);
            const dashboards = await Dashboard.findAll({ where: { id_dashboard: dashboardIds, id_project: project.id_project } });

            if (dashboards.length == 0) {
                req.flash("error_msg", "Nenhum dashboard encontrado com base nas suas permissões para este projeto.");
                return res.redirect("/projects");
            }

            const customer = await Customer.findByPk(project.id_customer);

            project.customer = customer;

            dashboards.forEach(dashboard => {
                dashboard.project = project
            })

            res.render("projects/view", { 
                user: req.user, 
                project, 
                dashboards, 
                styles: [{ src: "/styles/pages/projects.css" }],
                scripts: [{ src: "/js/viewproject.js" }]
            });
        }
    } catch (error) {
        console.error("Erro ao listar projetos e dashboards:", error);
        req.flash("error_msg", "Erro ao listar projetos e dashboards.");
        res.redirect("/home");
    }
});

// Add Vistos recentemente
router.post('/view', async (req, res) => {
    const userId = req.user.id_user;
    const projectId = req.body.id_project;


    try {
        // Adiciona uma entrada na tabela de visualizações
        await ProjectView.create({
            id_user: userId,
            id_project: projectId,
        });

        // Resto da lógica para exibir o projeto
        res.status(200).json({ message: 'Visualização registrada com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar visualização:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


// List All Projects by customer
router.get('/customer/:id', (req, res) => {
    Customer.findOne({ where: { id_customer: req.params.id } }).then((customer) => {
        Project.findAll({ where: { id_customer: req.params.id } }).then((projects) => {
            res.render('projects/view', { projects: projects, customer: customer, styles: [{ src: "/styles/pages/projects.css" }] })
        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar projetos " + error)
            res.redirect("/home")
        })
    }).catch((error) => {
        req.flash("error_msg", "Erro ao listar Cliente " + error)
        res.redirect("/home")
    })

})

// Add Project
router.get("/add", eAdmin, (req, res) => {
    Customer.findAll().then((customers) => {
        res.render("projects/addproject", { 
            customers: customers, 
            styles: [{ src: "/styles/pages/projects.css" }],
            scripts: [{ src: "/js/addproject.js" }]
        })
    }).catch((error) => {
        req.flash("error_msg", "Erro ao listar clientes " + error)
        res.redirect("/home")
    })

})

// Salva novo projeto
router.post("/new", eAdmin, upload.fields([
    { name: 'des_project_image_desktop', maxCount: 1 },
    { name: 'des_project_image_mobile', maxCount: 1 },
    { name: 'des_project_image_logo', maxCount: 1 }
]), (req, res) => {

    try {
        const newProject = {
            des_project_image_desktop: req.files['des_project_image_desktop'] ? req.files['des_project_image_desktop'][0].filename : null,
            des_project_image_mobile: req.files['des_project_image_mobile'] ? req.files['des_project_image_mobile'][0].filename : null,
            des_project_logo_header: req.files['des_project_image_logo'] ? req.files['des_project_image_logo'][0].filename : null,
            nam_project: req.body.nam_project,
            objective_project: req.body.objective_project,
            id_customer: req.body.customer,
            dat_expiration: req.body.dat_expiration,
            des_status: req.body.des_status,
            des_autoplay_timing: req.body.des_autoplay_timing,
            des_title_color: req.body.des_title_color,
            des_bg_title_color: req.body.des_bg_title_color
        }

        Project.create(newProject).then(() => {
            req.flash("success_msg", "Projeto cadastrado com sucesso")
            res.redirect("/projects/")
        }).catch((error) => {
            req.flash("error_msg", "Erro ao cadastrar projeto -" + error)
            res.redirect("/projects/add")
        })

    } catch (error) {
        console.error("Erro no upload:", error);
        req.flash("error_msg", "Erro no upload da imagem -" + error.message);
        res.redirect("/projects/add");
    }


})

// Coleta todos os dashboards de determinado projeto
router.get('/get-dashboards/:projectIds', (req, res) => {
    const projectIds = req.params.projectIds.split(','); // Obtenha os IDs dos projetos selecionados

    Dashboard.findAll({ where: { id_project: projectIds } }).then((dashboards) => {
        res.json(dashboards)
    }).catch((error) => {
        res.status(500).json({ error: "Error ao buscar dashboards" })
    })
});

// Edita Projecto
router.get("/project/edit/:id", eAdmin, (req, res) => {
    Project.findByPk(req.params.id).then((project) => {
        Customer.findByPk(project.id_customer).then((customerProject) => {
            Customer.findAll().then((customers) => {

                // Renderiza a view
                res.render("projects/editproject", { 
                    project: project, 
                    customerProject: customerProject, 
                    customers: customers, 
                    styles: [{ src: "/styles/pages/projects.css" }],
                    scripts: [{ src: "/js/editproject.js" }]
                })
            }).catch((error) => {
                req.flash("error_msg", "Erro ao listar clientes " + error)
                res.redirect("/home")
            })
        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar cliente do projeto " + error)
            res.redirect("/home")
        })
    }).catch((error) => {
        req.flash("error_msg", "Erro ao listar projeto " + error)
        res.redirect("/home")
    })

})

//save update
router.post("/update/:id", eAdmin, upload.fields([
    { name: 'des_project_image_desktop', maxCount: 1 },
    { name: 'des_project_image_mobile', maxCount: 1 },
    { name: 'des_project_image_logo', maxCount: 1 }
]), (req, res) => {
    const projectID = req.params.id

    const updateProject = {
        des_project_image_desktop: req.files['des_project_image_desktop'] ? req.files['des_project_image_desktop'][0].filename : null,
        des_project_image_mobile: req.files['des_project_image_mobile'] ? req.files['des_project_image_mobile'][0].filename : null,
        des_project_logo_header: req.files['des_project_image_logo'] ? req.files['des_project_image_logo'][0].filename : null,
        nam_project: req.body.nam_project,
        objective_project: req.body.objective_project,
        id_customer: req.body.customer,
        dat_expiration: req.body.dat_expiration,
        des_status: req.body.des_status,
        des_autoplay_timing: req.body.des_autoplay_timing,
        des_title_color: req.body.des_title_color,
        des_bg_title_color: req.body.des_bg_title_color
    }

    Project.update(updateProject, { where: { id_project: projectID } }).then(async () => {
        try {
            if (req.user.typ_user === "Administrador") {
                const project = await Project.findByPk(req.params.id);
                const dashboards = await Dashboard.findAll({ where: { id_project: project.id_project } });

                res.render('projects/view', { project, dashboards, styles: [{ src: "/styles/pages/projects.css" }] });
            } else {
                const userPermissions = await User_Permissions.findAll({ where: { id_user: req.user.id_user } });
                const dashboardIds = userPermissions.map(permission => permission.id_dashboard);

                if (dashboardIds.length == 0) {
                    req.flash("error_msg", "Você não tem permissão para acessar os dashboards deste projeto.");
                    return res.redirect("/projects");
                }

                const project = await Project.findByPk(req.params.id);
                const dashboards = await Dashboard.findAll({ where: { id_dashboard: dashboardIds, id_project: project.id_project } });

                if (dashboards.length == 0) {
                    req.flash("error_msg", "Nenhum dashboard encontrado com base nas suas permissões para este projeto.");
                    return res.redirect("/projects");
                }

                res.render("projects/view", { user: req.user, project, dashboards, styles: [{ src: "/styles/pages/projects.css" }] });
            }
        } catch (error) {
            console.error("Erro ao listar projetos e dashboards:", error);
            req.flash("error_msg", "Erro ao listar projetos e dashboards.");
            res.redirect("/home");
        }
    }).catch((error) => {
        req.flash("error_msg", "Erro ao cadastrar projeto -" + error)
        res.redirect("/projects")
    })
})

// Coleta todos os projetos de determinado cliente
router.get('/get-projects/:id_customer', (req, res) => {
    const customer = req.params.id_customer

    Project.findAll({ where: { id_customer: customer } }).then((projects) => {
        res.json(projects)
    }).catch((error) => {
        res.status(500).json({ error: "Error ao buscar dashboards" })
    })
});

// Delete Project
router.post("/project/delete", eAdmin, (req, res) => {
    const projectId = req.body.id;

    // Encontre e exclua todas as permissões associadas ao usuário
    Project.destroy({ where: { id_project: projectId } })
        .then(() => {
            req.flash("success_msg", "Seu projeto foi excluído com sucesso.");
            res.redirect("/projects");
        })
        .catch((error) => {
            req.flash("error_msg", "Erro ao deletar o projeto - " + error);
            res.redirect("/projects");
        });
});


//search
// Rota para pesquisa interna
router.post('/search', async (req, res) => {
    const searchTerm = req.body.searchTerm;

    try {

        if (req.user.typ_user == "Administrador") {
            // Substitua 'Project' e 'Dashboard' pelos seus modelos Sequelize reais
            const projects = await Project.findAll({
                where: {
                    nam_project: {
                        [Op.like]: `%${searchTerm}%`, // Caso insensível a maiúsculas/minúsculas
                    },
                },
            });

            // Carregue os clientes com base nos projetos
            const customers = await Customer.findAll({
                where: { id_customer: projects.map(project => project.id_customer) }
            });

            // Associe os clientes aos projetos com base no id_customer
            projects.forEach(project => {
                const customer = customers.find(customer => customer.id_customer == project.id_customer);
                project.customer = customer;
            });

            const qtdResults = projects.length

            res.render("projects/search", { user: req.user, projects: projects, qtdResults, styles: [{ src: "/styles/pages/projects.css" }] });
        } else {
            User_Permissions.findAll({ where: { id_user: req.user.id_user } })
                .then((userPermissions) => {
                    // Coleta os IDs dos projetos permitidos
                    const projectIds = userPermissions.map(permission => permission.id_project);

                    // Busca os projetos correspondentes aos IDs coletados
                    Project.findAll({
                        where: {
                            id_project: projectIds, nam_project: {
                                [Op.like]: `%${searchTerm}%`, // Caso insensível a maiúsculas/minúsculas
                            }
                        }
                    })
                        .then(async (projects) => {
                            // Carregue os clientes com base nos projetos
                            const customers = await Customer.findAll({
                                where: { id_customer: projects.map(project => project.id_customer) }
                            });

                            // Associe os clientes aos projetos com base no id_customer
                            projects.forEach(project => {
                                const customer = customers.find(customer => customer.id_customer == project.id_customer);
                                project.customer = customer;
                            });
                            res.render("projects/search", { user: req.user, projects: projects, styles: [{ src: "/styles/pages/projects.css" }] });
                        })
                        .catch((error) => {
                            req.flash("error_msg", "Erro ao listar projetos - " + error);
                            res.redirect("/home");
                        });
                })
                .catch((error) => {
                    req.flash("error_msg", "Erro em permissões do usuário - " + error);
                    res.redirect("/home");
                });
        }
    } catch (error) {
        req.flash("error_msg", "Erro ao pesquisar projeto - " + error);
        res.redirect("/projects");
    }
});


module.exports = router