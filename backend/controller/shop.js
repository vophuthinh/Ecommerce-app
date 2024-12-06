const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const sendToken = require('../utils/jwtToken');
const Shop = require('../model/shop');
const { isAuthenticated, isSeller, isAdmin } = require('../middleware/auth');
const { upload } = require('../multer');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const sendShopToken = require('../utils/shopToken');
const bcrypt = require('bcryptjs');
// create shop
router.post('/create-shop', upload.single('file'), async (req, res, next) => {
    try {
        const { email } = req.body;
        const sellerEmail = await Shop.findOne({ where: { email } });
        if (sellerEmail) {
            const filename = req.file.filename;
            const filePath = `uploads/${filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: 'Error deleting file' });
                }
            });
            return next(new ErrorHandler('Email đã được sử dụng!', 400));
        }
        const filename = req.file.filename;
        const fileUrl = path.join(filename);
        const seller = {
            name: req.body.name,
            email: email,
            password: req.body.password,
            avatar: fileUrl,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
        };
        const activationToken = createActivationToken(seller);
        const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;
        try {
            await sendMail({
                email: seller.email,
                subject: 'Activate your Shop',
                message: `Xin chào ${seller.name}, Vui lòng nhấn vào liên kết để xác minh email đăng ký " Trở thành người bán" trên ECommerce shop: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `Vui lòng kiểm tra Email:- ${seller.email} để xác minh đăng ký!`,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
// create activation token
const createActivationToken = (seller) => {
    return jwt.sign(seller, 'B2hFTxy%M#WaHgD6$5Wex2o@b*9J7u', {
        expiresIn: '5m',
    });
};
// activate user
router.post(
    '/activation',
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { activation_token } = req.body;

            const newSeller = jwt.verify(activation_token, 'B2hFTxy%M#WaHgD6$5Wex2o@b*9J7u');

            if (!newSeller) {
                return next(new ErrorHandler('Token không hợp lệ', 400));
            }
            const { name, email, password, avatar, address, phoneNumber } = newSeller;
            const hashedPassword = await bcrypt.hash(password, 10);

            let seller = await Shop.findOne({ where: { email } });
            if (seller) {
                return next(new ErrorHandler('Email này đã được sử dụng!', 400));
            }
            seller = await Shop.create({
                name,
                email,
                avatar,
                password: hashedPassword,
                address,
                phoneNumber: phoneNumber,
            });

            sendShopToken(seller, 201, res);
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// login shop
router.post(
    '/login-shop',
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(new ErrorHandler('Vui lòng điền đầy đủ thông tin đăng nhập!', 400));
            }
            const user = await Shop.findOne({ where: { email } });
            if (!user) {
                return next(new ErrorHandler('Cửa hàng này không tồn tại!', 400));
            }
            const isPasswordValid = await user.comparePassword(password);

            if (!isPasswordValid) {
                return next(new ErrorHandler('Vui lòng cung cấp thông tin chính xác!', 400));
            }
            sendShopToken(user, 201, res);
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// load shop
router.get(
    '/getSeller',
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const seller = await Shop.findByPk(req.seller.id);
            if (!seller) {
                return next(new ErrorHandler('Cửa hàng này không tồn tại!', 400));
            }
            const newData = {
                ...seller.toJSON(),
                withdrawMethod: JSON.parse(seller.withdrawMethod),
            };
            return res.status(200).json({
                success: true,
                seller: newData,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// log out from shop
router.get(
    '/logout',
    catchAsyncErrors(async (req, res, next) => {
        try {
            res.cookie('seller_token', null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            });
            res.status(201).json({
                success: true,
                message: 'Đăng xuất thành công!',
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// get shop info
router.get(
    '/get-shop-info/:id',
    catchAsyncErrors(async (req, res, next) => {
        try {
            const shop = await Shop.findByPk(req.params.id);
            res.status(201).json({
                success: true,
                shop,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// update shop profile picture
router.put(
    '/update-shop-avatar',
    isSeller,
    upload.single('image'),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const existsUser = await Shop.findById(req.seller.id);

            const existAvatarPath = `uploads/${existsUser.avatar}`;

            fs.unlinkSync(existAvatarPath);

            const fileUrl = path.join(req.file.filename);

            const seller = await Shop.findByIdAndUpdate(req.seller.id, {
                avatar: fileUrl,
            });

            res.status(200).json({
                success: true,
                seller,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// update seller info
router.put(
    '/update-seller-info',
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { name, description, address, phoneNumber } = req.body;

            const shop = await Shop.findByPk(req.seller.id);

            if (!shop) {
                return next(new ErrorHandler('Cửa hàng này không tìm thấy', 400));
            }

            shop.name = name;
            shop.description = description;
            shop.address = address;
            shop.phoneNumber = phoneNumber;
            // shop.zipCode = zipCode;

            await shop.save();

            res.status(201).json({
                success: true,
                shop,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// all sellers --- for admin
router.get(
    '/admin-all-sellers',
    isAuthenticated,
    isAdmin('Admin'),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const sellers = await Shop.findAll({});
            res.status(201).json({
                success: true,
                sellers,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// delete seller ---admin
router.delete(
    '/delete-seller/:id',
    isAuthenticated,
    isAdmin('Admin'),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const seller = await Shop.findByPk(req.params.id);
            if (!seller) {
                return next(new ErrorHandler('Người bán không có sẵn với id này', 400));
            }
            await seller.destroy();
            res.status(201).json({
                success: true,
                message: 'Đã xóa cửa hàng này thành công!',
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// update seller withdraw methods --- sellers
router.put(
    '/update-payment-methods',
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { withdrawMethod } = req.body;

            const seller = await Shop.findByPk(req.seller.id);
            await seller.update({ withdrawMethod: withdrawMethod });
            res.status(201).json({
                success: true,
                seller,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// delete seller withdraw merthods --- only seller
router.delete(
    '/delete-withdraw-method/',
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const seller = await Shop.findByPk(req.seller.id);
            if (!seller) {
                return next(new ErrorHandler('Không tìm thấy cửa hàng với id này', 400));
            }
            seller.withdrawMethod = null;
            await seller.save();
            res.status(201).json({
                success: true,
                seller,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

module.exports = router;
