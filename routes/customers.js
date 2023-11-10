const express = require('express')
const router = express.Router()
const Customer = require("../models/Customer")
const { route } = require('./users')
const {eAdmin} = require("../helpers/eAdmin")
const { eUser} = require("../helpers/eUser")

/** CUSTOMERS */
// List All Customers
router.get('/customers', eAdmin,(req,res) => {
    Customer.findAll().then((customers => {
        res.render("customers/customers", {customers: customers})
    })).catch((error) => {
        req.flash("error_msg", "Erro ao listar clientes "+error)
        res.redirect("/admin")
    })
    
})

router.get('/customers/:name', eUser, (req, res) => {
    Customer.findOne({where: {name_customer: req.params.name}}).then((customer) => {
        res.render('customers/view', {customer: customer})

    }).catch((error) => {
        req.flash("error_msg", "Erro ao acessar cliente "+error)
        res.redirect("/admin")
    })
})

module.exports = router