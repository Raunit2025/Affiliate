import { useState } from "react";
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { serverEndpoint } from "../config/config";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";

function Login() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = "Username is mandatory";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is mandatory";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await axios.post(
          `${serverEndpoint}/auth/login`,
          {
            username: formData.username,
            password: formData.password
          },
          { withCredentials: true }
        );
        dispatch({ type: SET_USER, payload: response.data.user });
      } catch (error) {
        console.error(error);
        setErrors({ message: "Something went wrong, please try again" });
      }
    }
  };

  const handleGoogleSuccess = async (authResponse) => {
    try {
      const response = await axios.post(`${serverEndpoint}/auth/google-auth`, {
        idToken: authResponse.credential
      }, {
        withCredentials: true
      });
      dispatch({ type: SET_USER, payload: response.data.user });
    } catch (error) {
      console.error(error);
      setErrors({ message: 'Error processing Google auth, please try again' });
    }
  };

  const handleGoogleError = (error) => {
    console.error(error);
    setErrors({ message: 'Error in Google authorization flow, please try again' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign in to Continue</h2>

        {errors.message && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {errors.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </form>

        <div className="my-6 flex items-center text-sm text-gray-400">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="px-3">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}

export default Login;
