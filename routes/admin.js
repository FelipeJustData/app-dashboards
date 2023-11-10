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
const upload = multer({ storage: storage('logo') });


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
            logotipo_customer: logoFile 
        };



        Customer.create(newCustomer)
            .then(() => {
                req.flash("success_msg", "Cliente cadastrado com sucesso");
                res.redirect("/customers/customers");
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
    if(req.file){
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
    }else{
        Customer.update({
            name_customer: req.body.name 
        }, {
            where: { id_customer: req.body.id }
        }).then(() => {
            req.flash("success_msg", "Cliente editado com sucesso")
            res.redirect("/admin/customers")
        }).catch((error) => {
            req.flash("error_msg", "Erro ao editar cliente - " + error)
            res.redirect("/admin/customers")
        })
    }
    
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


module.exports = router