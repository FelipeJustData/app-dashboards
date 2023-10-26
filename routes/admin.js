const express = require('express')
const router = express.Router()
const Customer = require("../models/Customer")
const Dashboard = require("../models/Dashboards")
const Url_Dashboard = require("../models/Url_Dashboard")
const { eAdmin } = require("../helpers/eAdmin")
const Project = require('../models/Projects')
const { eUser} = require("../helpers/eUser")
const { error } = require('console')
const User_Permissions = require("../models/User_Permissions")
const fs = require('fs');
const path = require('path');
const multer = require("multer");
const { storage } = require('../config/multerConfig');
const upload = multer({ storage: storage });


/** CUSTOMERS */
// List All Customers
router.get('/customers', (req, res) => {
    Customer.findAll().then((customers => {
        res.render("customers/customers", { customers: customers })
    })).catch((error) => {
        req.flash("error_msg", "Erro ao listar clientes " + error)
        res.redirect("/admin")
    })
})

router.get("/add", eAdmin, (req, res) => {
    res.render("customers/addcustomer")
})

// add new customer
router.post('/customers/new',eAdmin, upload.single('logo'), (req, res) => {
    const { name, des_mode } = req.body;
    const logoFile = req.file.filename;    

    if (!name) {
        req.flash("error_msg", "Nome inválido");
        return res.redirect("/admin/add");
    }

    // Agora, você pode verificar se um arquivo foi enviado e salvá-lo no banco de dados.
    if (logoFile && logoFile != "undefined") {
        const newCustomer = {
            name_customer: name,
            des_mode: des_mode,
            logotipo_customer: logoFile // Armazena os dados binários do arquivo
        };



        Customer.create(newCustomer)
            .then(() => {
                req.flash("success_msg", "Cliente cadastrado com sucesso");
                res.redirect("/admin/add");
            })
            .catch((error) => {
                req.flash("error_msg", "Erro ao cadastrar cliente");
                res.redirect("/admin/add");
            });
    } else {
        req.flash("error_msg", "Você deve enviar um logotipo");
        res.redirect("/admin/add");
    }
});



// Delete Customer
router.post("/customers/deletecustomer", eAdmin,(req, res) => {
    Customer.destroy({ where: { id_customer: req.body.id } }).then(() => {
        req.flash("success_msg", "Cliente deletado com sucesso")
        res.redirect("/admin/customers")
    }).catch((error) => {
        req.flash("error_msg", "Erro ao deletar o Cliente - " + error)
    })
})


// Search customer by ID
router.get("/customers/edit/:id", eAdmin,(req, res) => {
    Customer.findOne({ where: { id_customer: req.params.id } }).then((customer) => {
        res.render("customers/editcustomer", { customer: customer })
    }).catch((error) => {
        req.flash("error_msg", "Cliente não existe - " + error)
        res.redirect("/admin/customers")
    })
})

// Save Edit Customer
router.post("/customer/edit",eAdmin, upload.single('logo'), (req, res) => {

    Customer.update({
        name_customer: req.body.name,
        logotipo_customer: req.file.filename     
    }, {
        where: { id_customer: req.body.id }
    }).then(() => {
        req.flash("success_msg", "Cliente editado com sucesso")
        res.redirect("/admin/customers")
    }).catch((error) => {
        req.flash("error_msg", "Erro ao editar cliente - " + error)
        res.redirect("/admin/customers")
    })
})

/*
router.get('/customers/:name', eUser, (req, res) => {
    Customer.findOne({where: {name_customer: req.params.name}}).then((customer) => {
        Dashboard.findAll({where: {idCustomer: customer.id_customer}}).then((dashboards) => {
            res.render('customers/view', {customer: customer, dashboards: dashboards})
        }).catch((error) => {
            req.flash("error_msg", "Erro ao acessar dashboards do cliente "+error)
            res.redirect("/admin/customers")
        })       
    }).catch((error) => {
        req.flash("error_msg", "Erro ao acessar cliente "+error)
        res.redirect("/admin/customers")
    })
})

router.get('/customer/:id', eAdmin, (req, res) => {    
    Customer.findOne({where: {id_customer: req.params.id}}).then((customer) => {
        Dashboard.findAll({where: {id_customer: customer.id_customer}}).then((dashboards) => {
            res.render('customers/view', {customer: customer, dashboards: dashboards})
        }).catch((error) => {
            req.flash("error_msg", "Erro ao acessar dashboards do cliente "+error)
            res.redirect("/admin/customers")
        })       
    }).catch((error) => {
        req.flash("error_msg", "Erro ao acessar cliente "+error)
        res.redirect("/admin/customers")
    })
})
*/

