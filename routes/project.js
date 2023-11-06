const express = require('express')
const router = express.Router()
const Customer = require("../models/Customer")
const Project = require("../models/Projects")
const Dashboard = require("../models/Dashboards")
const { eAdmin } = require("../helpers/eAdmin")
const { eUser } = require("../helpers/eUser")
const User_Permissions = require("../models/User_Permissions")
const { error } = require('console')
const multer = require("multer");
const { storage } = require('../config/multerConfig');
const upload = multer({ storage: storage('projeto') });

// Página inicial de projetos
// List All Projects
router.get('/', eUser, async (req, res) => {
    if (req.user.typ_user == "Administrador") {

        try {
            // Recupere os projetos que você deseja exibir no carousel
            const projects = await Project.findAll({
                
            });
    
            // Carregue os clientes com base nos projetos
            const customers = await Customer.findAll({
                where: { id_customer: projects.map(project => project.id_customer) }
            });
    
            // Associe os clientes aos projetos com base no id_customer
            projects.forEach(project => {
                const customer = customers.find(customer => customer.id_customer == project.id_customer);
                project.customer = customer;
            });

            res.render("projects/projects", { user: req.user, projects: projects, styles: [{ src: "/styles/pages/projects.css" }] });
        } catch (error) {
            req.flash("error_msg", "Erro ao listar projetos - " + error);
            res.redirect("/");
        }


    }
    else {
        User_Permissions.findAll({ where: { id_user: req.user.id_user } })
            .then((userPermissions) => {
                // Coleta os IDs dos projetos permitidos
                const projectIds = userPermissions.map(permission => permission.id_project);

                // Busca os projetos correspondentes aos IDs coletados
                Project.findAll({ where: { id_project: projectIds } })
                    .then((projects) => {
                        res.render("projects/projects", { user: req.user, projects: projects, styles: [{ src: "/styles/pages/projects.css" }] });
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


// List All Projects
router.get('/view/:id', eUser, async (req, res) => {
    try {
        if (req.user.typ_user === "Administrador") {
            const project = await Project.findByPk(req.params.id);
            const dashboards = await Dashboard.findAll({ where: { id_project: project.id_project } });

            res.render('projects/view', { project, dashboards, styles: [{ src: "/styles/pages/projects.css" }] });
        } else {
            const userPermissions = await User_Permissions.findAll({ where: { id_user: req.user.id_user } });
            const dashboardIds = userPermissions.map(permission => permission.id_dashboard);

            if (dashboardIds.length == 0) {
                req.flash("error_msg", "Você não tem permissão para acessar os dashboards deste projeto.");
                return res.redirect("/projects");
            }

            const project = await Project.findByPk(req.params.id);
            const dashboards = await Dashboard.findAll({ where: { id_dashboard: dashboardIds, id_project: project.id_project } });

            if (dashboards.length == 0) {
                req.flash("error_msg", "Nenhum dashboard encontrado com base nas suas permissões para este projeto.");
                return res.redirect("/projects");
            }

            res.render("projects/view", { user: req.user, project, dashboards,styles: [{ src: "/styles/pages/projects.css" }] });
        }
    } catch (error) {
        console.error("Erro ao listar projetos e dashboards:", error);
        req.flash("error_msg", "Erro ao listar projetos e dashboards.");
        res.redirect("/");
    }
});



// List All Projects by customer
router.get('/customer/:id', (req, res) => {
    Customer.findOne({ where: { id_customer: req.params.id } }).then((customer) => {
        Project.findAll({ where: { id_customer: req.params.id } }).then((projects) => {
            res.render('projects/view', { projects: projects, customer: customer, styles: [{ src: "/styles/pages/projects.css" }] })
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
router.get("/add", eUser, (req, res) => {
    Customer.findAll().then((customers) => {
        res.render("projects/addproject", { customers: customers, styles: [{ src: "/styles/pages/projects.css" }] })
    }).catch((error) => {
        req.flash("error_msg", "Erro ao listar clientes " + error)
        res.redirect("/")
    })

})

router.post("/new", upload.fields([
    { name: 'des_project_image_desktop', maxCount: 1 },
    { name: 'des_project_image_mobile', maxCount: 1 },
    { name: 'des_project_logo', maxCount: 1 }
    ]),(req, res) => {
        const teste = req.files['des_project_image_desktop'][0]
        
    const newProject = {
        des_project_image_desktop: req.files['des_project_image_desktop'][0].filename,
        des_project_image_mobile: req.files['des_project_image_mobile'][0].filename,
        des_project_logo: req.files['des_project_logo'][0].filename,        
        nam_project: req.body.nam_project,        
        //owner_project: req.body.owner_project,        
        objective_project: req.body.objective_project,   
        id_customer: req.body.customer,     
        dat_expiration: req.body.dat_expiration,
        des_status: req.body.des_status,
        des_autoplay_timing: req.body.des_autoplay_timing,     
        des_title_color: req.body.des_title_color,
        des_bg_title_color: req.body.des_bg_title_color
        
    }

    Project.create(newProject).then(() => {
        //console.log("Usuário cadastrado com sucesso")
        req.flash("success_msg", "Projeto cadastrado com sucesso")
        res.redirect("/projects/")
    }).catch((error) => {
        req.flash("error_msg", "Erro ao cadastrar projeto -" + error)
        res.redirect("/projects/add")
    })
})

router.get('/get-dashboards/:projectIds', (req, res) => {
    const projectIds = req.params.projectIds.split(','); // Obtenha os IDs dos projetos selecionados

    Dashboard.findAll({ where: { id_project: projectIds } }).then((dashboards) => {
        res.json(dashboards)
    }).catch((error) => {
        res.status(500).json({ error: "Error ao buscar dashboards" })
    })
});


// Edit Project
router.get("/project/edit/:id", (req, res) => {
    Project.findByPk(req.params.id).then((project) => {
        Customer.findByPk(project.id_customer).then((customerProject) => {
            Customer.findAll().then((customers) => {
                res.render("projects/editproject", {project: project,customerProject: customerProject, customers: customers,styles: [{ src: "/styles/pages/projects.css" }] })
            }).catch((error) => {
                req.flash("error_msg", "Erro ao listar clientes " + error)
                res.redirect("/")
            })
        }).catch((error) => {
            req.flash("error_msg", "Erro ao listar cliente do projeto " + error)
            res.redirect("/")
        })
    }).catch((error) =>{
        req.flash("error_msg", "Erro ao listar projeto " + error)
        res.redirect("/")
    })   

})

//save update
router.post("/update/:id", (req, res) => {
    const projectID = req.params.id

    const updateProject = {
        nam_project: req.body.nam_project,
        des_autoplay: req.body.des_autoplay,
        des_autoplay_timing: req.body.des_autoplay_timing,
        dat_expiration: req.body.dat_expiration,
        des_principal_color: req.body.des_principal_color,
        des_secundary_color: req.body.des_secundary_color,
        des_menu_color: req.body.des_menu_color,
        des_options_colors: req.body.des_options_colors,
        id_customer: req.body.customer
    }

    Project.update(updateProject,{where: {id_project: projectID}}).then(async () =>{
        try {
            if (req.user.typ_user === "Administrador") {
                const project = await Project.findByPk(req.params.id);
                const dashboards = await Dashboard.findAll({ where: { id_project: project.id_project } });
    
                res.render('projects/view', { project, dashboards, styles: [{ src: "/styles/pages/projects.css" }] });
            } else {
                const userPermissions = await User_Permissions.findAll({ where: { id_user: req.user.id_user } });
                const dashboardIds = userPermissions.map(permission => permission.id_dashboard);
    
                if (dashboardIds.length == 0) {
                    req.flash("error_msg", "Você não tem permissão para acessar os dashboards deste projeto.");
                    return res.redirect("/projects");
                }
    
                const project = await Project.findByPk(req.params.id);
                const dashboards = await Dashboard.findAll({ where: { id_dashboard: dashboardIds, id_project: project.id_project } });
    
                if (dashboards.length == 0) {
                    req.flash("error_msg", "Nenhum dashboard encontrado com base nas suas permissões para este projeto.");
                    return res.redirect("/projects");
                }
    
                res.render("projects/view", { user: req.user, project, dashboards,styles: [{ src: "/styles/pages/projects.css" }] });
            }
        } catch (error) {
            console.error("Erro ao listar projetos e dashboards:", error);
            req.flash("error_msg", "Erro ao listar projetos e dashboards.");
            res.redirect("/");
        }
    }).catch((error) => {
        req.flash("error_msg", "Erro ao cadastrar projeto -" + error)
        res.redirect("/projects")
    })   
})

router.get('/get-projects/:id_customer', (req, res) => {
    const customer = req.params.id_customer

    Project.findAll({ where: { id_customer: customer } }).then((projects) => {
        res.json(projects)
    }).catch((error) => {
        res.status(500).json({ error: "Error ao buscar dashboards" })
    })
});


// Delete Project
router.post("/project/delete", eAdmin, (req, res) => {
    const projectId = req.body.id;

    // Passo 1: Encontre e exclua todas as permissões associadas ao usuário
    Project.destroy({ where: { id_project: projectId } })
        .then(() => {
            req.flash("success_msg", "Seu projeto foi excluído com sucesso.");
            res.redirect("/projects");
        })        
        .catch((error) => {
            req.flash("error_msg", "Erro ao deletar o projeto - " + error);
            res.redirect("/projects");
        });
});


module.exports = router