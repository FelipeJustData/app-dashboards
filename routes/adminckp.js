const express = require('express')
const router = express.Router()/*
const mongoose = require("mongoose")
require("../models/User")
const User = mongoose.model("users")
require("../models/Dashboards")
const Dashboard = mongoose.model("dashboards")
require("../models/Customer")
const Customer = mongoose.model("customers")*/
const {eAdmin} = require("../helpers/eAdmin")
const User = require("../models/User")

router.get('/', (req,res) => {
    res.render("index")
})

router.get('/admin', eAdmin, (req,res) => {
    res.render("admin/admin")
})

/** CUSTOMERS */
// List All Customers
router.get('/customers', (req,res) => {
    Customer.findAll().then((customers => {
        res.render("admin/customers", {customers: customers})
    })).catch((error) => {
        req.flash("error_msg", "Erro ao listar clientes "+error)
        res.redirect("/admin")
    })
    
})

/** DASHBOARDS */
// List Dashboards
router.get("/dashboards", (req,res) => {

    Dashboard.findAll().populate("user").sort({data: 'desc'}).then((dashboards) => {
        res.render("admin/dashboards",{dashboards: dashboards})
    }).catch((error) => {
        req.flash("error_msg", "Erro ao listar dashboards - " + error)
        res.redirect("/admin")
    })

    
})

// Add dashboard
router.get("/dashboards/add", (req,res) => {
    User.find().lean().then((user) => { //SUBSTITUIR PELO CLIENTE
        res.render("admin/adddashboard", {user: user})
    }).catch((error) => {
        req.flash("error_msg", "Erro ao adicionar dashboard - "+error)
        res.redirect("/admin")
    }) 

})

//Save new dashboards
router.post("/dashboard/new", (req,res) => {

    var errors = []

    if(req.body.user == '0'){
        errors.push({text: "Usuário inválido"})
    }

    if(errors.length > 0){
        res.render("admin/adddashboard", {errors: errors})
    }else{
        const newDashboard = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            url_dashboard: req.body.url_dashboard,
            user: req.body.user
        }

        new Dashboard(newDashboard).save().then(() => {
            req.flash("success_msg", "Dashboard criada com sucesso!")
            res.redirect("/admin/dashboards")
        }).catch((error) => {
            req.flash("error_msg", "Houve erro ao cadastrar dashboard - "+error)
            res.redirect("/admin/dashboards")
        })
    }
})

// Delete Dashboard
router.post("/dashboards/delete", (req, res) => {
    Dashboard.deleteOne({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Dashboard deletada com sucesso")
        res.redirect("/admin/dashboards")
    }).catch((error) => {
        req.flash("error_msg","Erro ao deletar dashboard - "+error)
    })
})

// show dashboard
router.get("/dashboards/:id", (req, res) => {
    Dashboard.findOne({_id: req.params.id}).lean().then((dashboard) => {
        res.render("admin/showdashboard", {dashboard: dashboard})
    }).catch((error) => {
        req.flash("error_msg","Dashboard não existe - "+ error)
        res.redirect("/admin/dashboards")
    })   
})


// Search Dashboard by ID
router.get("/dashboards/edit/:id", (req,res) => {
    Dashboard.findOne({_id: req.params.id}).lean().then((dashboard) => {
        User.find().lean().then((user) => {
            res.render("admin/editdashboards", {dashboard: dashboard, user: user})
        }).catch((error) => {
            req.flash("error_msg","Erro ao carregar usuário - " + error)
            res.redirect("/amdin/dashboards")
        })       
    }).catch((error) => {
        req.flash("error_msg","Dashboard não existe - "+ error)
        res.redirect("/admin/dashboards")
    })    
})

// Save Edit dashboard
router.post("/dashboards/edit", (req, res) => {

    Dashboard.findOne({_id: req.body.id}).then((dashboard) => {

        var errors = []

        if(!req.body.title || typeof req.body.title == undefined || req.body.title == null){
            errors.push({texto: "Título inválido"})
        }
    
        if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
            errors.push({texto: "Descrição inválida"})
        }

        if(!req.body.url_dashboard || typeof req.body.url_dashboard == undefined || req.body.url_dashboard == null){
            errors.push({texto: "Descrição inválida"})
        }
    
        if(errors.length > 0){
            res.render("admin/dashboards", {errors: errors})
        }

        dashboard.title = req.body.title
        dashboard.description = req.body.description
        dashboard.content = req.body.content
        dashboard.url_dashboard = req.body.url_dashboard

        dashboard.save().then(() => {
            req.flash("success_msg","Dashboard editada com sucesso")
            res.redirect("/admin/dashboards")
        }).catch((error) => {
            req.flash("error_msg", "Erro ao editar dashboard - "+error)
            res.redirect("/admin/dashboards")
        })
    

    }).catch((error) =>{
        req.flash("error_msg","Erro ao editar dashboard - "+ error)
        res.redirect("/admin/dashboards")
    })
})

// Edit dashboards
router.post("dashboard/edit", (req, res) => {
    Dashboard.findOne({_id: req.body.id}).lean().then(() => {
        dashboard.tite = req.body.title
        dashboard.description = req.body.description
        dashboard.content = req.body.content
        dashboard.url_dashboard = req.body.url_dashboard
        dashboard.user = req.body.user

        dashboard.save().then(() => {
            req.flash("success_msg", "Dashboard editada com sucesso")
            res.redirect("/admin/dashboards")            
        }).catch((error) => {
            req.flash("error_msg","Erro ao salvar dashboard - " + error)
            res.redirect("/admin/dashboards")
        })

    }).catch((error) => {
        req.flash("error_msg", "Erro ao salvar edição dashboard")
        res.redirect("admin/dashboards")
    })
})

module.exports = router