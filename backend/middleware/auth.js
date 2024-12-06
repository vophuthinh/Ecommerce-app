const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

exports.isAuthenticated = catchAsyncErrors(async(req,res,next) => {
    const {token} = req.cookies;
  
    if(!token){
        return next(new ErrorHandler("Vui lòng đăng nhập để tiếp tục", 401));
    }
    const decoded = jwt.verify(token, "B2hFTxy%M#WaHgD6$5Wex2o@b*9J7u");
    console.log(decoded)
    req.user = await User.findByPk(decoded.id);
    next();
});


exports.isSeller = catchAsyncErrors(async(req,res,next) => {
    const {seller_token} = req.cookies;
    if(!seller_token){
        return next(new ErrorHandler("Vui lòng đăng nhập để tiếp tục", 401));
    }
    const decoded = jwt.verify(seller_token, "B2hFTxy%M#WaHgD6$5Wex2o@b*9J7u");

    req.seller = await Shop.findByPk(decoded.id);

    next();
});


exports.isAdmin = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} không thể truy cập tài nguyên này!`))
        };
        next();
    }
}