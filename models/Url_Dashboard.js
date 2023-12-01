const db = require("../db/db")
const Dashboard = require('./Dashboards')

const Url_Dashboard = db.sequelize.define('url_dashboard', {
    id_url_dashboard:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    url_dashboard:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    typ_device:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    typ_plataform_dashboard:{
        type: db.Sequelize.STRING,
        allowNull: false
    }
})
Url_Dashboard.belongsTo(Dashboard, {
    constraint: true,
    foreignKey: 'id_dashboard'
})
Dashboard.hasMany(Url_Dashboard, {
    foreignKey: 'id_dashboard'
})


Url_Dashboard.sync()

module.exports = Url_Dashboard