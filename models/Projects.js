const db = require("../db/db")
const Customer = require('./Customer')

const Project = db.sequelize.define('projects', {
    id_project:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    settings:{
        type: db.Sequelize.STRING
    }
})
Project.belongsTo(Customer, {
    constraint: true,
    foreignKey: 'idCustomer'
})
Customer.hasMany(Project, {
    foreignKey: 'idCustomer'
})
//Project.sync({force: true})

module.exports = Project