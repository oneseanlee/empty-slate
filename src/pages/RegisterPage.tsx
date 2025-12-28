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
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <img src="/cru_logo.png" alt="Credit Repair University" className="h-32 w-auto" />
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create Your Account</h1>
          <p className="text-neutral-700">Start your credit repair education journey</p>
        </div>

        <div className="bg-white rounded-xl shadow-card p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-primary-300 focus:border-primary-500 transition-all"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-primary-300 focus:border-primary-500 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-primary-300 focus:border-primary-500 transition-all"
                placeholder="Minimum 6 characters"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-900 transition-all shadow-sm hover:shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-neutral-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-700 font-semibold hover:text-primary-900">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-neutral-600 hover:text-neutral-900 text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
