import { useState, useEffect } from "react";
import { User, Lock, Camera } from "lucide-react";

function AyarlarSayfasi() {
  const [kullanici, setKullanici] = useState(null);
  const [aktifSekme, setAktifSekme] = useState("profilim");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const veri = localStorage.getItem("kullanici");
    if (veri) {
      setKullanici(JSON.parse(veri));
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(URL.createObjectURL(file));
    }
  };

  if (!kullanici) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg">Kullanıcı bilgisi bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h2 className="text-3xl font-bold text-orange-600 mb-8 text-center">Ayarlar</h2>

      {/* Sekme Butonları */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            aktifSekme === "profilim"
              ? "bg-orange-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-orange-100"
          }`}
          onClick={() => setAktifSekme("profilim")}
        >
          <User size={18} />
          Profili Düzenle
        </button>
        <button
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
            aktifSekme === "hesap"
              ? "bg-orange-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-orange-100"
          }`}
          onClick={() => setAktifSekme("hesap")}
        >
          <Lock size={18} />
          Hesap Ayarları
        </button>
      </div>

      {/* Sekme İçerikleri */}
      {/* Profili Düzenle */}
      {aktifSekme === "profilim" && (
        <div className="bg-white p-8 rounded-lg shadow-lg text-gray-800 mb-8 transition-colors">
          <h3 className="text-xl font-semibold mb-6 text-orange-600">Kişisel Bilgiler</h3>
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <img
                src={selectedFile || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"}
                alt="avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-orange-100"
              />
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-orange-600 p-2 rounded-full text-white cursor-pointer hover:bg-orange-700 transition-colors">
                <Camera size={20} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-gray-500 text-sm">Ad</p>
              <p className="font-medium text-lg">{kullanici.ad}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-500 text-sm">Soyad</p>
              <p className="font-medium text-lg">{kullanici.soyad}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-500 text-sm">Kullanıcı Adı</p>
              <p className="font-medium text-lg">{kullanici.kullaniciAdi}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-500 text-sm">E-posta</p>
              <p className="font-medium text-lg">{kullanici.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hesap Ayarları */}
      {aktifSekme === "hesap" && (
        <div className="bg-white p-8 rounded-lg shadow-lg text-gray-800 transition-colors">
          <h3 className="text-xl font-semibold mb-6 text-orange-600">Hesap Ayarları</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Yeni Şifre</label>
              <input
                type="password"
                placeholder="Yeni şifre"
                className="w-full p-3 border rounded-lg bg-gray-50 border-gray-300 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                disabled
              />
            </div>
            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg opacity-50 cursor-not-allowed transition-colors hover:bg-opacity-90">
              Şifreyi Güncelle
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AyarlarSayfasi;
