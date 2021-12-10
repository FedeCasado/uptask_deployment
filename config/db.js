const Sequelize = require('sequelize');
//Importar las variables de entorno
require('dotenv').config({path:'variables.env'})

const db = new Sequelize (process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST ,
    dialect: 'mysql' ,
    port: process.env.DB_PORT, 
    define: {
        timestamps: false
    },
        
    pool: {
        max: 5 ,
        min: 0 ,
        acquire: 30000 ,
        idle: 10000

    }
});

module.exports = db;