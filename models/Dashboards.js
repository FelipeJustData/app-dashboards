const db = require("../db/db")
const Customer = require('./Customer')
const Project = require('./Projects')

const Dashboard = db.sequelize.define('dashboards', {
    id_dash:{
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
    url_desktop:{
        type: db.Sequelize.STRING
    },
    url_mobile:{
        type: db.Sequelize.STRING
    },
    url_bigscreen:{
        type: db.Sequelize.STRING
    },
    type:{
        type: db.Sequelize.STRING
    }
})
Dashboard.belongsTo(Project, {
    constraint: true,
    foreignKey: 'idProject'
})
Project.hasMany(Dashboard, {
    foreignKey: 'idProject'
})

Dashboard.belongsTo(Customer, {
    constraint: true,
    foreignKey: 'idCustomer'
})
Customer.hasMany(Dashboard, {
    foreignKey: 'idCustomer'
})
//Dashboard.sync({force: true})

module.exports = Dashboard