import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowLeft, Check, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestPasswordReset, verifyResetCode, resetPassword } from '../../authService';

const PasswordResetPages = () => {
  const [stage, setStage] = useState('forgot');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Password validation state
  const [isPasswordValid, setIsPasswordValid] = useState({
    length: false,
    number: false,
    mixedCase: false
  });

  // Password strength calculation
  const calculateStrength = () => {
    const checks = Object.values(isPasswordValid);
    const trueCount = checks.filter(Boolean).length;
    return (trueCount / checks.length) * 100;
  };

  // Resend code cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Password validation function
  const validatePassword = (password) => {
    setIsPasswordValid({
      length: password.length >= 8,
      number: /\d/.test(password),
      mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password)
    });
  };

  // Handle OTP input
  const handleCodeChange = (index, value) => {
    const filtered = value.replace(/[^0-9]/g, '');
    if (filtered.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = filtered;
    setCode(newCode);
    
    if (filtered && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle pasting OTP code
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').substring(0, 6);
    
    if (pastedData) {
      const newCode = [...code];
      for (let i = 0; i < pastedData.length; i++) {
        if (i < 6) newCode[i] = pastedData[i];
      }
      setCode(newCode);
      
      // Focus on the next empty input or last input
      const lastIndex = Math.min(pastedData.length, 5);
      const nextInput = document.getElementById(`code-${lastIndex}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle backspace in OTP input
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle password reset request
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setStage('verify');
      setResendCooldown(60); // 60 seconds cooldown
    } catch (error) {
      setError(error.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const codeString = code.join('');
    if (codeString.length !== 6) {
      setError('Please enter all 6 digits');
      setLoading(false);
      return;
    }

    try {
      await verifyResetCode(email, codeString);
      setStage('reset');
    } catch (error) {
      setError(error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password requirements
    if (!Object.values(isPasswordValid).every(Boolean)) {
      setError('Please meet all password requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email, code.join(''), newPassword);
      setStage('success');
    } catch (error) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setError('');
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setResendCooldown(60); // 60 seconds cooldown
    } catch (error) {
      setError(error.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  // Error Alert Component
  const ErrorAlert = ({ message }) => message ? (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center p-4 bg-red-50 rounded-lg text-red-600 border border-red-100"
    >
      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </motion.div>
  ) : null;

  // Page transitions
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  const renderForgotPassword = () => (
    <motion.div 
      className="space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="text-center space-y-3">
        <div className="bg-blue-100 w-20 h-20 flex items-center justify-center rounded-full mx-auto">
          <Mail className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Forgot Password?</h3>
        <p className="text-gray-600 text-sm md:text-base px-4">
          Enter your email address and we'll send you a verification code to reset your password.
        </p>
      </div>

      <ErrorAlert message={error} />

      <form onSubmit={handleRequestReset} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 font-medium flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : 'Send Reset Code'}
        </button>
      </form>
    </motion.div>
  );

  const renderVerifyCode = () => (
    <motion.div 
      className="space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="text-center space-y-3">
        <div className="bg-purple-100 w-20 h-20 flex items-center justify-center rounded-full mx-auto">
          <Lock className="w-10 h-10 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Verification Code</h3>
        <p className="text-gray-600 text-sm md:text-base">
          We've sent a 6-digit code to <span className="font-medium">{email}</span>
        </p>
      </div>

      <ErrorAlert message={error} />

      <form onSubmit={handleVerifyCode} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Enter 6-digit code
          </label>
          <div className="flex justify-between space-x-2 md:space-x-3" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-full h-12 md:h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
                required
                disabled={loading}
                autoComplete="one-time-code"
              />
            ))}
          </div>
          <p className="text-gray-500 text-xs text-center">Didn't receive the code? You can paste it if received.</p>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-all duration-300 disabled:opacity-50 font-medium flex items-center justify-center"
          disabled={loading || code.some(digit => !digit)}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Verifying...
            </>
          ) : 'Verify Code'}
        </button>
      </form>

      <div className="text-center">
        <button 
          onClick={handleResendCode}
          className={`text-sm ${resendCooldown > 0 ? 'text-gray-400' : 'text-purple-600 hover:text-purple-700'} font-medium transition-colors`}
          disabled={loading || resendCooldown > 0}
        >
          {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
        </button>
      </div>
    </motion.div>
  );

  const renderResetPassword = () => (
    <motion.div 
      className="space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="text-center space-y-3">
        <div className="bg-green-100 w-20 h-20 flex items-center justify-center rounded-full mx-auto">
          <Lock className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Create New Password</h3>
        <p className="text-gray-600 text-sm md:text-base">
          Your password must be different from previous passwords
        </p>
      </div>

      <ErrorAlert message={error} />

      <form onSubmit={handleResetPassword} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-700"
              placeholder="Enter new password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Password strength indicator */}
        {newPassword && (
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Password strength</span>
              <span className="text-xs font-medium">
                {calculateStrength() === 0 ? 'Very weak' : 
                 calculateStrength() <= 33 ? 'Weak' : 
                 calculateStrength() <= 66 ? 'Medium' : 
                 'Strong'}
              </span>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${
                  calculateStrength() <= 33 ? 'bg-red-500' : 
                  calculateStrength() <= 66 ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${calculateStrength()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-700"
              placeholder="Confirm new password"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-2">Password requirements:</p>
          <p className="text-sm text-gray-600 flex items-center">
            <span className={`flex items-center justify-center w-5 h-5 mr-2 rounded-full ${isPasswordValid.length ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-300'}`}>
              <Check className="w-3 h-3" />
            </span>
            At least 8 characters long
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <span className={`flex items-center justify-center w-5 h-5 mr-2 rounded-full ${isPasswordValid.number ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-300'}`}>
              <Check className="w-3 h-3" />
            </span>
            Contains at least one number
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <span className={`flex items-center justify-center w-5 h-5 mr-2 rounded-full ${isPasswordValid.mixedCase ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-300'}`}>
              <Check className="w-3 h-3" />
            </span>
            Contains both uppercase and lowercase letters
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all duration-300 disabled:opacity-50 font-medium flex items-center justify-center"
          disabled={loading || !Object.values(isPasswordValid).every(Boolean) || !confirmPassword || newPassword !== confirmPassword}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Resetting...
            </>
          ) : 'Reset Password'}
        </button>
      </form>
    </motion.div>
  );

  const renderSuccess = () => (
    <motion.div 
      className="text-center space-y-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div 
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <Check className="w-12 h-12 text-green-500" />
      </motion.div>
      
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-gray-800">Password Reset Successfully</h3>
        <p className="text-gray-600 text-sm md:text-base">
          Your password has been reset successfully. You can now use your new password to sign in.
        </p>
      </div>

      <button
        onClick={() => window.location.href = '/login'}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 font-medium"
      >
        Sign In Now
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header with logo */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-center">
          <svg className="h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="currentColor"/>
            <path d="M20 12C20 12.5523 19.5523 13 19 13H17.9381C17.446 15.9463 14.9855 18.2628 12 18.4466V19C12 19.5523 11.5523 20 11 20H10C9.44772 20 9 19.5523 9 19V18.4466C6.01454 18.2628 3.55399 15.9463 3.06189 13H2C1.44772 13 1 12.5523 1 12C1 11.4477 1.44772 11 2 11H3.06189C3.55399 8.05367 6.01454 5.73721 9 5.55345V5C9 4.44772 9.44772 4 10 4H11C11.5523 4 12 4.44772 12 5V5.55345C14.9855 5.73721 17.446 8.05367 17.9381 11H19C19.5523 11 20 11.4477 20 12Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        
        <div className="p-6 md:p-8">
          {/* Back button */}
          {stage !== 'forgot' && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setStage(stage === 'verify' ? 'forgot' : stage === 'reset' ? 'verify' : 'forgot')}
              className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition-colors group"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </motion.button>
          )}
          
          {/* Stage content with transitions */}
          <AnimatePresence mode="wait">
            {stage === 'forgot' && renderForgotPassword()}
            {stage === 'verify' && renderVerifyCode()}
            {stage === 'reset' && renderResetPassword()}
            {stage === 'success' && renderSuccess()}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordResetPages;