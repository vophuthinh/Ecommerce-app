const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('new-nodejs', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

sequelize
    .authenticate()
    .then(() => console.log('MySQL connected...'))
    .catch((err) => console.error('Connection error:', err));

module.exports = sequelize;
