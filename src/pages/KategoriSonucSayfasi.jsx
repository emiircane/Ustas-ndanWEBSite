import { useParams } from "react-router-dom";
import { useState } from "react";

export default function KategoriSonucSayfasi() {
  const { isim } = useParams();

  const dummyVeriler = [
    {
      id: 1,
      baslik: `${isim} Çağırın - Hızlı ve Güvenilir`,
      konum: "İstanbul / Kadıköy",
      tarih: "20 Nisan 2025",
      puan: 4.8,
      resim: "https://randomuser.me/api/portraits/men/31.jpg",
      sehir: "İstanbul",
      belgeli: true,
      hizmet: "Ev",
      deneyim: "5+ Yıl",
    },
    {
      id: 2,
      baslik: `Uygun Fiyatlı ${isim} Hizmeti`,
      konum: "İstanbul / Beşiktaş",
      tarih: "19 Nisan 2025",
      puan: 4.5,
      resim: "https://randomuser.me/api/portraits/men/32.jpg",
      sehir: "İstanbul",
      belgeli: false,
      hizmet: "Ofis",
      deneyim: "1-3 Yıl",
    },
    {
      id: 3,
      baslik: `Profesyonel ${isim} ile Tanışın!`,
      konum: "Ankara / Çankaya",
      tarih: "18 Nisan 2025",
      puan: 4.9,
      resim: "https://randomuser.me/api/portraits/men/33.jpg",
      sehir: "Ankara",
      belgeli: true,
      hizmet: "Her İkisi",
      deneyim: "3-5 Yıl",
    },
  ];

  const [secilenSehir, setSecilenSehir] = useState("");
  const [belgeliMi, setBelgeliMi] = useState("");
  const [hizmetTuru, setHizmetTuru] = useState("");
  const [deneyim, setDeneyim] = useState("");
  const [filtrelenmis, setFiltrelenmis] = useState(dummyVeriler);

  const filtrele = () => {
    let sonuc = dummyVeriler.filter((item) => {
      return (
        (!secilenSehir || item.sehir === secilenSehir) &&
        (!belgeliMi || item.belgeli === (belgeliMi === "evet")) &&
        (!hizmetTuru || item.hizmet === hizmetTuru) &&
        (!deneyim || item.deneyim === deneyim)
      );
    });
    setFiltrelenmis(sonuc);
  };

  return (
    <div className="flex">
      {/* Sol Filtre Paneli */}
      <aside className="w-1/4 p-4 bg-white border-r min-h-screen">
        <h2 className="font-bold text-lg mb-4">Filtrele</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">İl</label>
          <select onChange={(e) => setSecilenSehir(e.target.value)} className="w-full border p-2 rounded">
            <option value="">Tümü</option>
            <option>İstanbul</option>
            <option>Ankara</option>
            <option>İzmir</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Usta Belgeli</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input type="radio" name="belge" value="evet" onChange={(e) => setBelgeliMi(e.target.value)} /> Evet
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="belge" value="hayir" onChange={(e) => setBelgeliMi(e.target.value)} /> Hayır
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Hizmet Türü</label>
          <select onChange={(e) => setHizmetTuru(e.target.value)} className="w-full border p-2 rounded">
            <option value="">Tümü</option>
            <option>Ev</option>
            <option>Ofis</option>
            <option>Her İkisi</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Deneyim</label>
          <select onChange={(e) => setDeneyim(e.target.value)} className="w-full border p-2 rounded">
            <option value="">Tümü</option>
            <option>1-3 Yıl</option>
            <option>3-5 Yıl</option>
            <option>5+ Yıl</option>
          </select>
        </div>

        <button onClick={filtrele} className="bg-orange-600 text-white px-4 py-2 rounded w-full transition-all duration-300 hover:bg-orange-700">Ara</button>
      </aside>

      {/* Sağ İlan Listesi */}
      <main className="w-3/4 p-6">
        <h1 className="text-2xl font-bold text-orange-600 mb-6">{isim} İlanları</h1>
        <div className="space-y-4">
          {filtrelenmis.map((ilan) => (
            <div
              key={ilan.id}
              className="flex border rounded shadow-sm overflow-hidden bg-white opacity-0 animate-fade-in transition-shadow duration-300 hover:shadow-lg"
            >
              <img src={ilan.resim} alt={ilan.baslik} className="w-40 h-32 object-cover" />
              <div className="p-4 flex flex-col justify-between w-full">
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">{ilan.baslik}</h2>
                  <p className="text-sm text-gray-500">{ilan.konum}</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-xs text-gray-400">{ilan.tarih}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Tailwind Fade-in Keyframes */}
      <style>
        {`
          @keyframes fade-in {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}