import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, User, Eye, EyeOff } from "lucide-react";
import { supabase } from "../supabase";

function GirisSayfasi() {
  const [formBilgi, setFormBilgi] = useState({
    email: "",
    sifre: "",
  });
  const [hata, setHata] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormBilgi({ ...formBilgi, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formBilgi.email || !formBilgi.sifre) {
      setHata("Lütfen tüm alanları doldurun");
      return;
    }
    
    setIsLoading(true);
    setHata("");
    
    try {
      // Supabase ile giriş yap
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formBilgi.email,
        password: formBilgi.sifre,
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Kullanıcı profilini getir
        try {
          const { data: kullaniciVeri, error: profileError } = await supabase
            .from('kullanicilar')
            .select('*')
            .eq('id', authData.user.id)
            .limit(1);
            
          if (profileError) throw profileError;
          
          if (!kullaniciVeri || kullaniciVeri.length === 0) {
            throw new Error("Kullanıcı profili bulunamadı");
          }
          
          // Kullanıcı bilgilerini localStorage'a kaydet
          localStorage.setItem("kullanici", JSON.stringify(kullaniciVeri[0]));
          
          // Ana sayfaya yönlendir
          navigate("/");
          window.location.reload();
        } catch (profileError) {
          console.error("Profil getirme hatası:", profileError.message);
          
          // Profil bulunamadıysa, otomatik olarak oluşturma dene
          try {
            // Kullanıcı profilini oluştur
            const { data: insertData, error: insertError } = await supabase
              .from('kullanicilar')
              .insert([
                { 
                  id: authData.user.id,
                  email: authData.user.email,
                  ad: authData.user.user_metadata?.ad || "Kullanıcı",
                  soyad: authData.user.user_metadata?.soyad || "",
                  is_usta: false,
                  admin: false
                }
              ])
              .select()
              .single();
              
            if (insertError) throw insertError;
            
            // Kullanıcı bilgilerini localStorage'a kaydet
            localStorage.setItem("kullanici", JSON.stringify(insertData));
            
            // Ana sayfaya yönlendir
            navigate("/");
            window.location.reload();
          } catch (insertError) {
            console.error("Profil oluşturma hatası:", insertError.message);
            throw new Error("Kullanıcı profili oluşturulamadı");
          }
        }
      }
    } catch (error) {
      console.error("Giriş hatası:", error.message);
      setHata(error.message === "Invalid login credentials" 
        ? "E-posta veya şifre hatalı"
        : (error.message || "Giriş sırasında bir hata oluştu."));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 px-4 py-16">
      {/* Dekoratif elementler */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-md w-full perspective-1000">
        <div className="relative transform transition-all duration-500 preserve-3d hover:scale-[1.01]">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
            {/* Üst dekoratif çizgi */}
            <div className="h-1.5 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500"></div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                  <User className="h-8 w-8 text-orange-600" />
                </div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                  Giriş Yap
                </h2>
                <p className="text-gray-600 mt-2">
                  Ustasından platformuna hoş geldiniz
                </p>
              </div>

              {hata && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
                  <span className="bg-red-100 p-1 rounded mr-2">⚠️</span>
                  {hata}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
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
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                      Beni hatırla
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                      Şifremi unuttum
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-orange-300/20 transition-all duration-200 transform hover:-translate-y-0.5 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Giriş Yapılıyor...
                    </>
                  ) : (
                    <>
                      Giriş Yap <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">veya</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-gray-600">
                    Hesabınız yok mu?{" "}
                    <Link to="/kayit" className="text-orange-600 hover:text-orange-700 font-medium">
                      Hemen Kayıt Olun
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GirisSayfasi; 