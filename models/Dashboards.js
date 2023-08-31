const db = require("../db/db")
const Customer = require('./Customer')
const Project = require('./Projects')

const Dashboard = db.sequelize.define('dashboards', {
    id_dashboard:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    description:{
        type: db.Sequelize.STRING
    },
    des_status:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    dat_expiration: {
        type: db.Sequelize.DATE
    }
})
Dashboard.belongsTo(Project, {
    constraint: true,
    foreignKey: 'id_project'
})
Project.hasMany(Dashboard, {
    foreignKey: 'id_project'
})


//Dashboard.sync({force: true})

module.exports = Dashboard