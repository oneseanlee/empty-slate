import { Link } from 'react-router-dom';
import { BookOpen, Award, TrendingUp, Users, CheckCircle, Sparkles, Target, Shield, ChevronDown, Star, Quote, ArrowRight, Zap, Clock, Crown, Building2 } from 'lucide-react';
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
    <div className="min-h-screen bg-white text-[#1f2937]">
      {/* Glassmorphism Header/Navigation */}
      {/* Glassmorphism Header/Navigation - Floating Pill Style */}
      <nav
        className={`fixed z-50 left-1/2 transform -translate-x-1/2 transition-all duration-300 w-[95%] max-w-7xl
          ${isScrolled
            ? 'top-4'
            : 'top-6'
          }`}
      >
        <div className={`bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl px-6 py-3 flex justify-between items-center relative transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-xl'}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/cru_logo.png"
              alt="Credit Repair University"
              className={`object-contain transition-all duration-300 hover:scale-105 ${isScrolled ? 'h-16' : 'h-20'}`}
            />
          </Link>

          {/* Nav Links - Absolutely Centered */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <a href="#courses" className="text-[#1f2937] hover:text-blue-600 font-semibold transition-colors duration-200">COURSES</a>
            <a href="#about" className="text-[#1f2937] hover:text-blue-600 font-semibold transition-colors duration-200">ABOUT</a>
            <a href="#pricing" className="text-[#1f2937] hover:text-blue-600 font-semibold transition-colors duration-200">PRICING</a>
            <a href="#faq" className="text-[#1f2937] hover:text-blue-600 font-semibold transition-colors duration-200">FAQ</a>
            <Link to="/login" className="text-[#1f2937] hover:text-blue-600 font-semibold transition-colors duration-200">LOGIN</Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              to="/register"
              className="relative px-6 py-2.5 rounded-full font-bold text-base overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium Glassmorphism */}
      <section id="top" className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 animate-gradient"></div>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-16 text-center">
          {/* Trust Badges - Glassmorphism Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full border-2 border-green-500/30 shadow-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-[#1f2937] font-bold text-sm">10,000+ Users</span>
            </div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full border-2 border-blue-500/30 shadow-lg animate-pulse">
              <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span className="text-[#1f2937] font-bold text-sm">4.9 Rating</span>
            </div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full border-2 border-green-500/30 shadow-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-[#1f2937] font-bold text-sm">7-Day Free Trial</span>
            </div>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6 animate-fade-in-up">
            <span className="block text-black">Master Credit Repair Education</span>
            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent pb-4">
              Start Free, Upgrade Anytime
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-[#1f2937] max-w-4xl mx-auto mb-12 leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Try <span className="text-blue-600 font-bold">5 courses free</span>, then upgrade to Pro for full access to <span className="text-blue-600 font-bold">87 expert-led tutorials</span>, interactive quizzes, and professional certifications.
          </p>

          {/* Primary CTA - Premium Styling */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link
              to="/register"
              className="group relative px-8 py-4 rounded-2xl font-bold text-xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-[0_20px_60px_rgba(59,130,246,0.4)] border-4 border-yellow-400"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:from-blue-700 group-hover:to-cyan-700"></div>
              <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                Start Free Trial
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            <a
              href="#pricing"
              className="group px-8 py-4 rounded-2xl font-bold text-lg bg-white/80 backdrop-blur-md border-2 border-cyan-500/50 text-[#1f2937] hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              View Pricing Plans

            </a>
          </div>

          <p className="text-gray-500 font-bold text-sm mb-8 -mt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            No credit card required
          </p>

          {/* Urgency Element */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 backdrop-blur-sm rounded-full border border-red-600/30 animate-pulse">
            <Clock className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600 font-bold">Join 500+ learners who started this week</span>
          </div>

          {/* Stats Cards - Glassmorphism */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-16">
            {[
              { value: '10,000+', label: 'Active Learners', icon: Users },
              { value: '87', label: 'Expert Tutorials', icon: BookOpen },
              { value: '97', label: 'Practice Quizzes', icon: Target },
              { value: '4.9/5', label: 'Average Rating', icon: Star }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="group relative bg-white/70 backdrop-blur-lg rounded-3xl p-6 hover:bg-white/90 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-cyan-500/30"
                  style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
                >
                  <Icon className="w-8 h-8 text-blue-600 mb-3 mx-auto group-hover:scale-110 transition-transform" />
                  <div className="text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#1f2937] font-bold uppercase tracking-wide">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section >

      {/* Features/Value Props - Glassmorphism Cards */}
      < section id="about" className="py-24 relative bg-gradient-to-b from-white to-blue-50" >
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-black mb-4">
              Why <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">Credit Repair University</span>
            </h2>
            <p className="text-xl text-[#1f2937] font-semibold">Premium features that deliver real results</p>
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
                  className="group relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 hover:bg-white/95 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-cyan-500/40 hover:border-cyan-500/70"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-green-500/10 rounded-bl-full blur-2xl"></div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-black mb-3">{feature.title}</h3>
                    <p className="text-[#1f2937] leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section >

      {/* Categories/Courses Overview - Glassmorphism Grid */}
      < section id="courses" className="py-24 relative bg-gradient-to-b from-blue-50 to-white" >
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">12 Learning Paths</span>
            </h2>
            <p className="text-xl text-[#1f2937] font-semibold">From fundamentals to advanced strategies</p>
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
                  className="group bg-white/80 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/95 hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border-2 border-cyan-500/30 hover:border-cyan-500/60"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-black mb-1 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                      <p className="text-[#1f2937] text-sm font-semibold">{category.courses} courses</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl text-white font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-yellow-400"
            >
              View All Courses
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section >

      {/* Social Proof - Glassmorphism Testimonials */}
      < section className="py-24 relative bg-gradient-to-b from-white to-cyan-50" >
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">Real Results</span> from Real People
            </h2>
            <p className="text-xl text-[#1f2937] font-semibold">Join thousands transforming their financial future</p>
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
                className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 hover:bg-white/95 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-cyan-500/40"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-green-500 text-green-500" />
                  ))}
                </div>
                <Quote className="w-10 h-10 text-blue-600/20 mb-4" />
                <p className="text-black mb-6 leading-relaxed italic font-medium">"{testimonial.quote}"</p>
                <div className="border-t-2 border-cyan-500/30 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-black text-lg">{testimonial.name}</p>
                      <p className="text-sm text-[#1f2937] font-semibold">{testimonial.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-green-500 text-xl">{testimonial.result}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Pricing Section - 3 Tier Model */}
      < section id="pricing" className="py-24 relative bg-gradient-to-b from-cyan-50 to-white" >
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-black mb-4">
              Choose Your <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">Plan</span>
            </h2>
            <p className="text-xl text-[#1f2937] font-semibold">Start free, upgrade anytime for full access</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Free Plan */}
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-cyan-500/40 hover:shadow-xl transition-all duration-300 transform scale-95">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-black">Free Plan</h3>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-black text-black">$0</span>
                <span className="text-gray-600 text-lg font-semibold">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Access to 5 courses (limited selection)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Basic progress tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">XP and levels system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Badge earning</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="block w-full py-4 rounded-2xl font-bold text-lg text-center bg-gradient-to-r from-blue-600 to-green-500 text-white hover:from-blue-700 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Plan - Most Popular */}
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-4 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.5)] hover:shadow-[0_0_60px_rgba(250,204,21,0.7)] transition-all duration-300 transform scale-105">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg">
                MOST POPULAR
              </div>
              <div className="flex items-center gap-3 mb-6 mt-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-black">Pro Plan</h3>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-black text-black">$29</span>
                <span className="text-gray-600 text-lg font-semibold">/month</span>
                <p className="text-sm text-green-600 font-bold mt-2">7-day free trial included</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">All 87 courses (complete curriculum)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">All 97 quizzes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Certificates upon completion</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Full progress tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Priority support</span>
                </li>
              </ul>
              <Link
                to="/billing"
                className="block w-full py-4 rounded-2xl font-bold text-lg text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-xl hover:shadow-2xl border-4 border-yellow-400 transition-all duration-300"
              >
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-500/50 hover:shadow-2xl transition-all duration-300 transform scale-95">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg whitespace-nowrap">
                BUSINESS LAUNCH
              </div>
              <div className="flex items-center gap-3 mb-6 mt-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-black">Enterprise</h3>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-black text-black">$250</span>
                <span className="text-gray-600 text-lg font-semibold">/month</span>
                <p className="text-sm text-green-600 font-bold mt-2">7-day free trial included</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-bold">White-labeled credit repair software</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-bold">Complete business training program</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-bold">1-on-1 business launch support</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Weekly coaching calls (3 months)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">Custom domain setup</span>
                </li>
              </ul>
              <Link
                to="/billing"
                className="block w-full py-4 rounded-2xl font-bold text-lg text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300"
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
                <div key={idx} className="flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-xl p-4 border-2 border-cyan-500/30">
                  <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 font-bold text-sm">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section >

      {/* FAQ Accordion - Glassmorphism */}
      < section id="faq" className="py-24 relative bg-gradient-to-b from-white to-cyan-50" >
        <div className="max-w-4xl mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-black text-black mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-[#1f2937] font-semibold">Everything you need to know</p>
          </div>

          <div className="space-y-4">
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
                className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden hover:bg-white/95 hover:shadow-xl transition-all duration-300 border-2 border-cyan-500/30 hover:border-cyan-500/60"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-6 text-left"
                  aria-expanded={openFaqIndex === idx}
                >
                  <span className="font-bold text-lg text-black pr-8">{faq.question}</span>
                  <ChevronDown
                    className={`w-6 h-6 text-blue-600 flex-shrink-0 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaqIndex === idx ? 'max-h-48' : 'max-h-0'
                    }`}
                >
                  <p className="px-6 pb-6 text-[#1f2937] leading-relaxed font-medium">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* CTA Band */}
      < section className="py-20 relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500" >
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="relative max-w-5xl mx-auto px-6 lg:px-16 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Transform Your Credit Score?
          </h2>
          <p className="text-xl text-white/95 mb-10 leading-relaxed font-bold">
            Start with 5 free courses. No credit card required.
          </p>

          <Link
            to="/register"
            className="group inline-flex items-center gap-4 px-16 py-7 rounded-2xl font-black text-2xl bg-white text-blue-600 hover:bg-yellow-400 hover:text-black transition-all duration-300 hover:scale-105 shadow-2xl border-4 border-yellow-400"
          >
            Start Free Trial
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="mt-6 text-white/95 text-base font-bold">Upgrade anytime. Cancel anytime. No risk.</p>
        </div>
      </section >

      {/* Footer - Clean & Minimal */}
      < footer className="relative py-16 border-t border-neutral-200 bg-gradient-to-b from-white to-gray-50" >
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Logo & Tagline */}
            <div>
              <Link to="/" className="inline-block mb-4">
                <img src="/cru_logo.png" alt="Credit Repair University" className="h-20 md:h-24 object-contain hover:scale-105 transition-transform duration-300" />
              </Link>
              <p className="text-[#1f2937] text-sm leading-relaxed font-medium">The leading credit repair education platform empowering 10,000+ learners worldwide.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-black text-black mb-4 text-lg">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/courses" className="block text-[#1f2937] hover:text-blue-600 transition-colors font-semibold">All Courses</Link>
                <a href="#about" className="block text-[#1f2937] hover:text-blue-600 transition-colors font-semibold">About</a>
                <a href="#pricing" className="block text-[#1f2937] hover:text-blue-600 transition-colors font-semibold">Pricing</a>
                <a href="#faq" className="block text-[#1f2937] hover:text-blue-600 transition-colors font-semibold">FAQ</a>
              </div>
            </div>

            {/* Account Links */}
            <div>
              <h3 className="font-black text-black mb-4 text-lg">Get Started</h3>
              <div className="space-y-2">
                <Link to="/login" className="block text-[#1f2937] hover:text-blue-600 transition-colors font-semibold">Login</Link>
                <Link to="/register" className="block text-[#1f2937] hover:text-blue-600 transition-colors font-semibold">Sign Up Free</Link>
                <a href="#" className="block text-[#1f2937] hover:text-blue-600 transition-colors font-semibold">Privacy Policy</a>
                <a href="#" className="block text-[#1f2937] hover:text-blue-600 transition-colors font-semibold">Terms of Service</a>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-neutral-200 pt-8">
            <p className="text-center text-[#1f2937] text-sm font-semibold">
              &copy; 2025 Credit Repair University. Professional Credit Repair Education.
            </p>
          </div>
        </div>
      </footer >
    </div >
  );
}
