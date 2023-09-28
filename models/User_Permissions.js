const db = require("../db/db")
const User = require('./User')
const Project = require('./Projects')
const Dashboard = require('./Dashboards')

const User_Permissions = db.sequelize.define('user_permissions', {
    id_user_permissions:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    des_project_access:{
        type: db.Sequelize.BOOLEAN,
        allowNull: false
    },
    des_dashboard_access:{
        type: db.Sequelize.BOOLEAN,
        allowNull: false
    }
})

User_Permissions.belongsTo(User, {
    constraint: true,
    foreignKey: 'id_user'
})
User.hasMany(User_Permissions, {
    foreignKey: 'id_user'
})

User_Permissions.belongsTo(Project, {
    constraint: true,
    foreignKey: 'id_project'
})
Project.hasMany(User_Permissions, {
    foreignKey: 'id_project'
})

User_Permissions.belongsTo(Dashboard, {
    constraint: true,
    foreignKey: 'id_dashboard'
})
Dashboard.hasMany(User_Permissions, {
    foreignKey: 'id_dashboard'
})

User_Permissions.sync()

module.exports = User_Permissions