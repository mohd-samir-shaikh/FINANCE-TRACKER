import { useState } from "react";
import API from "../api";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  //send otp
  const sendOtp = async () => {
    if (!email) {
      setMessage("Please enter email");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      console.log("RESET EMAIL:", email);

      const res = await API.post("/auth/forgot-password", { email });

      setOtpSent(true);
      setMessage(res.data.message || "OTP sent to your email");
    } catch (err) {
      console.log("SEND OTP ERROR:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  //reset password
  const resetPassword = async () => {
    if (!email || otp.trim() === "" || newPassword.trim() === "") {
      setMessage("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      console.log("RESET DATA:", email, otp, newPassword);

      const res = await API.post("/auth/reset-password", {
        email,
        otp: otp.toString(), // IMPORTANT
        password: newPassword,
      });

      setMessage(res.data.message || "Password reset successful");

      // Optional cleanup
      setOtp("");
      setNewPassword("");
    } catch (err) {
      console.log("RESET ERROR:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {message && (
          <p className="text-center text-red-500 mb-3">{message}</p>
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mb-4 p-3 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Send OTP */}
        {!otpSent && (
          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {/* OTP + New Password */}
        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full mt-4 mb-4 p-3 border rounded-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter new password"
              className="w-full mb-4 p-3 border rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}