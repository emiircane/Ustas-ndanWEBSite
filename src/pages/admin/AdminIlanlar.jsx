import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Search, FileText, Trash2, Edit, Eye, XCircle } from 'lucide-react';

function AdminIlanlar() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit'
  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    fiyat: '',
    durum: 'aktif',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalListings, setTotalListings] = useState(0);
  const listingsPerPage = 10;

  useEffect(() => {
    fetchListings();
  }, [currentPage, searchTerm]);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('ilanlar')
        .select('*, kullanicilar(ad, email)', { count: 'exact' });
      
      // Apply search filter if search term exists
      if (searchTerm) {
        query = query.or(`baslik.ilike.%${searchTerm}%,aciklama.ilike.%${searchTerm}%`);
      }
      
      // Get total count for pagination
      const { count, error: countError } = await query;
      
      if (countError) throw countError;
      
      setTotalListings(count || 0);
      setTotalPages(Math.ceil((count || 0) / listingsPerPage));
      
      // Fetch paginated data
      const { data, error } = await query
        .range((currentPage - 1) * listingsPerPage, currentPage * listingsPerPage - 1)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setListings(data || []);
    } catch (error) {
      console.error('İlanlar alınırken hata:', error);
      setError('İlan verileri alınırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleViewListing = (listing) => {
    setSelectedListing(listing);
    setFormData({
      baslik: listing.baslik || '',
      aciklama: listing.aciklama || '',
      fiyat: listing.fiyat || '',
      durum: listing.durum || 'aktif',
    });
    setModalMode('view');
    setIsListingModalOpen(true);
  };

  const handleEditListing = (listing) => {
    setSelectedListing(listing);
    setFormData({
      baslik: listing.baslik || '',
      aciklama: listing.aciklama || '',
      fiyat: listing.fiyat || '',
      durum: listing.durum || 'aktif',
    });
    setModalMode('edit');
    setIsListingModalOpen(true);
  };

  const handleDeleteClick = (listing) => {
    setSelectedListing(listing);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteListing = async () => {
    if (!selectedListing) return;
    
    try {
      const { error } = await supabase
        .from('ilanlar')
        .delete()
        .eq('id', selectedListing.id);
        
      if (error) throw error;
      
      // Close modal and refresh listing list
      setIsDeleteModalOpen(false);
      fetchListings();
    } catch (error) {
      console.error('İlan silinirken hata:', error);
      alert('İlan silinirken bir hata oluştu.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmitListing = async (e) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'edit' && selectedListing) {
        // Update existing listing
        const { error } = await supabase
          .from('ilanlar')
          .update({
            baslik: formData.baslik,
            aciklama: formData.aciklama,
            fiyat: formData.fiyat,
            durum: formData.durum,
          })
          .eq('id', selectedListing.id);
          
        if (error) throw error;
      }
      
      // Close modal and refresh list
      setIsListingModalOpen(false);
      fetchListings();
    } catch (error) {
      console.error('İlan kaydedilirken hata:', error);
      alert('İlan kaydedilirken bir hata oluştu.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Belirtilmemiş';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">İlan Yönetimi</h2>
          <p className="text-sm text-gray-500">Toplam {totalListings} ilan</p>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="İlan Ara..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Listings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İlan Başlığı
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oluşturulma Tarihi
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'Arama sonucu bulunamadı.' : 'Henüz ilan bulunmamaktadır.'}
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <FileText size={20} className="text-orange-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {listing.baslik}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {listing.aciklama?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{listing.kullanicilar?.ad || 'İsimsiz'}</div>
                      <div className="text-xs text-gray-500">{listing.kullanicilar?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {listing.fiyat ? `₺${listing.fiyat}` : 'Belirtilmemiş'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {listing.durum === 'aktif' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Aktif
                        </span>
                      ) : listing.durum === 'pasif' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Pasif
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {listing.durum || 'Belirsiz'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(listing.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewListing(listing)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditListing(listing)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(listing)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Listing Modal */}
      {isListingModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-full max-w-lg shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {modalMode === 'view' ? 'İlan Detayları' : 'İlanı Düzenle'}
              </h3>
              <button
                onClick={() => setIsListingModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitListing}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="baslik" className="block text-sm font-medium text-gray-700">
                    Başlık
                  </label>
                  <input
                    type="text"
                    name="baslik"
                    id="baslik"
                    value={formData.baslik}
                    onChange={handleFormChange}
                    disabled={modalMode === 'view'}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${modalMode === 'view' ? 'bg-gray-50' : ''}`}
                  />
                </div>
                
                <div>
                  <label htmlFor="aciklama" className="block text-sm font-medium text-gray-700">
                    Açıklama
                  </label>
                  <textarea
                    name="aciklama"
                    id="aciklama"
                    rows="4"
                    value={formData.aciklama}
                    onChange={handleFormChange}
                    disabled={modalMode === 'view'}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${modalMode === 'view' ? 'bg-gray-50' : ''}`}
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="fiyat" className="block text-sm font-medium text-gray-700">
                    Fiyat (₺)
                  </label>
                  <input
                    type="text"
                    name="fiyat"
                    id="fiyat"
                    value={formData.fiyat}
                    onChange={handleFormChange}
                    disabled={modalMode === 'view'}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${modalMode === 'view' ? 'bg-gray-50' : ''}`}
                  />
                </div>
                
                <div>
                  <label htmlFor="durum" className="block text-sm font-medium text-gray-700">
                    Durum
                  </label>
                  <select
                    name="durum"
                    id="durum"
                    value={formData.durum}
                    onChange={handleFormChange}
                    disabled={modalMode === 'view'}
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${modalMode === 'view' ? 'bg-gray-50' : ''}`}
                  >
                    <option value="aktif">Aktif</option>
                    <option value="pasif">Pasif</option>
                    <option value="inceleniyor">İnceleniyor</option>
                  </select>
                </div>
                
                {modalMode !== 'view' && (
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setIsListingModalOpen(false)}
                      className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Güncelle
                    </button>
                  </div>
                )}
                
                {modalMode === 'view' && (
                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setIsListingModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Kapat
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-full max-w-sm shadow-lg rounded-lg bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">İlanı Sil</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </p>
              </div>
              <div className="flex justify-center mt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleDeleteListing}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminIlanlar; 