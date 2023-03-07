const express = require('express')
const router = express.Router()
const Customer = require("../models/Customer")
const Dashboard = require("../models/Dashboards")
const { eAdmin } = require("../helpers/eAdmin")

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

    Customer.findOne({ where: { name: req.body.name } }).then((customer) => {
        if (customer) {
            req.flash("error_msg", "Cliente já cadastrado")
            res.redirect("/admin/add")
        } else {
            const newCustomer = {
                name: req.body.name,
                logo: req.body.logo
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
    Customer.destroy({ where: { id: req.body.id } }).then(() => {
        req.flash("success_msg", "Cliente deletado com sucesso")
        res.redirect("/admin/customers")
    }).catch((error) => {
        req.flash("error_msg", "Erro ao deletar o Cliente - " + error)
    })
})


// Search customer by ID
router.get("/customers/edit/:id", eAdmin,(req, res) => {
    Customer.findOne({ where: { id: req.params.id } }).then((customer) => {
        res.render("customers/editcustomer", { customer: customer })
    }).catch((error) => {
        req.flash("error_msg", "Cliente não existe - " + error)
        res.redirect("/admin/customers")
    })
})

// Save Edit Customer
router.post("/customer/edit", (req, res) => {

    Customer.update({
        name: req.body.name,
        logo: req.body.logo        
    }, {
        where: { id: req.body.id }
    }).then(() => {
        req.flash("success_msg", "Cliente editado com sucesso")
        res.redirect("/admin/customers")
    }).catch((error) => {
        req.flash("error_msg", "Erro ao editar cliente - " + error)
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
            res.redirect("/admin")
        })

    }).catch((error) => {
        req.flash("error_msg", "Erro ao listar dashboards - " + error)
        res.redirect("/admin")
    })

    
})

// Add dashboard
router.get("/dashboards/add", (req,res) => {
    Customer.findAll().then((customer) => { //SUBSTITUIR PELO CLIENTE
        res.render("admin/adddashboard", {customer: customer})
    }).catch((error) => {
        req.flash("error_msg", "Erro ao adicionar dashboard - "+error)
        res.redirect("/admin")
    }) 

})

//Save new dashboards
router.post("/dashboard/new", (req,res) => {

    var errors = []

    if(req.body.customer == '0'){
        errors.push({text: "Cliente inválido"})
    }

    if(errors.length > 0){
        res.render("admin/adddashboard", {errors: errors})
    }else{
        const newDashboard = {
            title: req.body.title,
            description: req.body.description,
            url_desktop: req.body.url_desktop,
            url_mobile: req.body.url_mobile,
            url_bigscreen: req.body.url_bigscreen,
            type: req.body.type,
            id_project: req.body.project,
            id_customer: req.body.customer

        }

        Dashboard.create(newDashboard).then(() => {
            req.flash("success_msg", "Dashboard criada com sucesso!")
            res.redirect("/admin/dashboards")
        }).catch((error) => {
            req.flash("error_msg", "Houve erro ao cadastrar dashboard - "+error)
            res.redirect("/admin/dashboards")
        })
    }
})

// show dashboard
router.get("/dashboards/:id", (req, res) => {
    Dashboard.findOne({where: {id_dash: req.params.id}}).then((dashboard) => {
        res.render("admin/showdashboard", {dashboard: dashboard})
    }).catch((error) => {
        req.flash("error_msg","Dashboard não existe - "+ error)
        res.redirect("/admin/dashboards")
    })   
})
module.exports = router