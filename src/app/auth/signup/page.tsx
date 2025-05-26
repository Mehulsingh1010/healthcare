'use client'
import React, { useState } from 'react';
import { ArrowLeft, Leaf, Mail, Lock, Eye, EyeOff, Heart, Shield, Star, User} from 'lucide-react';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    if (!name.trim()) {
      setError('Full name is required');
      setIsSubmitting(false);
      return;
    }
    
    if (!email.trim()) {
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }
    
    if (!password) {
      setError('Password is required');
      setIsSubmitting(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }
    
    if (!agreeTerms) {
      setError('You must agree to the terms and conditions');
      setIsSubmitting(false);
      return;
    }
    
    setTimeout(() => {
      console.log('Registration attempt:', { name, email, password, agreeTerms });
      setIsSubmitting(false);
    }, 2000);
  };
  
  return (
    <div className="h-screen bg-white flex">
      {/* Back Button */}
      <button className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back</span>
      </button>

      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-teal-600 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute top-1/3 left-1/2 w-20 h-20 bg-white rounded-full"></div>
        </div>
        
        <div className="flex flex-col justify-center items-center text-white p-16 relative z-10">
          {/* Logo */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <Leaf className="h-16 w-16 text-white" />
          </div>
          
          {/* Brand */}
          <h1 className="text-5xl font-bold mb-4">HealthCare+</h1>
          <p className="text-xl text-emerald-100 mb-12 text-center max-w-md">
            Join thousands who trust us for their wellness journey
          </p>
          
          {/* Features */}
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg p-3">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Secure & Private</h3>
                <p className="text-emerald-100 text-sm">Your data is always protected</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg p-3">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Personalized Care</h3>
                <p className="text-emerald-100 text-sm">Tailored health recommendations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg p-3">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Premium Experience</h3>
                <p className="text-emerald-100 text-sm">Award-winning platform</p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex space-x-8 mt-12">
            <div className="text-center">
              <div className="text-2xl font-bold">500K+</div>
              <div className="text-emerald-200 text-sm">Happy Users</div>
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
      
      {/* Right Side - Registration Form */}
      <div className="flex-1 lg:w-1/2 bg-white flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mb-4">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">HealthCare+</h1>
          </div>
          
          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600">Join us and start your wellness journey</p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Create a password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Confirm your password"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input 
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-all"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create account'
              )}
            </button>
            
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{" "}
                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Sign in
                </a>
              </p>
            </div>
          </form>
          
          {/* Terms */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-emerald-600 hover:underline">Terms</a>{" "}
              and{" "}
              <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}