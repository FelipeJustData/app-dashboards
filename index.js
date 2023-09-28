const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require("path") 
const flash = require('connect-flash')
const passport = require("passport")
const session = require('express-session')
const users = require("./routes/user")
require("./config/auth")(passport)
const admin = require('./routes/admin')
const projects = require('./routes/project')
const { eAdmin } = require("./helpers/eAdmin")
const { eUser } = require("./helpers/eUser")

/**const Project = require("./models/Projects")
const Customer = require("./models/Customer")**/

try{
    const User_Module = require("./models/User_Module")
}catch(err){
    console.log("Erro ao gerar module - "+err)
}

// conseguir ler as variaveis de ambiente
require("dotenv").config({
    path:'variables.env'
})



// Settings
    //session
    app.use(session({
        secret: 'site de dashboards',
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())

    //middleware
    app.use((req,res,next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null
        next()
    })


    // body parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    // Template Engine
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine','handlebars')


    // Public
    app.use(express.static(path.join(__dirname,"public")))


// Routes

    app.get('/home',eAdmin, (req, res) => {
        res.render("home",{user: req.user})
    })

    app.get('/',eUser, (req, res) => {
        res.render("home",{user: req.user})
    })

    app.use('/users', users)
    app.use('/admin', admin)
    app.use('/projects', projects)



const PORT = process.env.PORT || 8081
app.listen(PORT, function(){
    console.log(`Servidor rodando na porta: ${PORT}` )
})