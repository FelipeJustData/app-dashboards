const db = require("../db/db")
const Customer = require('./Customer')

const Project = db.sequelize.define('projects', {
    id_project:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nam_project:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    des_autoplay:{
        type: db.Sequelize.STRING
    },
    des_autoplay_timing:{
        type: db.Sequelize.STRING
    },
    des_project_image_desktop: {
        type: db.Sequelize.BLOB('medium')        
    },
    des_project_image_mobile: {
        type: db.Sequelize.BLOB('medium')        
    },
    dat_expiration: {
        type: db.Sequelize.STRING
    },
    des_principal_color: {
        type: db.Sequelize.STRING
    },
    des_secundary_color: {
        type: db.Sequelize.STRING
    },
    des_menu_color: {
        type: db.Sequelize.STRING
    },
    des_options_colors: {
        type: db.Sequelize.STRING
    }
})
Project.belongsTo(Customer, {
    constraint: true,
    foreignKey: 'id_customer'
})
Customer.hasMany(Project, {
    foreignKey: 'id_customer'
})

Project.sync()

module.exports = Project