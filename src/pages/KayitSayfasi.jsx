import { useState } from "react";

function KayitSayfasi() {
  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ad || !soyad || !kullaniciAdi || !email || !sifre) {
      alert("Lütfen tüm alanları doldur.");
      return;
    }

    if (!email.includes("@")) {
      alert("Geçerli bir e-posta gir.");
      return;
    }

    if (sifre.length < 6) {
      alert("Şifre en az 6 karakter olmalı.");
      return;
    }

    const yeniKullanici = {
      ad,
      soyad,
      kullaniciAdi,
      email,
      sifre
    };

    localStorage.setItem("kullanici", JSON.stringify(yeniKullanici));

    alert(`Kayıt başarılı! Hoş geldin ${ad} ${soyad}`);
    console.log("Kayıt verisi kaydedildi:", yeniKullanici);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Kayıt Ol</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Ad"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            placeholder="Soyad"
            value={soyad}
            onChange={(e) => setSoyad(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={kullaniciAdi}
            onChange={(e) => setKullaniciAdi(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
          >
            Kayıt Ol
          </button>
        </form>
      </div>
    </div>
  );
}

export default KayitSayfasi;
