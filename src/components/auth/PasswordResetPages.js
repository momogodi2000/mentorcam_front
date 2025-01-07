import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, Check, AlertCircle } from 'lucide-react';

const PasswordResetPages = () => {
  const [stage, setStage] = useState('forgot'); // forgot, verify, reset, success
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle OTP input
  const handleCodeChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple digits
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
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

  const renderForgotPassword = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h3>
        <p className="text-gray-600">
          Enter your email address and we'll send you a verification code to reset your password.
        </p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        setStage('verify');
      }} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300"
        >
          Send Reset Code
        </button>
      </form>
    </div>
  );

  const renderVerifyCode = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Enter Verification Code</h3>
        <p className="text-gray-600">
          We've sent a 6-digit code to {email}. Enter the code below to reset your password.
        </p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        setStage('reset');
      }} className="space-y-6">
        <div className="flex justify-center space-x-3">
          {code.map((digit, index) => (
            <input
              key={index}
              id={`code-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300"
        >
          Verify Code
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Resend Code
          </button>
        </p>
      </div>
    </div>
  );

  const renderResetPassword = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h3>
        <p className="text-gray-600">
          Create a new password for your account
        </p>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        setStage('success');
      }} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter new password"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Confirm new password"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600 flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            At least 8 characters long
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            Contains at least one number
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            Contains both uppercase and lowercase letters
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300"
        >
          Reset Password
        </button>
      </form>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-500" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successfully</h3>
        <p className="text-gray-600">
          Your password has been reset successfully. You can now use your new password to sign in.
        </p>
      </div>

      <button
        onClick={() => window.location.href = '/login'}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300"
      >
        Sign In
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {stage !== 'forgot' && (
          <button
            onClick={() => setStage(stage === 'verify' ? 'forgot' : stage === 'reset' ? 'verify' : 'forgot')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        )}
        
        {stage === 'forgot' && renderForgotPassword()}
        {stage === 'verify' && renderVerifyCode()}
        {stage === 'reset' && renderResetPassword()}
        {stage === 'success' && renderSuccess()}
      </div>
    </div>
  );
};

export default PasswordResetPages;