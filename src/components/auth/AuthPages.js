import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register, socialAuth } from '../../authService';

// Load Google SDK
const loadGoogleSDK = () => {
  return new Promise((resolve) => {
    // Check if SDK is already loaded
    if (window.gapi) {
      resolve();
      return;
    }
    
    // Load Google SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

// Load LinkedIn SDK
const loadLinkedInSDK = () => {
  return new Promise((resolve) => {
    // Check if SDK is already loaded
    if (window.IN) {
      resolve();
      return;
    }
    
    // Load LinkedIn SDK
    const script = document.createElement('script');
    script.src = 'https://platform.linkedin.com/in.js';
    script.async = true;
    script.defer = true;
    script.text = 'api_key={YOUR_LINKEDIN_API_KEY}'; // Replace with your LinkedIn API key
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

const AuthPages = ({ isSignUp = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('amateur');
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load social SDKs
  useEffect(() => {
    const loadSDKs = async () => {
      try {
        await Promise.all([loadGoogleSDK(), loadLinkedInSDK()]);
        initializeGoogleAuth();
      } catch (err) {
        console.error('Error loading social SDKs:', err);
      }
    };
    
    loadSDKs();
    
    // Clean up
    return () => {
      // Remove any event listeners if needed
    };
  }, []);

  const initializeGoogleAuth = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google client ID
        callback: handleGoogleResponse,
      });
    }
  };

  const handleGoogleResponse = async (response) => {
    if (response.credential) {
      try {
        setLoading(true);
        setError('');
        
        const authResponse = await socialAuth('google', response.credential, userType);
        navigate(authResponse.redirect_url);
      } catch (err) {
        setError('Google authentication failed. Please try again.');
        console.error('Google auth error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLinkedInAuth = async () => {
    if (window.IN && window.IN.User) {
      try {
        setLoading(true);
        setError('');
        
        window.IN.User.authorize(() => {
          window.IN.API.Raw('/v2/me').result((data) => {
            // Get LinkedIn access token
            const token = window.IN.ENV.auth.oauth_token;
            
            socialAuth('linkedin', token, userType)
              .then(response => {
                navigate(response.redirect_url);
              })
              .catch(err => {
                setError('LinkedIn authentication failed. Please try again.');
                console.error('LinkedIn auth error:', err);
              })
              .finally(() => {
                setLoading(false);
              });
          });
        });
      } catch (err) {
        setError('LinkedIn authentication failed. Please try again.');
        console.error('LinkedIn auth error:', err);
        setLoading(false);
      }
    } else {
      setError('LinkedIn SDK not loaded. Please try again later.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    // Password validation for signup
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
  
    try {
      if (isSignUp) {
        const userData = {
          email: formData.email,
          password: formData.password,
          password2: formData.confirmPassword,
          user_type: userType,
          phone_number: formData.phone,
          username: formData.email,
          full_name: formData.fullName
        };
        const response = await register(userData);
        navigate(response.redirect_url);
      } else {
        const response = await login(formData.email, formData.password);
        navigate(response.redirect_url); // Navigate to the redirect URL after login
      }
    } catch (error) {
      setError('Authentication failed. Please check your credentials and try again.');
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google sign-in is not available at the moment. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel - Image/Brand */}
        <div className="md:w-1/2 bg-gradient-to-br from-green-600 to-blue-600 p-12 text-white hidden md:flex flex-col justify-between">
          {/* Left panel content remains the same */}
          <div className="mb-8">
            <Link to="/" className="text-white hover:text-white/90 transition-all">
              <h2 className="text-4xl font-bold mb-6">
                {isSignUp ? "Join Our Community" : "Welcome Back"}
              </h2>
            </Link>
            <p className="text-lg opacity-80">
              Connect with professionals and amateurs across Cameroon. Share knowledge, grow skills, and build networks.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <span className="text-sm">Professional Mentorship</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <span className="text-sm">Institution Partnerships</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {isSignUp ? "Create Account" : "Sign In"}
            </h3>
            <p className="text-gray-600">
              {isSignUp 
                ? "Start your journey with us today" 
                : "Access your account"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignUp && (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['amateur', 'professional', 'institution'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setUserType(type)}
                          className={`py-2 px-4 text-sm rounded-lg border transition-all ${
                            userType === type
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="flex justify-between items-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </Link>
                <Link
                  to="/"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Return to Home
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Please wait...' : (isSignUp ? "Create Account" : "Sign In")}
            </button>

            {/* Social login section updated */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                disabled={loading}
              >
                <img
                  src={require("../../assets/images/google.png")}
                  alt="Google"
                  className="w-6 h-6 mr-2"
                />
                Google
              </button>
              <button
                type="button"
                onClick={handleLinkedInAuth}
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                disabled={loading}
              >
                <img
                  src={require("../../assets/images/LinkedIn.png")}
                  alt="LinkedIn"
                  className="w-6 h-6 mr-2"
                />
                LinkedIn
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <Link
              to={isSignUp ? "/login" : "/signup"}
              className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;