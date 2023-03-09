const Sequelize = require("sequelize")
require("dotenv").config({
    path:'variables.env'
})

const db_name = process.env.DB_NAME
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const db_host = process.env.DB_HOST

    //Connect MySQL
    const sequelize = new Sequelize(db_name,db_user,db_pass,{
        host: db_host,
        dialect: 'mysql',
        query:{raw:true}
    })

    var db = {}
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

module.exports = db