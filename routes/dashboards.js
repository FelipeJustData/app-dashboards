const express = require('express')
const router = express.Router()
const Customer = require("../models/Customer")
const Dashboard = require("../models/Dashboards")
const Url_Dashboard = require("../models/Url_Dashboard")
const { eAdmin } = require("../helpers/eAdmin")
const Project = require('../models/Projects')
const { eUser } = require("../helpers/eUser")
const { error } = require('console')
const User_Permissions = require("../models/User_Permissions")
const fs = require('fs');
const path = require('path');
const multer = require("multer");
const { storage } = require('../config/multerConfig');
const upload = multer({ storage: storage('dashboard') });

// Lista todos Dashboards
router.get("/", eUser, async (req, res) => {
    if (req.user.typ_user == "Administrador") {

        try {
            const dashboards = await Dashboard.findAll();

            const projects = await Project.findAll({
                where: { id_project: dashboards.map(dashboard => dashboard.id_project) }
            })


            const customers = await Customer.findAll({
                where: { id_customer: projects.map(project => project.id_customer) }
            });

            projects.forEach(project => {
                const customer = customers.find(customer => customer.id_customer == project.id_customer);
                project.customer = customer;
            });

            dashboards.forEach(dashboard => {
                const project = projects.find(project => project.id_project == dashboard.id_project)
                dashboard.project = project
            })

            res.render("dashboards/dashboards", { 
                user: req.user, 
                dashboards: dashboards, 
                styles: [{ src: "/styles/pages/dashboards.css" }],
                scripts: [{ src: "/js/dashboards.js" }] })

        } catch (error) {
            req.flash("error_msg", "Erro ao listar dashboards - " + error);
            res.redirect("/home");
        }
    }
    else {
        User_Permissions.findAll({ where: { id_user: req.user.id_user } })
            .then(async (userPermissions) => {
                try {
                    // Coleta os IDs dos projetos permitidos
                    const dashboardId = userPermissions.map(permission => permission.id_dashboard);
                    const projectdId = userPermissions.map(permission => permission.id_project);

                    const dashboards = await Dashboard.findAll({ where: { id_dashboard: dashboardId } });

                    const projects = await Project.findAll({ where: { id_project: projectdId } });


                    const customers = await Customer.findAll({
                        where: { id_customer: projects.map(project => project.id_customer) }
                    });

                    projects.forEach(project => {
                        const customer = customers.find(customer => customer.id_customer == project.id_customer);
                        project.customer = customer;
                    });

                    dashboards.forEach(dashboard => {
                        const project = projects.find(project => project.id_project == dashboard.id_project)
                        dashboard.project = project
                    })

                    res.render("dashboards/dashboards", { 
                        user: req.user, 
                        dashboards: dashboards, 
                        styles: [{ src: "/styles/pages/dashboards.css" }],
                        scripts: [{ src: "/js/dashboards.js" }] })

                } catch (error) {

                    req.flash("error_msg", "Erro ao listar dashboards - " + error);
                    res.redirect("/home");
                }
            })
            .catch((error) => {
                req.flash("error_msg", "Erro em permissões do usuário - " + error);
                res.redirect("/home");
            });
    }
})

