import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Check, User, Eye, EyeOff, UserPlus, ArrowRight } from "lucide-react";
import { supabase } from "../supabase";

function KayitOlSayfasi() {
  const [formBilgi, setFormBilgi] = useState({
    ad: "",
    soyad: "",
    email: "",
    sifre: "",
    sifreTekrar: ""
  });
  const [hata, setHata] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // İki adımlı kayıt için
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormBilgi({ ...formBilgi, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateStep1 = () => {
    if (!formBilgi.ad || !formBilgi.soyad || !formBilgi.email) {
      setHata("Lütfen tüm alanları doldurun");
      return false;
    }
    
    // E-posta doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formBilgi.email)) {
      setHata("Geçerli bir e-posta adresi girin");
      return false;
    }
    
    setHata("");
    return true;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Şifre doğrulama
    if (!formBilgi.sifre || !formBilgi.sifreTekrar) {
      setHata("Lütfen tüm alanları doldurun");
      return;
    }
    
    if (formBilgi.sifre !== formBilgi.sifreTekrar) {
      setHata("Şifreler eşleşmiyor");
      return;
    }
    
    if (formBilgi.sifre.length < 6) {
      setHata("Şifreniz en az 6 karakter olmalıdır");
      return;
    }
    
    setIsLoading(true);
    setHata("");
    
    try {
      // 1. Supabase Auth ile kullanıcı oluştur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formBilgi.email,
        password: formBilgi.sifre,
        options: {
          data: {
            ad: formBilgi.ad,
            soyad: formBilgi.soyad,
            email: formBilgi.email
          },
          emailRedirectTo: window.location.origin
        }
      });
      
      if (authError) throw authError;
      
      // 2. Kullanıcı bilgilerini localStorage'a kaydet
      if (authData.user) {
        try {
          // Kullanıcılar tablosuna ekleme
          const { error: kullaniciError } = await supabase
            .from('kullanicilar')
            .insert([{
              id: authData.user.id,
              ad: formBilgi.ad,
              soyad: formBilgi.soyad,
              email: formBilgi.email
            }]);
            
          if (kullaniciError) {
            console.error("Kullanıcı bilgileri eklenirken hata:", kullaniciError);
          }
          
          // Kullanıcı e-posta doğrulama sayfasına yönlendir
          setHata("");
          navigate("/email-dogrulama", { 
            state: { 
              email: formBilgi.email 
            } 
          });
          return;
          
        } catch (profileError) {
          console.error("Profil oluşturma hatası:", profileError);
        }
        
        // Doğrudan oturum açma
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formBilgi.email,
          password: formBilgi.sifre
        });
        
        if (signInError) throw signInError;
        
        // Kullanıcı bilgilerini oluştur
        const kullanici = {
          id: authData.user.id,
          ad: formBilgi.ad,
          soyad: formBilgi.soyad,
          email: formBilgi.email
        };
        
        localStorage.setItem("kullanici", JSON.stringify(kullanici));
        
        // Ana sayfaya yönlendir
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Kayıt hatası:", error.message);
      setHata(error.message || "Kayıt sırasında bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 px-4 py-16">
      {/* Dekoratif elementler */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-orange-200/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-md w-full perspective-1000">
        <div className="relative transform transition-all duration-500 preserve-3d hover:scale-[1.01]">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
            {/* Üst dekoratif çizgi */}
            <div className="h-1.5 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500"></div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                  <UserPlus className="h-8 w-8 text-orange-600" />
                </div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                  Hesap Oluşturun
                </h2>
                <p className="text-gray-600 mt-2">
                  Hızlı ve kolay kayıt ile hemen hizmet almaya başlayın
                </p>
              </div>

              {/* Adım göstergesi */}
              <div className="flex mb-8 justify-center">
                <div className="flex items-center w-full max-w-xs">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'} transition-colors`}>
                    <span>1</span>
                  </div>
                  <div className={`h-1 flex-1 ${step >= 2 ? 'bg-orange-600' : 'bg-gray-200'} transition-colors`}></div>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'} transition-colors`}>
                    <span>2</span>
                  </div>
                </div>
              </div>

              {hata && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
                  <span className="bg-red-100 p-1 rounded mr-2">⚠️</span>
                  {hata}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {step === 1 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="ad"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Adınız
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="ad"
                            name="ad"
                            value={formBilgi.ad}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-colors"
                            placeholder="Adınız"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="soyad"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Soyadınız
                        </label>
                        <input
                          type="text"
                          id="soyad"
                          name="soyad"
                          value={formBilgi.soyad}
                          onChange={handleInputChange}
                          className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-colors"
                          placeholder="Soyadınız"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        E-posta Adresiniz
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formBilgi.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-colors"
                          placeholder="ornek@mail.com"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-orange-300/20 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Devam Et <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label
                        htmlFor="sifre"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Şifreniz
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="sifre"
                          name="sifre"
                          value={formBilgi.sifre}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-colors"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">En az 6 karakter olmalıdır</p>
                    </div>

                    <div>
                      <label
                        htmlFor="sifreTekrar"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Şifre Tekrar
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="sifreTekrar"
                          name="sifreTekrar"
                          value={formBilgi.sifreTekrar}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-500 transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                        <span>Kullanım şartlarını ve gizlilik politikasını kabul ediyorum</span>
                      </label>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                      >
                        Geri
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex-1 py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-orange-300/20 transition-all duration-200 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            İşleniyor...
                          </>
                        ) : (
                          <>
                            Kayıt Ol <Check className="h-4 w-4 ml-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Zaten bir hesabınız var mı?{" "}
                  <Link to="/giris" className="text-orange-600 hover:text-orange-700 font-medium">
                    Giriş Yapın
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KayitOlSayfasi; 