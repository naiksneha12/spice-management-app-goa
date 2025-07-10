import React, { useState } from 'react';
import loginImage from '../assets/LoginScreenImage.jpg';
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
    <div className="login-bg">
      <div className="login-card">
        <img src={loginImage} alt="Login" className="login-img" />
        <div className="login-title">Spice Manager Login</div>
        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button type="submit" className="login-btn">Login</button>
          {error && <div className="login-error" style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;
