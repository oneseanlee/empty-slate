import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Award, Download, Share2, ExternalLink } from 'lucide-react';

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
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex justify-between items-center h-18">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-primary-900">Credit Repair University</span>
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
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Your Certificates</h1>
          <p className="text-xl text-neutral-700">
            Earn certificates by completing all courses in each category
          </p>
        </div>

        {/* Earned Certificates */}
        {certificates.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Earned Certificates</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-white p-6 rounded-lg shadow-card hover:shadow-card-hover transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-success-700" />
                    </div>
                    <span className="px-3 py-1 bg-success-50 text-success-700 rounded-full text-xs font-medium">
                      {cert.certificate_type === 'master' ? 'Master' : 'Category'}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {cert.certificate_type === 'master'
                      ? 'Master Credit Repair Certificate'
                      : `${cert.categories?.name} Certificate`}
                  </h3>

                  <p className="text-sm text-neutral-600 mb-4">
                    Issued: {new Date(cert.issued_at).toLocaleDateString()}
                  </p>

                  <p className="text-xs text-neutral-500 mb-4 font-mono">
                    Verification: {cert.verification_code}
                  </p>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-900 transition-all text-sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                    <button className="px-4 py-2 border-2 border-neutral-300 text-neutral-700 rounded-lg hover:border-primary-500 transition-all">
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
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Available Certificates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Master Certificate */}
            <div className={`bg-white p-6 rounded-lg border-2 ${hasMasterCertificate
                ? 'border-success-500'
                : 'border-neutral-200'
              }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary-700" />
                </div>
                {hasMasterCertificate && (
                  <span className="px-3 py-1 bg-success-50 text-success-700 rounded-full text-xs font-medium">
                    Earned
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Master Certificate
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Complete all 87 courses across all 12 categories
              </p>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-primary-500 to-success-500 rounded-full transition-all"
                  style={{ width: `${(earnedCategoryIds.length / 12) * 100}%` }}
                />
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                {earnedCategoryIds.length}/12 categories completed
              </p>
            </div>

            {/* Category Certificates */}
            {availableCerts.map((category) => {
              const isEarned = earnedCategoryIds.includes(category.id);
              return (
                <div
                  key={category.id}
                  className={`bg-white p-6 rounded-lg border-2 ${isEarned
                      ? 'border-success-500'
                      : 'border-neutral-200'
                    }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-neutral-500" />
                    </div>
                    {isEarned && (
                      <span className="px-3 py-1 bg-success-50 text-success-700 rounded-full text-xs font-medium">
                        Earned
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Complete all courses in this category
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Public Verification Link */}
        <div className="mt-12 bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Certificate Verification</h3>
          <p className="text-neutral-700 mb-4">
            All certificates can be publicly verified using the verification code.
          </p>
          <a
            href="/verify"
            className="inline-flex items-center text-primary-700 font-semibold hover:text-primary-900"
          >
            Verify a Certificate
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
}
