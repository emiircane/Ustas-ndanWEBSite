import { useState, useEffect } from "react";

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
      setSelectedFile(URL.createObjectURL(file)); // Dosya seçildiğinde önizleme
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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Ayarlar</h2>

      {/* Sekme Butonları */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            aktifSekme === "profilim"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setAktifSekme("profilim")}
        >
          Profili Düzenle
        </button>
        <button
          className={`px-4 py-2 rounded ${
            aktifSekme === "hesap"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setAktifSekme("hesap")}
        >
          Hesap Ayarları
        </button>
      </div>

      {/* Sekme İçerikleri */}
      {/* Profili Düzenle */}
      {aktifSekme === "profilim" && (
        <div className="bg-white p-6 rounded shadow text-gray-800 mb-6">
          <h3 className="text-xl font-semibold mb-4">Kişisel Bilgiler</h3>
          <img
            src={selectedFile || "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"}
            alt="avatar"
            className="w-28 h-28 rounded-full mb-4 mx-auto border"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-3 border rounded mb-4"
          />
          <p><strong>Ad:</strong> {kullanici.ad}</p>
          <p><strong>Soyad:</strong> {kullanici.soyad}</p>
          <p><strong>Kullanıcı Adı:</strong> {kullanici.kullaniciAdi}</p>
          <p><strong>E-posta:</strong> {kullanici.email}</p>
        </div>
      )}

      {/* Hesap Ayarları */}
      {aktifSekme === "hesap" && (
        <div className="bg-white p-6 rounded shadow text-gray-800">
          <h3 className="text-xl font-semibold mb-4">Hesap Ayarları</h3>
          <input
            type="password"
            placeholder="Yeni şifre"
            className="w-full p-3 border rounded mb-4"
            disabled
          />
          <button className="bg-orange-600 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed">
            Şifreyi Güncelle
          </button>
        </div>
      )}
    </div>
  );
}

export default AyarlarSayfasi;
