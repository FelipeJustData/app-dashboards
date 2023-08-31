const db = require("../db/db")

const User = db.sequelize.define('users', {
    id_user:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name_user:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    email_user: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    typ_user: {
       // type: db.Sequelize.ENUM("Administrador","Leitor","Editor"),
        type: db.Sequelize.STRING,
        allowNull: false
    },
    password_user: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    is_just: {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false
    }
})

//User.sync({force: true})

module.exports = User