// Visualizad dashboard
router.get("/view/:id", eUser, async (req, res) => {
    const idDashboard = req.params.id

    if (req.user.typ_user == "Administrador") {

        try {
            const dashboard = await Dashboard.findByPk(idDashboard);
            const project = await Project.findByPk(dashboard.id_project);
            dashboard.project = project

            const urlsDashboard = await Url_Dashboard.findAll({
                where: { id_dashboard: dashboard.id_dashboard }
            })

            res.render("dashboards/view", { user: req.user, dashboard: dashboard, urlsDashboard: urlsDashboard, styles: [{ src: "/styles/pages/dashboards.css" }] })

        } catch (error) {
            req.flash("error_msg", "Erro ao listar dashboards - " + error);
            res.redirect("/home");
        }
    }
    else {
        User_Permissions.findAll({ where: { id_user: req.user.id_user, id_dashboard: idDashboard } })
            .then(async (userPermissions) => {
                // Coleta os IDs dos dashboards permitidos
                // const dashboardId = userPermissions.map(permission => permission.id_dashboard);
                if (userPermissions) {
                    try {
                        const dashboard = await Dashboard.findByPk(idDashboard);
                        const project = await Project.findByPk(dashboard.id_project);
                        dashboard.project = project

                        const urlsDashboard = await Url_Dashboard.findAll({
                            where: { id_dashboard: dashboard.id_dashboard }
                        })

                        res.render("dashboards/view", { user: req.user, dashboard: dashboard, urlsDashboard: urlsDashboard, styles: [{ src: "/styles/pages/dashboards.css" }] })

                    } catch (error) {
                        req.flash("error_msg", "Erro ao listar dashboards - " + error);
                        res.redirect("/home");
                    }
                }
            })
            .catch((error) => {
                req.flash("error_msg", "Erro em permissões do usuário - " + error);
                res.redirect("/home");
            });
    }

    /*
        if (req.user.typ_user == "Administrador") {
            Dashboard.findByPk(idDashboard).then((dashboard) => {
                Url_Dashboard.findAll({where: {id_dashboard: req.params.id}}).then((url_dashboard) => {
                    res.render("dashboards/view", {dashboard: dashboard, url_dashboard: url_dashboard})
                }).catch((error) => {
                    req.flash("error_msg","Dashboard sem detalhes cadastrados - "+ error)
                    res.redirect("/home")
                })    
            }).catch((error) => {
                req.flash("error_msg","Dashboard não existe - "+ error)
                res.redirect("/home")
            })
        }
        else {
            User_Permissions.findAll({ where: { id_user: req.user.id_user } })
                .then((userPermissions) => {
                    // Coleta os IDs dos projetos permitidos
                    const dashboardId = userPermissions.map(permission => permission.id_dashboard);
    
                    // Busca os projetos correspondentes aos IDs coletados
                    Dashboard.findAll({ where: { id_dashboard: dashboardId } })
                        .then((dashboards) => {
                            Url_Dashboard.findAll({where: {id_dashboard: req.params.id}}).then((url_dashboard) => {
                                res.render("dashboards/view", {dashboards: dashboards, url_dashboard: url_dashboard})
                            }).catch((error) => {
                                req.flash("error_msg","Dashboard sem detalhes cadastrados - "+ error)
                                res.redirect("/home")
                            })
                            
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
        }    */
})

// Add dashboard - Exibe o formulário para adicionar um novo dashboard
router.get("/add", eAdmin, (req, res) => {
    Customer.findAll().then((customers) => {
        Project.findAll().then((projects) => {
            res.render("dashboards/adddashboard", {
                customers: customers,
                projects: projects,
                styles: [{ src: "/styles/pages/dashboards.css" }],
                scripts: [{ src: "/js/adddashboard.js" }]
            });
        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar projetos - " + error);
            res.redirect("/dashboards");
        });
    }).catch((error) => {
        req.flash("error_msg", "Erro ao listar clientes - " + error);
        res.redirect("/dashboards");
    });
});

// Add dashboard por cliente
router.get("/dashboard/customer/:id", eAdmin, (req, res) => {
    Customer.findOne({ where: { id_customer: req.params.id } }).then((customer) => {
        Project.findAll().then((projects) => {
            res.render("dashboards/adddashboard", { 
                customer: customer, 
                projects: projects })
        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar projetos - " + error)
            res.redirect("/home")
        })

    }).catch((error) => {
        req.flash("error_msg", "Erro ao adicionar dashboard - " + error)
        res.redirect("/home")
    })

})

//Salva nova dashboard
router.post("/new", eAdmin, (req, res) => {
    var errors = [];

    if (req.body.customer === '0') {
        errors.push({ texto: "Cliente inválido - Cadastre um cliente primeiro" });
    }

    if (req.body.project === '0') {
        errors.push({ texto: "Projeto inválido - Cadastre um projeto primeiro" });
    }

    if (errors.length > 0) {
        res.render("dashboards/adddashboard", { errors: errors });
    } else {
        const newDashboard = {
            title: req.body.title,
            description: req.body.description,
            des_status: req.body.des_status,
            dat_expiration: req.body.dat_expiration,
            id_project: req.body.project,
            id_customer: req.body.customer
        };


        // Crie o novo dashboard na tabela 'dashboards'
        Dashboard.create(newDashboard)
            .then((dashboard) => {
                //req.flash("success_msg", "Dashboard criada com sucesso! Agora insira os detalhes dela");

                // Crie as URLs do dashboard (você pode iterar sobre as URLs na solicitação)
                const dashboardUrls = req.body.dashboardUrls; // Suponhamos que os dados das URLs são enviados como um array

                if (dashboardUrls && dashboardUrls.length > 0) {
                    dashboardUrls.forEach((url) => {
                        const newDashboardUrl = {
                            id_dashboard: dashboard.id_dashboard, // Use o ID do dashboard recém-criado
                            url_dashboard: url.url_dashboard,
                            typ_plataform_dashboard: url.input_format,
                            typ_device: url.dispositivo,
                        };

                        // Crie a URL do dashboard na tabela 'url_dashboard'
                        Url_Dashboard.create(newDashboardUrl);
                    });
                }
                req.flash("success_msg", "Todos os documentos foram enviados para o dash.");
                res.redirect("/dashboards");
            })
            .catch((error) => {
                req.flash("error_msg", "Houve erro ao cadastrar dashboard - " + error);
                res.redirect("/dashboards");
            });
    }
});

