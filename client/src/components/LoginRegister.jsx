// client/src/components/LoginRegister.jsx
// Authentication component with login and register tabs

import React, { useState } from 'react';
import authService from '../services/authService';
import './LoginRegister.css';

export default function LoginRegister({ onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = (isRegister) => {
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return false;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    setLoading(true);
    try {
      const data = await authService.login(username, password);
      console.log('Login successful:', data);
      onAuthSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setLoading(true);
    try {
      const data = await authService.register(username, password);
      console.log('Registration successful:', data);
      onAuthSuccess(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Chat App</h1>

        <div className="auth-tabs">
          <button
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('login')}
          >
            Login
          </button>
          <button
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('register')}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-username">Username</label>
              <input
                id="login-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                minLength={3}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                minLength={6}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label htmlFor="register-username">Username</label>
              <input
                id="register-username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                minLength={3}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                minLength={6}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p className="auth-hint">
            {activeTab === 'login'
              ? "Don't have an account? Click 'Register' above."
              : "Already have an account? Click 'Login' above."}
          </p>
        </div>
      </div>
    </div>
  );
}
