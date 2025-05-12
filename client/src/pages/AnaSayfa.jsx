import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import {
  Plug,
  Wrench,
  Paintbrush,
  Hammer,
  Sparkles,
  Truck,
  Key,
  Thermometer,
  Zap,
  Search,
  ArrowRight
} from "lucide-react";
import { supabase } from "../supabase";

const isimListesi = [
  "Ahmet Yılmaz", "Mehmet Demir", "Ali Kaya", "Mustafa Çelik", "Hasan Şahin",
  "İbrahim Koç", "Osman Acar", "Yusuf Kaplan", "Ramazan Eren", "Kemal Özdemir",
  "Cemal Güneş", "Tolga Aksoy", "Hakan Yıldız", "Barış Tunç", "Serkan Arslan"
];

const kategoriIkon = {
  Elektrikçi: <Plug className="mx-auto mb-2 text-orange-600" size={32} />,
  Tesisatçı: <Wrench className="mx-auto mb-2 text-orange-600" size={32} />,
  Boyacı: <Paintbrush className="mx-auto mb-2 text-orange-600" size={32} />,
  Marangoz: <Hammer className="mx-auto mb-2 text-orange-600" size={32} />,
  Temizlikçi: <Sparkles className="mx-auto mb-2 text-orange-600" size={32} />,
  Nakliyeci: <Truck className="mx-auto mb-2 text-orange-600" size={32} />,
  Çilingir: <Key className="mx-auto mb-2 text-orange-600" size={32} />,
  "Kombi Servisi": <Thermometer className="mx-auto mb-2 text-orange-600" size={32} />
};

// Arama için örnek hizmet türleri
const ornekHizmetler = [
  "Tesisatçı",
  "Elektrikçi",
  "Boyacı",
  "Marangoz",
  "Nakliyeci",
  "Çilingir",
  "Kombi Tamircisi",
  "İnşaat Ustası",
  "Mobilyacı",
  "Tadilat Ustası",
  "Dekorasyon Uzmanı"
];

