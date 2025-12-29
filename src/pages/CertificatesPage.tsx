import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Award, Download, Share2, ExternalLink, LogOut } from 'lucide-react';

export default function CertificatesPage() {
  const { user, signOut } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [availableCerts, setAvailableCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadCertificates();
  }, [user]);

  const loadCertificates = async () => {
    const { data } = await supabase
      .from('certificates')
      .select('*, categories(name)')
      .eq('user_id', user!.id)
      .order('issued_at', { ascending: false });

    setCertificates(data || []);

    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('display_order');

    setAvailableCerts(categories || []);
    setLoading(false);
  };

  const earnedCategoryIds = certificates
    .filter(c => c.certificate_type === 'category')
    .map(c => c.category_id);

  const hasMasterCertificate = certificates.some(c => c.certificate_type === 'master');

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
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'hsl(217, 85%, 31%)' }}>Your Certificates</h1>
          <p className="text-xl" style={{ color: 'hsl(215, 20%, 45%)' }}>
            Earn certificates by completing all courses in each category
          </p>
        </div>

        {/* Earned Certificates */}
        {certificates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'hsl(217, 85%, 31%)' }}>Earned Certificates</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div key={cert.id} className="p-6 rounded-lg shadow-md hover:shadow-lg transition-all" style={{ backgroundColor: '#ffffff' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsla(43, 47%, 60%, 0.2)' }}>
                      <Award className="w-6 h-6" style={{ color: 'hsl(43, 47%, 50%)' }} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'hsla(43, 47%, 60%, 0.2)', color: 'hsl(43, 47%, 45%)' }}>
                      {cert.certificate_type === 'master' ? 'Master' : 'Category'}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>
                    {cert.certificate_type === 'master'
                      ? 'Master Credit Repair Certificate'
                      : `${cert.categories?.name} Certificate`}
                  </h3>

                  <p className="text-sm mb-4" style={{ color: 'hsl(215, 20%, 45%)' }}>
                    Issued: {new Date(cert.issued_at).toLocaleDateString()}
                  </p>

                  <p className="text-xs mb-4 font-mono" style={{ color: 'hsl(215, 20%, 55%)' }}>
                    Verification: {cert.verification_code}
                  </p>

                  <div className="flex gap-2">
                    <button 
                      className="flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium text-sm transition-all"
                      style={{ backgroundColor: 'hsl(43, 47%, 60%)', color: 'hsl(217, 85%, 15%)' }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg transition-all"
                      style={{ border: '2px solid hsl(210, 40%, 85%)', color: 'hsl(217, 85%, 31%)' }}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Certificates */}
        <div>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'hsl(217, 85%, 31%)' }}>Available Certificates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Master Certificate */}
            <div 
              className="p-6 rounded-lg"
              style={{ 
                backgroundColor: '#ffffff',
                border: hasMasterCertificate ? '2px solid hsl(43, 47%, 60%)' : '2px solid hsl(210, 40%, 90%)'
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(210, 40%, 96%)' }}>
                  <Award className="w-6 h-6" style={{ color: 'hsl(217, 85%, 31%)' }} />
                </div>
                {hasMasterCertificate && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'hsla(43, 47%, 60%, 0.2)', color: 'hsl(43, 47%, 45%)' }}>
                    Earned
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>
                Master Certificate
              </h3>
              <p className="text-sm mb-4" style={{ color: 'hsl(215, 20%, 45%)' }}>
                Complete all 87 courses across all 12 categories
              </p>
              <div className="w-full rounded-full h-2" style={{ backgroundColor: 'hsl(210, 40%, 92%)' }}>
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ 
                    width: `${(earnedCategoryIds.length / 12) * 100}%`,
                    background: 'linear-gradient(to right, hsl(217, 85%, 31%), hsl(43, 47%, 60%))'
                  }}
                />
              </div>
              <p className="text-xs mt-2" style={{ color: 'hsl(215, 20%, 55%)' }}>
                {earnedCategoryIds.length}/12 categories completed
              </p>
            </div>

            {/* Category Certificates */}
            {availableCerts.map((category) => {
              const isEarned = earnedCategoryIds.includes(category.id);
              return (
                <div
                  key={category.id}
                  className="p-6 rounded-lg"
                  style={{ 
                    backgroundColor: '#ffffff',
                    border: isEarned ? '2px solid hsl(43, 47%, 60%)' : '2px solid hsl(210, 40%, 90%)'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(210, 40%, 96%)' }}>
                      <Award className="w-6 h-6" style={{ color: 'hsl(215, 20%, 55%)' }} />
                    </div>
                    {isEarned && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'hsla(43, 47%, 60%, 0.2)', color: 'hsl(43, 47%, 45%)' }}>
                        Earned
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>
                    {category.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'hsl(215, 20%, 45%)' }}>
                    Complete all courses in this category
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Public Verification Link */}
        <div className="mt-12 p-6 rounded-lg" style={{ backgroundColor: 'hsl(210, 40%, 96%)', border: '1px solid hsl(210, 40%, 90%)' }}>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(217, 85%, 31%)' }}>Certificate Verification</h3>
          <p className="mb-4" style={{ color: 'hsl(215, 20%, 45%)' }}>
            All certificates can be publicly verified using the verification code.
          </p>
          <a
            href="/verify"
            className="inline-flex items-center font-semibold"
            style={{ color: 'hsl(43, 47%, 50%)' }}
          >
            Verify a Certificate
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}
