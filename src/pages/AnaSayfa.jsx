import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import {
  Plug,
  Wrench,
  Paintbrush,
  Hammer,
  Sparkles,
  Truck,
  Key,
  Thermometer,
  Zap
} from "lucide-react";

const isimListesi = [
  "Ahmet Yılmaz", "Mehmet Demir", "Ali Kaya", "Mustafa Çelik", "Hasan Şahin",
  "İbrahim Koç", "Osman Acar", "Yusuf Kaplan", "Ramazan Eren", "Kemal Özdemir",
  "Cemal Güneş", "Tolga Aksoy", "Hakan Yıldız", "Barış Tunç", "Serkan Arslan"
];

const kategoriIkon = {
  Elektrikçi: <Plug className="mx-auto mb-2 text-orange-600" size={32} />,
  Tesisatçı: <Wrench className="mx-auto mb-2 text-orange-600" size={32} />,
  Boyacı: <Paintbrush className="mx-auto mb-2 text-orange-600" size={32} />,
  Marangoz: <Hammer className="mx-auto mb-2 text-orange-600" size={32} />,
  Temizlikçi: <Sparkles className="mx-auto mb-2 text-orange-600" size={32} />,
  Nakliyeci: <Truck className="mx-auto mb-2 text-orange-600" size={32} />,
  Çilingir: <Key className="mx-auto mb-2 text-orange-600" size={32} />,
  "Kombi Servisi": <Thermometer className="mx-auto mb-2 text-orange-600" size={32} />
};

export default function AnaSayfa() {
  const sliderRef = useRef();

  useEffect(() => {
    const slider = sliderRef.current;
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      slider.classList.add("cursor-grabbing");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* HERO */}
      <section className="bg-orange-50 text-center py-16 px-4">
        <h2 className="text-4xl font-bold text-orange-600 mb-4">Usta mı lazım?</h2>
        <p className="text-gray-700 mb-6">Hemen kategorini seç, çevrendeki hizmet verenleri bul!</p>
        <input
          type="text"
          placeholder="Örn: Elektrikçi, Su Tesisatçısı..."
          className="p-4 w-full max-w-xl border border-gray-300 rounded-md shadow-sm mx-auto"
        />
      </section>

      {/* KATEGORİLER */}
      <section className="py-12 px-6">
        <h3 className="text-2xl font-semibold mb-6 text-center text-orange-600">Popüler Kategoriler</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Elektrikçi", "Tesisatçı", "Boyacı", "Marangoz", "Temizlikçi", "Nakliyeci", "Çilingir", "Kombi Servisi"].map((kategori) => (
            <Link
              key={kategori}
              to={`/kategori/${encodeURIComponent(kategori)}`}
              className="bg-white border rounded-lg shadow hover:shadow-md p-6 text-center cursor-pointer block"
            >
              {kategoriIkon[kategori]}
              <p className="text-lg font-medium text-gray-800">{kategori}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* HİZMET VERENLER */}
      <section className="py-12 bg-gray-50 px-6">
        <h3 className="text-2xl font-semibold mb-6 text-center text-orange-600">Öne Çıkan Hizmet Verenler</h3>
        <div className="relative">
          <div
            className="flex gap-4 overflow-x-scroll snap-x snap-mandatory scroll-smooth px-1 hide-scroll-bar cursor-grab"
            ref={sliderRef}
          >
            {Array.from({ length: 15 }, (_, i) => i).map((index) => (
              <Link
                key={index}
                to={`/detay/${index + 1}`}
                className="min-w-[200px] snap-start bg-white border rounded-lg shadow-md p-4 flex-shrink-0 hover:shadow-lg transition duration-200"
              >
                <img
                  src={`https://randomuser.me/api/portraits/men/${index + 1}.jpg`}
                  alt={`Usta ${isimListesi[index]}`}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-lg font-bold">{isimListesi[index]}</h4>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">✔ Onaylı</span>
                </div>
                <p className="text-sm text-gray-600">★★★★★ 4.{Math.floor(Math.random() * 9) + 1}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-orange-100 text-center text-gray-600 py-6">
        <p>© 2025 Ustasından - Tüm hakları saklıdır.</p>
        <p className="text-sm mt-1">Hakkımızda • İletişim • Gizlilik</p>
      </footer>

      {/* GÖRÜNMEZ SCROLLBAR CSS */}
      <style>
        {`
          .hide-scroll-bar::-webkit-scrollbar {
            display: none;
          }
          .hide-scroll-bar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </div>
  );
}
