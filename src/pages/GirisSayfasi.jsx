import { useState } from "react";
import { useNavigate } from "react-router-dom";

function GirisSayfasi() {
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [basariliGiris, setBasariliGiris] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (kullaniciAdi === "" || sifre === "") {
      alert("Kullanıcı adı ve şifre boş olamaz!");
      return;
    }

    const kayitliKullanici = JSON.parse(localStorage.getItem("kullanici"));

    if (!kayitliKullanici) {
      alert("Kayıtlı kullanıcı bulunamadı!");
      return;
    }

    if (
      kullaniciAdi === kayitliKullanici.kullaniciAdi &&
      sifre === kayitliKullanici.sifre
    ) {
      localStorage.setItem("girisYaptiMi", "true");
      setBasariliGiris(true);

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2500);
    } else {
      alert("Kullanıcı adı veya şifre yanlış!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">

      {/* ORTADA GİRİŞ BAŞARILI POPUP */}
      {basariliGiris && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-green-500 text-white px-8 py-6 rounded-lg shadow-lg text-center animate-fadeIn">
            <div className="flex justify-center mb-3">
              <svg
                className="w-14 h-14 text-white animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Giriş başarılı!</h3>
            <p className="mt-1 text-sm text-white/90">Yönlendiriliyorsun...</p>
          </div>
        </div>
      )}

      {/* GİRİŞ FORMU */}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Giriş Yap</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={kullaniciAdi}
            onChange={(e) => setKullaniciAdi(e.target.value)}
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
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}

export default GirisSayfasi;
