import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Users, FileText, ShoppingBag, Wrench, TrendingUp, Clock } from 'lucide-react';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    todayUsers: 0,
    todayListings: 0,
    recentUsers: [],
    recentListings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get total users count
        const { count: totalUsers, error: usersError } = await supabase
          .from('kullanicilar')
          .select('*', { count: 'exact', head: true });
          
        if (usersError) throw usersError;
        
        // Get total listings count
        const { count: totalListings, error: listingsError } = await supabase
          .from('ilanlar')
          .select('*', { count: 'exact', head: true });
          
        if (listingsError) throw listingsError;
        
        // Get today's new users
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { count: todayUsers, error: todayUsersError } = await supabase
          .from('kullanicilar')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());
          
        if (todayUsersError) throw todayUsersError;
        
        // Get today's new listings
        const { count: todayListings, error: todayListingsError } = await supabase
          .from('ilanlar')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());
          
        if (todayListingsError) throw todayListingsError;
        
        // Get recent users
        const { data: recentUsers, error: recentUsersError } = await supabase
          .from('kullanicilar')
          .select('id, ad, email, created_at')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentUsersError) throw recentUsersError;
        
        // Get recent listings
        const { data: recentListings, error: recentListingsError } = await supabase
          .from('ilanlar')
          .select('id, baslik, created_at, kullanici_id')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (recentListingsError) throw recentListingsError;
        
        setStats({
          totalUsers: totalUsers || 0,
          totalListings: totalListings || 0,
          todayUsers: todayUsers || 0,
          todayListings: todayListings || 0,
          recentUsers: recentUsers || [],
          recentListings: recentListings || []
        });
      } catch (error) {
        console.error('Kontrol paneli verisi alınırken hata:', error);
        setError('Veri alınırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Toplam Kullanıcı</p>
              <p className="text-2xl font-bold mt-1">{stats.totalUsers}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-600">
            <TrendingUp size={14} className="mr-1" />
            <span>Bugün {stats.todayUsers} yeni</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Toplam İlan</p>
              <p className="text-2xl font-bold mt-1">{stats.totalListings}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-50 text-orange-600">
              <FileText size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-600">
            <TrendingUp size={14} className="mr-1" />
            <span>Bugün {stats.todayListings} yeni</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Kategori Sayısı</p>
              <p className="text-2xl font-bold mt-1">34</p> {/* Örnek sabit değer */}
            </div>
            <div className="p-3 rounded-full bg-purple-50 text-purple-600">
              <ShoppingBag size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <span>En popüler: Tadilat</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Toplam Hizmet</p>
              <p className="text-2xl font-bold mt-1">1,250+</p> {/* Örnek sabit değer */}
            </div>
            <div className="p-3 rounded-full bg-teal-50 text-teal-600">
              <Wrench size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-gray-500">
            <Clock size={14} className="mr-1" />
            <span>Tüm zamanlar</span>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Son Kaydolan Kullanıcılar</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user) => (
                <div key={user.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.ad || 'İsimsiz Kullanıcı'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(user.created_at)}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-gray-500">
                Henüz kullanıcı bulunmamaktadır.
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Listings */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Son Eklenen İlanlar</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentListings.length > 0 ? (
              stats.recentListings.map((listing) => (
                <div key={listing.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{listing.baslik}</p>
                    <p className="text-sm text-gray-500">Kullanıcı ID: {listing.kullanici_id}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(listing.created_at)}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-gray-500">
                Henüz ilan bulunmamaktadır.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 