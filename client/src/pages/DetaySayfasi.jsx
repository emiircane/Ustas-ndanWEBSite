import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabase";
import { Phone, MapPin, Calendar, User, Flag, Search, Home, Shield, ArrowLeft } from "lucide-react";

function DetaySayfasi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ilan, setIlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [benzerIlanlar, setBenzerIlanlar] = useState([]);

  useEffect(() => {
    const fetchIlanDetay = async () => {
      try {
        setLoading(true);
        
        // İlan detaylarını getir
        const { data, error } = await supabase
          .from('ilanlar')
          .select(`
            *,
            kategoriler(id, isim),
            kullanici:kullanicilar(id, ad, soyad, telefon, email)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setIlan(data);
        
        // Benzer ilanları getir (aynı kategoriden)
        if (data && data.kategoriler) {
          const { data: benzerData, error: benzerError } = await supabase
            .from('ilanlar')
            .select(`
              id,
              baslik,
              fiyat,
              konum,
              resimler,
              created_at
            `)
            .eq('kategori_id', data.kategoriler.id)
            .neq('id', id) // Kendisi hariç
            .limit(5);
          
          if (!benzerError) {
            setBenzerIlanlar(benzerData);
          }
        }

      } catch (err) {
        console.error("İlan detayları alınırken hata:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchIlanDetay();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (error || !ilan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 border border-gray-300 rounded-lg text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">İlan Bulunamadı</h2>
          <p className="text-gray-500 mb-6">Bu ilan kaldırılmış veya mevcut değil.</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  // Wireframe tarzında yalın tasarım
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Üst arama ve navigasyon */}
      <header className="bg-white border-b border-gray-300 py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center mr-6">
                <Home className="h-5 w-5 mr-1" />
                <span className="font-medium">Ana Sayfa</span>
              </Link>
              <Link to="/admin" className="flex items-center">
                <Shield className="h-5 w-5 mr-1" />
                <span className="font-medium">Admin Panel</span>
              </Link>
            </div>
            
            <div className="relative w-1/3">
              <input 
                type="text" 
                placeholder="İlan ara..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>
      
      {/* Ana içerik */}
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Geri Dön</span>
        </button>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sol ana içerik */}
          <div className="w-full md:w-2/3">
            {/* Resim alanı */}
            <div className="border border-gray-300 rounded-lg bg-white overflow-hidden mb-6">
              <div className="h-[400px] w-full bg-gray-200">
                {ilan.resimler && ilan.resimler.length > 0 ? (
                  <img 
                    src={ilan.resimler[0]} 
                    alt={ilan.baslik} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="h-20 w-20 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            {/* Başlık ve fiyat */}
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{ilan.baslik}</h1>
              <div className="text-2xl font-bold text-gray-800">
                {ilan.fiyat ? `${ilan.fiyat} ₺` : 'Fiyat Sorunuz'}
              </div>
            </div>
            
            {/* Açıklama */}
            <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Açıklama</h2>
              <div className="text-gray-700 whitespace-pre-line">
                {ilan.aciklama}
              </div>
            </div>
            
            {/* Detaylar */}
            <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Detaylar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <Flag className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Kategori</p>
                    <p className="font-medium">{ilan.kategoriler?.isim || "Belirtilmemiş"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Konum</p>
                    <p className="font-medium">{ilan.konum || "Belirtilmemiş"}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">İlan Sahibi</p>
                    <p className="font-medium">{ilan.kullanici?.ad} {ilan.kullanici?.soyad}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">İlan Tarihi</p>
                    <p className="font-medium">
                      {new Date(ilan.created_at).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sağ yan panel */}
          <div className="w-full md:w-1/3">
            {/* İletişim Bilgileri */}
            <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">İletişim Bilgileri</h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Ad Soyad</p>
                <p className="font-medium">{ilan.kullanici?.ad} {ilan.kullanici?.soyad}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Telefon</p>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-gray-600" />
                  <p className="font-medium">{ilan.kullanici?.telefon || "Belirtilmemiş"}</p>
                </div>
              </div>
              
              <button className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center">
                <Phone className="h-5 w-5 mr-2" />
                İletişime Geç
              </button>
            </div>
            
            {/* Şikayet Butonu */}
            <div className="bg-white border border-gray-300 rounded-lg p-6 mb-6">
              <button className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center">
                <Flag className="h-4 w-4 mr-2" />
                İlanı Şikayet Et
              </button>
            </div>
            
            {/* Benzer İlanlar */}
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Benzer İlanlar</h2>
              
              {benzerIlanlar.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Benzer ilan bulunamadı</p>
              ) : (
                <div className="space-y-4">
                  {benzerIlanlar.map(benzerIlan => (
                    <div key={benzerIlan.id} className="flex border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <div className="w-16 h-16 bg-gray-200 rounded mr-3 overflow-hidden flex-shrink-0">
                        {benzerIlan.resimler && benzerIlan.resimler.length > 0 ? (
                          <img 
                            src={benzerIlan.resimler[0]} 
                            alt={benzerIlan.baslik} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 line-clamp-2 text-sm mb-1">
                          <Link to={`/ilan/${benzerIlan.id}`} className="hover:underline">
                            {benzerIlan.baslik}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500">{benzerIlan.konum}</p>
                        <p className="text-sm font-medium">
                          {benzerIlan.fiyat ? `${benzerIlan.fiyat} ₺` : 'Fiyat Sorunuz'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetaySayfasi;
