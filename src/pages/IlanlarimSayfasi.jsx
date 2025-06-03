import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function IlanlarimSayfasi() {
  const [kullanici, setKullanici] = useState(null);
  const [ilanlar, setIlanlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const veri = localStorage.getItem("kullanici");
    if (veri) {
      setKullanici(JSON.parse(veri));
    }
  }, []);

  useEffect(() => {
    if (kullanici) {
      ilanlarGetir();
    }
  }, [kullanici]);

  const ilanlarGetir = async () => {
    if (!kullanici) return;
    
    try {
      setYukleniyor(true);
      setHata("");
      
      // Önce kullanıcının oturumunu kontrol et
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData || !sessionData.session) {
        throw new Error("Oturum bulunamadı");
      }
      
      // Kullanıcının ilanlarını getir
      const { data, error } = await supabase
        .from('ilanlar')
        .select(`
          *,
          kategoriler(isim)
        `)
        .eq('kullanici_id', sessionData.session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setIlanlar(data || []);
    } catch (error) {
      console.error("İlanlar getirilirken hata:", error.message);
      setHata("İlanlarınız yüklenirken bir hata oluştu");
    } finally {
      setYukleniyor(false);
    }
  };

  const ilanDetayGit = (ilanId) => {
    navigate(`/ilan/${ilanId}`);
  };

  if (!kullanici) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg">Kullanıcı bilgisi bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">İlanlarım</h3>
          <button
            onClick={() => navigate("/ilan-olustur")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Yeni İlan
          </button>
        </div>
        
        {yukleniyor ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">İlanlarınız yükleniyor...</p>
          </div>
        ) : hata ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{hata}</p>
              </div>
            </div>
          </div>
        ) : ilanlar.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-600 mb-2">Henüz ilan oluşturmadınız</p>
            <button 
              onClick={() => navigate("/ilan-olustur")}
              className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              İlk İlanınızı Oluşturun
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ilanlar.map((ilan) => (
              <div 
                key={ilan.id} 
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => ilanDetayGit(ilan.id)}
              >
                <div className="h-48 overflow-hidden bg-gray-100">
                  {ilan.resimler && ilan.resimler.length > 0 ? (
                    <img 
                      src={ilan.resimler[0]} 
                      alt={ilan.baslik} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <svg className="h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full">
                      {ilan.kategoriler?.isim || "Kategori"}
                    </span>
                    {ilan.fiyat ? (
                      <span className="font-bold text-gray-700">{ilan.fiyat} ₺</span>
                    ) : (
                      <span className="font-medium text-gray-500">Fiyat Sorunuz</span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-800 mb-2 truncate">
                    {ilan.baslik}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {ilan.aciklama}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{ilan.konum || "Konum belirtilmedi"}</span>
                    <span>
                      {new Date(ilan.created_at).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default IlanlarimSayfasi;
