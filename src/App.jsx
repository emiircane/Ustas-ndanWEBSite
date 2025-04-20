import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import AnaSayfa from "./pages/AnaSayfa";
import DetaySayfasi from "./pages/DetaySayfasi";
import GirisSayfasi from "./pages/GirisSayfasi";
import KayitSayfasi from "./pages/KayitSayfasi";
import AyarlarSayfasi from "./pages/AyarlarSayfasi";
import KategoriSonucSayfasi from "./pages/KategoriSonucSayfasi"; // EKLENDİ ✅

function App() {
  const [kullanici, setKullanici] = useState(null);
  const [menuAcik, setMenuAcik] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const veri = localStorage.getItem("kullanici");
    const giris = localStorage.getItem("girisYaptiMi");
    if (veri && giris === "true") {
      setKullanici(JSON.parse(veri));
    }

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAcik(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cikisYap = () => {
    localStorage.removeItem("girisYaptiMi");
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="min-h-screen bg-orange-50 text-gray-900">
        <header className="bg-orange-600 shadow-md p-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">Ustasından</Link>

          {kullanici ? (
            <div className="relative" ref={menuRef}>
              <img
                src="https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
                alt="profil"
                className="w-10 h-10 rounded-full border cursor-pointer"
                onClick={() => setMenuAcik(!menuAcik)}
              />
              {menuAcik && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 text-sm">
                  <p className="px-4 py-2 text-gray-600">👋 Merhaba, <b>{kullanici.ad}</b></p>
                  <hr />
                  <div className="relative group">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 flex justify-between items-center">
                      Ayarlar <span className="ml-2">▸</span>
                    </button>
                    <div className="absolute left-0 top-0 mt-1 hidden group-hover:block bg-white border rounded shadow-lg w-48">
                      <Link to="/ayarlar" className="block px-4 py-2 hover:bg-gray-100">Profili Düzenle</Link>
                      <Link to="/ayarlar" className="block px-4 py-2 hover:bg-gray-100">Hesap Ayarları</Link>
                    </div>
                  </div>
                  <Link to="/iletisim" className="block px-4 py-2 hover:bg-gray-100">Bize Ulaşın</Link>
                  <button onClick={cikisYap} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100">
                    Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/giris" className="text-white font-semibold hover:bg-orange-700 px-4 py-2 rounded">
                Giriş Yap
              </Link>
              <Link to="/kayit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
                Kayıt Ol
              </Link>
            </div>
          )}
        </header>

        <Routes>
          <Route path="/" element={<AnaSayfa />} />
          <Route path="/detay/:id" element={<DetaySayfasi />} />
          <Route path="/giris" element={<GirisSayfasi />} />
          <Route path="/kayit" element={<KayitSayfasi />} />
          <Route path="/ayarlar" element={<AyarlarSayfasi />} />
          <Route path="/kategori/:isim" element={<KategoriSonucSayfasi />} /> {/* EKLENDİ ✅ */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
