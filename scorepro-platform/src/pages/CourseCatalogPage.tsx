import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Clock, TrendingUp, Lock, Crown } from 'lucide-react';
import { getUserSubscription, type UserSubscription } from '@/lib/subscription';
import toast from 'react-hot-toast';

export default function CourseCatalogPage() {
  const { user, signOut } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [userProgress, setUserProgress] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      // Load subscription status first
      const subData = await getUserSubscription(user.id);
      setSubscription(subData);

      // Load categories and courses
      const [categoriesData, coursesData, progressData] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('courses').select('*, categories(name, slug)').order('display_order'),
        supabase.from('user_progress').select('course_id').eq('user_id', user.id)
      ]);

      console.log('Categories loaded:', categoriesData.data?.length || 0);
      console.log('Courses loaded:', coursesData.data?.length || 0);

      if (categoriesData.error) {
        console.error('Categories error:', categoriesData.error);
        toast.error('Failed to load categories');
      }

      if (coursesData.error) {
        console.error('Courses error:', coursesData.error);
        toast.error('Failed to load courses');
      }

      setCategories(categoriesData.data || []);

      // Mark first 5 courses as free for free users, all for paid users
      const coursesWithAccess = (coursesData.data || []).map((course, index) => ({
        ...course,
        is_free: index < 5, // First 5 courses are free
        is_accessible: subData.plan_type !== 'free' || index < 5
      }));

      console.log('Courses with access control:', coursesWithAccess.length);
      setCourses(coursesWithAccess);

      const progressIds = new Set(progressData.data?.map(p => p.course_id) || []);
      setUserProgress(progressIds);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = selectedCategory
    ? courses.filter(c => c.categories?.slug === selectedCategory)
    : courses;

  const getCoursesByCategory = (categorySlug: string) => {
    return courses.filter(c => c.categories?.slug === categorySlug);
  };

  const handleCourseClick = (course: any, e: React.MouseEvent) => {
    // Check if course is accessible
    if (!course.is_accessible && subscription?.plan_type === 'free') {
      e.preventDefault();
      toast.error('This course is only available for Pro and Enterprise members. Upgrade to access all 87 courses!', {
        duration: 5000,
      });
    }
  };

  const getAccessibleCoursesCount = () => {
    if (subscription?.plan_type === 'pro' || subscription?.plan_type === 'enterprise') {
      return courses.length;
    }
    return Math.min(5, courses.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex justify-between items-center h-18">
            <Link to="/dashboard" className="flex items-center">
              <img src="/cru_logo.png" alt="Credit Repair University" className="h-20 object-contain" />
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-neutral-700 hover:text-primary-700 font-medium">Dashboard</Link>
              <Link to="/certificates" className="text-neutral-700 hover:text-primary-700 font-medium">Certificates</Link>
              <Link to="/billing" className="text-neutral-700 hover:text-primary-700 font-medium">Billing</Link>
              <button onClick={signOut} className="text-neutral-700 hover:text-primary-700 font-medium">Sign Out</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">
        {/* Header with Subscription Info */}
        <div className="mb-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 mb-4">Course Catalog</h1>
              <p className="text-xl text-neutral-700">87 expert tutorials across 12 comprehensive categories</p>
            </div>

            {/* Subscription Status Card */}
            <div className="bg-white rounded-xl shadow-card p-6 min-w-[280px]">
              <div className="flex items-center gap-3 mb-3">
                {subscription?.plan_type === 'free' ? (
                  <BookOpen className="w-6 h-6 text-blue-600" />
                ) : (
                  <Crown className="w-6 h-6 text-yellow-600" />
                )}
                <div>
                  <p className="text-sm text-neutral-600">Current Plan</p>
                  <p className="font-bold text-lg text-neutral-900 capitalize">{subscription?.plan_type || 'Free'}</p>
                </div>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm text-neutral-600 mb-1">Access</p>
                <p className="font-bold text-neutral-900">{getAccessibleCoursesCount()} of {courses.length} courses</p>
              </div>
              {subscription?.plan_type === 'free' && (
                <Link
                  to="/billing"
                  className="mt-4 block w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Free User Notice */}
        {subscription?.plan_type === 'free' && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Lock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-neutral-900 mb-2">
                  You have access to 5 free courses
                </h3>
                <p className="text-neutral-700 mb-4">
                  Upgrade to Pro ($29/month) to unlock all 87 courses, quizzes, and certificates. Or choose Enterprise ($250/month) for complete business launch support.
                </p>
                <Link
                  to="/billing"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
                >
                  <Crown className="w-5 h-5" />
                  View Upgrade Options
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${!selectedCategory
              ? 'bg-primary-700 text-white shadow-card'
              : 'bg-white text-neutral-700 border border-neutral-300 hover:border-primary-500'
              }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === cat.slug
                ? 'bg-primary-700 text-white shadow-card'
                : 'bg-white text-neutral-700 border border-neutral-300 hover:border-primary-500'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {!selectedCategory ? (
          // Show by category
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryCourses = getCoursesByCategory(category.slug);
              return (
                <div key={category.id}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">{category.name}</h2>
                    <p className="text-neutral-700">{category.description}</p>
                    <p className="text-sm text-neutral-500 mt-1">{categoryCourses.length} courses</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryCourses.map((course) => {
                      const isStarted = userProgress.has(course.id);
                      const isLocked = !course.is_accessible;

                      return (
                        <Link
                          key={course.id}
                          to={`/lesson/${course.id}`}
                          onClick={(e) => handleCourseClick(course, e)}
                          className={`group bg-white rounded-xl shadow-card hover:shadow-lg transition-all p-6 relative ${isLocked ? 'opacity-60' : ''
                            }`}
                        >
                          {isLocked && (
                            <div className="absolute top-4 right-4">
                              <Lock className="w-6 h-6 text-neutral-400" />
                            </div>
                          )}

                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isStarted ? 'bg-success-100' : 'bg-primary-100'
                              }`}>
                              <BookOpen className={`w-6 h-6 ${isStarted ? 'text-success-700' : 'text-primary-700'
                                }`} />
                            </div>
                            {isStarted && (
                              <span className="text-xs font-semibold text-success-700 bg-success-100 px-2 py-1 rounded">
                                In Progress
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-neutral-600 text-sm line-clamp-2 mb-4">{course.description}</p>

                          <div className="flex items-center gap-4 text-sm text-neutral-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{course.duration_minutes ?? 15} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>{course.difficulty_level || 'Beginner'}</span>
                            </div>
                          </div>

                          {isLocked && (
                            <div className="mt-4 pt-4 border-t border-neutral-200">
                              <p className="text-sm text-neutral-600 font-medium flex items-center gap-2">
                                <Crown className="w-4 h-4 text-yellow-600" />
                                Pro/Enterprise Only
                              </p>
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Filtered view
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isStarted = userProgress.has(course.id);
              const isLocked = !course.is_accessible;

              return (
                <Link
                  key={course.id}
                  to={`/lesson/${course.id}`}
                  onClick={(e) => handleCourseClick(course, e)}
                  className={`group bg-white rounded-xl shadow-card hover:shadow-lg transition-all p-6 relative ${isLocked ? 'opacity-60' : ''
                    }`}
                >
                  {isLocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-6 h-6 text-neutral-400" />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isStarted ? 'bg-success-100' : 'bg-primary-100'
                      }`}>
                      <BookOpen className={`w-6 h-6 ${isStarted ? 'text-success-700' : 'text-primary-700'
                        }`} />
                    </div>
                    {isStarted && (
                      <span className="text-xs font-semibold text-success-700 bg-success-100 px-2 py-1 rounded">
                        In Progress
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-neutral-600 text-sm line-clamp-2 mb-4">{course.description}</p>

                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration_minutes ?? 15} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{course.difficulty_level || 'Beginner'}</span>
                    </div>
                  </div>

                  {isLocked && (
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <p className="text-sm text-neutral-600 font-medium flex items-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-600" />
                        Pro/Enterprise Only
                      </p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
