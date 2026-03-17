import React, { useState } from 'react';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import '../../../components/Shared/Auth/Auth.css';
import Logo from '../../../components/Shared/Logo/Logo';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Login = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /* ── Email/Password Submit ── */
  const onSubmit = async (data) => {
    setLoading(true);
    console.log('Login data:', data);

    try {
      // TODO: replace with your Firebase signInWithEmailAndPassword
      // await signInWithEmailAndPassword(auth, data.email, data.password);

      // ── simulate success for now ──
      await new Promise((r) => setTimeout(r, 800));

      toast.success('Logged in successfully!', {
        style: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          fontSize: '14px',
          borderRadius: '100px',
          padding: '12px 20px',
        },
      });

    } catch (err) {
      console.error('Login error:', err);

      Swal.fire({
        icon:              'error',
        title:             'Login failed',
        text:              err?.message || 'Invalid email or password. Please try again.',
        confirmButtonText: 'Try again',
        confirmButtonColor:'#0B3D91',
        borderRadius:      '16px',
        customClass:       { popup: 'swal-popup' },
      });
    } finally {
      setLoading(false);
    }
  };

  /* ── Google Sign In ── */
  const handleGoogle = async () => {
    console.log('Google sign-in triggered');

    try {
      // TODO: replace with your Firebase signInWithPopup(auth, googleProvider)
      // await signInWithPopup(auth, googleProvider);

      toast.success('Signed in with Google!', {
        style: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          fontSize: '14px',
          borderRadius: '100px',
        },
      });

    } catch (err) {
      console.error('Google login error:', err);
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="auth-card">
        <div className="auth-card__body">

          {/* ── Logo ── */}
          <div className="mb-7"> 
            <Logo href="/" size="md" />
          </div>

          {/* ── Heading ── */}
          <div className="auth-title">Welcome back</div>
          <div className="auth-sub">
            New to FindHub? <Link to="/register">Create an account →</Link>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* Email */}
            <div className="fg">
              <label className="fl">Email address</label>
              <input
                type="email"
                placeholder="yourname@ewubd.edu"
                className={`fi ${errors.email ? 'fi--error' : ''}`}
                {...register('email', {
                  required: 'Email is required',
                  pattern:  {
                    value:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />
              {errors.email && (
                <span className="f-error">✕ {errors.email.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="fg">
              <label className="fl">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className={`fi ${errors.password ? 'fi--error' : ''}`}
                {...register('password', {
                  required:  'Password is required',
                  minLength: { value: 6, message: 'At least 6 characters required' },
                })}
              />
              {errors.password && (
                <span className="f-error">✕ {errors.password.message}</span>
              )}
            </div>

            {/* Forgot */}
            <div className="forgot-row">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowIcon />}
            </button>
          </form>

          {/* ── Divider ── */}
          <div className="auth-divider">
            <div className="auth-divider__line" />
            <div className="auth-divider__txt">or continue with</div>
            <div className="auth-divider__line" />
          </div>

          {/* ── Google ── */}
          <button className="btn-google" onClick={handleGoogle} type="button">
            <GoogleIcon />
            Continue with Google
          </button>

        </div>
      </div>
    </>
  );
};

export default Login;