const db = require("../db/db")

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
    },
    id_project:{
        type: db.Sequelize.INTEGER
    },
    id_customer:{
        type: db.Sequelize.INTEGER
    },
})

//Dashboard.sync({force: true})

module.exports = Dashboard