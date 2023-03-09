// Loading modules
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require("path") //manipular pastas/diretórios
const mongoose  = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const users = require("./routes/user")
const projects = require("./routes/project")
const passport = require("passport")
require("./config/auth")(passport)

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
    //handlebars
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    //mongoose
    mongoose.connect('mongodb://127.0.0.1:27017/dashbrand').then(() => {
        console.log("MongoDB Conectado")
    }).catch((error) => {
        console.log("Erro ao conectar banco de dados: "+ error)
    })
    // Public
    app.use(express.static(path.join(__dirname,"public")))


// Routes
    app.get('/', (req, res) => {
        res.render('index')
    })

    app.use('/admin', admin)
    app.use('/users', users)
    app.use('/projects', projects)

//Outros
const PORT = 8081

app.listen(PORT, () => {
    console.log("Servidor rodando")
})