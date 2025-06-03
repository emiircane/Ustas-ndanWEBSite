import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Save, AlertCircle } from 'lucide-react';

function AdminAyarlar() {
  const [settings, setSettings] = useState({
    site_adi: 'Ustasından',
    site_aciklama: 'En iyi ustalar burada!',
    iletisim_email: 'iletisim@ustasindan.com',
    iletisim_telefon: '0850 123 4567',
    sosyal_facebook: 'https://facebook.com/ustasindan',
    sosyal_instagram: 'https://instagram.com/ustasindan',
    sosyal_twitter: 'https://twitter.com/ustasindan',
    meta_keywords: 'usta, hizmet, tamir, tadilat, uzman, profesyonel',
    meta_description: 'Ustasından - Profesyonel hizmet platformu. En iyi ustalar burada!'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('site_ayarlar')
        .select('*')
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Ayarlar alınırken hata:', error);
      setError('Site ayarları alınırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Check if settings already exist
      const { data: existingData, error: checkError } = await supabase
        .from('site_ayarlar')
        .select('id')
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      let result;
      
      if (existingData) {
        // Update existing settings
        result = await supabase
          .from('site_ayarlar')
          .update(settings)
          .eq('id', existingData.id);
      } else {
        // Insert new settings
        result = await supabase
          .from('site_ayarlar')
          .insert([settings]);
      }
      
      if (result.error) throw result.error;
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata:', error);
      setError('Site ayarları kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Site Ayarları</h2>
          <p className="text-sm text-gray-500">Genel site yapılandırması ve ayarları</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Ayarlar başarıyla kaydedildi!
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Genel Bilgiler</h3>
              <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="site_adi" className="block text-sm font-medium text-gray-700">
                    Site Adı
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="site_adi"
                      id="site_adi"
                      value={settings.site_adi}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="site_aciklama" className="block text-sm font-medium text-gray-700">
                    Site Slogan
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="site_aciklama"
                      id="site_aciklama"
                      value={settings.site_aciklama}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">İletişim Bilgileri</h3>
              <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="iletisim_email" className="block text-sm font-medium text-gray-700">
                    E-posta Adresi
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="iletisim_email"
                      id="iletisim_email"
                      value={settings.iletisim_email}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="iletisim_telefon" className="block text-sm font-medium text-gray-700">
                    Telefon Numarası
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="iletisim_telefon"
                      id="iletisim_telefon"
                      value={settings.iletisim_telefon}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Sosyal Medya</h3>
              <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label htmlFor="sosyal_facebook" className="block text-sm font-medium text-gray-700">
                    Facebook
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="sosyal_facebook"
                      id="sosyal_facebook"
                      value={settings.sosyal_facebook}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="sosyal_instagram" className="block text-sm font-medium text-gray-700">
                    Instagram
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="sosyal_instagram"
                      id="sosyal_instagram"
                      value={settings.sosyal_instagram}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="sosyal_twitter" className="block text-sm font-medium text-gray-700">
                    Twitter
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="sosyal_twitter"
                      id="sosyal_twitter"
                      value={settings.sosyal_twitter}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">SEO Ayarları</h3>
              <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-700">
                    Anahtar Kelimeler
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="meta_keywords"
                      id="meta_keywords"
                      value={settings.meta_keywords}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                    <p className="mt-1 text-xs text-gray-500">Virgül ile ayırarak yazın</p>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700">
                    Meta Açıklama
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="meta_description"
                      id="meta_description"
                      rows="3"
                      value={settings.meta_description}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">En fazla 160 karakter</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Save className={`-ml-1 mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminAyarlar; 