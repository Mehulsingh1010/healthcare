/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Heart,
  Shield,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email.trim()) {
      setError("Email is required");
      setIsSubmitting(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      console.log("Login attempt:", { email, password, rememberMe });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="h-screen bg-white flex">
      {/* Back Button */}
      <button className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />

          <span className="font-medium">Back</span>
        </Link>
      </button>

      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-teal-600 relative">
        {/* Simple background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 right-20 w-16 h-16 bg-white rounded-full"></div>
        </div>

        <div className="flex flex-col justify-center items-center text-white p-16 relative z-10">
          {/* Logo */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <Leaf className="h-16 w-16 text-white" />
          </div>

          {/* Brand */}
          <h1 className="text-5xl font-bold mb-4">HealthCare+</h1>
          <p className="text-xl text-emerald-100 mb-12 text-center max-w-md">
            Your trusted partner for premium health products
          </p>

          {/* Simple features */}
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg p-3">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Certified Products</h3>
                <p className="text-emerald-100 text-sm">
                  FDA approved supplements
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg p-3">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Expert Care</h3>
                <p className="text-emerald-100 text-sm">
                  Professional health support
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg p-3">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Premium Quality</h3>
                <p className="text-emerald-100 text-sm">
                  Top-rated health products
                </p>
              </div>
            </div>
          </div>

          {/* Simple stats */}
          <div className="flex space-x-8 mt-12">
            <div className="text-center">
              <div className="text-2xl font-bold">500K+</div>
              <div className="text-emerald-200 text-sm">Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-emerald-200 text-sm">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4.9★</div>
              <div className="text-emerald-200 text-sm">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mb-4">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">HealthCare+</h1>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-all"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <a
                  href="#"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Create account
                </a>
              </p>
            </div>
          </div>

          {/* Terms */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <a href="#" className="text-emerald-600 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-emerald-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
