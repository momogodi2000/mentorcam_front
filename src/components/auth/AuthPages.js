import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register, socialAuth } from '../../authService';
import { motion, AnimatePresence } from 'framer-motion';

// Load Google SDK
const loadGoogleSDK = () => {
  return new Promise((resolve) => {
    if (window.gapi) {
      resolve();
      return;
    }
    
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
    if (window.IN) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://platform.linkedin.com/in.js';
    script.async = true;
    script.defer = true;
    script.text = 'api_key={YOUR_LINKEDIN_API_KEY}';
    script.onload = resolve;
    document.body.appendChild(script);
  });
};

const AuthPages = ({ isSignUp = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState('amateur');
  const [activeStep, setActiveStep] = useState(1);
  const [formFocus, setFormFocus] = useState(null);
  const navigate = useNavigate();
  const formRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    
    // Add background animation
    document.body.classList.add('auth-animation-bg');
    
    return () => {
      document.body.classList.remove('auth-animation-bg');
    };
  }, []);

  const initializeGoogleAuth = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleGoogleResponse,
      });
    }
  };

  const handleGoogleResponse = async (response) => {
    if (response.credential) {
      try {
        setLoading(true);
        setError('');
        setSuccess('Authenticating with Google...');
        
        const authResponse = await socialAuth('google', response.credential, userType);
        setSuccess('Authentication successful!');
        
        // Add delay for better UX
        setTimeout(() => {
          navigate(authResponse.redirect_url);
        }, 1000);
      } catch (err) {
        setError('Google authentication failed. Please try again.');
        setSuccess('');
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
        setSuccess('Authenticating with LinkedIn...');
        
        window.IN.User.authorize(() => {
          window.IN.API.Raw('/v2/me').result((data) => {
            const token = window.IN.ENV.auth.oauth_token;
            
            socialAuth('linkedin', token, userType)
              .then(response => {
                setSuccess('Authentication successful!');
                setTimeout(() => {
                  navigate(response.redirect_url);
                }, 1000);
              })
              .catch(err => {
                setError('LinkedIn authentication failed. Please try again.');
                setSuccess('');
                console.error('LinkedIn auth error:', err);
              })
              .finally(() => {
                setLoading(false);
              });
          });
        });
      } catch (err) {
        setError('LinkedIn authentication failed. Please try again.');
        setSuccess('');
        console.error('LinkedIn auth error:', err);
        setLoading(false);
      }
    } else {
      setError('LinkedIn SDK not loaded. Please try again later.');
      setSuccess('');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear errors on typing
    if (error) setError('');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (activeStep === 1 && formData.email) {
      setActiveStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
  
    // Additional form validation
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }
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
        
        setSuccess('Creating your account...');
        const response = await register(userData);
        setSuccess('Account created successfully!');
        
        // Add delay for better UX
        setTimeout(() => {
          navigate(response.redirect_url);
        }, 1500);
      } else {
        setSuccess('Signing you in...');
        const response = await login(formData.email, formData.password);
        setSuccess('Sign in successful!');
        
        // Add delay for better UX
        setTimeout(() => {
          navigate(response.redirect_url);
        }, 1500);
      }
    } catch (error) {
      setError('Authentication failed. Please check your credentials and try again.');
      setSuccess('');
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

  const handleFocus = (field) => {
    setFormFocus(field);
  };

  const handleBlur = () => {
    setFormFocus(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="glowing-circles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`circle circle-${i+1}`}></div>
          ))}
        </div>
      </div>
      
      {/* Glass morphism card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20"
      >
        {/* Left Panel - Branding & Info */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="md:w-5/12 bg-gradient-to-br from-blue-600/90 to-purple-600/90 p-12 text-white hidden md:flex flex-col justify-between relative overflow-hidden"
        >
          {/* Animated background shapes */}
          <div className="absolute inset-0 z-0">
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
            <div className="floating-shape shape-3"></div>
          </div>
          
          <div className="relative z-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <Link to="/" className="text-white hover:text-white/90 transition-all">
                <h2 className="text-4xl font-bold mb-6">
                  {isSignUp ? "Join Our Community" : "Welcome Back"}
                </h2>
              </Link>
              <p className="text-lg text-white/80 mb-8">
                Connect with professionals and amateurs across Cameroon. Share knowledge, grow skills, and build networks.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium">Professional Mentorship</h3>
                  <p className="text-sm text-white/70">Connect with industry leaders</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium">Institution Partnerships</h3>
                  <p className="text-sm text-white/70">Access educational resources</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            className="relative z-10 mt-8"
          >
            <p className="text-white/60 text-sm">
              "The platform has revolutionized how we connect professionals with ambitious young talents in Cameroon."
            </p>
            <div className="flex items-center mt-4">
              <div className="w-10 h-10 bg-white/20 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium">Sarah Johnson</p>
                <p className="text-xs text-white/60">CEO, TechStart Africa</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Panel - Form */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="md:w-7/12 p-8 md:p-12 relative"
        >
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-white mb-3">
              {isSignUp ? "Create Account" : "Sign In"}
            </h3>
            <p className="text-white/70">
              {isSignUp 
                ? "Start your professional journey with us today" 
                : "Access your personalized dashboard"}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start"
              >
                <div className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0">⚠️</div>
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-start"
              >
                <div className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0">✅</div>
                <p>{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form 
            ref={formRef}
            className="space-y-6" 
            onSubmit={isSignUp ? handleSubmit : (activeStep === 1 ? handleNextStep : handleSubmit)}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Account Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['amateur', 'professional', 'institution'].map((type) => (
                        <motion.button
                          key={type}
                          type="button"
                          onClick={() => setUserType(type)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={`py-2.5 px-4 text-sm rounded-xl border transition-all ${
                            userType === type
                              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                              : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Full Name
                    </label>
                    <div className={`relative transition-all duration-300 ${formFocus === 'fullName' ? 'transform-gpu scale-[1.02]' : ''}`}>
                      <User className={`w-5 h-5 text-white/50 absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${formFocus === 'fullName' ? 'text-blue-400' : ''}`} />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onFocus={() => handleFocus('fullName')}
                        onBlur={handleBlur}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Phone Number
                    </label>
                    <div className={`relative transition-all duration-300 ${formFocus === 'phone' ? 'transform-gpu scale-[1.02]' : ''}`}>
                      <Phone className={`w-5 h-5 text-white/50 absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${formFocus === 'phone' ? 'text-blue-400' : ''}`} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => handleFocus('phone')}
                        onBlur={handleBlur}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {(activeStep === 1 || isSignUp) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Email Address
                  </label>
                  <div className={`relative transition-all duration-300 ${formFocus === 'email' ? 'transform-gpu scale-[1.02]' : ''}`}>
                    <Mail className={`w-5 h-5 text-white/50 absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${formFocus === 'email' ? 'text-blue-400' : ''}`} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {(activeStep === 2 || isSignUp) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Password
                  </label>
                  <div className={`relative transition-all duration-300 ${formFocus === 'password' ? 'transform-gpu scale-[1.02]' : ''}`}>
                    <Lock className={`w-5 h-5 text-white/50 absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${formFocus === 'password' ? 'text-blue-400' : ''}`} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => handleFocus('password')}
                      onBlur={handleBlur}
                      className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Confirm Password
                  </label>
                  <div className={`relative transition-all duration-300 ${formFocus === 'confirmPassword' ? 'transform-gpu scale-[1.02]' : ''}`}>
                    <Lock className={`w-5 h-5 text-white/50 absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${formFocus === 'confirmPassword' ? 'text-blue-400' : ''}`} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => handleFocus('confirmPassword')}
                      onBlur={handleBlur}
                      className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all"
                      placeholder="Confirm your password"
                      required
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!isSignUp && activeStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex justify-between items-center"
                >
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-all"
                  >
                    Forgot Password?
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-all"
                  >
                    Change Email
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/30 shadow-lg shadow-blue-700/20 transition-all duration-300 flex items-center justify-center ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isSignUp 
                    ? "Create Account" 
                    : (activeStep === 1 ? "Continue" : "Sign In")}
                  
                  {activeStep === 1 && !isSignUp && (
                    <ArrowRight className="w-5 h-5 ml-2" />
                  )}
                </>
              )}
            </motion.button>

            {/* Social login section updated */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-indigo-800/30 text-white/70 backdrop-blur-sm">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center py-3 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                disabled={loading}
              >
                <img
                  src={require("../../assets/images/google.png")}
                  alt="Google"
                  className="w-6 h-6 mr-2"
                />
                Google
              </motion.button>
              <motion.button
                type="button"
                onClick={handleLinkedInAuth}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center py-3 px-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                disabled={loading}
              >
                <img
                  src={require("../../assets/images/LinkedIn.png")}
                  alt="LinkedIn"
                  className="w-6 h-6 mr-2"
                />
                LinkedIn
              </motion.button>
            </div>
          </motion.form>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 text-center text-sm text-white/60"
          >
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <Link
              to={isSignUp ? "/login" : "/signup"}
              className="ml-1 text-blue-400 hover:text-blue-300 font-medium"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPages;