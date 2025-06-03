# Ustasından - Supabase Veritabanı Kurulumu

Bu belge, Ustasından uygulaması için Supabase veritabanı kurulumunu ve kullanımını açıklar.

## Supabase Kurulumu

1. [Supabase](https://supabase.io) hesabı oluşturun
2. Yeni bir proje oluşturun
3. SQL Editör'ü açın
4. `ustasinden_db_full.sql` dosyasının içeriğini kopyalayın ve SQL Editör'de çalıştırın

## Ortam Değişkenleri

Projede Supabase bağlantı bilgilerinizi kullanmak için, kök dizinde `.env` dosyası oluşturun:

```
NEXT_PUBLIC_SUPABASE_URL=https://gpxrrzalxsvjxgmuhogh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdweHJyemFseHN2anhnbXVob2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDg0OTcsImV4cCI6MjA2NDQ4NDQ5N30.6_Oahg-N6bKzTcvsPUKX7TquTchNJGEsbfxKnlD4P4g
```

## Veritabanı Yapısı

Projede üç ana tablo bulunmaktadır:

1. **kullanicilar**: Kullanıcı profillerini saklar
2. **kategoriler**: Hizmet kategorilerini saklar
3. **ilanlar**: Kullanıcıların oluşturduğu iş ilanlarını saklar

## Admin Girişi

Sistem otomatik olarak bir admin kullanıcısı oluşturur:

- **E-posta**: admin@ustasindanapp.com
- **Şifre**: Admin123!

Bu bilgileri kullanarak /admin sayfasından yönetici paneline erişebilirsiniz.

## Supabase API Kullanımı

`src/supabase.js` dosyasında tanımlanan yardımcı fonksiyonlar ile veritabanı işlemlerini kolayca gerçekleştirebilirsiniz:

### Kullanıcı İşlemleri

```javascript
import { db } from '../supabase';

// Kullanıcı profili getirme
const profile = await db.kullanicilar.getById('kullanici-id');

// Kullanıcı profilini güncelleme
await db.kullanicilar.update('kullanici-id', { 
  ad: 'Yeni Ad', 
  telefon: 'Yeni Telefon' 
});

// Yeni kullanıcı oluşturma
await db.kullanicilar.create({
  id: 'auth-user-id',
  ad: 'Kullanıcı Adı',
  soyad: 'Kullanıcı Soyadı',
  email: 'mail@ornek.com'
});
```

### İlan İşlemleri

```javascript
import { db } from '../supabase';

// Tüm ilanları getirme
const ilanlar = await db.ilanlar.getAll();

// İlan detayını getirme
const ilan = await db.ilanlar.getById(5);

// Kullanıcının ilanlarını getirme
const kullaniciIlanlari = await db.ilanlar.getByUserId('kullanici-id');

// Kategoriye göre ilanları getirme
const kategoriIlanlari = await db.ilanlar.getByCategory(3);

// Yeni ilan oluşturma
await db.ilanlar.create({
  baslik: 'İlan Başlığı',
  aciklama: 'İlan açıklaması',
  kategori_id: 2,
  kullanici_id: 'kullanici-id',
  fiyat: 100,
  konum: 'İstanbul'
});

// İlan güncelleme
await db.ilanlar.update(5, { fiyat: 120 });

// İlan silme
await db.ilanlar.delete(5);
```

### Kategori İşlemleri

```javascript
import { db } from '../supabase';

// Tüm kategorileri getirme
const kategoriler = await db.kategoriler.getAll();

// Kategori detayını getirme
const kategori = await db.kategoriler.getById(3);
```

## Row Level Security (RLS)

Veritabanında güvenlik için Row Level Security (RLS) politikaları tanımlanmıştır:

- Herkes kullanıcı profillerini ve ilanları görüntüleyebilir
- Kimliği doğrulanmış kullanıcılar profil ve ilan oluşturabilir
- Kullanıcılar sadece kendi profil ve ilanlarını güncelleyebilir/silebilir

## Sorun Giderme

Eğer RLS ile ilgili sorunlar yaşarsanız, `rls-fix-kullanicilar.sql` ve `rls-fix-ilanlar.sql` dosyalarını SQL Editör'de çalıştırarak politikaları güncelleyebilirsiniz. 