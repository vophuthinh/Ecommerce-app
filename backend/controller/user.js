const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const bcrypt = require("bcryptjs");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.file)
    const userEmail = await User.findOne({ where: { email } });

    if (userEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      return next(new ErrorHandler("Người dùng đã tồn tại", 400));
    }
    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    };
    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;
    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Xin chào ${user.name}, vui lòng nhấn vào liên kết để kích hoạt tài khoản: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `Vui lòng kiểm tra Email:- ${user.email} để kích hoạt tài khoản!`,
      });
    } catch (error) {
      return res.json({
        message: error.message,
      });
    }
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, "B2hFTxy%M#WaHgD6$5Wex2o@b*9J7u", {
    expiresIn: "5m",
  });
};

// activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        "B2hFTxy%M#WaHgD6$5Wex2o@b*9J7u"
      );

      if (!newUser) {
        return next(new ErrorHandler("Token không hợp lệ", 400));
      }
      const { name, email, password, avatar } = newUser;
      const hashedPassword = await bcrypt.hash(password, 10);
      let user = await User.findOne({ where: { email } });
      if (user) {
        return next(new ErrorHandler("Người dùng đã tồn tại!", 400));
      }
      user = await User.create({
        name,
        email,
        avatar,
        password: hashedPassword,
      });
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(
          new ErrorHandler("Vui lòng cung cấp tất cả thông tin!", 400)
        );
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(new ErrorHandler("Người dùng không tồn tại!", 400));
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Vui lòng cung cấp thông tin chính xác!", 400)
        );
      }
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return next(new ErrorHandler("Người dùng không tồn tại!", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// log out user
router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(201).json({
        success: true,
        message: "Đăng xuất thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user info
router.put(
  "/update-user-info",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password, phoneNumber, name } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(new ErrorHandler("Không tìm thấy người dùng này!", 400));
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Vui lòng cung cấp thông tin chính xác!", 400)
        );
      }
      user.name = name;
      user.email = email;
      user.phoneNumber = phoneNumber;

      await user.save();

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user avatar
router.put(
  "/update-avatar",
  isAuthenticated,
  upload.single("image"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const existsUser = await User.findByPk(req.user.id);
      if (!existsUser) {
        return next(new ErrorHandler("User not found!", 404));
      }
      const existAvatarPath = `uploads/${existsUser.avatar}`;
      if (fs.existsSync(existAvatarPath)) {
        fs.unlinkSync(existAvatarPath);
      }
      const fileUrl = path.join(req.file.filename);
      existsUser.avatar = fileUrl;
      await existsUser.save();
      res.status(200).json({
        success: true,
        user: existsUser,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user addresses
router.put(
  "/update-user-addresses",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      console.log(user)
      const newAdd = JSON.parse(user.addresses ||'[]')
      const sameTypeAddress = newAdd.find(
        (address) => address.addressType === req.body.addressType
      );
      if (sameTypeAddress) {
        return next(
          new ErrorHandler(`${req.body.addressType} địa chỉ đã tồn tại!`)
        );
      }

      const existsAddress = newAdd.find(
        (address) => address.id === req.body.id
      );

      if (existsAddress) {
        Object.assign(existsAddress, req.body);
      } else {
        // add the new address to the array
        newAdd.push(req.body);
      }
      user.addresses = newAdd
      await user.save();
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete user address
router.delete(
  "/delete-user-address/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const userId = req.user.id;
      const addressId = req.params.id;

      console.log(addressId);
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      const addresses = user.addresses ? JSON.parse(user.addresses) : [];
      const updatedAddresses = addresses.filter(
        (_ , index) => index != addressId
      );
      if (updatedAddresses.length === 0) {
        user.addresses = null;
      } else {
        user.addresses = JSON.stringify(updatedAddresses);
      }
      await user.save();
      res.status(200).json({ success: true, user });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update user password
router.put(
  "/update-user-password",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id);
      const isPasswordMatched = await user.comparePassword(
        req.body.oldPassword
      );

      if (!isPasswordMatched) {
        return next(new ErrorHandler("Mật khẩu cũ không đúng!", 400));
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Mật khẩu không khớp với nhau!", 400));
      }
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({
        success: true,
        message: "Cập nhật mật khẩu thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// find user infoormation with the userId
router.get(
  "/user-info/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// all users --- for admin
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const users = await User.findAll({});
      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// delete users --- admin
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return next(
          new ErrorHandler("Người dùng không khả dụng với id này!", 400)
        );
      }
      await user.destroy();
      res.status(201).json({
        success: true,
        message: "Xóa người dùng thành công!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
