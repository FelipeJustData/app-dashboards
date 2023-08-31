const db = require("../db/db")

const Customer = db.sequelize.define('customers', {
    id_customer:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name_customer:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    logotipo_customer: {
        type: db.Sequelize.BLOB('medium')        
    },
    des_mode: {
        type: db.Sequelize.STRING
    }
})

//Customer.sync({force: true})

module.exports = Customer