export default function AnaSayfa() {
  const sliderRef = useRef();
  const [searchText, setSearchText] = useState("");
  const [currentHizmetIndex, setCurrentHizmetIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [kategoriler, setKategoriler] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Veritabanından kategorileri çek
  useEffect(() => {
    async function fetchKategoriler() {
      try {
        const { data, error } = await supabase
          .from('kategoriler')
          .select('*')
          .order('isim', { ascending: true });
          
        if (error) throw error;
        
        setKategoriler(data || []);
      } catch (error) {
        console.error('Kategoriler çekilirken hata oluştu:', error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchKategoriler();
  }, []);
  
  // Yazı efekti için
  useEffect(() => {
    if (isTyping) {
      if (searchText.length < ornekHizmetler[currentHizmetIndex].length) {
        const timer = setTimeout(() => {
          setSearchText(ornekHizmetler[currentHizmetIndex].substring(0, searchText.length + 1));
        }, 150);
        return () => clearTimeout(timer);
      } else {
        setIsTyping(false);
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else {
      if (searchText.length > 0) {
        const timer = setTimeout(() => {
          setSearchText(searchText.substring(0, searchText.length - 1));
        }, 100);
        return () => clearTimeout(timer);
      } else {
        setCurrentHizmetIndex((currentHizmetIndex + 1) % ornekHizmetler.length);
        setIsTyping(true);
      }
    }
  }, [searchText, isTyping, currentHizmetIndex]);

  useEffect(() => {
    const slider = sliderRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      slider.classList.add("cursor-grabbing");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      window.location.href = `/kategori/${encodeURIComponent(searchQuery)}`;
    }
  };

  // KATEGORİLER bölümünü güncelleyelim
  const renderKategoriBolumu = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {kategoriler.map((kategori) => (
          <Link
            key={kategori.id}
            to={`/kategori/${encodeURIComponent(kategori.isim)}`}
            className="bg-white hover:bg-orange-50 shadow-md hover:shadow-lg rounded-xl p-4 transition-all text-center transform hover:-translate-y-1 duration-300 flex flex-col items-center"
          >
            {kategoriIkon[kategori.isim] || <Zap className="mx-auto mb-2 text-orange-600" size={32} />}
            <span className="text-gray-800 font-medium">{kategori.isim}</span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Solid background instead of gradient */}
        <div className="absolute inset-0 -z-10 bg-white"></div>
        
        {/* Decorative elements - subtle and consistent */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-orange-200/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 mb-4 drop-shadow-sm">
              Usta mı lazım?
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 md:mb-10">
              Hemen kategorini seç, profesyonel ustaları bul!
            </p>
            
            {/* Arama formu */}
            <div className="relative max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="group">
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400">
                    <Search size={20} />
                  </div>
                  
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Örn: ${searchText}${isTyping ? '|' : ''}`}
                    className="pl-12 pr-20 py-4 md:py-5 w-full bg-white border-2 border-gray-200 rounded-full shadow-lg focus:shadow-orange-200 focus:outline-none focus:border-orange-400 transition-all duration-300"
                  />
                  
                  <button 
                    type="submit" 
                    className="absolute right-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium py-2 px-4 md:px-6 rounded-full transition-all duration-200 flex items-center space-x-1 group-focus-within:scale-95"
                  >
                    <span className="hidden md:inline">Ara</span>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
              
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Tesisatçı', 'Elektrikçi', 'Boyacı', 'Marangoz'].map((tag) => (
                  <Link 
                    key={tag} 
                    to={`/kategori/${encodeURIComponent(tag)}`}
                    className="text-xs md:text-sm bg-white/80 hover:bg-orange-100 text-gray-600 hover:text-orange-600 px-3 py-1 rounded-full border border-gray-200 transition-colors duration-200"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Updated Featured badge - more modern and subtle */}
            <div className="absolute -right-2 md:right-0 top-0 bg-white border border-orange-200 shadow-sm text-xs md:text-sm px-4 py-1.5 rounded-full font-medium transform rotate-2 transition-transform hover:rotate-0 duration-300">
              <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent font-semibold">200+ Uzman Usta</span>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="py-16 px-6 flex justify-center relative overflow-hidden">
        {/* No background decoration - using parent bg-white */}
        
        {/* Decorative elements - subtle and consistent with hero */}
        <div className="absolute -top-24 right-0 w-64 h-64 bg-orange-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-200/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-5xl w-full relative z-10">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-orange-100/80 backdrop-blur-sm px-4 py-1.5 rounded-full mb-3">
              <span className="text-orange-600 font-medium text-sm">En Çok Tercih Edilenler</span>
            </div>
            <h3 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
              Popüler Kategoriler
            </h3>
            <p className="text-gray-500 text-center max-w-lg">
              Aradığınız hizmeti sunan binlerce uzman ustadan teklif alın
            </p>
          </div>
          
          {/* Staggered grid layout */}
          {renderKategoriBolumu()}
          
          <div className="flex justify-center mt-16">
            <Link to="/kategoriler" className="bg-white/80 backdrop-blur-sm hover:bg-white text-orange-600 hover:text-orange-700 font-medium py-2.5 px-6 rounded-full border border-orange-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2 group">
              <span>Tüm Kategorileri Görüntüle</span>
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* HİZMET VERENLER - MODERNİZE EDİLMİŞ */}
      <section className="py-16 px-6 relative overflow-hidden">
        {/* Softer background with very subtle pattern */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-orange-50/30"></div>
        
        {/* Decorative elements - softer and more subtle */}
        <div className="absolute -bottom-24 right-0 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-24 w-80 h-80 bg-orange-100/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <div className="bg-orange-50 px-4 py-1.5 rounded-full mb-3 shadow-sm border border-orange-100/50">
              <span className="text-orange-500 font-medium text-sm">Uzmanlarla Tanışın</span>
            </div>
            
            <h3 className="text-3xl font-bold mb-2 text-center text-gray-700">
              Öne Çıkan Hizmet Verenler
            </h3>
            
            <p className="text-gray-500 text-center max-w-lg mb-3">
              Yüksek puanlı ve deneyimli uzmanlar işinizi profesyonelce yapar
            </p>
            
            {/* Navigation controls for cards - softer design */}
            <div className="flex items-center gap-3 mt-2">
              <button 
                onClick={() => {
                  if (sliderRef.current) {
                    sliderRef.current.scrollLeft -= 340;
                  }
                }}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-orange-50 transition-all"
                aria-label="Önceki"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              
              <button 
                onClick={() => {
                  if (sliderRef.current) {
                    sliderRef.current.scrollLeft += 340;
                  }
                }}
                className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-orange-50 transition-all"
                aria-label="Sonraki"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Softer card showcase with gentler effects */}
          <div className="relative">
            {/* Scroll shadow indicators - more subtle */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-orange-50/50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-orange-50/50 to-transparent z-10 pointer-events-none"></div>
            
            {/* Cards container */}
            <div 
              className="flex gap-8 pt-4 pb-8 px-2 overflow-x-scroll hide-scroll-bar scroll-smooth"
              ref={sliderRef}
            >
              {Array.from({ length: 15 }, (_, i) => i).map((index) => (
                <Link
                  key={index}
                  to={`/detay/${index + 1}`}
                  className="group min-w-[320px] relative transform transition-all duration-500 hover:scale-[1.01] focus:scale-[1.01]"
                >
                  <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden h-[420px] relative transition-all duration-300 group-hover:shadow-md group-hover:border-orange-100">
                    {/* Softer top color bar */}
                    <div className="h-1 w-full bg-orange-200"></div>
                    
                    {/* Card background effect - more subtle */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-orange-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Profile section */}
                    <div className="flex flex-col items-center justify-center pt-8 pb-4 px-6 relative">
                      {/* Circular profile image with softer glow */}
                      <div className="relative mb-5">
                        <div className="absolute inset-0 bg-gradient-to-tr from-orange-200/30 to-orange-100/30 rounded-full blur-md transform scale-90 opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
                        <img
                          src={`https://randomuser.me/api/portraits/men/${index + 1}.jpg`}
                          alt={`Usta ${isimListesi[index]}`}
                          className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-sm relative z-10 transition-all duration-300 group-hover:shadow-orange-100"
                        />
                        
                        {/* Online status indicator - softer */}
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white z-20 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Name and profession with better typography */}
                      <h4 className="text-xl font-bold text-gray-700 group-hover:text-orange-500 transition-colors duration-300 mb-1">{isimListesi[index]}</h4>
                      <p className="text-gray-500 mb-3 tracking-wide">{["Elektrikçi", "Tesisatçı", "Boyacı", "Marangoz"][index % 4]}</p>
                      
                      {/* More elegant verification badge */}
                      <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-500 px-3 py-1 rounded-full text-xs font-medium mb-4 transition-all duration-300 group-hover:bg-green-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Kimliği Doğrulanmış</span>
                      </div>
                      
                      {/* Rating stars - softer colors */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-5 w-5 ${i < (index % 2 === 0 ? 5 : 4) ? 'text-yellow-300' : 'text-gray-200'}`}
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-gray-600 font-medium text-sm">{index % 2 === 0 ? '5.0' : '4.8'}</span>
                      </div>
                      
                      {/* Location with icon */}
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {["İstanbul", "Ankara", "İzmir", "Bursa"][index % 4]}
                      </div>
                      
                      {/* Contact button - softer */}
                      <button className="w-full py-2.5 px-4 bg-orange-50 text-orange-500 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-orange-100 hover:text-orange-600 group-hover:shadow-sm">
                        İletişime Geç
                      </button>
                    </div>
                    
                    {/* Availability badge with softer design */}
                    <div className="absolute top-4 right-4 bg-orange-100 text-orange-500 text-xs py-1.5 px-3 rounded-full shadow-sm">
                      {["Acil İşler", "Aynı Gün", "Hafta Sonu", "7/24"][index % 4]}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Page indicators - softer design */}
          <div className="flex justify-center gap-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <button 
                key={i}
                onClick={() => {
                  if (sliderRef.current) {
                    const cardWidth = 340; // card width + gap
                    sliderRef.current.scrollLeft = i * cardWidth * 3;
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === 0 ? 'w-8 bg-orange-300' : 'w-2 bg-gray-200 hover:bg-orange-200'
                }`}
                aria-label={`Sayfa ${i + 1}`}
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <Link 
              to="/hizmet-verenler" 
              className="bg-orange-50 hover:bg-orange-100 text-orange-500 hover:text-orange-600 font-medium py-2.5 px-6 rounded-full border border-orange-100 shadow-sm transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Tüm Hizmet Verenleri Görüntüle</span>
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Zengin, çok kolonlu FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
        {/* Ana footer içeriği */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Logo ve kısa açıklama */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-orange-400 w-10 h-10 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <span className="text-gray-800 font-bold text-2xl">ustasından</span>
              </div>
              <p className="text-gray-600 mb-6 pr-4">
                Güvenilir ve profesyonel ustalar ile hizmet arayanları buluşturan platform. Binlerce usta ve müşteri arasında siz de yerinizi alın.
              </p>
              
              {/* Mobil uygulama butonları */}
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <button className="bg-black text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-transform hover:transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 3.293a1 1 0 011.414 0l.001.001a1 1 0 01.294.507A9.98 9.98 0 0120 10a9.98 9.98 0 01-1.998 6.199 1 1 0 01-.294.507l-.001.001a1 1 0 01-1.414 0L10 11.414l-6.293 6.293a1 1 0 01-1.414 0l-.001-.001a1 1 0 01-.294-.507A9.98 9.98 0 010 10C0 7.604.816 5.393 2.156 3.66a1 1 0 01.35-.391A9.95 9.95 0 0110 0c2.45 0 4.716.882 6.465 2.344a1 1 0 01.375.326l.001.001a1 1 0 01.293.507A9.95 9.95 0 0110 0c2.45 0 4.716.882 6.465 2.344a1 1 0 01.375.326l.001.001a1 1 0 01.293.507z" />
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="text-xs">İNDİR</span>
                    <span className="text-sm font-semibold">App Store</span>
                  </div>
                </button>
                <button className="bg-black text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-transform hover:transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm5.856 8.699l-2.38 1.25 2.38 1.337v2.027l-4.1-2.42.01-.017-1.2-.673v-.012l-.7.415-3.99 2.35v-2.039l2.38-1.335-2.38-1.25V6.334l4.1 2.419-.01.017 1.2.673v.012l.7-.414 3.99-2.35v2.008z" clipRule="evenodd" />
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="text-xs">İNDİR</span>
                    <span className="text-sm font-semibold">Google Play</span>
                  </div>
                </button>
              </div>
            </div>
            
            {/* Hızlı Linkler */}
            <div>
              <h3 className="text-gray-800 font-semibold mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Nasıl Çalışır?</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Sıkça Sorulan Sorular</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Kullanım Şartları</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Gizlilik Politikası</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Blog</a></li>
              </ul>
            </div>
            
            {/* Popüler Kategoriler */}
            <div>
              <h3 className="text-gray-800 font-semibold mb-4">Popüler Kategoriler</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Elektrikçi</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Tesisatçı</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Boyacı</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Marangoz</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Temizlikçi</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-600 transition-colors">Tüm Kategoriler</a></li>
              </ul>
            </div>
            
            {/* İletişim Bilgileri ve Sosyal Medya */}
            <div>
              <h3 className="text-gray-800 font-semibold mb-4">İletişim</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">Bağdat Caddesi, No:123, Kadıköy, İstanbul</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@ustasindan.com" className="text-gray-600 hover:text-orange-600 transition-colors">info@ustasindan.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+902121234567" className="text-gray-600 hover:text-orange-600 transition-colors">+90 (212) 123 45 67</a>
                </li>
              </ul>
              
              <h3 className="text-gray-800 font-semibold mb-3">Bizi Takip Edin</h3>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-gray-200 hover:bg-orange-500 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-200 hover:bg-orange-500 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-200 hover:bg-orange-500 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 bg-gray-200 hover:bg-orange-500 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16">
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Popüler Şehirler */}
          <div className="border-t border-gray-200 pt-8 pb-6">
            <h3 className="text-gray-800 font-semibold mb-4">Popüler Şehirler</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Şanlıurfa", "Kocaeli", "Mersin", "Diyarbakır"].map((sehir) => (
                <a key={sehir} href="#" className="text-gray-600 text-sm hover:text-orange-600 transition-colors">{sehir}</a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Alt footer - Telif hakkı */}
        <div className="border-t border-gray-200 mt-4 pt-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 Ustasından - Tüm hakları saklıdır.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 text-sm hover:text-orange-600 transition-colors">Kullanım Şartları</a>
              <a href="#" className="text-gray-500 text-sm hover:text-orange-600 transition-colors">Gizlilik Politikası</a>
              <a href="#" className="text-gray-500 text-sm hover:text-orange-600 transition-colors">Çerez Politikası</a>
            </div>
          </div>
        </div>
      </footer>

      {/* GÖRÜNMEZ SCROLLBAR CSS */}
      <style>
        {`
          .hide-scroll-bar::-webkit-scrollbar {
            display: none;
          }
          .hide-scroll-bar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          
          /* 3D transform utilities */
          .perspective-1000 {
            perspective: 1000px;
          }
          .preserve-3d {
            transform-style: preserve-3d;
          }
          .rotate-y-3 {
            transform: rotateY(3deg);
          }
        `}
      </style>
    </div>
  );
}
