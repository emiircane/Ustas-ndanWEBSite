import { useState, useEffect } from 'react';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import { supabase } from '../supabase';
import { Users, FileText, Settings, LogOut, Home, Database, UserCog, PlusCircle } from 'lucide-react';
import AdminKullanicilar from './admin/AdminKullanicilar';
import AdminIlanlar from './admin/AdminIlanlar';
import AdminAyarlar from './admin/AdminAyarlar';
import AdminDashboard from './admin/AdminDashboard';

function AdminPanel() {
  const [admin, setAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin');
    
    if (!adminData) {
      navigate('/admin');
      return;
    }
    
    try {
      const parsedAdmin = JSON.parse(adminData);
      
      if (!parsedAdmin.admin) {
        // Not an admin, redirect to login
        localStorage.removeItem('admin');
        navigate('/admin');
        return;
      }
      
      setAdmin(parsedAdmin);
    } catch (error) {
      console.error('Admin verisi işlenirken hata oluştu:', error);
      localStorage.removeItem('admin');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('admin');
      navigate('/admin');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!admin) {
    return null; // Navigate will handle redirect
  }

  return (
    <div className="bg-gray-100 min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-white w-64 shadow-lg flex flex-col">
        <div className="p-5 border-b">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-md">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">Yönetim</span>
          </Link>
        </div>
        
        <nav className="flex-grow py-5 overflow-y-auto">
          <div className="px-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Ana Menü
          </div>
          <Link 
            to="/admin/panel" 
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 ${activeTab === 'dashboard' ? 'bg-orange-50 border-l-4 border-orange-500' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Home size={18} className={activeTab === 'dashboard' ? 'text-orange-500' : 'text-gray-500'} />
            <span className={`ml-3 ${activeTab === 'dashboard' ? 'text-orange-500 font-medium' : ''}`}>Kontrol Paneli</span>
          </Link>
          
          <Link
            to="/admin/panel/kullanicilar"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 ${activeTab === 'kullanicilar' ? 'bg-orange-50 border-l-4 border-orange-500' : ''}`}
            onClick={() => setActiveTab('kullanicilar')}
          >
            <Users size={18} className={activeTab === 'kullanicilar' ? 'text-orange-500' : 'text-gray-500'} />
            <span className={`ml-3 ${activeTab === 'kullanicilar' ? 'text-orange-500 font-medium' : ''}`}>Kullanıcılar</span>
          </Link>
          
          <Link
            to="/admin/panel/ilanlar"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 ${activeTab === 'ilanlar' ? 'bg-orange-50 border-l-4 border-orange-500' : ''}`}
            onClick={() => setActiveTab('ilanlar')}
          >
            <FileText size={18} className={activeTab === 'ilanlar' ? 'text-orange-500' : 'text-gray-500'} />
            <span className={`ml-3 ${activeTab === 'ilanlar' ? 'text-orange-500 font-medium' : ''}`}>İlanlar</span>
          </Link>
          
          <div className="px-4 pt-5 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Ayarlar
          </div>
          
          <Link
            to="/admin/panel/ayarlar"
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-orange-50 ${activeTab === 'ayarlar' ? 'bg-orange-50 border-l-4 border-orange-500' : ''}`}
            onClick={() => setActiveTab('ayarlar')}
          >
            <Settings size={18} className={activeTab === 'ayarlar' ? 'text-orange-500' : 'text-gray-500'} />
            <span className={`ml-3 ${activeTab === 'ayarlar' ? 'text-orange-500 font-medium' : ''}`}>Site Ayarları</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center mb-4">
            <UserCog size={20} className="text-gray-500" />
            <div className="ml-3">
              <p className="text-xs text-gray-500">Hoş geldiniz,</p>
              <p className="text-sm font-medium">{admin.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            Çıkış Yap
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeTab === 'dashboard' && 'Kontrol Paneli'}
              {activeTab === 'kullanicilar' && 'Kullanıcı Yönetimi'}
              {activeTab === 'ilanlar' && 'İlan Yönetimi'}
              {activeTab === 'ayarlar' && 'Site Ayarları'}
            </h1>
            <Link to="/" className="text-sm text-orange-600 hover:text-orange-800 flex items-center">
              <Home size={16} className="mr-1" />
              Siteye Dön
            </Link>
          </div>
        </header>

        <main className="p-6">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="kullanicilar" element={<AdminKullanicilar />} />
            <Route path="ilanlar" element={<AdminIlanlar />} />
            <Route path="ayarlar" element={<AdminAyarlar />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AdminPanel; 