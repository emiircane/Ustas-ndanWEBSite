import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { LogIn, Database, AlertCircle, X, Key } from 'lucide-react';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../utils/auth';

function AdminGiris() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Admin bilgilerini otomatik doldurma
  const fillAdminCredentials = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASSWORD);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Check if user exists in kullanicilar table
      let { data: userData, error: userError } = await supabase
        .from('kullanicilar')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError && userError.code === 'PGRST116') {
        // User not found in kullanicilar table, add them
        const { error: insertError } = await supabase
          .from('kullanicilar')
          .insert([
            { 
              id: data.user.id, 
              email: data.user.email,
              admin: true  // Use admin boolean field instead of role string
            }
          ]);
          
        if (insertError) throw insertError;
        
        // Fetch the user data again
        const { data: newUserData, error: newUserError } = await supabase
          .from('kullanicilar')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (newUserError) throw newUserError;
        userData = newUserData;
      } else if (userError) {
        throw userError;
      }

      // Check if user has admin privileges
      if (!userData.admin) {
        throw new Error('Yönetici yetkileriniz bulunmamaktadır.');
      }

      // Store admin info in localStorage
      localStorage.setItem('admin', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        admin: userData.admin
      }));

      // Navigate to admin dashboard
      navigate('/admin/panel');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Top section with background gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-8 px-6 relative">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-yellow-400 via-orange-300 to-red-400"></div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:rotate-6 duration-300">
              <Database className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">Yönetici Girişi</h2>
          <p className="mt-2 text-center text-sm text-orange-100">
            Yönetici paneline erişmek için giriş yapın
          </p>
        </div>

        {/* Form section */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-red-700">{error}</p>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setError(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                E-posta Adresi
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LogIn className="h-5 w-5 text-orange-300 group-hover:text-orange-200" aria-hidden="true" />
                </span>
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Giriş Yapılıyor...
                  </>
                ) : 'Giriş Yap'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <a href="/" className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors">
              Ana Sayfaya Dön
            </a>
          </div>
          
          {/* Admin Hızlı Giriş Düğmesi */}
          <div className="mt-4 text-center">
            <button 
              onClick={fillAdminCredentials}
              className="inline-flex items-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
            >
              <Key className="h-3 w-3 mr-1" />
              Admin Bilgilerini Doldur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminGiris; 