// models/ProjectView.js
const db = require("../db/db")
const Project = require('./Projects')

const ProjectView = db.sequelize.define('project_view', {
    id_visualization: {
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_user: {
        type: db.Sequelize.INTEGER,
        allowNull: false
    },

});

ProjectView.belongsTo(Project, {
    constraint: true,
    foreignKey: 'id_project'
})
Project.hasMany(ProjectView, {
    foreignKey: 'id_project'
})

ProjectView.sync()

module.exports = ProjectView;
