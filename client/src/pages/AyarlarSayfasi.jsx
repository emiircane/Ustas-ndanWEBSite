import { useState, useEffect } from "react";
import { User, Lock, Camera, Mail, Phone, MapPin, Save, Edit, ArrowLeft, Plus, AtSign, Check, Calendar, Briefcase, FileText, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AyarlarSayfasi() {
  const [kullanici, setKullanici] = useState(null);
  const [aktifSekme, setAktifSekme] = useState("profilim");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    email: "",
    telefon: "",
    konum: "",
    meslek: "",
    hakkinda: "",
    dogumTarihi: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const veri = localStorage.getItem("kullanici");
    if (veri) {
      const userData = JSON.parse(veri);
      setKullanici(userData);
      setFormData({
        ad: userData.ad || "",
        soyad: userData.soyad || "",
        email: userData.email || "",
        telefon: userData.telefon || "",
        konum: userData.konum || "",
        meslek: userData.meslek || "",
        hakkinda: userData.hakkinda || "",
        dogumTarihi: userData.dogumTarihi || ""
      });
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = () => {
    // Gerçek uygulamada API çağrısı yapılacak
    setKullanici(prev => ({
      ...prev,
      ...formData
    }));
    
    localStorage.setItem("kullanici", JSON.stringify({
      ...kullanici,
      ...formData
    }));
    
    setIsEditing(false);
    showNotification("Profil bilgileriniz başarıyla güncellendi", "success");
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Şifreler eşleşmiyor");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Şifre en az 6 karakter olmalıdır");
      return;
    }
    
    // Gerçek uygulamada şifre değiştirme API çağrısı yapılacak
    showNotification("Şifreniz başarıyla güncellendi", "success");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };
  
  const showNotification = (message, type = "info") => {
    setNotification({
      show: true,
      message,
      type
    });
    
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  if (!kullanici) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Kullanıcı bulunamadı</h2>
          <p className="text-gray-600 mb-6">Devam etmek için lütfen giriş yapın</p>
          <button 
            onClick={() => navigate("/giris")}
            className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Bildirim */}
      {notification.show && (
        <div className={`fixed top-6 right-6 max-w-md p-4 rounded-lg shadow-lg z-50 transition-all transform animate-slideInRight ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 
          notification.type === 'error' ? 'bg-red-500 text-white' : 
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Geri Dön</span>
          </button>
          <h1 className="text-3xl font-bold ml-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
            Ayarlar
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sol taraf - Sekmeler ve Profil Özeti */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="p-6 flex flex-col items-center border-b border-gray-100">
                <div className="relative mb-4">
                  <img
                    src={selectedFile || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"}
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-orange-100"
                  />
                  <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full text-white cursor-pointer hover:bg-orange-600 transition-colors shadow-md">
                    <Camera size={18} />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <h3 className="text-xl font-bold text-gray-800">{kullanici.ad} {kullanici.soyad}</h3>
                <p className="text-gray-500 text-sm">{kullanici.email}</p>
              </div>
              
              <div className="p-4">
                <button
                  onClick={() => setAktifSekme("profilim")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg mb-2 transition-all ${
                    aktifSekme === "profilim" 
                      ? "bg-orange-50 text-orange-600 font-medium" 
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  <span>Profil Bilgileri</span>
                </button>
                
                <button
                  onClick={() => setAktifSekme("hesap")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                    aktifSekme === "hesap" 
                      ? "bg-orange-50 text-orange-600 font-medium" 
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Lock className="h-5 w-5 mr-3" />
                  <span>Şifre Değiştir</span>
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md overflow-hidden text-white p-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 mr-2 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Hesap Güvenliği</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Düzenli olarak şifrenizi güncelleyin ve hesap bilgilerinizi güncel tutun.
                  </p>
                  <button 
                    onClick={() => setAktifSekme("hesap")}
                    className="px-4 py-2 bg-white text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors"
                  >
                    Şifremi Değiştir
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sağ taraf - İçerik */}
          <div className="w-full md:w-2/3">
            {/* Profil bilgileri */}
            {aktifSekme === "profilim" && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">Profil Bilgileri</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1 text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      <Edit size={18} />
                      <span>Düzenle</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-1 text-green-500 hover:text-green-600 transition-colors"
                    >
                      <Save size={18} />
                      <span>Kaydet</span>
                    </button>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="ad"
                          value={formData.ad}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <User className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-800 font-medium">{formData.ad || "Belirtilmedi"}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="soyad"
                          value={formData.soyad}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <User className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-800 font-medium">{formData.soyad || "Belirtilmedi"}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-800 font-medium">{formData.email}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="telefon"
                          value={formData.telefon}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="0555 555 55 55"
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-5 w-5 text-gray-400 mr-3" />
                          <span className="text-gray-800 font-medium">{formData.telefon || "Belirtilmedi"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-6 mt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Ek Bilgiler</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="konum"
                            value={formData.konum}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            placeholder="İstanbul, Türkiye"
                          />
                        ) : (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-gray-800 font-medium">{formData.konum || "Belirtilmedi"}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meslek</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="meslek"
                            value={formData.meslek}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            placeholder="Mühendis"
                          />
                        ) : (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-gray-800 font-medium">{formData.meslek || "Belirtilmedi"}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi</label>
                        {isEditing ? (
                          <input
                            type="date"
                            name="dogumTarihi"
                            value={formData.dogumTarihi}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          />
                        ) : (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                            <span className="text-gray-800 font-medium">{formData.dogumTarihi || "Belirtilmedi"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hakkında</label>
                      {isEditing ? (
                        <textarea
                          name="hakkinda"
                          value={formData.hakkinda}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="Kendiniz hakkında kısa bir bilgi..."
                        ></textarea>
                      ) : (
                        <div className="flex p-3 bg-gray-50 rounded-lg">
                          <FileText className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-1" />
                          <span className="text-gray-800">{formData.hakkinda || "Henüz bir açıklama eklenmedi."}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Şifre değiştirme */}
            {aktifSekme === "hesap" && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">Şifre Değiştir</h2>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handlePasswordSubmit}>
                    {passwordError && (
                      <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                        <span>{passwordError}</span>
                      </div>
                    )}
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mevcut Şifre</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                        <p className="text-xs text-gray-500 mt-1">En az 6 karakter olmalıdır</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre (Tekrar)</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                      Şifreyi Güncelle
                    </button>
                  </form>
                  
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800 mb-1">Güvenli Şifre Önerileri</h4>
                        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                          <li>En az 8 karakter kullanın</li>
                          <li>Büyük ve küçük harfler ekleyin</li>
                          <li>Rakam ve özel karakterler kullanın</li>
                          <li>Kolayca tahmin edilebilecek bilgiler kullanmayın</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AyarlarSayfasi;
