const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");

// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;
      //   group cart items by shopId
      const shopItemsMap = new Map();
      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }
      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shipping_address: shippingAddress,
          user,
          total_price: totalPrice,
          paymentInfo,
          
        });
        orders.push(order);
      }

      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.findAll({
        where: { "user.id": req.params.userId },
      })
      const updatedProducts = orders.map(product => {
        const newProduct = product.toJSON(); 
        newProduct.cart = JSON.parse(newProduct.cart);
        newProduct.shipping_address = JSON.parse(newProduct.shipping_address);
        newProduct.user = JSON.parse(newProduct.user);
        newProduct.paymentInfo = JSON.parse(newProduct.paymentInfo);
        return newProduct;
      });
      const newUpdatedProducts = updatedProducts.map(product => ({
        ...product,
        shippingAddress: product.shipping_address,
        totalPrice: product.total_price,
        paidAt: product.paid_at,
        deliveredAt: product.delivered_at,
        createdAt : product.created_at

      }));
      res.status(200).json({
        success: true,
        orders :newUpdatedProducts,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.findAll({
        "cart.shopId": req.params.shopId,
      })
      const updatedProducts = orders.map(product => {
     
        const newProduct = product.toJSON(); 
        console.log( JSON.parse(newProduct.user),'newProduct')
        newProduct.cart = JSON.parse(newProduct.cart);
        newProduct.shipping_address = JSON.parse(newProduct.shipping_address);
        // newProduct.shippingAddress = JSON.parse(newProduct.shipping_address);
        newProduct.user = JSON.parse(newProduct.user);
        newProduct.paymentInfo = JSON.parse(newProduct.paymentInfo);

        return newProduct;
      });
      const newUpdatedProducts = updatedProducts.map(product => ({
        ...product,
        shippingAddress: product.shipping_address,
        totalPrice: product.total_price,
        paidAt: product.paid_at,
        deliveredAt: product.delivered_at,
        createdAt : product.created_at

      }));
      res.status(200).json({
        success: true,
        orders :newUpdatedProducts,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findByPk(req.params.id);

      if (!order) {
        return next(
          new ErrorHandler("Đơn hàng không tìm thấy với ID này", 400)
        );
      }
      if (req.body.status === "Transferred to delivery partner") {
        const cartDataOrder = JSON.parse(order.cart) || '[]'
        cartDataOrder.forEach(async (o) => {
          await updateOrder(o.id, o.qty);
        });
      }

      order.status = req.body.status;

      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        const infoPayment = JSON.parse(order.paymentInfo)
        infoPayment.status = "Succeeded";
        const serviceCharge = order.total_price * 0.1;
        console.log(123)
        await updateSellerInfo(order.total_price - serviceCharge);
      }
      await order.save({ validateBeforeSave: false });
      res.status(200).json({
        success: true,
        order,
      });
      async function updateOrder(id, qty) {
        const product = await Product.findByPk(id);
        product.stock -= qty;
        product.sold_out += qty;
        await product.save({ validateBeforeSave: false });
      }
      async function updateSellerInfo(amount) {
        console.log(amount,'seller')
        const seller = await Shop.findByPk(req.seller.id);
        seller.availableBalance = amount;
        await seller.save();
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// give a refund ----- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findByPk(req.params.id);

      if (!order) {
        return next(
          new ErrorHandler("Đơn hàng không tìm thấy với ID này", 400)
        );
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Yêu cầu hoàn tiền đặt hàng thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findByPk(req.params.id);

      if (!order) {
        return next(
          new ErrorHandler("Không tìm thấy đơn đặt hàng với id này", 400)
        );
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Hoàn tiền đặt hàng thành công!",
      });

      if (req.body.status === "Refund Success") {
        const cartOrder = JSON.parse(order.cart)||'[]'
        console.log(cartOrder,'cartOrder')
        cartOrder.forEach(async (o) => {
          await updateOrder(o.productId, o.quantity);
        });
      }
      async function updateOrder(id, qty) {
        const product = await Product.findByPk(id);
        console.log(product,'product')
        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all orders --- for admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
  // isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.findAll({})
      const updatedProducts = orders.map(product => {
        const newProduct = product.toJSON(); 
        newProduct.cart = JSON.parse(newProduct.cart);
        newProduct.shipping_address = JSON.parse(newProduct.shipping_address);
        newProduct.user = JSON.parse(newProduct.user);
        newProduct.paymentInfo = JSON.parse(newProduct.paymentInfo);
        return newProduct;
      });
      const newUpdatedProducts = updatedProducts.map(product => ({
        ...product,
        shippingAddress: product.shipping_address,
        totalPrice: product.total_price,
        paidAt: product.paid_at,
        deliveredAt: product.delivered_at,
        createdAt : product.created_at
      }));
      res.status(201).json({
        success: true,
        orders :newUpdatedProducts,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
