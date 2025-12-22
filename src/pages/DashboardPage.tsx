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
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex justify-between items-center h-18">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-primary-900">Credit Repair University</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/courses" className="text-neutral-700 hover:text-primary-700 font-medium">Courses</Link>
              <Link to="/certificates" className="text-neutral-700 hover:text-primary-700 font-medium">Certificates</Link>
              <button onClick={signOut} className="flex items-center text-neutral-700 hover:text-primary-700 font-medium">
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
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Welcome back, {userProfile?.profile_data?.full_name || 'Learner'}!
          </h1>
          <p className="text-xl text-neutral-700">Continue your credit repair journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-700" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{stats.completedLessons}</span>
            </div>
            <p className="text-neutral-700 font-medium">Lessons Completed</p>
            <p className="text-neutral-500 text-sm">of {stats.totalCourses} total</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success-700" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{stats.totalXP}</span>
            </div>
            <p className="text-neutral-700 font-medium">Total XP</p>
            <p className="text-neutral-500 text-sm">Level {stats.level}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-700" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{stats.currentStreak}</span>
            </div>
            <p className="text-neutral-700 font-medium">Day Streak</p>
            <p className="text-neutral-500 text-sm">Keep it going!</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-success-700" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{stats.badges}</span>
            </div>
            <p className="text-neutral-700 font-medium">Badges Earned</p>
            <p className="text-neutral-500 text-sm">22 available</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-8 rounded-lg shadow-card mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-neutral-900">Overall Progress</h2>
            <span className="text-lg font-semibold text-primary-700">{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-4">
            <div
              className="h-4 rounded-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
                background: progressPercentage === 100
                  ? '#15803d'
                  : 'linear-gradient(to right, #3b82f6, #22c55e)'
              }}
            />
          </div>
        </div>

        {/* Course Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Continue Learning</h2>
            <Link to="/courses" className="text-primary-700 font-semibold hover:text-primary-900">
              View All Courses
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses`}
                className="bg-white p-6 rounded-lg shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1"
              >
                <div className="mb-3">
                  <span className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
                    {course.categories?.name}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{course.title}</h3>
                <p className="text-neutral-700 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">{course.duration_minutes} min</span>
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
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
