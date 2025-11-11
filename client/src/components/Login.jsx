import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (username.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }

    setError('');
    onLogin(username);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Socket.io Chat</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Enter your username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., Jane Kamau"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSubmit(e);
              }}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn">
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}
