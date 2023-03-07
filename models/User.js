const db = require("../db/db")

const User = db.sequelize.define('users', {
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
    email: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    user_type: {
       // type: db.Sequelize.ENUM("Administrador","Leitor","Editor"),
        type: db.Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
})

//User.sync({force: true})

module.exports = User