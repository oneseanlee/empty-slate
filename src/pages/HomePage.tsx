import { Link } from 'react-router-dom';
import { BookOpen, Award, TrendingUp, Users, CheckCircle, Sparkles, Target, Shield, ChevronDown, Star, Quote, ArrowRight, Clock, Crown, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation - Clean White Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        } border-b border-slate-100`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/cru_logo.png"
              alt="Credit Repair University"
              className={`object-contain transition-all duration-300 hover:scale-105 ${isScrolled ? 'h-14' : 'h-16'}`}
            />
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#courses" className="text-navy hover:text-gold font-semibold transition-colors duration-200">COURSES</a>
            <a href="#about" className="text-navy hover:text-gold font-semibold transition-colors duration-200">ABOUT</a>
            <a href="#pricing" className="text-navy hover:text-gold font-semibold transition-colors duration-200">PRICING</a>
            <a href="#faq" className="text-navy hover:text-gold font-semibold transition-colors duration-200">FAQ</a>
            <Link to="/login" className="text-navy hover:text-gold font-semibold transition-colors duration-200">LOGIN</Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-lg font-semibold text-base bg-gold text-navy hover:bg-gold-hover transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dark Navy Overlay with Background Image */}
      <section id="top" className="relative pt-24 min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
        ></div>
        {/* Navy Overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: 'hsl(217, 85%, 15%)', opacity: 0.85 }}></div>
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(217,85%,15%)] via-transparent to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-16 py-20 text-center">
          {/* Gold Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ backgroundColor: 'hsla(43, 47%, 60%, 0.2)', border: '1px solid hsla(43, 47%, 60%, 0.4)' }}>
            <Sparkles className="w-4 h-4" style={{ color: 'hsl(43, 47%, 60%)' }} />
            <span className="font-semibold text-sm" style={{ color: 'hsl(43, 47%, 60%)' }}>7-Day Free Trial • No Credit Card Required</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6 tracking-tight" style={{ color: '#ffffff' }}>
            Master Credit Repair Education
            <span className="block mt-2" style={{ color: 'hsl(43, 47%, 60%)' }}>Start Free, Upgrade Anytime</span>
          </h1>

          <p className="text-lg lg:text-xl max-w-3xl mx-auto mb-10 leading-relaxed" style={{ color: 'hsl(210, 40%, 78%)' }}>
            Try <span className="font-semibold" style={{ color: '#ffffff' }}>5 courses free</span>, then upgrade to Pro for full access to{' '}
            <span className="font-semibold" style={{ color: '#ffffff' }}>87 expert-led tutorials</span>, interactive quizzes, and professional certifications.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link
              to="/register"
              className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              style={{ backgroundColor: 'hsl(43, 47%, 60%)', color: 'hsl(217, 85%, 15%)' }}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#pricing"
              className="px-8 py-4 rounded-lg font-semibold text-lg backdrop-blur-sm transition-all duration-300"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff' }}
            >
              View Pricing Plans
            </a>
          </div>

          <p className="text-sm mb-16" style={{ color: 'hsl(210, 20%, 55%)' }}>No credit card required</p>
        </div>

        {/* Stats Bar at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md" style={{ backgroundColor: 'hsla(217, 85%, 15%, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-16 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: '10,000+', label: 'Active Learners', icon: Users },
                { value: '87', label: 'Expert Tutorials', icon: BookOpen },
                { value: '97', label: 'Practice Quizzes', icon: Target },
                { value: '4.9/5', label: 'Average Rating', icon: Star }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <Icon className="w-6 h-6 flex-shrink-0" style={{ color: 'hsl(43, 47%, 60%)' }} />
                    <div>
                      <div className="text-2xl font-semibold" style={{ color: '#ffffff' }}>{stat.value}</div>
                      <div className="text-sm" style={{ color: 'hsl(210, 40%, 78%)' }}>{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features/Value Props - Clean Cards */}
      <section id="about" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <span className="text-gold font-medium tracking-wider uppercase text-sm">WHY CHOOSE US</span>
            <h2 className="text-3xl lg:text-5xl font-semibold text-navy mb-4 mt-2 tracking-tight">
              Why Credit Repair University
            </h2>
            <p className="text-lg text-slate-600">Premium features that deliver real results</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Try Before You Buy',
                desc: '5 free courses to experience platform quality, then upgrade for full access.',
              },
              {
                icon: Award,
                title: 'Professional Certificates',
                desc: 'Earn recognized certifications and share your achievements on LinkedIn.',
              },
              {
                icon: TrendingUp,
                title: 'Upgrade Anytime',
                desc: 'Start free, upgrade when ready. Cancel anytime - no long-term commitment.',
              },
              {
                icon: Building2,
                title: 'Complete Business Platform',
                desc: 'Enterprise plan includes white-labeled software, full training, and 1-on-1 support to launch your credit repair business.',
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white rounded-xl p-8 hover:shadow-lg hover:bg-navy-50 transition-all duration-300 border border-slate-100"
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors duration-300 shadow-sm">
                    <Icon className="w-7 h-7 text-navy group-hover:text-gold transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories/Courses Overview */}
      <section id="courses" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <span className="text-gold font-medium tracking-wider uppercase text-sm">OUR COURSES</span>
            <h2 className="text-3xl lg:text-5xl font-semibold text-navy mb-4 mt-2 tracking-tight">
              12 Learning Paths
            </h2>
            <p className="text-lg text-slate-600">From fundamentals to advanced strategies</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              { name: 'Getting Started', icon: Target, courses: 7 },
              { name: 'Credit Fundamentals', icon: BookOpen, courses: 8 },
              { name: 'Legal Rights', icon: Shield, courses: 6 },
              { name: 'Reading Reports', icon: BookOpen, courses: 7 },
              { name: 'Dispute Process', icon: Target, courses: 8 },
              { name: 'Advanced Strategies', icon: TrendingUp, courses: 9 },
              { name: 'Credit Building', icon: TrendingUp, courses: 7 },
              { name: 'Specific Issues', icon: Target, courses: 8 },
              { name: 'Financial Management', icon: TrendingUp, courses: 6 },
              { name: 'Platform Guide', icon: Sparkles, courses: 7 },
              { name: 'Avoiding Scams', icon: Shield, courses: 7 },
              { name: 'Maintenance', icon: CheckCircle, courses: 7 }
            ].map((category, idx) => {
              const Icon = category.icon;
              return (
                <div
                  key={idx}
                  className="group bg-white rounded-xl p-5 hover:shadow-md transition-all duration-300 cursor-pointer border border-slate-200 hover:border-gold/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gold transition-colors duration-300">
                      <Icon className="w-6 h-6 text-white group-hover:text-navy" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-navy mb-1 group-hover:text-gold-hover transition-colors">{category.name}</h3>
                      <p className="text-slate-600 text-sm">{category.courses} courses</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-navy rounded-lg font-semibold text-lg hover:bg-gold-hover transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View All Courses
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof - Dark Navy Background */}
      <section className="py-24 relative overflow-hidden" style={{ backgroundColor: 'hsl(217, 85%, 15%)' }}>
        {/* Decorative Quote Icon */}
        <Quote className="absolute top-16 left-1/2 -translate-x-1/2 w-48 h-48 text-white opacity-[0.03]" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold font-medium tracking-wider uppercase text-sm">TESTIMONIALS</span>
            <h2 className="text-3xl lg:text-5xl font-semibold text-white mb-4 mt-2 tracking-tight">
              Real Results from Real People
            </h2>
            <p className="text-lg" style={{ color: 'hsl(213, 27%, 75%)' }}>Join thousands transforming their financial future</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Mitchell',
                result: '+120 Points',
                quote: 'Started with the free plan and loved it so much I upgraded to Pro. Worth every penny!',
                stars: 5,
                role: 'Small Business Owner'
              },
              {
                name: 'Michael Torres',
                result: '+95 Points',
                quote: 'The Pro plan certifications helped me land a better mortgage rate. ROI was immediate!',
                stars: 5,
                role: 'First-Time Homebuyer'
              },
              {
                name: 'Jennifer Lee',
                result: 'Started Credit Repair Business',
                quote: 'The Enterprise plan gave me everything I needed - software, training, and support. Launched in 90 days!',
                stars: 5,
                role: 'Credit Repair Business Owner'
              }
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="rounded-xl p-8 transition-all duration-300 hover:scale-[1.02]"
                style={{ backgroundColor: 'hsl(217, 85%, 22%)', border: '1px solid rgba(11, 61, 145, 0.5)' }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-white/20 mb-4" />
                <p className="mb-6 leading-relaxed italic" style={{ color: 'hsl(214, 32%, 85%)' }}>"{testimonial.quote}"</p>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm" style={{ color: 'hsl(215, 20%, 70%)' }}>{testimonial.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gold text-lg">{testimonial.result}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <span className="text-gold font-medium tracking-wider uppercase text-sm">PRICING</span>
            <h2 className="text-3xl lg:text-5xl font-semibold text-navy mb-4 mt-2 tracking-tight">
              Choose Your Plan
            </h2>
            <p className="text-lg text-slate-600">Start free, upgrade anytime for full access</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Free Plan */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-xl font-semibold text-navy">Free Plan</h3>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-semibold text-navy">$0</span>
                <span className="text-slate-600 text-lg">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Access to 5 courses (limited selection)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Basic progress tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">XP and levels system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Badge earning</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full py-3 rounded-lg font-semibold text-center border-2 border-navy text-navy hover:bg-navy hover:text-white transition-all duration-300"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="relative bg-navy rounded-xl p-8 shadow-xl transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gold text-navy px-4 py-1.5 rounded-full text-sm font-semibold">
                MOST POPULAR
              </div>
              <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-semibold text-white">Pro Plan</h3>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-semibold text-white">$29</span>
                <span className="text-lg" style={{ color: 'hsl(213, 27%, 75%)' }}>/month</span>
                <p className="text-sm text-gold font-semibold mt-2">7-day free trial included</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span style={{ color: 'hsl(214, 32%, 85%)' }}>All 87 courses (complete curriculum)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span style={{ color: 'hsl(214, 32%, 85%)' }}>All 97 quizzes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span style={{ color: 'hsl(214, 32%, 85%)' }}>Certificates upon completion</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span style={{ color: 'hsl(214, 32%, 85%)' }}>Full progress tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span style={{ color: 'hsl(214, 32%, 85%)' }}>Priority support</span>
                </li>
              </ul>
              <Link
                to="/billing"
                className="block w-full py-3 rounded-lg font-semibold text-center bg-gold text-navy hover:bg-gold-hover transition-all duration-300"
              >
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="relative bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-navy text-white px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap">
                BUSINESS LAUNCH
              </div>
              <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="w-12 h-12 bg-navy/10 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-xl font-semibold text-navy">Enterprise</h3>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-semibold text-navy">$250</span>
                <span className="text-slate-600 text-lg">/month</span>
                <p className="text-sm text-gold font-semibold mt-2">7-day free trial included</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 font-semibold">White-labeled credit repair software</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 font-semibold">Complete business training program</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 font-semibold">1-on-1 business launch support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">Weekly coaching calls (3 months)</span>
                </li>
              </ul>
              <Link
                to="/billing"
                className="block w-full py-3 rounded-lg font-semibold text-center border-2 border-navy text-navy hover:bg-navy hover:text-white transition-all duration-300"
              >
                Start Business Launch Program
              </Link>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Sparkles, text: 'Try Before You Buy - 5 Free Courses' },
              { icon: ArrowRight, text: 'Upgrade Anytime for Full Access' },
              { icon: Shield, text: 'No Risk - Cancel Anytime' },
              { icon: Building2, text: 'Launch Your Credit Repair Business in 90 Days' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-4 border border-slate-200">
                  <Icon className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="text-slate-600 text-sm font-medium">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <span className="text-gold font-medium tracking-wider uppercase text-sm">FAQ</span>
            <h2 className="text-3xl lg:text-5xl font-semibold text-navy mb-4 mt-2 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600">Everything you need to know</p>
          </div>

          <div className="space-y-3">
            {[
              {
                question: 'How does the free plan work?',
                answer: 'The free plan gives you access to 5 carefully selected courses to experience the platform quality. No credit card required. Upgrade to Pro anytime for full access to all 87 courses and certifications.'
              },
              {
                question: 'What is included in the 7-day trial?',
                answer: 'Pro and Enterprise plans include a 7-day free trial with full access to all features. No charges during the trial. Cancel anytime before the trial ends with no cost.'
              },
              {
                question: 'Can I upgrade or downgrade my plan?',
                answer: 'Yes! Upgrade from Free to Pro or Enterprise anytime. You can also cancel or downgrade. Changes take effect at the next billing cycle.'
              },
              {
                question: 'How do the certifications work?',
                answer: 'Pro and Enterprise users can earn professional certificates by completing all lessons and passing quizzes in any category. Instantly downloadable and shareable on LinkedIn.'
              },
              {
                question: 'What is included in the Enterprise business launch program?',
                answer: 'Enterprise plan is a complete business launch package including: white-labeled credit repair software platform, comprehensive business training, weekly 1-on-1 coaching calls for 3 months, marketing strategies, legal compliance guidance, and ongoing support to help you successfully launch and grow your credit repair business.'
              },
              {
                question: 'How does billing work?',
                answer: 'Plans are billed monthly. Free plan has no charges. Pro is $29/month, Enterprise is $99/month. All paid plans include a 7-day free trial. Cancel anytime.'
              },
              {
                question: 'What support is available?',
                answer: 'Free users have community access. Pro users get priority support with faster response times. Enterprise users receive dedicated support with a personal account manager.'
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-5 text-left hover:bg-slate-50 transition-colors duration-200"
                  aria-expanded={openFaqIndex === idx}
                >
                  <span className="font-semibold text-navy pr-8">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
                      openFaqIndex === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaqIndex === idx ? 'max-h-48' : 'max-h-0'
                  }`}
                >
                  <p className="px-5 pb-5 text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band - Gold Background */}
      <section className="py-20 bg-gold">
        <div className="max-w-5xl mx-auto px-6 lg:px-16 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-navy mb-6 tracking-tight">
            Ready to Transform Your Credit Score?
          </h2>
          <p className="text-lg text-navy/80 mb-10 leading-relaxed">
            Start with 5 free courses. No credit card required.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-lg font-semibold text-lg bg-navy text-white hover:bg-navy-800 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-6 text-navy/70 text-sm">Upgrade anytime. Cancel anytime. No risk.</p>
        </div>
      </section>

      {/* Footer - Dark Navy */}
      <footer className="py-16 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Logo & Tagline */}
            <div className="md:col-span-2">
              <Link to="/" className="inline-block mb-4">
                <img src="/cru_logo.png" alt="Credit Repair University" className="h-16 object-contain brightness-0 invert hover:opacity-80 transition-opacity duration-300" />
              </Link>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: 'hsl(213, 27%, 75%)' }}>The leading credit repair education platform empowering 10,000+ learners worldwide to take control of their financial future.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/courses" className="block hover:text-gold transition-colors text-sm" style={{ color: 'hsl(213, 27%, 75%)' }}>All Courses</Link>
                <a href="#about" className="block hover:text-gold transition-colors text-sm" style={{ color: 'hsl(213, 27%, 75%)' }}>About</a>
                <a href="#pricing" className="block hover:text-gold transition-colors text-sm" style={{ color: 'hsl(213, 27%, 75%)' }}>Pricing</a>
                <a href="#faq" className="block hover:text-gold transition-colors text-sm" style={{ color: 'hsl(213, 27%, 75%)' }}>FAQ</a>
              </div>
            </div>

            {/* Account Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Get Started</h3>
              <div className="space-y-2">
                <Link to="/login" className="block hover:text-gold transition-colors text-sm" style={{ color: 'hsl(213, 27%, 75%)' }}>Login</Link>
                <Link to="/register" className="block hover:text-gold transition-colors text-sm" style={{ color: 'hsl(213, 27%, 75%)' }}>Sign Up Free</Link>
                <a href="#" className="block hover:text-gold transition-colors text-sm" style={{ color: 'hsl(213, 27%, 75%)' }}>Privacy Policy</a>
                <a href="#" className="block hover:text-gold transition-colors text-sm" style={{ color: 'hsl(213, 27%, 75%)' }}>Terms of Service</a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-8">
            <p className="text-center text-sm" style={{ color: 'hsl(215, 20%, 70%)' }}>
              &copy; 2025 Credit Repair University. Professional Credit Repair Education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
