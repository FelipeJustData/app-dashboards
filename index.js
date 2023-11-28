const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const path = require("path")
const flash = require('connect-flash')
const passport = require("passport")
const session = require('express-session')
const users = require("./routes/users")
require("./config/auth")(passport)
const admin = require('./routes/admin')
const projects = require('./routes/projects')
const customers = require('./routes/customers')
const dashboards = require('./routes/dashboards')
const { eAdmin } = require("./helpers/eAdmin")
const ifAdmin = require("./helpers/ifAdmin")
const { eUser } = require("./helpers/eUser")
const Project = require("./models/Projects")
const Customer = require("./models/Customer")
const User_Permissions = require("./models/User_Permissions")
const Favorite = require("./models/Favorite")
const ProjectView = require("./models/ProjectView")
const db = require("./db/db")



// Configuração para leitura de variáveis de ambiente
require("dotenv").config({ path: 'variables.env' });

// Configuração de sessão e autenticação com Passport
app.use(session({
    secret: 'site de dashboards',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware para mensagens flash e usuário global
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

// Body parser para tratar dados de formulário
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do template engine Handlebars
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    helpers: ifAdmin
}));
app.set('view engine', 'handlebars');

// Registro de helpers adicionais para Handlebars
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

hbs.handlebars.registerHelper('gte', function (a, b, options) {
    if (a >= b) {
        return true;
    } else {
        return false;
    }
})

hbs.handlebars.registerHelper('and', function (a, b, options) {
    if (a && b) {
        return true;
    } else {
        return false;
    }
})

hbs.handlebars.registerHelper('add', function (a, b, options) {
    return a + b;
})

hbs.handlebars.registerHelper('mod', function (value, modulus, options) {
    return value % modulus

})

// Servir arquivos estáticos na pasta "public"
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use('/users', users)
app.use('/admin', admin)
app.use('/projects', projects)
app.use('/customers', customers)
app.use('/dashboards', dashboards)

// Rota principal
app.get('/home', eUser, async (req, res) => {
    if (req.user.typ_user == "Administrador") {

        try {
            // Recupere os projetos que você deseja exibir no carousel
            const projects = await Project.findAll();

            // Carregue os clientes com base nos projetos
            const customers = await Customer.findAll({
                where: { id_customer: projects.map(project => project.id_customer) }
            });

            const favorites = await Favorite.findAll({
                where: { id_user: req.user.id_user, id_project: projects.map(project => project.id_project) }
            });

            // Obtém as últimas 4 visualizações distintas do usuário
            const recentViews = await ProjectView.findAll({
                attributes: ['id_project', [db.Sequelize.fn('MAX', db.Sequelize.col('createdAt')), 'latestView']],
                where: { id_user: req.user.id_user },
                order: [[db.Sequelize.fn('MAX', db.Sequelize.col('createdAt')), 'DESC']],
                limit: 4,
                group: ['id_project'],
            });


            // Obtém os projetos associados às visualizações
            const recentProjects = await Promise.all(
                recentViews.map(async (view) => {
                    const project = await Project.findByPk(view.id_project);
                    return project;
                })
            );

            // Associe os clientes aos projetos com base no id_customer
            projects.forEach(project => {
                const customer = customers.find(customer => customer.id_customer == project.id_customer);
                const favorite = favorites.find(favorite => favorite.id_project == project.id_project)
                project.customer = customer;
                project.favorite = favorite
            });

            // Associe os clientes aos projetos recentes com base no id_customer
            recentProjects.forEach(project => {
                const customer = customers.find(customer => customer.id_customer == project.id_customer);
                const favorite = favorites.find(favorite => favorite.id_project == project.id_project)
                project.customer = customer;
                project.favorite = favorite
            });



            res.render("home", { user: req.user, projects: projects, recentProjects: recentProjects, styles: [{ src: "/styles/pages/homepage.css" }] });
        } catch (error) {
            req.flash("error_msg", "Erro ao listar projetos - " + error);
            res.redirect("/users/login");
        }
    }
    else {
        User_Permissions.findAll({ where: { id_user: req.user.id_user } })
            .then((userPermissions) => {
                // Coleta os IDs dos projetos permitidos
                const projectIds = userPermissions.map(permission => permission.id_project);

                // Busca os projetos correspondentes aos IDs coletados
                Project.findAll({ where: { id_project: projectIds } })
                    .then(async (projects) => {

                        // Carregue os clientes com base nos projetos
                        const customers = await Customer.findAll({
                            where: { id_customer: projects.map(project => project.id_customer) }
                        });

                        const favorites = await Favorite.findAll({
                            where: { id_user: req.user.id_user, id_project: projects.map(project => project.id_project) }
                        });

                        // Obtém as últimas 4 visualizações distintas do usuário
                        const recentViews = await ProjectView.findAll({
                            attributes: ['id_project', [db.Sequelize.fn('MAX', db.Sequelize.col('createdAt')), 'latestView']],
                            where: { id_user: req.user.id_user },
                            order: [[db.Sequelize.fn('MAX', db.Sequelize.col('createdAt')), 'DESC']],
                            limit: 4,
                            group: ['id_project'],
                        });

                        // Obtém os projetos associados às visualizações
                        const recentProjects = await Promise.all(
                            recentViews.map(async (view) => {
                                const project = await Project.findByPk(view.id_project);
                                return project;
                            })
                        );

                        // Associe os clientes aos projetos com base no id_customer
                        projects.forEach(project => {
                            const customer = customers.find(customer => customer.id_customer == project.id_customer);
                            const favorite = favorites.find(favorite => favorite.id_project == project.id_project)
                            project.customer = customer;
                            project.favorite = favorite
                        });

                        // Associe os clientes aos projetos com base no id_customer
                        recentProjects.forEach(project => {
                            const customer = customers.find(customer => customer.id_customer == project.id_customer);
                            const favorite = favorites.find(favorite => favorite.id_project == project.id_project)
                            project.customer = customer;
                            project.favorite = favorite
                        });

                        res.render("home", { user: req.user, projects: projects, recentProjects: recentProjects, styles: [{ src: "/styles/pages/homepage.css" }] });
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
    try {
        res.redirect("/home");
    } catch (error) {
        req.flash("error_msg", "Não foi possível acessar a homepage - " + error);
        res.redirect("/");
    }

})

// Configuração do servidor
const PORT = process.env.PORT || 8081
app.listen(PORT, function () {
    console.log(`Servidor rodando na porta: ${PORT}`)
})