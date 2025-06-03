-- Ustasından Veritabanı Düzeltme SQL

-- Not: E-posta doğrulama ayarını aşağıdaki yoldan değiştirin:
-- Supabase Kontrol Paneli > Authentication > Settings > Email Auth > "Email Confirmation" seçeneğini kapatın

-- 1. Kullanıcılar tablosundaki çift kayıtları temizle
-- Önce tüm kullanıcı id'lerini al
WITH duplicate_users AS (
  SELECT id, email, COUNT(*) 
  FROM kullanicilar 
  GROUP BY id, email 
  HAVING COUNT(*) > 1
)
-- Çift kayıtları tespit et ve gereksiz olanları sil
DELETE FROM kullanicilar
WHERE id IN (
  SELECT id FROM duplicate_users
) 
-- İlk kayıt dışındakileri sil (ctid PostgreSQL'in iç satır tanımlayıcısıdır)
AND ctid NOT IN (
  SELECT MIN(ctid) 
  FROM kullanicilar 
  WHERE id IN (SELECT id FROM duplicate_users) 
  GROUP BY id
);

-- 2. Kullanıcılar tablosunda eksik alanları doldur
UPDATE kullanicilar
SET 
  ad = COALESCE(ad, 'Kullanıcı'),
  soyad = COALESCE(soyad, ''),
  is_usta = COALESCE(is_usta, false),
  admin = COALESCE(admin, false)
WHERE 
  ad IS NULL OR soyad IS NULL OR is_usta IS NULL OR admin IS NULL; 