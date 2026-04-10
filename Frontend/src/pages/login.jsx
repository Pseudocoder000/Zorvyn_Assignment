import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Wallet, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { loginRequest } from '../utils/api';
import { setUser, setToken, setRole } from '../features/auth/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const data = await loginRequest(email, password);

      dispatch(setUser(data.user || { email }));
      if (data.token) dispatch(setToken(data.token));
      if (data.user?.role) dispatch(setRole(data.user.role));

      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <div className="glass-card rounded-3xl border border-border/50 bg-background/80 p-6 shadow-2xl shadow-primary/10 backdrop-blur-xl">
          <div className="text-center pb-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-semibold">Welcome back</h1>
            <p className="text-lg text-muted-foreground mt-2">Sign in to your Gullak account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-border/50 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-border/50 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
