// AdminLogin.jsx - New component for admin login
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Adjust path if needed
import useDocumentTitle from '../hooks/useDocumentTitle';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useDocumentTitle("Ali's Portfolio | Login");

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
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden p-6">
      {/* Decorative white glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse [animation-delay:1s] -z-10"></div>

      <form
        onSubmit={handleLogin}
        className="login-form bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 max-w-md w-full"
      >
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-white/20 bg-white/5">
            <ShieldCheck size={26} className="text-white" />
          </div>
        </div>

        <h2 className="text-3xl  font-bold font-heading mb-1 text-center text-white">
          Admin Login
        </h2>
        <p className="text-sm text-gray-400 text-center mb-8">
          Sign in to manage your portfolio
        </p>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-white/5 border border-white/20 text-sm text-gray-200 text-center">
            {error}
          </div>
        )}

        <div className="relative mb-4">
          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors text-white placeholder-gray-500"
            required
          />
        </div>

        <div className="relative mb-6">
          <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-10 pr-10 py-3 bg-black/50 border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors text-white placeholder-gray-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-black bg-white hover:bg-black hover:text-white border-white border-2 transition-all duration-300 rounded-lg font-bold  disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3  flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;