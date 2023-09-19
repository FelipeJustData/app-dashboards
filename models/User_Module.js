const db = require("../db/db")
const User = require('./User')

const User_Module = db.sequelize.define('users_module', {
    id_user_module:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name_module:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    typ_permission: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    access: {       
        type: db.Sequelize.BOOLEAN,
        allowNull: false
    }
})

User_Module.belongsTo(User, {
    constraint: true,
    foreignKey: 'id_user'
})
User.hasOne(User_Module, {
    foreignKey: 'id_user'
})

User_Module.sync({force: true})

module.exports = User_Module