// AdminLogin.jsx - New component for admin login
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { supabase } from '../lib/supabase'; // Adjust path if needed
import useDocumentTitle from '../hooks/useDocumentTitle';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
    useDocumentTitle("Ali's Portfolio | Login ");
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  React.useEffect(() => {
    gsap.fromTo('.login-form', 
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-700 rounded-full opacity-20 blur-3xl animate-pulse-slow -z-10"></div>

      <form onSubmit={handleLogin} className="login-form bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-purple-500/20 max-w-md w-full">
        <h2 className="text-4xl font-bold font-heading mb-8 text-center bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Admin Login</h2>
        
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
          required
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full text-black bg-white hover:bg-white/5 hover:text-white  border-white border-2  px-6 py-3 rounded-lg font-bold  transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;