const Sequielize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyecto')

const Tareas = db.define('tareas', {
    id: {
        type:Sequielize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true 
    },
    tarea: Sequielize.STRING(100),
    estado: Sequielize.INTEGER(1)
});
Tareas.belongsTo(Proyectos);

module.exports = Tareas;