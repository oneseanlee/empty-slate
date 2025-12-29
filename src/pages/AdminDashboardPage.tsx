import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Users, BookOpen, DollarSign, TrendingUp, LogOut } from 'lucide-react';

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
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(210, 40%, 98%)' }}>
      {/* Navigation */}
      <nav className="shadow-sm sticky top-0 z-50" style={{ backgroundColor: '#ffffff', borderBottom: '1px solid hsl(210, 40%, 96%)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex justify-between items-center h-18 py-3">
            <Link to="/admin" className="flex items-center">
              <img src="/cru_logo.png" alt="Credit Repair University" className="h-14 object-contain" />
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/dashboard" className="font-medium transition-colors" style={{ color: 'hsl(217, 85%, 31%)' }}>Dashboard</Link>
              <Link to="/courses" className="font-medium transition-colors" style={{ color: 'hsl(217, 85%, 31%)' }}>Courses</Link>
              <button onClick={signOut} className="flex items-center font-medium transition-colors" style={{ color: 'hsl(217, 85%, 31%)' }}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>Reseller Dashboard</h1>
          <p className="text-xl" style={{ color: 'hsl(215, 20%, 45%)' }}>Manage your organization and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(210, 40%, 96%)' }}>
                <Users className="w-6 h-6" style={{ color: 'hsl(217, 85%, 31%)' }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>{stats.totalUsers}</span>
            </div>
            <p className="font-medium" style={{ color: 'hsl(217, 85%, 31%)' }}>Total Users</p>
            <p className="text-sm" style={{ color: 'hsl(215, 20%, 55%)' }}>Active learners</p>
          </div>

          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsla(43, 47%, 60%, 0.2)' }}>
                <DollarSign className="w-6 h-6" style={{ color: 'hsl(43, 47%, 50%)' }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>${stats.totalRevenue}</span>
            </div>
            <p className="font-medium" style={{ color: 'hsl(217, 85%, 31%)' }}>Revenue</p>
            <p className="text-sm" style={{ color: 'hsl(215, 20%, 55%)' }}>This month</p>
          </div>

          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(210, 40%, 96%)' }}>
                <BookOpen className="w-6 h-6" style={{ color: 'hsl(217, 85%, 31%)' }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>{stats.activeSubs}</span>
            </div>
            <p className="font-medium" style={{ color: 'hsl(217, 85%, 31%)' }}>Active Subscriptions</p>
            <p className="text-sm" style={{ color: 'hsl(215, 20%, 55%)' }}>Current period</p>
          </div>

          <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: '#ffffff' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsla(43, 47%, 60%, 0.2)' }}>
                <TrendingUp className="w-6 h-6" style={{ color: 'hsl(43, 47%, 50%)' }} />
              </div>
              <span className="text-2xl font-bold" style={{ color: 'hsl(217, 85%, 31%)' }}>{stats.completionRate}%</span>
            </div>
            <p className="font-medium" style={{ color: 'hsl(217, 85%, 31%)' }}>Avg Completion</p>
            <p className="text-sm" style={{ color: 'hsl(215, 20%, 55%)' }}>Course completion rate</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-lg shadow-md p-8" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'hsl(217, 85%, 31%)' }}>Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '2px solid hsl(210, 40%, 92%)' }}>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'hsl(217, 85%, 31%)' }}>Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'hsl(217, 85%, 31%)' }}>Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'hsl(217, 85%, 31%)' }}>Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'hsl(217, 85%, 31%)' }}>Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'hsl(217, 85%, 31%)' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid hsl(210, 40%, 96%)' }}>
                    <td className="py-3 px-4 text-sm" style={{ color: 'hsl(217, 85%, 31%)' }}>
                      {user.profile_data?.full_name || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'hsl(215, 20%, 45%)' }}>{user.email}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-2 py-1 rounded text-xs font-medium capitalize" style={{ backgroundColor: 'hsl(210, 40%, 96%)', color: 'hsl(217, 85%, 31%)' }}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={user.is_active 
                          ? { backgroundColor: 'hsla(43, 47%, 60%, 0.2)', color: 'hsl(43, 47%, 45%)' }
                          : { backgroundColor: 'hsl(210, 40%, 96%)', color: 'hsl(215, 20%, 55%)' }
                        }
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'hsl(215, 20%, 55%)' }}>
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
