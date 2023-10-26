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
const customers = require('./routes/customer')
const { eAdmin } = require("./helpers/eAdmin")
const ifAdmin = require("./helpers/ifAdmin")

const { eUser } = require("./helpers/eUser")

const Project = require("./models/Projects")
const User_Permissions = require("./models/User_Permissions")
const { error } = require('console')

try {
    const User_Module = require("./models/User_Module")
} catch (err) {
    console.log("Erro ao gerar module - " + err)
}

// conseguir ler as variaveis de ambiente
require("dotenv").config({
    path: 'variables.env'
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
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
})


// body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Template Engine
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    helpers: ifAdmin
}))
app.set('view engine', 'handlebars')

var hbs = handlebars.create({});

hbs.handlebars.registerHelper('eq', function (a, b) {
    if (a === b) {
        return a === b;
    }
})
hbs.handlebars.registerHelper('includes', function (arr, value, options) {
    return arr && arr.includes(value)
})

hbs.handlebars.registerHelper('lt', function (a, b, options) {
    if (a < b) {
        return true;
      } else {
        return false;
      }
})


// Public
app.use(express.static(path.join(__dirname, "public")))


// Routes

app.get('/home', eUser, (req, res) => {
    if (req.user.typ_user == "Administrador") {
        // Busca os projetos correspondentes aos IDs coletados
        Project.findAll()
            .then((projects) => {
                res.render("home", { user: req.user, projects: projects });
            })
            .catch((error) => {
                req.flash("error_msg", "Erro ao listar projetos - " + error);
                res.redirect("/");
            });
    }
    else {
        User_Permissions.findAll({ where: { id_user: req.user.id_user } })
            .then((userPermissions) => {
                // Coleta os IDs dos projetos permitidos
                const projectIds = userPermissions.map(permission => permission.id_project);

                // Busca os projetos correspondentes aos IDs coletados
                Project.findAll({ where: { id_project: projectIds } })
                    .then((projects) => {
                        res.render("home", { user: req.user, projects: projects });
                    })
                    .catch((error) => {
                        req.flash("error_msg", "Erro ao listar projetos - " + error);
                        res.redirect("/");
                    });
            })
            .catch((error) => {
                req.flash("error_msg", "Erro em permissões do usuário - " + error);
                res.redirect("/");
            });
    }
});



app.get('/', eUser, (req, res) => {
    if (req.user.typ_user == "Administrador") {
        // Busca os projetos correspondentes aos IDs coletados
        Project.findAll()
            .then((projects) => {
                res.render("home", { user: req.user, projects: projects });
            })
            .catch((error) => {
                req.flash("error_msg", "Erro ao listar projetos - " + error);
                res.redirect("/");
            });
    }
    else {
        User_Permissions.findAll({ where: { id_user: req.user.id_user } })
            .then((userPermissions) => {
                // Coleta os IDs dos projetos permitidos
                const projectIds = userPermissions.map(permission => permission.id_project);

                // Busca os projetos correspondentes aos IDs coletados
                Project.findAll({ where: { id_project: projectIds } })
                    .then((projects) => {
                        res.render("home", { user: req.user, projects: projects });
                    })
                    .catch((error) => {
                        req.flash("error_msg", "Erro ao listar projetos - " + error);
                        res.redirect("/");
                    });
            })
            .catch((error) => {
                req.flash("error_msg", "Erro em permissões do usuário - " + error);
                res.redirect("/");
            });
    }

})

app.use('/users', users)
app.use('/admin', admin)
app.use('/projects', projects)
app.use('/customers', customers)



const PORT = process.env.PORT || 8081
app.listen(PORT, function () {
    console.log(`Servidor rodando na porta: ${PORT}`)
})