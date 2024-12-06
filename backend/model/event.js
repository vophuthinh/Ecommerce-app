const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Event = sequelize.define(
  "Event",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    Finish_Date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Running",
    },
    tags: {
      type: DataTypes.STRING,
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
    },
    discountPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
    },
    shopId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shop: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    sold_out: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "events",
    timestamps: false,
  }
);
module.exports = Event;
