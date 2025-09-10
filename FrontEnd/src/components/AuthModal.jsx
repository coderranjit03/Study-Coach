import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, X, Phone } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export default function AuthModal({ isOpen, onClose, onAuth, onSignupSuccess, showToast }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      if (isSignUp) {
        // Validate form data
        if (!formData.username || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
          throw new Error('Please fill in all fields');
        }
        
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        
        // Sign up with Supabase
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          options: {
            data: {
              username: formData.username,
              display_name: formData.username,
              full_name: formData.username
            }
          }
        });
        
        if (signUpError) {
          throw new Error(signUpError.message);
        }
        
        // Store additional user data in a custom table
        if (data.user) {
          try {
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert([
                {
                  user_id: data.user.id,
                  username: formData.username,
                  email: formData.email,
                  phone: formData.phone,
                  display_name: formData.username,
                  created_at: new Date().toISOString()
                }
              ]);
            
            if (profileError) {
              console.error('Error storing user profile:', profileError);
              // Don't throw error here as the user is already created
            } else {
              console.log('User profile created successfully');
            }
          } catch (profileError) {
            console.error('Error storing user profile:', profileError);
            // Don't throw error here as the user is already created
          }
        }
        
        console.log('Signup successful:', data);
        onSignupSuccess && onSignupSuccess(data);
        
      } else {
        // Sign in with Supabase
        if (!formData.email || !formData.password) {
          throw new Error('Please fill in all fields');
        }
        
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        
        if (signInError) {
          throw new Error(signInError.message);
        }
        
        console.log('Signin successful:', data);
        onAuth && onAuth(data);
      }
      
      onClose();
      resetForm();
      
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message);
      showToast && showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <>
      <style>
        {`
          @keyframes slideInRight {
            from { 
              opacity: 0; 
              transform: translateX(100%); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0); 
            }
          }
          
          @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes modalZoomIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          
          @keyframes slideInFromTop {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideInFromLeft {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes slideInFromBottom {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .modal-container {
            animation: modalZoomIn 0.5s ease-out forwards;
          }
          
          .modal-header {
            animation: slideInFromTop 0.7s ease-out forwards;
          }
          
          .modal-header-subtitle {
            animation: slideInFromTop 0.7s ease-out 0.1s forwards;
            opacity: 0;
          }
          
          .form-field-1 {
            animation: slideInFromLeft 0.5s ease-out 0.2s forwards;
            opacity: 0;
          }
          
          .form-field-2 {
            animation: slideInFromLeft 0.5s ease-out 0.3s forwards;
            opacity: 0;
          }
          
          .form-field-3 {
            animation: slideInFromLeft 0.5s ease-out 0.4s forwards;
            opacity: 0;
          }
          
          .form-field-4 {
            animation: slideInFromLeft 0.5s ease-out 0.5s forwards;
            opacity: 0;
          }
          
          .form-field-5 {
            animation: slideInFromLeft 0.5s ease-out 0.6s forwards;
            opacity: 0;
          }
          
          .submit-button {
            animation: slideInFromBottom 0.5s ease-out 0.7s forwards;
            opacity: 0;
          }
          
          .switch-mode {
            animation: slideInFromBottom 0.5s ease-out 0.8s forwards;
            opacity: 0;
          }
          
          .glassmorphism-input {
            background: rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 16px !important;
            color: white !important;
            transition: all 0.3s ease !important;
          }
          
          .glassmorphism-input:hover {
            background: rgba(255, 255, 255, 0.15) !important;
          }
          
          .glassmorphism-input:focus {
            outline: none !important;
            ring: 2px solid rgba(255, 255, 255, 0.3) !important;
            border-color: transparent !important;
          }
          
          .glassmorphism-input::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
          }
        `}
      </style>
      
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          animation: 'modalFadeIn 0.3s ease-out forwards',
        }}
      >
        {/* Modal Container */}
        <div 
          className="modal-container"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            margin: '0 16px',
          }}
        >
          {/* Glassmorphism Card */}
          <div 
            style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '8px',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseOver={(e) => {
                e.target.style.color = 'white';
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseOut={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                e.target.style.background = 'none';
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 
                className="modal-header"
                style={{
                  fontSize: '32px',
                  fontWeight: '900',
                  color: 'white',
                  marginBottom: '8px',
                  opacity: 0,
                }}
              >
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p 
                className="modal-header-subtitle"
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '16px',
                }}
              >
                {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
              </p>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Error Message */}
              {error && (
                <div style={{
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  color: '#fca5a5',
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}
              {/* Username Field (Sign Up only) */}
              {isSignUp && (
                <div className="form-field-1" style={{ position: 'relative' }}>
                  <div 
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  >
                    <User size={20} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    className="glassmorphism-input"
                    style={{
                      width: '100%',
                      paddingLeft: '48px',
                      paddingRight: '16px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>
              )}

              {/* Email Field */}
              <div className={isSignUp ? "form-field-2" : "form-field-1"} style={{ position: 'relative' }}>
                <div 
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <Mail size={20} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="glassmorphism-input"
                  style={{
                    width: '100%',
                    paddingLeft: '48px',
                    paddingRight: '16px',
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              {/* Phone Field (Sign Up only) */}
              {isSignUp && (
                <div className="form-field-3" style={{ position: 'relative' }}>
                  <div 
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  >
                    <Phone size={20} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="glassmorphism-input"
                    style={{
                      width: '100%',
                      paddingLeft: '48px',
                      paddingRight: '16px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>
              )}

              {/* Password Field */}
              <div className={isSignUp ? "form-field-4" : "form-field-2"} style={{ position: 'relative' }}>
                <div 
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <Lock size={20} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="glassmorphism-input"
                  style={{
                    width: '100%',
                    paddingLeft: '48px',
                    paddingRight: '48px',
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseOver={(e) => { e.target.style.color = 'white'; }}
                  onMouseOut={(e) => { e.target.style.color = 'rgba(255, 255, 255, 0.5)'; }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password Field (Sign Up only) */}
              {isSignUp && (
                <div className="form-field-5" style={{ position: 'relative' }}>
                  <div 
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                    }}
                  >
                    <Lock size={20} style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    className="glassmorphism-input"
                    style={{
                      width: '100%',
                      paddingLeft: '48px',
                      paddingRight: '48px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.5)',
                      cursor: 'pointer',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseOver={(e) => { e.target.style.color = 'white'; }}
                    onMouseOut={(e) => { e.target.style.color = 'rgba(255, 255, 255, 0.5)'; }}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="submit-button"
                style={{
                  width: '100%',
                  padding: '16px',
                  background: isLoading 
                    ? 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)'
                    : 'linear-gradient(90deg, #8b5cf6 0%, #3b82f6 100%)',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isLoading 
                    ? '0 5px 15px rgba(107, 114, 128, 0.3)'
                    : '0 10px 25px rgba(139, 92, 246, 0.3)',
                  opacity: isLoading ? 0.7 : 1,
                }}
                onMouseOver={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 15px 35px rgba(139, 92, 246, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)';
                  }
                }}
              >
                {isLoading 
                  ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                  : (isSignUp ? 'Create Account' : 'Sign In')
                }
              </button>
            </div>

            {/* Switch Mode */}
            <div className="switch-mode" style={{ textAlign: 'center', marginTop: '24px' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={switchMode}
                  style={{
                    marginLeft: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    fontSize: '14px',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.textDecoration = 'underline';
                    e.target.style.color = '#60a5fa';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.textDecoration = 'none';
                    e.target.style.color = 'white';
                  }}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}