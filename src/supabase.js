import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gpxrrzalxsvjxgmuhogh.supabase.co'
const supabaseKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdweHJyemFseHN2anhnbXVob2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDg0OTcsImV4cCI6MjA2NDQ4NDQ5N30.6_Oahg-N6bKzTcvsPUKX7TquTchNJGEsbfxKnlD4P4g'

// Supabase client oluştur - özel config ile
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Storage yardımcı fonksiyonları
export const storage = {
  // Bucket oluşturma işlemi yerine doğrudan var olan bucket'ı kullanıyoruz
  // Bucket'ı admin panelinden oluşturmak gerekiyor
  BUCKET_NAME: 'ilan-resimleri',
  
  // Resim yükleme
  uploadImage: async (file, path) => {
    if (!file) return { error: { message: "Dosya belirtilmedi" } };
    
    try {
      const bucketName = storage.BUCKET_NAME;
      
      // Dosya boyutu kontrolü
      if (file.size > 5 * 1024 * 1024) { // 5MB
        return { error: { message: "Dosya boyutu 5MB'dan büyük olamaz" } };
      }
      
      // Dosya tipini kontrol et
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return { error: { message: "Sadece PNG, JPEG veya WebP dosyaları yüklenebilir" } };
      }
      
      // Yükleme yolunu belirle
      const filePath = path || `public/${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
      
      // Resmi yükle
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Resim URL'sini al
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      return { 
        data: { 
          path: filePath,
          url: urlData.publicUrl,
          size: file.size,
          mimetype: file.type
        },
        error: null
      };
    } catch (error) {
      console.error("Resim yüklenirken hata:", error.message);
      return { error };
    }
  },
  
  // Resim silme
  deleteImage: async (path) => {
    if (!path) return { error: { message: "Silinecek resim yolu belirtilmedi" } };
    
    try {
      const { error } = await supabase.storage
        .from(storage.BUCKET_NAME)
        .remove([path]);
      
      if (error) throw error;
      
      return { data: true, error: null };
    } catch (error) {
      console.error("Resim silinirken hata:", error.message);
      return { error };
    }
  },
  
  // Thumbnail oluşturma
  createThumbnail: async (file, maxWidth = 200, maxHeight = 200) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          
          img.onload = () => {
            let width = img.width;
            let height = img.height;
            
            // Oranları koru
            if (width > height) {
              if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }
            
            // Canvas oluştur ve resmi küçült
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            // Blob olarak döndür
            canvas.toBlob((blob) => {
              resolve(blob);
            }, file.type, 0.7); // %70 kalite
          };
          
          img.onerror = (error) => {
            reject(error);
          };
        };
        
        reader.onerror = (error) => {
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }
};

// initStorageBucket kaldırıldı, yerine konsola bilgi mesajı
console.log("Supabase Storage sistemi kullanıma hazır (ilan-resimleri bucket'ı önceden oluşturulmuş olmalıdır)");

// Yardımcı veritabanı fonksiyonları
export const db = {
  // Kullanıcı ile ilgili işlemler
  kullanicilar: {
    // Kullanıcı profili getir
    getById: async (id) => {
      const { data, error } = await supabase
        .from('kullanicilar')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    
    // Tüm kullanıcıları getir
    getAll: async () => {
      const { data, error } = await supabase
        .from('kullanicilar')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    
    // Kullanıcı profilini güncelle
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('kullanicilar')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      return data;
    },
    
    // Yeni kullanıcı profili oluştur
    create: async (profile) => {
      const { data, error } = await supabase
        .from('kullanicilar')
        .insert([profile]);
      
      if (error) throw error;
      return data;
    }
  },
  
  // İlanlar ile ilgili işlemler
  ilanlar: {
    // Tüm ilanları getir
    getAll: async () => {
      const { data, error } = await supabase
        .from('ilanlar')
        .select('*, kategoriler(*), kullanicilar(*)');
      
      if (error) throw error;
      return data;
    },
    
    // İlan detayını getir
    getById: async (id) => {
      const { data, error } = await supabase
        .from('ilanlar')
        .select('*, kategoriler(*), kullanicilar(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    
    // Kullanıcının ilanlarını getir
    getByUserId: async (userId) => {
      const { data, error } = await supabase
        .from('ilanlar')
        .select('*, kategoriler(*)')
        .eq('kullanici_id', userId);
      
      if (error) throw error;
      return data;
    },
    
    // Kategoriye göre ilanları getir
    getByCategory: async (categoryId) => {
      const { data, error } = await supabase
        .from('ilanlar')
        .select('*, kategoriler(*), kullanicilar(*)')
        .eq('kategori_id', categoryId);
      
      if (error) throw error;
      return data;
    },
    
    // Yeni ilan oluştur
    create: async (ilan) => {
      const { data, error } = await supabase
        .from('ilanlar')
        .insert([ilan]);
      
      if (error) throw error;
      return data;
    },
    
    // İlan güncelle
    update: async (id, updates) => {
      const { data, error } = await supabase
        .from('ilanlar')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      return data;
    },
    
    // İlan sil
    delete: async (id) => {
      const { data, error } = await supabase
        .from('ilanlar')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return data;
    }
  },
  
  // Kategoriler ile ilgili işlemler
  kategoriler: {
    // Tüm kategorileri getir
    getAll: async () => {
      const { data, error } = await supabase
        .from('kategoriler')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    
    // Kategori detayını getir
    getById: async (id) => {
      const { data, error } = await supabase
        .from('kategoriler')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  }
} 