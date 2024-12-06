const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Shop = sequelize.define(
  "Shop",
  {
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
    description: {
      type: DataTypes.TEXT,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "Seller",
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.INTEGER,
    },
    withdrawMethod: {
      type: DataTypes.JSON,
    },
    availableBalance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
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
  },
  {
    tableName: "shops",
    timestamps: false,
  }
);

Shop.prototype.getJwtToken = function () {
  return jwt.sign({ id: this.id }, "B2hFTxy%M#WaHgD6$5Wex2o@b*9J7u");
};
Shop.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = Shop;
