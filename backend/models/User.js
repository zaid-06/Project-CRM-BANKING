const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER, // ✅ IMPORTANT
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },

    role: {
      type: DataTypes.ENUM("admin", "manager", "staff", "franchise"),
      defaultValue: "staff",
    },

    department: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    avatar: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },

    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // 🔐 OTP Fields
    otp: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },

    otpExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // 🔄 Refresh Token
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,

    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }

        if (user.name && !user.avatar) {
          user.avatar = user.name.charAt(0).toUpperCase();
        }
      },

      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);



// 🔒 Hide sensitive fields in response
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  delete values.refreshToken;
  delete values.otp;
  delete values.otpExpires;
  return values;
};



// 🔐 Compare Password
User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};



// 🔢 Generate OTP
User.prototype.generateOTP = async function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await this.save();
  return otp;
};



// ✅ VERIFY OTP METHOD (Important Fix)
User.prototype.verifyOTP = function (enteredOtp) {
  if (!this.otp || !this.otpExpires) return false;
  if (this.otp !== enteredOtp) return false;
  if (new Date() > this.otpExpires) return false;
  return true;
};



module.exports = User;