// Rota para exibir a imagem do cliente
router.get('/customer/logo/:id', (req, res) => {
    const customerId = req.params.id;

    Customer.findByPk(customerId)
        .then((customer) => {
            if (customer && customer.logotipo_customer) {
                // Define o cabeçalho Content-Type com base na extensão da imagem
                res.set('Content-Type', 'image/*');
                // Envie os dados da imagem como resposta
                res.send(customer.logotipo_customer);
            } else {
                // Se não houver imagem, envie uma imagem padrão ou uma mensagem de erro
                // Exemplo: res.sendFile('caminho/para/imagem-padroes/sem-imagem.jpg');
                res.status(404).send('Imagem não encontrada');
            }
        })
        .catch((error) => {
            req.flash('error_msg', 'Erro ao carregar a imagem do cliente - ' + error);
            res.status(500).send('Erro interno do servidor');
        });
});


/** DASHBOARDS */
// List Dashboards
router.get("/dashboards", eUser,(req,res) => { 
    if (req.user.typ_user == "Administrador") {
        Dashboard.findAll().then((dashboards) => {
            Customer.findAll().then((customers) => {
                res.render("admin/dashboards",{dashboards: dashboards, customers: customers})        
            }).catch((error) => {
                req.flash("error_msg", "Erro ao listar clientes - " + error)
                res.redirect("/")
            })
    
        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar dashboards - " + error)
            res.redirect("/")
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
                        res.render("admin/dashboards", { user: req.user, dashboards: dashboards });
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
/*
// Add dashboard
router.get("/dashboards/add",eAdmin, (req,res) => {
    Customer.findAll().then((customer) => {
        Project.findAll().then((projects) => {
            res.render("admin/adddashboard", {customer: customer, projects: projects})
        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar projetos - "+error)
            res.redirect("/admin")
        })
        
    }).catch((error) => {
        req.flash("error_msg", "Erro ao adicionar dashboard - "+error)
        res.redirect("/admin")
    }) 
})*/
// Add dashboard - Exibe o formulário para adicionar um novo dashboard
router.get("/dashboards/add", eAdmin, (req, res) => {
    Customer.findAll().then((customers) => {
        Project.findAll().then((projects) => {
            res.render("admin/adddashboard", {
                customers: customers,
                projects: projects,
            });
        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar projetos - " + error);
            res.redirect("/admin");
        });
    }).catch((error) => {
        req.flash("error_msg", "Erro ao listar clientes - " + error);
        res.redirect("/admin");
    });
});


// Add dashboard customer
router.get("/dashboard/customer/:id",eAdmin, (req,res) => {
    Customer.findOne({where: {id_customer: req.params.id}}).then((customer) => {
        Project.findAll().then((projects) => {
            res.render("admin/adddashboard", {customer: customer, projects: projects})
        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar projetos - "+error)
            res.redirect("/home")
        })
        
    }).catch((error) => {
        req.flash("error_msg", "Erro ao adicionar dashboard - "+error)
        res.redirect("/home")
    }) 

})

//Save new dashboards
/*
router.post("/dashboard/new", (req,res) => {

    var errors = []

    if(req.body.customer == '0'){
        errors.push({texto: "Cliente inválido - Cadastre um cliente primeiro"})
    }

    if(req.body.project == '0'){
        errors.push({texto: "Projeto inválido - Cadastre um projeto primeiro"})
    }

    if(errors.length > 0){
        res.render("admin/adddashboard", {errors: errors})
    }else{
        const newDashboard = {
            title: req.body.title,
            description: req.body.description,
            des_status: req.body.des_status,
            dat_expiration: req.body.dat_expiration,
            id_project: req.body.project,
            id_customer: req.body.customer
        }

        Dashboard.create(newDashboard).then(() => {
            req.flash("success_msg", "Dashboard criada com sucesso! Agora insira os detalhes dela")
            res.redirect("/admin/dashboards")
        }).catch((error) => {
            req.flash("error_msg", "Houve erro ao cadastrar dashboard - "+error)
            res.redirect("/admin/dashboards")
        })
    }
})
*/


// show dashboard
router.get("/dashboard/view/:id", (req, res) => {
    if (req.user.typ_user == "Administrador") {
        Dashboard.findAll().then((dashboards) => {
            Url_Dashboard.findAll({where: {id_dashboard: req.params.id}}).then((url_dashboard) => {
                res.render("admin/showdashboard", {dashboards: dashboards, url_dashboard: url_dashboard})
            }).catch((error) => {
                req.flash("error_msg","Dashboard sem detalhes cadastrados - "+ error)
                res.redirect("/admin/dashboards")
            })    
        }).catch((error) => {
            req.flash("error_msg","Dashboard não existe - "+ error)
            res.redirect("/admin/dashboards")
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
                            res.render("admin/showdashboard", {dashboards: dashboards, url_dashboard: url_dashboard})
                        }).catch((error) => {
                            req.flash("error_msg","Dashboard sem detalhes cadastrados - "+ error)
                            res.redirect("/admin/dashboards")
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




/*
//Save new dashboardurl
router.post("/dashboardurl/new", (req,res) => {

    const newDashboardUrl = {
        id_dashboard: req.body.id_dashboard,
        url_dashboard: req.body.url_dashboard,
        typ_screen: req.body.typ_screen,
        is_default: req.body.is_default,
        typ_plataform_dashboard: req.body.typ_plataform_dashboard,
        typ_database: req.body.typ_database
    }

    Url_Dashboard.create(newDashboardUrl).then(() => {
        req.flash("success_msg", "Dashboard atualizada")
        res.redirect("/admin/dashboards")
    }).catch((error) => {
        req.flash("error_msg", "Houve erro ao atualizar dashboard - "+error)
        res.redirect("/admin/dashboards")
    })
})
*/

// Add dasboard
router.post("/dashboard/new", (req, res) => {
    var errors = [];

    if (req.body.customer === '0') {
        errors.push({ texto: "Cliente inválido - Cadastre um cliente primeiro" });
    }

    if (req.body.project === '0') {
        errors.push({ texto: "Projeto inválido - Cadastre um projeto primeiro" });
    }

    if (errors.length > 0) {
        res.render("admin/adddashboard", { errors: errors });
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
                            typ_screen: url.typ_screen,
                            is_default: url.is_default,
                            typ_plataform_dashboard: url.typ_plataform_dashboard,
                            typ_database: url.typ_database,
                        };

                        // Crie a URL do dashboard na tabela 'url_dashboard'
                        Url_Dashboard.create(newDashboardUrl);
                    });
                }

                res.redirect("/admin/dashboards");
            })
            .catch((error) => {
                req.flash("error_msg", "Houve erro ao cadastrar dashboard - " + error);
                res.redirect("/admin/dashboards");
            });
    }
});

// Delete dashboard
router.post("/dashboard/delete", eAdmin,(req, res) => {
    Dashboard.destroy({ where: { id_dashboard: req.body.id } }).then(() => {
        req.flash("success_msg", "Dashboard deletado com sucesso")
        res.redirect("/admin/dashboards")
    }).catch((error) => {
        req.flash("error_msg", "Erro ao deletar o Dashboard - " + error)
    })
})


//Edit dashboard
router.get("/dashboard/edit/:id", eAdmin, (req, res) => {

    Dashboard.findByPk(req.params.id).then((dashboard) =>{
        Url_Dashboard.findAll({where: {id_dashboard: dashboard.id_dashboard}}).then((urlDashboards) =>{
            res.render("admin/editdashboard", {dashboard: dashboard, urlDashboards: urlDashboards})            
        }).catch((error) =>{
            req.flash("error_msg", "Erro ao listar URLs - " + error);
            res.redirect("/admin/dashboards");
        })
    }).catch((error) => {
        req.flash("error_msg", "Erro ao listar Dashboard - " + error);
        res.redirect("/admin/dashboards");
    })

    
});

// Add dasboard
router.post("/dashboard/edit", (req, res) => {
    const idDashboard = req.body.id_dashboard

        const updateDashboard = {
            title: req.body.title,
            description: req.body.description,
            des_status: req.body.des_status,
            dat_expiration: req.body.dat_expiration
        };

        // Crie o novo dashboard na tabela 'dashboards'
        Dashboard.update(updateDashboard,{where: {id_dashboard: idDashboard}})
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
                            Url_Dashboard.update(updateDashboardUrl,{where:{id_dashboard: idDashboard}});                            
                        } catch (error) {
                            req.flash("error_msg", "Houve erro ao atualizar url da dashboard - " + error);
                            res.redirect("/admin/dashboards");
                        }
                        
                    });
                }else{
                    Url_Dashboard.destroy({where: {id_dashboard:idDashboard}})
                }

                res.redirect("/admin/dashboards");
            })
            .catch((error) => {
                req.flash("error_msg", "Houve erro ao cadastrar dashboard - " + error);
                res.redirect("/admin/dashboards");
            });
    
});
module.exports = router