const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
 const Conversation = sequelize.define('Conversation', {
    groupTitle: {
          type: DataTypes.STRING
      },
      members: {
          type: DataTypes.JSON
      },
      lastMessage: {
          type: DataTypes.TEXT
      },
      lastMessageId: {
          type: DataTypes.STRING
      },
      created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
      },
      updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW
      }
  }, {
      tableName: 'conversations',
      timestamps: false
  });
module.exports = Conversation;
