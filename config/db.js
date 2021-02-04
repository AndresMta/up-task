const { Sequelize } = require('sequelize');
require('dotenv').config({ path: 'variables.env' });

// Passing parameters separately (other dialects)
const sequelize = new Sequelize(process.env.DB_NOMBRE, process.env.DB_USER, '', {
    host: process.env.DB_HOST,
    dialect: 'mysql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
    define: {
        timestamps: false,
    }
  });

module.exports = sequelize;
