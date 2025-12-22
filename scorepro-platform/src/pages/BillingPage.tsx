import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Check, AlertCircle, Crown, Sparkles, Building2, ArrowRight, Shield, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

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
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchSubscription(user.id);
    });

    // Handle payment result
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-2">
              <ArrowRight className="w-5 h-5 rotate-180" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-black text-black">Billing & Subscriptions</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Current Subscription Status */}
        {subscription && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-cyan-500/30 p-6 mb-8 rounded-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-xl font-black text-black mb-2">
                    Current Plan: {subscription.stripe_plans.plan_type.charAt(0).toUpperCase() + subscription.stripe_plans.plan_type.slice(1)}
                  </h3>
                  <p className="text-gray-700 font-semibold">
                    Status: <span className="text-green-600 font-bold">{subscription.status}</span>
                  </p>
                  {subscription.trial_end && new Date(subscription.trial_end) > new Date() && (
                    <p className="text-gray-700 font-semibold mt-1">
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
            <h2 className="text-4xl lg:text-5xl font-black text-black mb-4">
              Choose Your <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">Plan</span>
            </h2>
            <p className="text-xl text-gray-700 font-semibold">
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
                  className={`relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                    plan.popular
                      ? 'border-4 border-yellow-400 shadow-2xl hover:shadow-[0_20px_60px_rgba(59,130,246,0.4)]'
                      : isEnterprise
                      ? 'border-4 border-purple-500/50 shadow-2xl hover:shadow-[0_20px_60px_rgba(147,51,234,0.4)]'
                      : 'border-2 border-cyan-500/40 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg">
                      MOST POPULAR
                    </div>
                  )}
                  {isEnterprise && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg">
                      BUSINESS LAUNCH
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-6 mt-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      plan.popular 
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-600' 
                        : isEnterprise
                        ? 'bg-gradient-to-br from-purple-600 to-blue-600'
                        : 'bg-gradient-to-br from-blue-600 to-green-500'
                    }`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-black">{plan.name}</h3>
                  </div>

                  <div className="mb-6">
                    <span className="text-5xl font-black text-black">${plan.price}</span>
                    <span className="text-gray-600 text-lg font-semibold">/month</span>
                    {plan.price > 0 && (
                      <p className="text-sm text-green-600 font-bold mt-2">7-day free trial included</p>
                    )}
                    {isEnterprise && (
                      <p className="text-sm text-purple-600 font-bold mt-1">Complete business launch package</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          isEnterprise && idx > 0 ? 'text-purple-600' : 'text-green-500'
                        }`} />
                        <span className={`font-medium ${
                          isEnterprise && idx > 0 ? 'text-gray-700 font-bold' : 'text-gray-700'
                        }`}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isCurrentPlan || loading === plan.id}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                      isCurrentPlan
                        ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl border-4 border-yellow-400'
                        : isEnterprise
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl border-2 border-purple-500'
                        : 'bg-gradient-to-r from-blue-600 to-green-500 text-white hover:from-blue-700 hover:to-green-600 shadow-lg hover:shadow-xl'
                    }`}
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
        <div className="bg-gradient-to-b from-cyan-50 to-white rounded-3xl p-8 border-2 border-cyan-500/30">
          <h3 className="text-3xl font-black text-black mb-6 text-center">
            Feature Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-cyan-500/30">
                  <th className="text-left py-4 px-4 font-black text-black">Feature</th>
                  <th className="text-center py-4 px-4 font-black text-black">Free</th>
                  <th className="text-center py-4 px-4 font-black text-black">Pro</th>
                  <th className="text-center py-4 px-4 font-black text-black">Enterprise</th>
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
                  <tr key={idx} className="border-b border-cyan-500/20">
                    <td className="py-3 px-4 font-bold text-gray-700">{row.feature}</td>
                    <td className="py-3 px-4 text-center text-gray-600 font-semibold">{row.free}</td>
                    <td className="py-3 px-4 text-center text-gray-600 font-semibold">{row.pro}</td>
                    <td className="py-3 px-4 text-center text-gray-600 font-semibold">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-cyan-50 border-2 border-green-500/30 p-8 rounded-2xl text-center">
          <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-black mb-3">Risk-Free Guarantee</h3>
          <p className="text-gray-700 font-semibold max-w-2xl mx-auto">
            Try any paid plan risk-free with our 7-day trial. Cancel anytime, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
