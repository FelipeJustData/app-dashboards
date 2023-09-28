const express = require('express')
const router = express.Router()
const Customer = require("../models/Customer")
const Dashboard = require("../models/Dashboards")
const Url_Dashboard = require("../models/Url_Dashboard")
const { eAdmin } = require("../helpers/eAdmin")
const Project = require('../models/Projects')
const { eUser} = require("../helpers/eUser")
const { error } = require('console')

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
router.post("/customers/new", eAdmin,(req, res) => {
    var errors = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ texto: "Nome inválido" })
    }
    if (errors.length > 0) {
        res.render("customers/addcustomer", { errors: errors })
    }

    Customer.findOne({ where: { name_customer: req.body.name } }).then((customer) => {
        if (customer) {
            req.flash("error_msg", "Cliente já cadastrado")
            res.redirect("/admin/add")
        } else {
            const newCustomer = {
                name_customer: req.body.name,
                logotipo_customer: req.body.logo
            }
            Customer.create(newCustomer).then(() => {
                //console.log("Usuário cadastrado com sucesso")
                req.flash("success_msg", "Cliente cadastrado com sucesso")
                res.redirect("/admin/customers")
            }).catch((error) => {
                req.flash("error_msg", "Erro ao cadastrar cliente")
                res.redirect("/admin/add")
            })
        }
    }).catch((error) => {
        req.flash("error_mag", "Error interno - " + error)
    })
})


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
router.post("/customer/edit", (req, res) => {

    Customer.update({
        name_customer: req.body.name,
        logotipo_customer: req.body.logo        
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


/** DASHBOARDS */
// List Dashboards
router.get("/dashboards", (req,res) => {

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

    
})

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
})

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

// show dashboard
router.get("/dashboards/:id", (req, res) => {
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
})

// Add dashboard url
router.get("/dashboards/addurl/:id", (req,res) => {
    Dashboard.findOne({where: {id_dashboard: req.params.id}}).then((dashboard) => {
        res.render("admin/adddashboarddetails", {dashboard: dashboard})
    }).catch((error) => {
        req.flash("error_msg","Dashboard não existe - "+ error)
        res.redirect("/admin/dashboards")
    })  
})

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

module.exports = router