import { useState } from "react";
import axios from "../api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //send otp
  const sendOtp = async () => {
    try {
      await axios.post("/auth/forgot-password", { email });
      alert("OTP sent to your email");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Email not found");
    }
  };

  //verify otp and reset
  const resetPassword = async () => {
    if (!otp || !password || !confirmPassword) {
      alert("All fields required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("/auth/reset-password", {
        email,
        otp: String(otp),
        password,
      });

      alert("Password reset successfully");

      // reset state
      setStep(1);
      setEmail("");
      setOtp("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP or OTP expired");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md border">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Forgot Password
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter registered email"
              className="w-full p-3 mb-4 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
            onClick={sendOtp}
            disabled={step !== 1}
            className={`w-full mt-4 py-3 rounded-lg font-semibold transition
            ${step !== 1
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
            Send OTP
          </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 mb-4 border rounded-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 mb-4 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 mb-6 border rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              onClick={resetPassword}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}