import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Droplets, AlertCircle } from 'lucide-react';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 p-6">
      <div className="w-16 h-16 rounded-2xl bg-sky-600 flex items-center justify-center mb-6">
        <Droplets className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-black text-white mb-2">HydroGuard AI</h1>
      <p className="text-zinc-500 mb-8 text-center text-sm">Citizen Emergency System</p>
      
      {error && (
        <div className="w-full bg-rose-500/20 border border-rose-500 text-rose-300 px-4 py-3 rounded-xl mb-6 flex gap-2 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:border-sky-500"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:border-sky-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:border-sky-500"
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 mt-2 rounded-xl font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-sky-600 hover:bg-sky-500 glow-blue"
        >
          {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-6 text-sm text-sky-400 font-semibold"
      >
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
}
