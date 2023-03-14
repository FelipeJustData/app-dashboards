const express = require('express')
const router = express.Router()
const User = require("../models/User")
const bcrypt = require('bcryptjs')
const passport = require("passport")
const { eAdmin } = require("../helpers/eAdmin")
const Customer = require('../models/Customer')

// List All Users
router.get('/users', (req, res) => {
    User.findAll().then((users) => {
        res.render("users/users", { users: users })
    }).catch((error) => {
        req.flash("error_msg", "Erro ao lista usuários " + error)
        res.redirect("/admin")
    })

})


router.get("/register", eAdmin,(req, res) => {
    res.render("users/register")
})

// Form add new user
router.get('/user/add',(req, res) => {
    res.render("user/addusers")
})


// Add new User
router.post('/users/new',(req, res) => {
    var errors = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        errors.push({ texto: "Nome inválido" })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        errors.push({ texto: "Email inválido" })
    }

    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        errors.push({ texto: "Senha inválido" })
    }

    if (req.body.password.length < 4) {
        errors.push({ texto: "Senha muito curta" })
    }

    if (req.body.password != req.body.password2) {
        errors.push({ texto: "Senhas diferentes, tente novamente" })
    }

    if (errors.length > 0) {
        res.render("users/register", { errors: errors })
    }
    else {

        User.findOne({ where: { email: req.body.email } }).then((user) => {
            if (user) {
                req.flash("error_msg", "Email já cadastrado")
                res.redirect("/users/register")
            } else {
                const newUser = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    user_type: req.body.user_type
                }

                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) {
                            req.flash("error_msg", "Erro ao criptografar senha - " + error)
                            res.redirect("/")
                        }
                        else {
                            newUser.password = hash
                            User.create(newUser).then(() => {
                                //console.log("Usuário cadastrado com sucesso")
                                req.flash("success_msg", "Usuário cadastrado com sucesso")
                                res.redirect("/")
                            }).catch((error) => {
                                req.flash("error_msg", "Erro ao cadastrar usuário")
                                res.redirect("/users/register")
                            })

                        }
                    })
                })
            }
        }).catch((error) => {
            req.flash("error_mag", "Error interno - " + error)
        })
    }
})

// Search User by ID
router.get("/users/edit/:id", eAdmin,(req, res) => {
    User.findOne({ where: { id: req.params.id } }).then((user) => {
        res.render("users/editusers", { user: user })
    }).catch((error) => {
        req.flash("error_msg", "Usuário não existe - " + error)
        res.redirect("/users/users")
    })
})

// Save Edit User
router.post("/users/edit", (req, res) => {

    User.update({
        name: req.body.name,
        email: req.body.email,
        user_type: req.body.user_type
    }, {
        where: { id: req.body.id }
    }).then(() => {
        req.flash("success_msg", "Usuário editado com sucesso")
        res.redirect("/users/users")
    }).catch((error) => {
        req.flash("error_msg", "Erro ao editar usuário - " + error)
        res.redirect("/users/users")
    })
})

// Delete User
router.post("/users/delete", eAdmin,(req, res) => {
    User.destroy({ where: { id: req.body.id } }).then(() => {
        req.flash("success_msg", "Usuário deletado com sucesso")
        res.redirect("/users/users")
    }).catch((error) => {
        req.flash("error_msg", "Erro ao deletar o usuário - " + error)
    })
})

// LOGIN
router.get("/login", (req, res) => {
    res.render("users/login")
})

router.get("/login/:name", (req, res) => {
    Customer.findOne({where: {name: req.params.name}}).then((customer) => {
        res.render("users/login",{customer: customer})
    })    
})

router.post("/login", (req, res, next) => {
    if(req.body.name_customer){
        passport.authenticate("local", {
            successRedirect: "/admin/customers/"+req.body.name_customer,
            failureRedirect: "/login/"+req.body.name_customer,
            failureFlash: true
        })(req, res, next)
    }else{
        passport.authenticate("local", {
            successRedirect: "/home/"+req.body.email,
            failureRedirect: "/users/login",
            failureFlash: true
        })(req, res, next)
    }
})


// LOGOUT
router.get("/logout", (req, res) => {
    req.logout(function (error) {
        if (error) {
            return next(error)
        }
        req.flash("succes_msg", "Deslogado com sucesso")
        res.redirect("/")
    })
})

module.exports = router