const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    
    resetOtp: {
      type: String,                   // for forgot password otp
      default: null,
    },

    resetOtpExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {                  // hash password before saving
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);                // compare password in login with hashed password in db
};

module.exports = mongoose.model("User", userSchema);