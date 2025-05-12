import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import AnaSayfa from "./pages/AnaSayfa";
import DetaySayfasi from "./pages/DetaySayfasi";
import AyarlarSayfasi from "./pages/AyarlarSayfasi";
import KategoriSonucSayfasi from "./pages/KategoriSonucSayfasi";
import IlanlarimSayfasi from "./pages/IlanlarimSayfasi";
import GirisSayfasi from "./pages/GirisSayfasi";
import KayitOlSayfasi from "./pages/KayitOlSayfasi";
import IlanOlustur from "./pages/IlanOlustur";
import { Plus, Menu, X, Settings, LogOut, Home, Wrench, Bell, TrendingUp, Award } from "lucide-react"; // Modern ikonlar için
import { supabase } from "./supabase";

function App() {
  const [menuAcik, setMenuAcik] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [kullanici, setKullanici] = useState(null);
  const menuRef = useRef();

  // İstatistik verileri
  const statsData = [
    { icon: <TrendingUp size={18} />, title: "Toplam Hizmet", value: "1,250+" },
    { icon: <Award size={18} />, title: "Memnun Müşteri", value: "10,000+" }
  ];

  // Kullanıcı bilgisini localStorage'dan al
  useEffect(() => {
    const veri = localStorage.getItem("kullanici");
    if (veri) {
      try {
        const kullaniciData = JSON.parse(veri);
        setKullanici(kullaniciData);
      } catch (error) {
        console.error("Kullanıcı verisi işlenirken hata oluştu:", error);
        localStorage.removeItem("kullanici");
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAcik(false);
      }
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Remove dark mode from document and localStorage on load
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem('darkMode');
  }, []);

  // Kullanıcı çıkış fonksiyonu
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.removeItem("kullanici");
      setKullanici(null);
      setMenuAcik(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error.message);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-orange-50 text-gray-900 transition-colors duration-300">
        <header className={`sticky top-0 z-50 ${isScrolled ? 'bg-white/95' : 'bg-white/80'} backdrop-blur-md shadow-sm transition-all duration-300 border-b border-gray-100`}>
          <div className="container mx-auto">
            {/* Top header section with gradient accent */}
            <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500"></div>
            
            {/* Main navigation */}
            <nav className="flex flex-col md:flex-row justify-between items-center py-3 px-4">
              <div className="flex items-center justify-between w-full md:w-auto">
                {/* Logo area with animation */}
                <Link to="/" className="group flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-orange-300/50 transition-all duration-300">
                    <Wrench className="w-6 h-6 text-white transform group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent tracking-tight">
                    Ustasından
                  </span>
                </Link>
                
                {/* Mobile menu trigger */}
                <button 
                  className="md:hidden p-2 rounded-full bg-gray-100 text-gray-700"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
              
              {/* İstatistik Bilgi Alanı - Yan Yana */}
              <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex mt-4 md:mt-0 w-full md:w-auto max-w-md mx-auto md:mx-0`}>
                <div className="relative bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 rounded-full border border-orange-200 shadow-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10"></div>
                  <div className="relative flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-orange-600">
                        {statsData[0].icon}
                      </span>
                      <div className="text-xs md:text-sm">
                        <span className="font-semibold text-orange-600">{statsData[0].value}</span>
                        <span className="text-gray-600"> {statsData[0].title}</span>
                      </div>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="flex items-center space-x-1">
                      <span className="text-orange-600">
                        {statsData[1].icon}
                      </span>
                      <div className="text-xs md:text-sm">
                        <span className="font-semibold text-orange-600">{statsData[1].value}</span>
                        <span className="text-gray-600"> {statsData[1].title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions area */}
              <div className={`${mobileMenuOpen ? 'flex flex-col items-center' : 'hidden'} md:flex md:flex-row items-center gap-3 mt-4 md:mt-0 w-full md:w-auto`}>
                {/* Navigation links for mobile */}
                <div className="md:hidden flex flex-col items-center space-y-4 w-full mb-4">
                  <Link to="/" className="flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-orange-100 w-full">
                    <Home size={18} />
                    <span>Ana Sayfa</span>
                  </Link>
                </div>
                
                {/* Create post button */}
                <Link
                  to="/ilan-olustur"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-orange-400/20 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Plus size={20} className="animate-pulse" /> İlan Oluştur
                </Link>
                
                {/* Notifications button (hidden when not logged in) */}
                {kullanici && (
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
                  </button>
                )}
                
                {/* User menu */}
                {kullanici ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      className="flex items-center space-x-1 p-1 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors"
                      onClick={() => setMenuAcik(!menuAcik)}
                    >
                      <img
                        src="https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
                        alt="profil"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="hidden md:block text-sm font-medium">Profil</span>
                    </button>
                    
                    {menuAcik && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-100 shadow-lg overflow-hidden z-50 transform transition-all duration-200 origin-top-right">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm text-gray-500">Hoş geldiniz</p>
                          <p className="text-sm font-semibold">{kullanici.ad || "Kullanıcı"}</p>
                        </div>
                        <div className="py-1">
                          <Link to="/ayarlar" className="flex items-center px-4 py-2 text-sm hover:bg-orange-50 text-gray-700">
                            <Settings size={16} className="mr-2" />
                            Profili Düzenle
                          </Link>
                          <Link to="/ilanlar" className="flex items-center px-4 py-2 text-sm hover:bg-orange-50 text-gray-700">
                            <Wrench size={16} className="mr-2" />
                            İlanlarım
                          </Link>
                          <button 
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={handleLogout}
                          >
                            <LogOut size={16} className="mr-2" />
                            Çıkış Yap
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/giris"
                    className="flex items-center space-x-1 p-1 px-3 rounded-full border border-orange-200 bg-orange-50 hover:bg-orange-100 transition-colors"
                  >
                    <span className="text-sm font-medium text-orange-600">Giriş Yap</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<AnaSayfa />} />
          <Route path="/giris" element={<GirisSayfasi />} />
          <Route path="/kayit" element={<KayitOlSayfasi />} />
          <Route path="/ilan/:id" element={<DetaySayfasi />} />
          <Route path="/ilanlar" element={<IlanlarimSayfasi />} />
          <Route path="/ayarlar" element={<AyarlarSayfasi />} />
          <Route path="/kategori/:kategori" element={<KategoriSonucSayfasi />} />
          <Route path="/ilan-olustur" element={<IlanOlustur />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
