import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/config";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // ADDED: Import Link component

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is mandatory";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setMessage(null);

    try {
      // Call the new backend API to send the reset token
      const response = await axios.post(
        `${serverEndpoint}/auth/send-reset-password-token`,
        { email },
        { withCredentials: true }
      );
      setMessage(response.data.message); // Display the generic success message

      // Navigate to ResetPassword page, passing the email
      navigate("/reset-password", { state: { email: email, fromForgot: true } });

    } catch (error) {
      console.error("Forgot Password Error:", error);
      setErrors({
        message:
          error.response?.data?.message ||
          "Failed to send reset code. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Forgot Password
        </h2>

        {errors.message && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {errors.message}
          </div>
        )}
        {message && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Remember your password?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
