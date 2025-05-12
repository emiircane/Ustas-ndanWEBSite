import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, MapPin, DollarSign, TextIcon, ListIcon, Plus, ArrowLeft, Upload, X, Tag, FileText } from "lucide-react";
import { supabase } from "../supabase";

function IlanOlustur() {
  const [formBilgi, setFormBilgi] = useState({
    baslik: "",
    aciklama: "",
    kategori_id: "",
    fiyat: "",
    konum: ""
  });
  const [resimler, setResimler] = useState([]);
  const [resimURLs, setResimURLs] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hata, setHata] = useState("");
  const [basari, setBasari] = useState("");
  const [adimlar, setAdimlar] = useState(1); // Adımları takip etmek için
  const navigate = useNavigate();
  
  // Kullanıcı bilgilerini localStorage'dan al
  const kullanici = JSON.parse(localStorage.getItem("kullanici")) || null;
  const [authUser, setAuthUser] = useState(null);
  
  // Kimlik doğrulama kontrolü
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Mevcut oturumu kontrol et
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data && data.session) {
          setAuthUser(data.session.user);
        } else {
          // Oturum yoksa giriş sayfasına yönlendir
          navigate("/giris", { replace: true });
        }
      } catch (error) {
        console.error("Oturum kontrolü başarısız:", error.message);
        navigate("/giris", { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Eğer kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
  useEffect(() => {
    if (!kullanici) {
      navigate("/giris");
    }
  }, [kullanici, navigate]);
  
  // Kategorileri çek
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
        setHata("Kategoriler yüklenirken bir hata oluştu.");
      }
    }
    
    fetchKategoriler();
  }, []);
  
  // Form değişikliklerini izle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormBilgi({ ...formBilgi, [name]: value });
  };
  
  // Resim önizlemeleri oluştur
  useEffect(() => {
    if (resimler.length > 0) {
      const newResimURLs = [];
      resimler.forEach(resim => {
        newResimURLs.push(URL.createObjectURL(resim));
      });
      setResimURLs(newResimURLs);
      
      // Component unmount olduğunda URL'leri temizle
      return () => {
        newResimURLs.forEach(url => URL.revokeObjectURL(url));
      };
    }
  }, [resimler]);
  
  // Resim yükleme işleyicisi
  const handleResimChange = (e) => {
    if (e.target.files.length > 5) {
      setHata("En fazla 5 resim yükleyebilirsiniz.");
      return;
    }
    
    setResimler([...e.target.files]);
  };

  // Drag and drop işlemleri
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-orange-400', 'bg-orange-50');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-orange-400', 'bg-orange-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-orange-400', 'bg-orange-50');
    
    if (e.dataTransfer.files.length > 5) {
      setHata("En fazla 5 resim yükleyebilirsiniz.");
      return;
    }
    
    setResimler([...e.dataTransfer.files]);
  };

  // Resim silme işlemi
  const handleResimSil = (index) => {
    const yeniResimler = [...resimler];
    yeniResimler.splice(index, 1);
    setResimler(yeniResimler);
  };
  
  // Resimleri Supabase Storage'a yükle
  const uploadResimleri = async () => {
    if (resimler.length === 0) return [];
    
    try {
      // Bucket'ın varlığını kontrol et, yoksa uyarı ver
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      const bucketExists = buckets && buckets.some(bucket => bucket.name === 'ilan-resimleri');
      
      if (!bucketExists) {
        console.warn("ilan-resimleri bucket'ı bulunamadı. Resimler yüklenemeyecek.");
        return [];
      }
      
      const resimURLListesi = [];
      
      for (let i = 0; i < resimler.length; i++) {
        const resim = resimler[i];
        const dosyaAdi = `ilan-${Date.now()}-${i}-${resim.name}`;
        
        const { data, error } = await supabase.storage
          .from('ilan-resimleri')
          .upload(dosyaAdi, resim);
        
        if (error) throw error;
        
        const { data: publicURL } = supabase.storage
          .from('ilan-resimleri')
          .getPublicUrl(dosyaAdi);
        
        resimURLListesi.push(publicURL.publicUrl);
      }
      
      return resimURLListesi;
    } catch (error) {
      console.error("Resim yükleme hatası:", error.message);
      return []; // Hata durumunda boş liste döndür
    }
  };

  // Adım fonksiyonları
  const sonrakiAdim = () => {
    if (adimlar === 1) {
      if (!formBilgi.baslik || !formBilgi.kategori_id) {
        setHata("Lütfen başlık ve kategori alanlarını doldurun.");
        return;
      }
    }
    
    setHata("");
    setAdimlar(adimlar + 1);
    window.scrollTo(0, 0);
  };

  const oncekiAdim = () => {
    setHata("");
    setAdimlar(adimlar - 1);
    window.scrollTo(0, 0);
  };
  
  // Form gönderme işleyicisi
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formBilgi.baslik || !formBilgi.aciklama || !formBilgi.kategori_id) {
      setHata("Lütfen zorunlu alanları doldurun.");
      return;
    }
    
    if (!authUser) {
      setHata("Lütfen giriş yapın ve tekrar deneyin.");
      return;
    }
    
    try {
      setLoading(true);
      setHata("");
      
      // Yeniden oturum kontrolü yap
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData || !sessionData.session) {
        throw new Error("Oturum bulunamadı. Lütfen yeniden giriş yapın.");
      }

      // Kullanıcının 'kullanicilar' tablosunda olup olmadığını kontrol et
      const { data: kullaniciData, error: kullaniciError } = await supabase
        .from('kullanicilar')
        .select('id')
        .eq('id', authUser.id)
        .single();
      
      // Kullanıcı yoksa, ekle
      if (kullaniciError || !kullaniciData) {
        console.log("Kullanıcı veritabanında bulunamadı, ekleniyor...");
        
        // Minimum gerekli bilgilerle kullanıcıyı oluştur
        const { error: insertError } = await supabase
          .from('kullanicilar')
          .insert({
            id: authUser.id,
            ad: kullanici?.ad || authUser.email?.split('@')[0] || "Kullanıcı",
            soyad: kullanici?.soyad || "",
            email: authUser.email
          });
        
        if (insertError) {
          console.error("Kullanıcı oluşturma hatası:", insertError);
          throw new Error("Kullanıcı profili oluşturulamadı: " + insertError.message);
        }
      }
      
      // Resimleri yükle
      let resimURLListesi = [];
      try {
        resimURLListesi = await uploadResimleri();
      } catch (uploadError) {
        console.error("Resim yükleme başarısız:", uploadError.message);
        // Resim yükleme hatası olsa bile devam et
      }
      
      // İlanı veritabanına ekle
      const { data, error } = await supabase
        .from('ilanlar')
        .insert({
          baslik: formBilgi.baslik,
          aciklama: formBilgi.aciklama,
          kategori_id: parseInt(formBilgi.kategori_id),
          kullanici_id: authUser.id,  // localStorage'dan değil, auth session'dan al
          fiyat: formBilgi.fiyat ? parseInt(formBilgi.fiyat) : null,
          konum: formBilgi.konum,
          resimler: resimURLListesi
        });
      
      if (error) throw error;
      
      setBasari("İlanınız başarıyla oluşturuldu!");
      setAdimlar(3); // Başarı adımına git
      
      // Form alanlarını temizle
      setFormBilgi({
        baslik: "",
        aciklama: "",
        kategori_id: "",
        fiyat: "",
        konum: ""
      });
      setResimler([]);
      setResimURLs([]);
      
      // 3 saniye sonra profil sayfasına yönlendir
      setTimeout(() => {
        navigate("/ilanlar");
      }, 3000);
      
    } catch (error) {
      console.error("İlan oluşturulurken hata:", error.message);
      setHata("İlan oluşturulurken bir hata oluştu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Form ilerlemesini göster
  const ilerleme = () => {
    return (
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-500">
            Adım {adimlar}/3
          </div>
          <div className="text-sm font-medium text-gray-500">
            {adimlar === 1 ? 'Temel Bilgiler' : adimlar === 2 ? 'Detaylar ve Resimler' : 'Tamamlandı'}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${(adimlar / 3) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  // Adımlar arası geçiş için butonlar
  const adimButonlari = () => {
    return (
      <div className="flex justify-between mt-10">
        {adimlar > 1 && adimlar < 3 && (
          <button
            type="button"
            onClick={oncekiAdim}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center transition-all"
          >
            <ArrowLeft size={18} className="mr-2" />
            Geri
          </button>
        )}
        
        {adimlar < 2 ? (
          <button
            type="button"
            onClick={sonrakiAdim}
            className="ml-auto px-6 py-3 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg flex items-center transition-all"
          >
            Devam
            <ArrowLeft size={18} className="ml-2 transform rotate-180" />
          </button>
        ) : adimlar === 2 ? (
          <button
            type="submit"
            disabled={loading}
            className={`ml-auto px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-lg flex items-center transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                İşleniyor...
              </>
            ) : (
              <>
                <Plus size={18} className="mr-2" />
                İlanı Oluştur
              </>
            )}
          </button>
        ) : null}
      </div>
    );
  };
  
  // Adım 1: Temel bilgiler
  const renderAdim1 = () => {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Temel bilgileri doldurarak ilanınızı oluşturmaya başlayın. Yıldızlı alanlar zorunludur.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="baslik" className="block text-sm font-medium text-gray-700 mb-1">
            İlan Başlığı <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TextIcon size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="baslik"
              name="baslik"
              value={formBilgi.baslik}
              onChange={handleInputChange}
              placeholder="Örn: Su Tesisatı Tamiri, Elektrik Arıza"
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all"
              maxLength={100}
            />
          </div>
          <div className="mt-1 text-xs text-gray-500 flex justify-between">
            <span>Açıklayıcı bir başlık ilanınızın daha fazla ilgi görmesini sağlar</span>
            <span>{formBilgi.baslik.length}/100</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="kategori_id" className="block text-sm font-medium text-gray-700 mb-1">
            Kategori <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag size={18} className="text-gray-400" />
            </div>
            <select
              id="kategori_id"
              name="kategori_id"
              value={formBilgi.kategori_id}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 bg-white transition-all"
            >
              <option value="">Kategori Seçin</option>
              {kategoriler.map(kategori => (
                <option key={kategori.id} value={kategori.id}>
                  {kategori.isim}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="konum" className="block text-sm font-medium text-gray-700 mb-1">
            Konum
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="konum"
              name="konum"
              value={formBilgi.konum}
              onChange={handleInputChange}
              placeholder="Örn: İstanbul, Kadıköy"
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all"
            />
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Konum belirtmek, size yakın müşterilerin ilanınızı bulmasını sağlar
          </div>
        </div>
      </div>
    );
  };
  
  // Adım 2: Detaylar ve Resimler
  const renderAdim2 = () => {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Detayları ekleyin ve resimler yükleyin. Daha fazla detay ve resim, ilanınızın daha çok ilgi görmesini sağlar.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="aciklama" className="block text-sm font-medium text-gray-700 mb-1">
            Açıklama <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
              <FileText size={18} className="text-gray-400" />
            </div>
            <textarea
              id="aciklama"
              name="aciklama"
              value={formBilgi.aciklama}
              onChange={handleInputChange}
              rows={5}
              placeholder="Hizmetiniz hakkında detaylı bilgi verin. Ne tür işler yapabildiğinizi, deneyiminizi, hangi bölgelere hizmet verdiğinizi belirtin."
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all"
            />
          </div>
          <div className="mt-1 text-xs text-gray-500">
            En az 30 karakter girin
          </div>
        </div>
        
        <div>
          <label htmlFor="fiyat" className="block text-sm font-medium text-gray-700 mb-1">
            Fiyat
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={18} className="text-gray-400" />
            </div>
            <input
              type="number"
              id="fiyat"
              name="fiyat"
              value={formBilgi.fiyat}
              onChange={handleInputChange}
              placeholder="Örn: 250"
              className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-all"
            />
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Fiyat belirtmek isteğe bağlıdır. Fiyat belirtmezseniz "Fiyat Sorunuz" olarak görünecektir
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resimler (en fazla 5 adet)
          </label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="resimler"
              multiple
              accept="image/*"
              onChange={handleResimChange}
              className="hidden"
            />
            <label
              htmlFor="resimler"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <Upload size={40} className="text-gray-400 mb-2" />
              <span className="text-gray-500 font-medium">Resimleri seçmek için tıklayın</span>
              <span className="text-xs text-gray-400 mt-1">veya sürükleyip bırakın</span>
              <span className="text-xs text-gray-400 mt-3">PNG, JPG veya JPEG • En fazla 5 dosya • Dosya başına maksimum 5MB</span>
            </label>
          </div>
          
          {/* Resim önizlemeleri */}
          {resimURLs.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {resimURLs.map((url, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden h-32 bg-gray-100 border border-gray-200">
                  <img 
                    src={url} 
                    alt={`Önizleme ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => handleResimSil(index)}
                      className="p-1.5 bg-red-500 text-white rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Adım 3: Başarı
  const renderAdim3 = () => {
    return (
      <div className="text-center py-10">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-3">İlanınız Oluşturuldu!</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          İlanınız başarıyla oluşturuldu ve yayınlandı. Birkaç saniye içinde profil sayfanıza yönlendirileceksiniz.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate("/profil")}
            className="px-6 py-3 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-all inline-flex items-center justify-center"
          >
            İlanlarımı Gör
          </button>
          <button
            type="button"
            onClick={() => {
              setAdimlar(1);
              setFormBilgi({
                baslik: "",
                aciklama: "",
                kategori_id: "",
                fiyat: "",
                konum: ""
              });
              setResimler([]);
              setResimURLs([]);
              setBasari("");
            }}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all inline-flex items-center justify-center"
          >
            Yeni İlan Oluştur
          </button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>İlanınız birkaç dakika içinde onaylanacak ve kullanıcılara gösterilmeye başlanacaktır.</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors mr-4"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span className="hidden sm:inline">Geri Dön</span>
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
            {adimlar === 3 ? 'İlan Oluşturuldu' : 'Yeni İlan Oluştur'}
          </h1>
        </div>
        
        {adimlar < 3 && ilerleme()}
        
        {hata && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
            <span className="bg-red-100 p-1 rounded mr-2">⚠️</span>
            {hata}
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="h-1.5 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500"></div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {adimlar === 1 && renderAdim1()}
            {adimlar === 2 && renderAdim2()}
            {adimlar === 3 && renderAdim3()}
            
            {adimlar < 3 && adimButonlari()}
          </form>
        </div>
        
        {adimlar < 3 && (
          <div className="bg-gray-50 p-4 rounded-lg mt-6 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">İpuçları</h3>
            <ul className="text-xs text-gray-600 space-y-1.5">
              <li className="flex items-start">
                <span className="text-orange-500 mr-1.5">•</span>
                Detaylı ve doğru bilgiler sağladığınızda, daha fazla potansiyel müşteri ilanınızı görecektir.
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-1.5">•</span>
                Profesyonel ve net fotoğraflar eklemek, ilanınızın tıklanma oranını artırır.
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-1.5">•</span>
                İlanınız yayınlandıktan sonra profilinizden düzenleyebilir veya silebilirsiniz.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default IlanOlustur; 