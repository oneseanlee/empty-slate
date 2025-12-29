import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Clock, TrendingUp, Lock, Crown, LogOut } from 'lucide-react';
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
      const subData = await getUserSubscription(user.id);
      setSubscription(subData);

      const [categoriesData, coursesData, progressData] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('courses').select('*, categories(name, slug)').order('display_order'),
        supabase.from('user_progress').select('course_id').eq('user_id', user.id)
      ]);

      if (categoriesData.error) {
        toast.error('Failed to load categories');
      }

      if (coursesData.error) {
        toast.error('Failed to load courses');
      }

      setCategories(categoriesData.data || []);

      const coursesWithAccess = (coursesData.data || []).map((course, index) => ({
        ...course,
        is_free: index < 5,
        is_accessible: subData.plan_type !== 'free' || index < 5
      }));

      setCourses(coursesWithAccess);

      const progressIds = new Set(progressData.data?.map(p => p.course_id) || []);
      setUserProgress(progressIds);
    } catch (error) {
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'hsl(210, 40%, 98%)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 mx-auto mb-4" style={{ borderBottom: '2px solid hsl(217, 85%, 31%)' }}></div>
          <p style={{ color: 'hsl(215, 20%, 45%)' }}>Loading courses...</p>
        </div>
      </div>
    );
  }

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
              <Link to="/dashboard" className="font-medium transition-colors" style={{ color: 'hsl(217, 85%, 31%)' }}>Dashboard</Link>
              <Link to="/certificates" className="font-medium transition-colors" style={{ color: 'hsl(217, 85%, 31%)' }}>Certificates</Link>
              <Link to="/billing" className="font-medium transition-colors" style={{ color: 'hsl(217, 85%, 31%)' }}>Billing</Link>
              <button onClick={signOut} className="flex items-center font-medium transition-colors" style={{ color: 'hsl(217, 85%, 31%)' }}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">
        {/* Header with Subscription Info */}
        <div className="mb-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-4" style={{ color: 'hsl(217, 85%, 31%)' }}>Course Catalog</h1>
              <p className="text-xl" style={{ color: 'hsl(215, 20%, 45%)' }}>87 expert tutorials across 12 comprehensive categories</p>
            </div>

            {/* Subscription Status Card */}
            <div className="rounded-xl shadow-md p-6 min-w-[280px]" style={{ backgroundColor: '#ffffff' }}>
              <div className="flex items-center gap-3 mb-3">
                {subscription?.plan_type === 'free' ? (
                  <BookOpen className="w-6 h-6" style={{ color: 'hsl(217, 85%, 31%)' }} />
                ) : (
                  <Crown className="w-6 h-6" style={{ color: 'hsl(43, 47%, 50%)' }} />
                )}
                <div>
                  <p className="text-sm" style={{ color: 'hsl(215, 20%, 55%)' }}>Current Plan</p>
                  <p className="font-bold text-lg capitalize" style={{ color: 'hsl(217, 85%, 31%)' }}>{subscription?.plan_type || 'Free'}</p>
                </div>
              </div>
              <div className="pt-3" style={{ borderTop: '1px solid hsl(210, 40%, 92%)' }}>
                <p className="text-sm mb-1" style={{ color: 'hsl(215, 20%, 55%)' }}>Access</p>
                <p className="font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>{getAccessibleCoursesCount()} of {courses.length} courses</p>
              </div>
              {subscription?.plan_type === 'free' && (
                <Link
                  to="/billing"
                  className="mt-4 block w-full py-2 text-center rounded-lg font-semibold transition-all"
                  style={{ backgroundColor: 'hsl(43, 47%, 60%)', color: 'hsl(217, 85%, 15%)' }}
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Free User Notice */}
        {subscription?.plan_type === 'free' && (
          <div className="mb-8 rounded-xl p-6" style={{ backgroundColor: 'hsl(210, 40%, 96%)', border: '2px solid hsl(217, 85%, 80%)' }}>
            <div className="flex items-start gap-4">
              <Lock className="w-8 h-8 flex-shrink-0 mt-1" style={{ color: 'hsl(217, 85%, 31%)' }} />
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>
                  You have access to 5 free courses
                </h3>
                <p className="mb-4" style={{ color: 'hsl(215, 20%, 45%)' }}>
                  Upgrade to Pro ($29/month) to unlock all 87 courses, quizzes, and certificates. Or choose Enterprise ($250/month) for complete business launch support.
                </p>
                <Link
                  to="/billing"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-md transition-all"
                  style={{ backgroundColor: 'hsl(43, 47%, 60%)', color: 'hsl(217, 85%, 15%)' }}
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
            className="px-4 py-2 rounded-lg font-medium transition-all"
            style={!selectedCategory 
              ? { backgroundColor: 'hsl(217, 85%, 31%)', color: '#ffffff' }
              : { backgroundColor: '#ffffff', color: 'hsl(217, 85%, 31%)', border: '1px solid hsl(210, 40%, 85%)' }
            }
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className="px-4 py-2 rounded-lg font-medium transition-all"
              style={selectedCategory === cat.slug
                ? { backgroundColor: 'hsl(43, 47%, 60%)', color: 'hsl(217, 85%, 15%)' }
                : { backgroundColor: '#ffffff', color: 'hsl(217, 85%, 31%)', border: '1px solid hsl(210, 40%, 85%)' }
              }
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        {!selectedCategory ? (
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryCourses = getCoursesByCategory(category.slug);
              return (
                <div key={category.id}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>{category.name}</h2>
                    <p style={{ color: 'hsl(215, 20%, 45%)' }}>{category.description}</p>
                    <p className="text-sm mt-1" style={{ color: 'hsl(215, 20%, 55%)' }}>{categoryCourses.length} courses</p>
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
                          className={`group rounded-xl shadow-md hover:shadow-lg transition-all p-6 relative ${isLocked ? 'opacity-60' : ''}`}
                          style={{ backgroundColor: '#ffffff' }}
                        >
                          {isLocked && (
                            <div className="absolute top-4 right-4">
                              <Lock className="w-6 h-6" style={{ color: 'hsl(215, 20%, 65%)' }} />
                            </div>
                          )}

                          <div className="flex items-start justify-between mb-4">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: isStarted ? 'hsla(43, 47%, 60%, 0.2)' : 'hsl(210, 40%, 96%)' }}
                            >
                              <BookOpen className="w-6 h-6" style={{ color: isStarted ? 'hsl(43, 47%, 50%)' : 'hsl(217, 85%, 31%)' }} />
                            </div>
                            {isStarted && (
                              <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: 'hsla(43, 47%, 60%, 0.2)', color: 'hsl(43, 47%, 45%)' }}>
                                In Progress
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-bold mb-2 transition-colors" style={{ color: 'hsl(217, 85%, 31%)' }}>
                            {course.title}
                          </h3>
                          <p className="text-sm line-clamp-2 mb-4" style={{ color: 'hsl(215, 20%, 45%)' }}>{course.description}</p>

                          <div className="flex items-center gap-4 text-sm" style={{ color: 'hsl(215, 20%, 55%)' }}>
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
                            <div className="mt-4 pt-4" style={{ borderTop: '1px solid hsl(210, 40%, 92%)' }}>
                              <p className="text-sm font-medium flex items-center gap-2" style={{ color: 'hsl(215, 20%, 45%)' }}>
                                <Crown className="w-4 h-4" style={{ color: 'hsl(43, 47%, 50%)' }} />
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isStarted = userProgress.has(course.id);
              const isLocked = !course.is_accessible;

              return (
                <Link
                  key={course.id}
                  to={`/lesson/${course.id}`}
                  onClick={(e) => handleCourseClick(course, e)}
                  className={`group rounded-xl shadow-md hover:shadow-lg transition-all p-6 relative ${isLocked ? 'opacity-60' : ''}`}
                  style={{ backgroundColor: '#ffffff' }}
                >
                  {isLocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-6 h-6" style={{ color: 'hsl(215, 20%, 65%)' }} />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: isStarted ? 'hsla(43, 47%, 60%, 0.2)' : 'hsl(210, 40%, 96%)' }}
                    >
                      <BookOpen className="w-6 h-6" style={{ color: isStarted ? 'hsl(43, 47%, 50%)' : 'hsl(217, 85%, 31%)' }} />
                    </div>
                    {isStarted && (
                      <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: 'hsla(43, 47%, 60%, 0.2)', color: 'hsl(43, 47%, 45%)' }}>
                        In Progress
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold mb-2 transition-colors" style={{ color: 'hsl(217, 85%, 31%)' }}>
                    {course.title}
                  </h3>
                  <p className="text-sm line-clamp-2 mb-4" style={{ color: 'hsl(215, 20%, 45%)' }}>{course.description}</p>

                  <div className="flex items-center gap-4 text-sm" style={{ color: 'hsl(215, 20%, 55%)' }}>
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
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid hsl(210, 40%, 92%)' }}>
                      <p className="text-sm font-medium flex items-center gap-2" style={{ color: 'hsl(215, 20%, 45%)' }}>
                        <Crown className="w-4 h-4" style={{ color: 'hsl(43, 47%, 50%)' }} />
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
