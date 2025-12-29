import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { BookOpen, Award, TrendingUp, Target, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const { user, userProfile, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedLessons: 0,
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    badges: 0
  });
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const [xpData, progressData, coursesData, badgesData] = await Promise.all([
        supabase.from('user_xp').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_progress').select('*').eq('user_id', user.id).eq('completed', true),
        supabase.from('courses').select('*, categories(name)').limit(6),
        supabase.from('user_badges').select('id').eq('user_id', user.id)
      ]);

      setStats({
        totalCourses: 87,
        completedLessons: progressData.data?.length || 0,
        totalXP: xpData.data?.total_xp || 0,
        level: xpData.data?.level || 1,
        currentStreak: xpData.data?.current_streak || 0,
        badges: badgesData.data?.length || 0
      });

      setRecentCourses(coursesData.data || []);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (stats.completedLessons / stats.totalCourses) * 100;

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
              <Link to="/courses" className="font-medium transition-colors" style={{ color: 'hsl(217, 85%, 31%)' }}>Courses</Link>
              <Link to="/certificates" className="font-medium transition-colors" style={{ color: 'hsl(217, 85%, 31%)' }}>Certificates</Link>
              <button onClick={signOut} className="flex items-center font-medium transition-colors" style={{ color: 'hsl(217, 85%, 31%)' }}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>
            Welcome back, {userProfile?.profile_data?.full_name || 'Learner'}!
          </h1>
          <p className="text-xl" style={{ color: 'hsl(215, 20%, 45%)' }}>Continue your credit repair journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(210, 40%, 96%)' }}>
                <BookOpen className="w-6 h-6" style={{ color: 'hsl(217, 85%, 31%)' }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>{stats.completedLessons}</span>
            </div>
            <p className="font-medium" style={{ color: 'hsl(217, 85%, 31%)' }}>Lessons Completed</p>
            <p className="text-sm" style={{ color: 'hsl(215, 20%, 55%)' }}>of {stats.totalCourses} total</p>
          </div>

          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsla(43, 47%, 60%, 0.2)' }}>
                <TrendingUp className="w-6 h-6" style={{ color: 'hsl(43, 47%, 50%)' }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>{stats.totalXP}</span>
            </div>
            <p className="font-medium" style={{ color: 'hsl(217, 85%, 31%)' }}>Total XP</p>
            <p className="text-sm" style={{ color: 'hsl(215, 20%, 55%)' }}>Level {stats.level}</p>
          </div>

          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(210, 40%, 96%)' }}>
                <Target className="w-6 h-6" style={{ color: 'hsl(217, 85%, 31%)' }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>{stats.currentStreak}</span>
            </div>
            <p className="font-medium" style={{ color: 'hsl(217, 85%, 31%)' }}>Day Streak</p>
            <p className="text-sm" style={{ color: 'hsl(215, 20%, 55%)' }}>Keep it going!</p>
          </div>

          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsla(43, 47%, 60%, 0.2)' }}>
                <Award className="w-6 h-6" style={{ color: 'hsl(43, 47%, 50%)' }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>{stats.badges}</span>
            </div>
            <p className="font-medium" style={{ color: 'hsl(217, 85%, 31%)' }}>Badges Earned</p>
            <p className="text-sm" style={{ color: 'hsl(215, 20%, 55%)' }}>22 available</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="p-8 rounded-lg shadow-md mb-12" style={{ backgroundColor: '#ffffff' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>Overall Progress</h2>
            <span className="text-lg font-semibold" style={{ color: 'hsl(43, 47%, 50%)' }}>{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full rounded-full h-4" style={{ backgroundColor: 'hsl(210, 40%, 92%)' }}>
            <div
              className="h-4 rounded-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
                background: 'linear-gradient(to right, hsl(217, 85%, 31%), hsl(43, 47%, 60%))'
              }}
            />
          </div>
        </div>

        {/* Course Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>Continue Learning</h2>
            <Link to="/courses" className="font-semibold hover:underline" style={{ color: 'hsl(43, 47%, 50%)' }}>
              View All Courses
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses`}
                className="p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                style={{ backgroundColor: '#ffffff' }}
              >
                <div className="mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'hsl(43, 47%, 50%)' }}>
                    {course.categories?.name}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>{course.title}</h3>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'hsl(215, 20%, 45%)' }}>{course.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'hsl(215, 20%, 55%)' }}>{course.duration_minutes} min</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'hsl(210, 40%, 96%)', color: 'hsl(217, 85%, 31%)' }}>
                    {course.difficulty_level}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
