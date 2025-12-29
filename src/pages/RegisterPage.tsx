import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signUpError } = await signUp(email, password, { full_name: fullName });
      if (signUpError) throw signUpError;

      if (data.user) {
        const { data: tenant } = await supabase.from('tenants').select('id').eq('slug', 'credit-repair-university').maybeSingle();

        const { error: profileError } = await supabase.from('users').insert({
          auth_user_id: data.user.id,
          email: email,
          tenant_id: tenant?.id,
          role: 'learner',
          profile_data: { full_name: fullName }
        });

        if (profileError) throw profileError;

        await supabase.from('user_xp').insert({
          user_id: data.user.id,
          total_xp: 0,
          level: 1,
          current_streak: 0,
          longest_streak: 0
        });

        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'hsl(210, 40%, 98%)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <img src="/cru_logo.png" alt="Credit Repair University" className="h-32 w-auto" />
          </Link>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>Create Your Account</h1>
          <p style={{ color: 'hsl(215, 20%, 45%)' }}>Start your credit repair education journey</p>
        </div>

        <div className="rounded-xl shadow-lg p-8" style={{ backgroundColor: '#ffffff' }}>
          {error && (
            <div className="mb-6 p-4 rounded-lg text-sm" style={{ backgroundColor: 'hsl(0, 84%, 97%)', border: '1px solid hsl(0, 84%, 85%)', color: 'hsl(0, 65%, 45%)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2"
                style={{ 
                  border: '1px solid hsl(210, 40%, 85%)',
                  backgroundColor: '#ffffff',
                  color: 'hsl(217, 85%, 31%)'
                }}
                placeholder="John Doe"
                required
              />
            </div>

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
                placeholder="Minimum 6 characters"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'hsl(43, 47%, 60%)', color: 'hsl(217, 85%, 15%)' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'hsl(215, 20%, 45%)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: 'hsl(43, 47%, 50%)' }}>
                Sign In
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
