import { useState } from "react";
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { serverEndpoint } from "../config/config";
import { useDispatch } from "react-redux";
import { SET_USER } from "../redux/user/actions";

function Register() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is mandatory";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validate()) {
      const body = {
        username: formData.username,
        password: formData.password,
        name: formData.name
      };
      const config = { withCredentials: true };

      try {
        const response = await axios.post(`${serverEndpoint}/auth/register`, body, config);
        dispatch({ type: SET_USER, payload: response.data });
      } catch (error) {
        console.error(error);
        setErrors({
          message:
            error.response?.data?.message || 'Registration failed',
        });

      }
    }
  };

  const handleGoogleSignin = async (credentialResponse) => {
    try {
      const response = await axios.post(
        `${serverEndpoint}/auth/google`,
        { token: credentialResponse.credential },
        { withCredentials: true }
      );
      dispatch({ type: SET_USER, payload: response.data });
    } catch (error) {
      console.error(error);
      setErrors({ message: 'Google Sign-in failed' });
    }
  };

  const handleGoogleSigninFailure = () => {
    setErrors({ message: 'Something went wrong while Google Sign-in' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign up with a new account</h2>

        {errors.message && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {errors.message}
            {errors.message.toLowerCase().includes('already') && (
              <a href="/login" className="underline text-blue-600 hover:text-blue-800 ml-1">
                Go to login
              </a>
            )}
          </div>
        )}


        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.username ? 'border-red-500' : 'border-gray-300'
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
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${errors.password ? 'border-red-500' : 'border-gray-300'
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
          <GoogleLogin onSuccess={handleGoogleSignin} onError={handleGoogleSigninFailure} />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}

export default Register;
