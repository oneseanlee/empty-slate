import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Crown, Sparkles, Building2, ArrowLeft, Shield, Zap, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Plan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  features: string[];
  icon: typeof Crown;
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    priceId: 'price_free',
    icon: Sparkles,
    features: [
      'Access to 5 courses (limited selection)',
      'Basic progress tracking',
      'XP and levels system',
      'Badge earning',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 29,
    priceId: 'price_pro_monthly',
    icon: Crown,
    popular: true,
    features: [
      'All 87 courses (complete curriculum)',
      'All 97 quizzes',
      'Certificates upon completion',
      'Full progress tracking',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 250,
    priceId: 'price_enterprise_monthly',
    icon: Building2,
    features: [
      'Everything in Pro',
      'White-labeled credit repair software platform',
      'Complete business training program',
      '1-on-1 business launch support',
      'Weekly coaching calls for 3 months',
      'Custom domain and branding setup',
      'Multi-user licenses',
      'Dedicated account manager',
    ],
  },
];

export default function BillingPage() {
  const { signOut } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchSubscription(user.id);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionStatus = urlParams.get('subscription');
    const sessionId = urlParams.get('session_id');

    if (subscriptionStatus === 'success' && sessionId) {
      toast.success('Subscription activated successfully!');
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => window.location.reload(), 1500);
    } else if (subscriptionStatus === 'cancelled') {
      toast.error('Subscription cancelled. You can try again anytime!');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('stripe_subscriptions')
        .select(`
          *,
          stripe_plans!price_id(
            plan_type,
            price,
            monthly_limit,
            features
          )
        `)
        .eq('user_id', userId)
        .in('status', ['active', 'trialing'])
        .maybeSingle();

      if (error) throw error;
      setSubscription(data);
    } catch (error: any) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    if (planId === 'free') {
      toast.error('You are already on the free plan');
      return;
    }

    setLoading(planId);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          planType: planId,
          customerEmail: user.email,
        },
      });

      if (error) throw error;

      if (data?.data?.checkoutUrl) {
        toast.success('Redirecting to payment...');
        window.location.href = data.data.checkoutUrl;
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error(error.message || 'Failed to create subscription. Please ensure Stripe is configured.');
    } finally {
      setLoading(null);
    }
  };

  const currentPlanType = subscription?.stripe_plans?.plan_type || 'free';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(210, 40%, 98%)' }}>
      {/* Navigation */}
      <nav className="shadow-sm sticky top-0 z-50" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid hsl(210, 40%, 96%)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex justify-between items-center h-18 py-3">
            <Link to="/dashboard" className="flex items-center">
              <img src="/cru_logo.png" alt="Credit Repair University" className="h-14 object-contain" />
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="font-medium transition-colors flex items-center gap-2" style={{ color: 'hsl(217, 85%, 31%)' }}>
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <button onClick={signOut} className="flex items-center font-medium transition-colors" style={{ color: 'hsl(217, 85%, 31%)' }}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">
        {/* Current Subscription Status */}
        {subscription && (
          <div className="p-6 mb-8 rounded-xl" style={{ backgroundColor: 'hsl(210, 40%, 96%)', border: '1px solid hsl(210, 40%, 90%)' }}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 mt-1" style={{ color: 'hsl(217, 85%, 31%)' }} />
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>
                    Current Plan: {subscription.stripe_plans.plan_type.charAt(0).toUpperCase() + subscription.stripe_plans.plan_type.slice(1)}
                  </h3>
                  <p className="font-semibold" style={{ color: 'hsl(215, 20%, 45%)' }}>
                    Status: <span className="font-bold" style={{ color: 'hsl(142, 71%, 35%)' }}>{subscription.status}</span>
                  </p>
                  {subscription.trial_end && new Date(subscription.trial_end) > new Date() && (
                    <p className="font-semibold mt-1" style={{ color: 'hsl(215, 20%, 45%)' }}>
                      Trial ends: {new Date(subscription.trial_end).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'hsl(217, 85%, 31%)' }}>
              Choose Your <span style={{ color: 'hsl(43, 47%, 50%)' }}>Plan</span>
            </h1>
            <p className="text-xl" style={{ color: 'hsl(215, 20%, 45%)' }}>
              Start free, upgrade anytime for full access
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = currentPlanType === plan.id;
              const isUpgrade = plan.price > (PLANS.find(p => p.id === currentPlanType)?.price || 0);
              const isEnterprise = plan.id === 'enterprise';

              return (
                <div
                  key={plan.id}
                  className="relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2"
                  style={{ 
                    backgroundColor: '#ffffff',
                    border: plan.popular 
                      ? '3px solid hsl(43, 47%, 60%)' 
                      : isEnterprise 
                      ? '3px solid hsl(217, 85%, 40%)' 
                      : '2px solid hsl(210, 40%, 90%)',
                    boxShadow: plan.popular || isEnterprise ? '0 10px 40px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.05)'
                  }}
                >
                  {plan.popular && (
                    <div 
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold shadow-md"
                      style={{ backgroundColor: 'hsl(43, 47%, 60%)', color: 'hsl(217, 85%, 15%)' }}
                    >
                      MOST POPULAR
                    </div>
                  )}
                  {isEnterprise && (
                    <div 
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full text-sm font-bold shadow-md"
                      style={{ backgroundColor: 'hsl(217, 85%, 31%)', color: '#ffffff' }}
                    >
                      BUSINESS LAUNCH
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-6 mt-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: plan.popular ? 'hsl(43, 47%, 60%)' : isEnterprise ? 'hsl(217, 85%, 31%)' : 'hsl(210, 40%, 96%)' }}
                    >
                      <Icon className="w-7 h-7" style={{ color: plan.popular || isEnterprise ? '#ffffff' : 'hsl(217, 85%, 31%)' }} />
                    </div>
                    <h3 className="text-2xl font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>{plan.name}</h3>
                  </div>

                  <div className="mb-6">
                    <span className="text-5xl font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>${plan.price}</span>
                    <span className="text-lg" style={{ color: 'hsl(215, 20%, 55%)' }}>/month</span>
                    {plan.price > 0 && (
                      <p className="text-sm font-semibold mt-2" style={{ color: 'hsl(142, 71%, 35%)' }}>7-day free trial included</p>
                    )}
                    {isEnterprise && (
                      <p className="text-sm font-semibold mt-1" style={{ color: 'hsl(217, 85%, 31%)' }}>Complete business launch package</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: isEnterprise && idx > 0 ? 'hsl(217, 85%, 31%)' : 'hsl(142, 71%, 35%)' }} />
                        <span className="font-medium" style={{ color: 'hsl(215, 20%, 35%)' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isCurrentPlan || loading === plan.id}
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={isCurrentPlan 
                      ? { backgroundColor: 'hsl(210, 40%, 92%)', color: 'hsl(215, 20%, 55%)' }
                      : plan.popular 
                      ? { backgroundColor: 'hsl(43, 47%, 60%)', color: 'hsl(217, 85%, 15%)' }
                      : isEnterprise
                      ? { backgroundColor: 'hsl(217, 85%, 31%)', color: '#ffffff' }
                      : { backgroundColor: 'hsl(210, 40%, 96%)', color: 'hsl(217, 85%, 31%)' }
                    }
                  >
                    {loading === plan.id ? (
                      'Processing...'
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : isUpgrade ? (
                      isEnterprise ? (
                        <>Start Business Launch Program</>
                      ) : (
                        <>Upgrade to {plan.name}</>
                      )
                    ) : (
                      <>Choose {plan.name}</>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="rounded-2xl p-8" style={{ backgroundColor: '#ffffff', border: '1px solid hsl(210, 40%, 90%)' }}>
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: 'hsl(217, 85%, 31%)' }}>
            Feature Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '2px solid hsl(210, 40%, 90%)' }}>
                  <th className="text-left py-4 px-4 font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>Feature</th>
                  <th className="text-center py-4 px-4 font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>Free</th>
                  <th className="text-center py-4 px-4 font-bold" style={{ color: 'hsl(43, 47%, 50%)' }}>Pro</th>
                  <th className="text-center py-4 px-4 font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Course Access', free: '5 courses', pro: 'All 87 courses', enterprise: 'All 87 courses' },
                  { feature: 'Quizzes', free: 'Limited', pro: 'All 97 quizzes', enterprise: 'All 97 quizzes' },
                  { feature: 'Certificates', free: 'No', pro: 'Yes', enterprise: 'Yes' },
                  { feature: 'Progress Tracking', free: 'Basic', pro: 'Full', enterprise: 'Full' },
                  { feature: 'Support', free: 'Community', pro: 'Priority', enterprise: '1-on-1 Dedicated' },
                  { feature: 'White-Label Software Platform', free: 'No', pro: 'No', enterprise: 'Yes' },
                  { feature: 'Business Training Program', free: 'No', pro: 'No', enterprise: 'Yes' },
                  { feature: 'Weekly Coaching Calls', free: 'No', pro: 'No', enterprise: 'Yes (3 months)' },
                  { feature: 'Custom Domain Setup', free: 'No', pro: 'No', enterprise: 'Yes' },
                  { feature: 'Multi-User Licenses', free: 'No', pro: 'No', enterprise: 'Yes' },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid hsl(210, 40%, 94%)' }}>
                    <td className="py-3 px-4 font-semibold" style={{ color: 'hsl(217, 85%, 31%)' }}>{row.feature}</td>
                    <td className="py-3 px-4 text-center" style={{ color: 'hsl(215, 20%, 45%)' }}>{row.free}</td>
                    <td className="py-3 px-4 text-center" style={{ color: 'hsl(215, 20%, 45%)' }}>{row.pro}</td>
                    <td className="py-3 px-4 text-center" style={{ color: 'hsl(215, 20%, 45%)' }}>{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="mt-12 p-8 rounded-xl text-center" style={{ backgroundColor: 'hsla(43, 47%, 60%, 0.15)', border: '1px solid hsla(43, 47%, 60%, 0.3)' }}>
          <Zap className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(43, 47%, 50%)' }} />
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'hsl(217, 85%, 31%)' }}>Risk-Free Guarantee</h3>
          <p className="max-w-2xl mx-auto" style={{ color: 'hsl(215, 20%, 45%)' }}>
            Try any paid plan risk-free with our 7-day trial. Cancel anytime, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
