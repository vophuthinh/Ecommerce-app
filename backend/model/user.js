const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.BIGINT,
    },
    addresses: {
        type: DataTypes.JSON,
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    reset_password_token: {
        type: DataTypes.STRING,
    },
    reset_password_time: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'users',
    timestamps: false, 
});

User.prototype.getJwtToken = function () {
  return jwt.sign({ id: this.id }, "B2hFTxy%M#WaHgD6$5Wex2o@b*9J7u");
};

User.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
