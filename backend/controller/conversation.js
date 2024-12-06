const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const sequelize = require("../config/database");
const { Op } = require("sequelize");
const router = express.Router();

// create a new conversation
router.post(
  "/create-new-conversation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { groupTitle, userId, sellerId } = req.body;
      console.log(req.body,'req.body')
      const isConversationExist = await Conversation.findOne({
        where: { groupTitle: groupTitle },
      });

      if (isConversationExist) {
        const conversation = isConversationExist;
        res.status(201).json({
          success: true,
          conversation,
        });
      } else {
        const conversation = await Conversation.create({
          members: [userId, sellerId],
          groupTitle: groupTitle,
        });

       return res.status(201).json({
          success: true,
          conversation,
        });
      }
    } catch (error) {
      return res.json({
        message  : error.message,
      })
    }
  })
);

// get seller conversations
router.get(
  "/get-all-conversation-seller/:id",
   isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellerId = req.params.id;
      const conversations = await Conversation.findAll({});
      console.log(sellerId,'sellerId')
      const filteredConversations = conversations.filter((conversation) => {
        const membersArray = conversation.members
        .replace(/[\[\]']+/g, '')  
        .split(',');     
        console.log(membersArray,'conversation')
        return membersArray.includes(sellerId); 
      });
      if (filteredConversations.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không có cuộc trò chuyện nào!',
        });
      }
      const updatedProducts = filteredConversations.map(product => {
        const newProduct = product.toJSON(); 
        newProduct.members = JSON.parse(newProduct.members);
        return newProduct;
      });
      res.status(200).json({
        success: true,
        conversations: updatedProducts,
      });
    } catch (error) {
      console.error(error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get user conversations
router.get(
  "/get-all-conversation-user/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const sellerId = req.params.id;
      const conversations = await Conversation.findAll({});
      console.log(sellerId,'sellerId')
      const filteredConversations = conversations.filter((conversation) => {
        const membersArray = conversation.members
        .replace(/[\[\]']+/g, '')  
        .split(',');     
        return membersArray.includes(sellerId); 
      });
      if (filteredConversations.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không có cuộc trò chuyện nào!',
        });
      }
      const updatedProducts = filteredConversations.map(product => {
        const newProduct = product.toJSON();
        newProduct.members = JSON.parse(newProduct.members);
        return newProduct;
      });
      res.status(201).json({
        success: true,
        conversations : updatedProducts,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

// update the last message
router.put(
  "/update-last-message/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { lastMessage, lastMessageId } = req.body;
      const conversationId = req.params.id;

      const conversation = await Conversation.findOne({where :{id :req.params.id}})
      if (!conversation) {
        return next(new ErrorHandler("Cuộc trò chuyện không tồn tại!", 404));
      }
      conversation.lastMessage = lastMessage;
      conversation.lastMessageId = lastMessageId;
      
    await conversation.save();

      res.status(201).json({
        success: true,
        conversation,
      });
    } catch (error) {
      return next(new ErrorHandler(error), 500);
    }
  })
);

module.exports = router;
