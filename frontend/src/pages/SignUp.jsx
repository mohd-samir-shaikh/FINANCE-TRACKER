import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import Header from "../components/Header";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/signup", {
        username,
        email,
        password,
      });

      console.log("SIGNUP SUCCESS 👉", res.data);

      navigate("/signin");
    } catch (err) {
      console.log("SIGNUP ERROR 👉", err.response?.data);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Create Account
          </h2>

          {error && (
            <p className="mb-4 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/*SIGN IN LINK */}
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}