import React, { useState } from 'react';
import './Login.css';

// Hardcoded users
const USERS = [
  { username: 'admin', password: 'admin' },
  { username: 'manager', password: 'manager' },
  { username: 'staff', password: 'staff' },
];

const Login: React.FC<{ onLogin: (user: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) {
      setError('');
      onLogin(username);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-bg" style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e8f6f3 0%, #b2dfdb 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative circles for visual interest */}
      <div style={{
        position: 'absolute',
        top: -80,
        left: -80,
        width: 220,
        height: 220,
        background: 'radial-gradient(circle, #b2dfdb 60%, #e8f6f3 100%)',
        borderRadius: '50%',
        opacity: 0.35,
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        bottom: -100,
        right: -100,
        width: 260,
        height: 260,
        background: 'radial-gradient(circle, #009688 60%, #b2dfdb 100%)',
        borderRadius: '50%',
        opacity: 0.18,
        zIndex: 0,
      }} />
      <div className="login-card login-card-gradient" style={{
        maxWidth: 400,
        margin: 'auto',
        borderRadius: 22,
        boxShadow: '0 8px 40px 0 rgba(31,182,152,0.18)',
        padding: '2.7rem 2.2rem 2.2rem 2.2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        background: 'linear-gradient(135deg, #fff 60%, #e8f6f3 100%)',
        border: '1.5px solid #b2dfdb',
      }}>
        <div style={{
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #b2dfdb 60%, #009688 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
          boxShadow: '0 2px 12px 0 rgba(31,182,152,0.10)',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M12 13.5c2.485 0 4.5-2.015 4.5-4.5S14.485 4.5 12 4.5 7.5 6.515 7.5 9s2.015 4.5 4.5 4.5zm0 1.5c-2.97 0-9 1.485-9 4.5V21h18v-1.5c0-3.015-6.03-4.5-9-4.5z" fill="#009688"/></svg>
        </div>
        <div className="login-title" style={{
          fontSize: '2.1rem',
          fontWeight: 900,
          color: '#009688',
          marginBottom: 18,
          letterSpacing: 1,
          textShadow: '0 2px 8px #b2dfdb44',
        }}>Manager Login</div>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            style={{
              border: '1.5px solid #b2dfdb',
              borderRadius: 12,
              padding: '1.1rem 1.2rem',
              fontSize: '1.13rem',
              background: '#e8f6f3',
              color: '#00796b',
              marginBottom: 10,
              outline: 'none',
              fontWeight: 500,
              boxShadow: '0 2px 8px 0 rgba(31,182,152,0.04)',
              transition: 'border 0.2s',
              width: '100%',
              maxWidth: 280,
              boxSizing: 'border-box',
              alignSelf: 'center',
            }}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{
              border: '1.5px solid #b2dfdb',
              borderRadius: 12,
              padding: '1.1rem 1.2rem',
              fontSize: '1.13rem',
              background: '#e8f6f3',
              color: '#00796b',
              marginBottom: 10,
              outline: 'none',
              fontWeight: 500,
              boxShadow: '0 2px 8px 0 rgba(31,182,152,0.04)',
              transition: 'border 0.2s',
              width: '100%',
              maxWidth: 280,
              boxSizing: 'border-box',
              alignSelf: 'center',
            }}
          />
          <button type="submit" className="login-btn" style={{
            background: 'linear-gradient(90deg, #009688 0%, #b2dfdb 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: '1.13rem',
            fontWeight: 700,
            padding: '1.1rem 0',
            marginTop: 8,
            boxShadow: '0 2px 8px 0 rgba(31,182,152,0.08)',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            letterSpacing: 1,
          }}>Login</button>
          {error && <div className="login-error" style={{ color: '#e53935', marginTop: 8, fontWeight: 600, textAlign: 'center', fontSize: '1rem' }}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
