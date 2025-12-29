import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@creditrepairuniversity.com');
    setPassword('Demo123!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'hsl(210, 40%, 98%)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <img src="/cru_logo.png" alt="Credit Repair University" className="h-32 w-auto" />
          </Link>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>Welcome Back</h1>
          <p style={{ color: 'hsl(215, 20%, 45%)' }}>Sign in to continue your credit repair journey</p>
        </div>

        <div className="rounded-xl shadow-lg p-8" style={{ backgroundColor: '#ffffff' }}>
          {error && (
            <div className="mb-6 p-4 rounded-lg text-sm" style={{ backgroundColor: 'hsl(0, 84%, 97%)', border: '1px solid hsl(0, 84%, 85%)', color: 'hsl(0, 65%, 45%)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2"
                style={{ 
                  border: '1px solid hsl(210, 40%, 85%)',
                  backgroundColor: '#ffffff',
                  color: 'hsl(217, 85%, 31%)'
                }}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2"
                style={{ 
                  border: '1px solid hsl(210, 40%, 85%)',
                  backgroundColor: '#ffffff',
                  color: 'hsl(217, 85%, 31%)'
                }}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'hsl(43, 47%, 60%)', color: 'hsl(217, 85%, 15%)' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full" style={{ borderTop: '1px solid hsl(210, 40%, 90%)' }}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4" style={{ backgroundColor: '#ffffff', color: 'hsl(215, 20%, 55%)' }}>or try demo</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: 'hsl(210, 40%, 96%)', 
              color: 'hsl(217, 85%, 31%)',
              border: '1px solid hsl(210, 40%, 90%)'
            }}
          >
            <span>🎮</span>
            Try Demo Account
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'hsl(215, 20%, 45%)' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold hover:underline" style={{ color: 'hsl(43, 47%, 50%)' }}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm hover:underline" style={{ color: 'hsl(215, 20%, 45%)' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
