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
    objective_project:{
        type: db.Sequelize.STRING
    },
    des_status:{
        type: db.Sequelize.STRING
    },
    des_autoplay_timing:{
        type: db.Sequelize.STRING
    },
    des_project_image_desktop: {
        type: db.Sequelize.STRING      
    },
    des_project_image_mobile: {
        type: db.Sequelize.STRING       
    },
    des_project_logo_header: {
        type: db.Sequelize.STRING       
    },
    dat_expiration: {
        type: db.Sequelize.STRING
    },
    des_custom_color_customer: {
        type: db.Sequelize.STRING
    },
    des_custom_color_title: {
        type: db.Sequelize.STRING
    },
    des_custom_color_bg_title: {
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