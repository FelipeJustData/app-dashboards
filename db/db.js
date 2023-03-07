const Sequelize = require("sequelize")
require("dotenv").config({
    path:'variables.env'
})

    //Connect MySQL
    const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASS,{
        host: process.env.DB_HOST,
        dialect: 'mysql',
        query:{raw:true}
    })

    var db = {}
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

module.exports = db