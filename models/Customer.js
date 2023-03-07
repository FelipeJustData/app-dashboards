const db = require("../db/db")

const Customer = db.sequelize.define('customers', {
    id:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    logo: {
        type: db.Sequelize.BLOB('medium')        
    }
})

//Customer.sync({force: true})

module.exports = Customer