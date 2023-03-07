const express = require('express')
const router = express.Router()
const Customer = require("../models/Customer")

//const {eAdmin} = require("../helpers/eAdmin")

/** CUSTOMERS */
// List All Customers
router.get('/customers', (req,res) => {
    Customer.findAll().then((customers => {
        res.render("customers/customers", {customers: customers})
    })).catch((error) => {
        req.flash("error_msg", "Erro ao listar clientes "+error)
        res.redirect("/admin")
    })
    
})

module.exports = router