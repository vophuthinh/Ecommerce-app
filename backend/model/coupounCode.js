const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CoupounCode = sequelize.define(
  "CoupounCode",
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    minAmount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    maxAmount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    shopId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    selectedProducts: {
        type: DataTypes.TEXT, 
        allowNull: true,
        get() {
          const value = this.getDataValue("selectedProducts");
          return value ? JSON.parse(value) : [];
        },
        set(value) {
          this.setDataValue("selectedProducts", JSON.stringify(value));
        },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "coupoun_codes",
    timestamps: false,
  }
);
module.exports = CoupounCode;
