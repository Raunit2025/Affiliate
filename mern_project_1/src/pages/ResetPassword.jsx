import { useState, useEffect } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/config";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const userDetails = useSelector((state) => state.userDetails);

  const initialEmail = location.state?.email || userDetails?.email || "";
  const isEmailFieldHidden = !!userDetails?.email; 

  const [formData, setFormData] = useState({
    email: initialEmail,
    code: "",
    newPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userDetails?.email && location.state?.fromUserHeader) {
      const sendTokenAutomatically = async () => {
        setLoading(true);
        setErrors({});
        setMessage(null);
        try {
          const response = await axios.post(
            `${serverEndpoint}/auth/send-reset-password-token`,
            { email: userDetails.email },
            { withCredentials: true }
          );
          setMessage(response.data.message);
        } catch (error) {
          console.error("Auto Send Reset Token Error:", error);
          setErrors({
            message:
              error.response?.data?.message ||
              "Failed to send reset code automatically. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      };
      sendTokenAutomatically();
    }
  }, [userDetails, location.state?.fromUserHeader]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (!isEmailFieldHidden && !formData.email.trim()) {
      newErrors.email = "Email is mandatory";
      isValid = false;
    } else if (!isEmailFieldHidden && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
      isValid = false;
    }

    if (!formData.code.trim()) {
      newErrors.code = "Reset code is mandatory";
      isValid = false;
    } else if (!/^\d{6}$/.test(formData.code)) {
      newErrors.code = "Reset code must be 6 digits";
      isValid = false;
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is mandatory";
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setMessage(null);

    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/reset-password`,
        {
          email: formData.email,
          code: formData.code,
          newPassword: formData.newPassword,
        },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Reset Password Error:", error);
      setErrors({
        message:
          error.response?.data?.message ||
          "Failed to reset password. Please check your code and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
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
          {!isEmailFieldHidden && (
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
                value={formData.email}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                required
                disabled={isEmailFieldHidden}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              6-Digit Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring ${
                errors.code ? "border-red-500" : "border-gray-300"
              }`}
              maxLength="6"
              required
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring ${
                errors.newPassword ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Back to{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;