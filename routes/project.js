const express = require('express')
const router = express.Router()
const Customer = require("../models/Customer")
const Project = require("../models/Projects")
const Dashboard = require("../models/Dashboards")
const { eAdmin } = require("../helpers/eAdmin")
const { eUser } = require("../helpers/eUser")
const User_Permissions = require("../models/User_Permissions")
const { error } = require('console')

// Página inicial de projetos
// List All Projects
router.get('/', eUser, async (req, res) => {
    try {
        if (req.user.typ_user === "Administrador") {
            const projects = await Project.findAll();
            return res.render('projects/projects', { projects });
        }

        const userPermissions = await User_Permissions.findAll({ where: { id_user: req.user.id_user } });
        const projectIds = userPermissions.map(permission => permission.id_project);

        if (projectIds.length === 0) {
            req.flash("error_msg", "Você não tem permissão para acessar projetos.");
            return res.redirect("/");
        }

        const projects = await Project.findAll({ where: { id_project: projectIds } });
        if (projects.length === 0) {
            req.flash("error_msg", "Nenhum projeto encontrado com base nas suas permissões.");
            return res.redirect("/");
        }

        res.render("projects/projects", { user: req.user, projects });
    } catch (error) {
        console.error("Erro ao listar projetos:", error);
        req.flash("error_msg", "Erro ao listar projetos.");
        res.redirect("/");
    }
});


// List All Projects
router.get('/view/:id', eUser, async (req, res) => {
    try {
        if (req.user.typ_user === "Administrador") {
            const project = await Project.findByPk(req.params.id);
            const dashboards = await Dashboard.findAll({ where: { id_project: project.id_project } });

            res.render('projects/view', { project, dashboards });
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

            res.render("projects/view", { user: req.user, project, dashboards });
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
            res.render('projects/view', { projects: projects, customer: customer })
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
        res.render("projects/addproject", { customers: customers })
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
                res.render("projects/editproject", {project: project,customerProject: customerProject, customers: customers })
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

    Project.update(updateProject,{where: {id_project: projectID}}).then(() =>{
        req.flash("success_msg", "Projeto atualizado com sucesso")
        res.redirect("/projects/")
    }).catch((error) => {
        req.flash("error_msg", "Erro ao cadastrar projeto -" + error)
        res.redirect("/projects/add")
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
            req.flash("success_msg", "Projeto deletado com sucesso");
            res.redirect("/projects");
        })        
        .catch((error) => {
            req.flash("error_msg", "Erro ao deletar o projeto - " + error);
            res.redirect("/projects");
        });
});


module.exports = router