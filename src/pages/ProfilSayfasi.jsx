import { useEffect, useState } from "react";

function ProfilSayfasi() {
  const [kullanici, setKullanici] = useState(null);
  const [aktifSekme, setAktifSekme] = useState("profil");

  useEffect(() => {
    const veri = localStorage.getItem("kullanici");
    if (veri) {
      setKullanici(JSON.parse(veri));
    }
  }, []);

  if (!kullanici) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg">Kullanıcı bilgisi bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Hesap Ayarları</h2>

      {/* SEKME BUTONLARI */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            aktifSekme === "profil"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setAktifSekme("profil")}
        >
          Profil Bilgileri
        </button>
        <button
          className={`px-4 py-2 rounded ${
            aktifSekme === "sifre"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setAktifSekme("sifre")}
        >
          Şifre Değiştir
        </button>
        <button
          className={`px-4 py-2 rounded ${
            aktifSekme === "foto"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setAktifSekme("foto")}
        >
          Profil Fotoğrafı
        </button>
      </div>

      {/* AKTİF SEKME İÇERİĞİ */}
      {aktifSekme === "profil" && (
        <div className="bg-white p-6 rounded shadow text-gray-800 space-y-3">
          <p><strong>Ad:</strong> {kullanici.ad}</p>
          <p><strong>Soyad:</strong> {kullanici.soyad}</p>
          <p><strong>Kullanıcı Adı:</strong> {kullanici.kullaniciAdi}</p>
          <p><strong>E-posta:</strong> {kullanici.email}</p>
        </div>
      )}

      {aktifSekme === "sifre" && (
        <div className="bg-white p-6 rounded shadow text-gray-800">
          <h3 className="text-xl font-semibold mb-4">Şifre Değiştir (yakında)</h3>
          <input
            type="password"
            placeholder="Yeni şifre"
            className="w-full p-3 border rounded mb-4"
            disabled
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed">
            Güncelle
          </button>
        </div>
      )}

      {aktifSekme === "foto" && (
        <div className="bg-white p-6 rounded shadow text-gray-800">
          <h3 className="text-xl font-semibold mb-4">Profil Fotoğrafı Yükle (yakında)</h3>
          <input
            type="file"
            className="w-full p-2 border rounded mb-4"
            disabled
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed">
            Yükle
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilSayfasi;
