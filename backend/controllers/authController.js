const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const sendMail = require("../utils/mail");
const generateOTP = require("../utils/otp");


exports.signupRequest = async (req, res) => {
  console.log("SIGNUP BODY", req.body);                       //sign up
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
  console.error("SIGNUP ERROR 👉", err);

  return res.status(500).json({
    message: err.message,
    error: err,
  });
}
};


exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
                                                                        // sign in
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("SIGNIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.forgot = async (req, res) => {
  try {
    const { email } = req.body;                                 // forgot password

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ FIX: define OTP properly
    const otp = generateOTP().toString();

    console.log("OTP GENERATED 👉", otp);

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

//     await sendMail(
//   email,
//   "Password Reset OTP",
//   `Your OTP is ${otp}. It will expire in 5 minutes.`
// );

    return res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR 👉", err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};


exports.reset = async (req, res) => {
  try {                                                             // reset password
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // //  DEBUG LOGS (NOW SAFE)
    // console.log("DB OTP:", user.resetOTP);
    // console.log("USER OTP:", otp);
    // console.log("EXPIRY:", user.resetOTPExpiry);
    // console.log("NOW:", Date.now());

    
    if (
      !user.resetOtp ||
      String(user.resetOtp).trim() !== String(otp).trim() ||
      !user.resetOtpExpiry ||                                                 // otp check
      user.resetOtpExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = password;
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;                     // change password in login info

    if (!newPassword) {
      return res.status(400).json({ message: "Password required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};