// Deleta dashboard
router.post("/delete", eAdmin, (req, res) => {
    Dashboard.destroy({ where: { id_dashboard: req.body.id } }).then(() => {
        req.flash("success_msg", "Dashboard deletado com sucesso")
        res.redirect("/dashboards")
    }).catch((error) => {
        req.flash("error_msg", "Erro ao deletar o Dashboard - " + error)
    })
})


//Edita dashboard
router.get("/edit/:id", eAdmin, async (req, res) => {
    await Dashboard.findByPk(req.params.id).then(async (dashboard) => {
        await Url_Dashboard.findAll({ where: { id_dashboard: dashboard.id_dashboard } }).then(async (urlsDashboard) => {
            dashboard.urlDashboards = urlsDashboard
            await Project.findByPk(dashboard.id_project).then(async (project) => {
                await Customer.findByPk(project.id_customer).then(async (customer) => {
                    project.customer = customer;
                    dashboard.project = project
                    await Customer.findAll().then((customers) => {
                        res.render("dashboards/edit", { 
                            dashboard: dashboard, 
                            customers: customers, 
                            styles: [{ src: "/styles/pages/dashboards.css" }],
                            scripts: [{ src: "/js/editdashboard.js"}]
                        })
                    }).catch((error) => {
                        req.flash("error_msg", "Erro ao listar clientes - " + error);
                        res.redirect("/dashboards");
                    })

                }).catch((error) => {
                    req.flash("error_msg", "Erro ao listar cliente - " + error);
                    res.redirect("/dashboards");
                })
            }).catch((error) => {
                req.flash("error_msg", "Erro ao listar projeto do dashboard - " + error);
                res.redirect("/dashboards");
            })
        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar URLS do Dashboard - " + error);
            res.redirect("/dashboards");
        })
    }).catch((error) => {
        req.flash("error_msg", "Erro ao listar Dashboard - " + error + " id dash: " + req.params.id);
        res.redirect("/dashboards");
    })
});

// Update dasboard
router.post("/edit", (req, res) => {
    const idDashboard = req.body.id_dashboard

    const updateDashboard = {
        title: req.body.title,
        description: req.body.description,
        des_status: req.body.des_status,
        dat_expiration: req.body.dat_expiration
    };

    // Crie o novo dashboard na tabela 'dashboards'
    Dashboard.update(updateDashboard, { where: { id_dashboard: idDashboard } })
        .then((dashboard) => {
            //req.flash("success_msg", "Dashboard criada com sucesso! Agora insira os detalhes dela");

            // Crie as URLs do dashboard (você pode iterar sobre as URLs na solicitação)
            const dashboardUrls = req.body.dashboardUrls; // Suponhamos que os dados das URLs são enviados como um array

            if (dashboardUrls && dashboardUrls.length > 0) {
                dashboardUrls.forEach((url) => {
                    const updateDashboardUrl = {
                        url_dashboard: url.url_dashboard,
                        typ_screen: url.typ_screen,
                        is_default: url.is_default,
                        typ_plataform_dashboard: url.typ_plataform_dashboard,
                        typ_database: url.typ_database,
                    };

                    try {
                        // Crie a URL do dashboard na tabela 'url_dashboard'
                        Url_Dashboard.update(updateDashboardUrl, { where: { id_dashboard: idDashboard } });
                    } catch (error) {
                        req.flash("error_msg", "Houve erro ao atualizar url da dashboard - " + error);
                        res.redirect("/home");
                    }

                });
            } else {
                Url_Dashboard.destroy({ where: { id_dashboard: idDashboard } })
            }

            res.redirect("/home");
        })
        .catch((error) => {
            req.flash("error_msg", "Houve erro ao cadastrar dashboard - " + error);
            res.redirect("/home");
        });

});

module.exports = router