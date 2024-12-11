const express = require('express');
const { isSeller, isAuthenticated, isAdmin } = require('../middleware/auth');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const router = express.Router();
const Product = require('../model/product');
const Order = require('../model/order');
const Shop = require('../model/shop');
const { upload } = require('../multer');
const ErrorHandler = require('../utils/ErrorHandler');
const fs = require('fs');
const { analyzeSentiment, checkModelStatus, getDominantLabel } = require('./analyzeSentiment');

// create product
router.post(
    '/create-product',
    upload.array('images'),
    catchAsyncErrors(async (req, res, next) => {
        try {
            console.log(123);
            const shopId = req.body.shopId;
            const shop = await Shop.findByPk(shopId);

            if (!shop) {
                return next(new ErrorHandler('Id cửa hàng không hợp lệ!', 400));
            } else {
                const files = req.files;
                const imageUrls = files.map((file) => `${file.filename}`);
                const productData = req.body;
                productData.images = imageUrls;
                productData.shop = shop;
                productData.discount_price = 0;
                productData.shopId = shopId;
                const product = await Product.create(productData);
                res.status(201).json({
                    success: true,
                    product,
                });
            }
        } catch (error) {
            return res.json({
                message: error.message,
            });
        }
    }),
);
router.put(
    '/update-product',
    upload.array('images'),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { shopId, productId, ...productData } = req.body;
            console.log(req.body, 'cc');
            const shop = await Shop.findByPk(shopId);
            const dataProduct = await Product.findOne({ where: { id: productId } });
            if (!dataProduct) {
                return next(new ErrorHandler('Sản phẩm không hợp lệ!', 400));
            }
            if (!shop) {
                return next(new ErrorHandler('Cửa hàng không hợp lệ!', 400));
            }
            const files = req.files;
            if (files && files.length > 0) {
                const imageUrls = files.map((file) => `${file.filename}`);
                productData.images = imageUrls;
            }
            dataProduct.name = productData.name || dataProduct.name;
            dataProduct.description = productData.description || dataProduct.description;
            dataProduct.price = productData.price || dataProduct.price;
            dataProduct.discountPrice = productData.discountPrice || dataProduct.discountPrice;
            dataProduct.originalPrice = productData.originalPrice || dataProduct.originalPrice;
            dataProduct.shopId = shopId;
            dataProduct.images = productData.images || dataProduct.images;
            await dataProduct.save();
            res.status(200).json({
                success: true,
                product: dataProduct,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// get all products of a shop
// router.get(
//   "/get-all-products-shop/:id",
//   catchAsyncErrors(async (req, res, next) => {
//     try {
//       const products = await Product.findAll({
//         where: { shopId: req.params.id },
//       });
//       const updatedProducts = products.map(product => {
//         const newProduct = product.toJSON();
//         newProduct.images = JSON.parse(newProduct.images);
//         newProduct.shop = JSON.parse(newProduct.shop);
//         newProduct.reviews = JSON.parse(newProduct.reviews);
//         return newProduct;
//       });

//       res.status(201).json({
//         success: true,
//         products :updatedProducts,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error, 400));
//     }
//   })
// );
router.get(
    '/get-all-products-shop/:id',
    catchAsyncErrors(async (req, res, next) => {
        try {
            // Kiểm tra mô hình trước khi tiếp tục
            while (!(await checkModelStatus())) {
                console.log('Chờ thêm 10 giây...');
                await new Promise((resolve) => setTimeout(resolve, 10000));
            }

            const products = await Product.findAll({
                where: { shopId: req.params.id },
            });

            const updatedProducts = await Promise.all(
                products.map(async (product) => {
                    const newProduct = product.toJSON();
                    newProduct.images = JSON.parse(newProduct.images);
                    newProduct.shop = JSON.parse(newProduct.shop);
                    newProduct.reviews = JSON.parse(newProduct.reviews);

                    // Phân tích cảm xúc cho từng review
                    if (newProduct.reviews && newProduct.reviews.length > 0) {
                        newProduct.reviews = await Promise.all(
                            newProduct.reviews.map(async (review) => {
                                if (review.comment) {
                                    const sentimentResult = await analyzeSentiment(review.comment);
                                    if (sentimentResult) {
                                        const dominant = getDominantLabel(sentimentResult);
                                        return {
                                            ...review,
                                            sentiment: dominant, // Thêm trường cảm xúc vào mỗi review
                                        };
                                    }
                                }
                                return review; // Nếu không thể phân tích, trả về review gốc
                            }),
                        );
                    }

                    return newProduct;
                }),
            );

            res.status(201).json({
                success: true,
                products: updatedProducts,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    }),
);

// delete product of a shop
router.delete(
    '/delete-shop-product/:id',
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const productId = req.params.id;

            const productData = await Product.findByPk(productId);
            const imageArr = JSON.parse(productData.images);
            imageArr.forEach((imageUrl) => {
                const filename = imageUrl;
                const filePath = `uploads/${filename}`;

                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
            const product = await productData.destroy();
            if (!product) {
                return next(new ErrorHandler('Không tìm thấy sản phẩm với ID này!', 500));
            }
            res.status(201).json({
                success: true,
                message: 'Xóa sản phẩm thành công!',
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    }),
);

// get all products
router.get(
    '/get-all-products',
    catchAsyncErrors(async (req, res, next) => {
        try {
            const products = await Product.findAll({});
            const updatedProducts = products.map((product) => {
                const newProduct = product.toJSON();
                newProduct.images = JSON.parse(newProduct.images);
                newProduct.shop = JSON.parse(newProduct.shop);
                newProduct.reviews = JSON.parse(newProduct.reviews);
                return newProduct;
            });
            res.status(201).json({
                success: true,
                products: updatedProducts,
            });
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    }),
);

// review for a product
router.put(
    '/create-new-review',
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { user, rating, comment, productId, orderId } = req.body;

            // Tìm sản phẩm
            const product = await Product.findByPk(productId);

            // Nếu không tìm thấy sản phẩm, trả về lỗi
            if (!product) {
                return next(new ErrorHandler('Sản phẩm không tồn tại!', 404));
            }

            const review = {
                user,
                rating,
                comment,
                productId,
                date: new Date(),
            };

            const dataReview = product?.reviews ? JSON.parse(product.reviews) : [];
            const isReviewed = dataReview.find((rev) => rev.user.id == req.user.id);

            if (isReviewed) {
                dataReview.forEach((rev) => {
                    if (rev.user.id == req.user.id) {
                        rev.rating = rating;
                        rev.comment = comment;
                        rev.user = user;
                        rev.date = new Date();
                    }
                });
            } else {
                dataReview.push(review);
            }

            let avg = 0;
            dataReview.forEach((rev) => {
                avg += rev.rating;
            });

            product.ratings = avg / dataReview.length;
            product.reviews = dataReview;
            await product.save({ validateBeforeSave: false });

            res.status(200).json({
                success: true,
                product,
                message: 'Đánh giá thành công!',
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// all products --- for admin
router.get(
    '/admin-all-products',
    isAuthenticated,
    isAdmin('Admin'),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const products = await Product.findAll({});
            res.status(201).json({
                success: true,
                products,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);
module.exports = router;
