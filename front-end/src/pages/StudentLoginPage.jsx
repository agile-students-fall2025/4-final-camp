import React, { useState } from "react";
import { api } from "../services/api.js";
import { authUtils } from "../utils/auth.js";

export default function StudentLoginPage({ onLogin, onBack, onNavigateToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      // Call the backend login API
      const response = await api.login(email, password);
      
      // Store user info in localStorage
      if (response.user) {
        authUtils.setUser(response.user);
        if (response.user.id) {
          authUtils.setUserId(response.user.id);
        }
      } else if (response.userId) {
        authUtils.setUserId(response.userId);
      } else {
        // Fallback: use email as userId or default
        authUtils.setUserId(`usr_${email.split('@')[0]}`);
      }
      
      onLogin();
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-800 flex items-center gap-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Login</h1>
          <p className="text-gray-600">Access your campus equipment reservations</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="your.email@university.edu"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            New user?{" "}
            <button
              onClick={onNavigateToRegister}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Register here
            </button>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Powered by your NetID • Secure • Real-time availability
          </p>
        </div>
      </div>
    </div>
  );
}

// [Task #408] Update: Improve student login form validation
