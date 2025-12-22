import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Users, BookOpen, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const { signOut, userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    activeSubs: 0,
    completionRate: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    const tenantId = userProfile?.tenant_id;
    if (!tenantId) return;

    const [usersData, subsData] = await Promise.all([
      supabase.from('users').select('*').eq('tenant_id', tenantId),
      supabase.from('subscriptions').select('*').eq('tenant_id', tenantId).eq('status', 'active')
    ]);

    setStats({
      totalUsers: usersData.data?.length || 0,
      totalRevenue: 0,
      activeSubs: subsData.data?.length || 0,
      completionRate: 0
    });

    setUsers(usersData.data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex justify-between items-center h-18">
            <Link to="/admin" className="flex items-center">
              <span className="text-2xl font-bold text-primary-900">Credit Repair University Admin</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="text-neutral-700 hover:text-primary-700 font-medium">Dashboard</Link>
              <Link to="/courses" className="text-neutral-700 hover:text-primary-700 font-medium">Courses</Link>
              <button onClick={signOut} className="text-neutral-700 hover:text-primary-700 font-medium">Sign Out</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">Reseller Dashboard</h1>
          <p className="text-xl text-neutral-700">Manage your organization and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-700" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{stats.totalUsers}</span>
            </div>
            <p className="text-neutral-700 font-medium">Total Users</p>
            <p className="text-neutral-500 text-sm">Active learners</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success-700" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">${stats.totalRevenue}</span>
            </div>
            <p className="text-neutral-700 font-medium">Revenue</p>
            <p className="text-neutral-500 text-sm">This month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-700" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{stats.activeSubs}</span>
            </div>
            <p className="text-neutral-700 font-medium">Active Subscriptions</p>
            <p className="text-neutral-500 text-sm">Current period</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success-700" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{stats.completionRate}%</span>
            </div>
            <p className="text-neutral-700 font-medium">Avg Completion</p>
            <p className="text-neutral-500 text-sm">Course completion rate</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user) => (
                  <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4 text-sm text-neutral-900">
                      {user.profile_data?.full_name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-700">{user.email}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${user.is_active
                          ? 'bg-success-50 text-success-700'
                          : 'bg-neutral-100 text-neutral-600'
                        }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
