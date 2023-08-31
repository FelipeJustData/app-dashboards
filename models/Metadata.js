const db = require("../db/db")
const User = require('./User')
const Customer = require('./Customer')

const Metadata = db.sequelize.define('metadata', {
    id_metadata:{
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    des_change:{
        type: db.Sequelize.STRING,
        allowNull: false
    },
    dat_change: {
        type: db.Sequelize.DATE,
        defaultValue: db.Sequelize.NOW,
        allowNull: false
    },
    des_before_information: {       
        type: db.Sequelize.STRING
    },
    typ_change: {       
        type: db.Sequelize.STRING,
        allowNull: false
    },
    des_new_information: {       
        type: db.Sequelize.STRING,
        allowNull: false
    }
})

Metadata.belongsTo(User, {
    constraint: true,
    foreignKey: 'id_user'
})
User.hasMany(Metadata, {
    foreignKey: 'id_user'
})


//Metadata.sync({force: true})

module.exports = Metadata