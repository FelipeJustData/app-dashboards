const express = require('express')
const router = express.Router()
const Customer = require("../models/Customer")
const Project = require("../models/Projects")
const {eAdmin} = require("../helpers/eAdmin")

// Página inicial de projetos
// List All Projects
router.get('/', (req,res) => {
    Customer.findAll().then((customers) => {
     res.render('projects/projects', {customers: customers}) 
     }).catch((error) => {
         req.flash("error_msg", "Erro ao listar projetos " + error)
         res.redirect("/")
     })       
 })

 // List All Projects by customer
router.get('/customer/:id', (req,res) => {
    Customer.findOne({where: {id_customer: req.params.id}}).then((customer) => {
        Project.findAll({where: {id_customer: req.params.id}}).then((projects) => {       
            res.render('projects/view', {projects: projects, customer: customer}) 
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
        res.render("projects/addproject", {customers: customers})
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
    console.log(typeof idCustomer)
    Project.create(newProject).then(() => {
        //console.log("Usuário cadastrado com sucesso")
        req.flash("success_msg", "Projeto cadastrado com sucesso")
        res.redirect("/projects/")
    }).catch((error) => {
        req.flash("error_msg", "Erro ao cadastrar projeto -" + error)
        res.redirect("/projects/add")
    })
})


module.exports = router