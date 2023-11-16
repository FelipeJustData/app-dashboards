const db = require("../db/db")
const User = require('./User')
const Project = require('./Projects')
const Dashboard = require('./Dashboards')

const Favorite = db.sequelize.define('favorite', {
    id_user_favorite:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
})

Favorite.belongsTo(User, {
    constraint: true,
    foreignKey: 'id_user'
})
User.hasMany(Favorite, {
    foreignKey: 'id_user'
})

Favorite.belongsTo(Project, {
    constraint: true,
    foreignKey: 'id_project'
})
Project.hasMany(Favorite, {
    foreignKey: 'id_project'
})

Favorite.belongsTo(Dashboard, {
    constraint: true,
    foreignKey: 'id_dashboard'
})
Dashboard.hasMany(Favorite, {
    foreignKey: 'id_dashboard'
})

Favorite.sync()

module.exports = Favorite;