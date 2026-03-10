import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

export default function LoginPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters';
    if (!isLogin && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save/fetch user profile in Firestore
  const saveUserToFirestore = async (firebaseUser, extraData = {}) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const existing = await getDoc(userRef);
    if (!existing.exists()) {
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        name: extraData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        createdAt: serverTimestamp(),
        loginMethod: extraData.loginMethod || 'email'
      });
    }
    return {
      id: firebaseUser.uid,
      name: extraData.name || firebaseUser.displayName || firebaseUser.email.split('@')[0],
      email: firebaseUser.email
    };
  };

  const handleSubmit = async () => {
    setSuccessMessage('');
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      if (isLogin) {
        // Sign in existing user
        const result = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = await saveUserToFirestore(result.user);
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => onLoginSuccess(user), 800);
      } else {
        // Create new account
        const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(result.user, { displayName: formData.name });
        const user = await saveUserToFirestore(result.user, { name: formData.name });
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => onLoginSuccess(user), 800);
      }
    } catch (err) {
      // Convert Firebase error codes to friendly messages
      const msg = {
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'An account with this email already exists',
        'auth/invalid-email': 'Invalid email address',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/too-many-requests': 'Too many attempts. Please try again later',
        'auth/invalid-credential': 'Invalid email or password',
      }[err.code] || err.message;
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = await saveUserToFirestore(result.user, { loginMethod: 'google' });
      setSuccessMessage('Google login successful! Redirecting...');
      setTimeout(() => onLoginSuccess(user), 800);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrors({ form: 'Google login failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
            <span className="text-5xl">🎤</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">AI Interview Coach</h1>
          <p className="text-blue-100">Practice, Learn, Succeed</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Login / Sign Up tabs */}
          <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
            {['Login', 'Sign Up'].map((label, i) => (
              <button
                key={label}
                onClick={() => { setIsLogin(i === 0); setErrors({}); setSuccessMessage(''); }}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  (i === 0) === isLogin
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >{label}</button>
            ))}
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700 font-semibold">{successMessage}</p>
            </div>
          )}

          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{errors.form}</p>
            </div>
          )}

          <div className="space-y-5">
            {/* Name field (sign up only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} onKeyPress={handleKeyPress}
                    placeholder="Enter your full name"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
                  />
                </div>
                {errors.name && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.name}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} onKeyPress={handleKeyPress}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.password}</p>}
            </div>

            {/* Confirm password (sign up only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} onKeyPress={handleKeyPress}
                    placeholder="Confirm your password"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.confirmPassword}</p>}
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-semibold">Forgot Password?</button>
              </div>
            )}

            <button onClick={handleSubmit} disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading
                ? <span className="flex items-center justify-center gap-2"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Processing...</span>
                : <span>{isLogin ? 'Login' : 'Create Account'}</span>
              }
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t-2 border-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm font-semibold">OR</span>
            <div className="flex-1 border-t-2 border-gray-200"></div>
          </div>

          {/* Google login */}
          <button onClick={handleGoogleLogin} disabled={isLoading}
            className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-white text-sm mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setIsLogin(!isLogin); setErrors({}); setSuccessMessage(''); }}
            className="font-bold underline hover:text-blue-200">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}