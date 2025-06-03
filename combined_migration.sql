-- Ustasından - Birleştirilmiş Veritabanı Kurulum Dosyası

------------------------------------------
-- 1. TEMEL TABLOLARIN OLUŞTURULMASI
------------------------------------------

-- Kategoriler tablosu
CREATE TABLE kategoriler (
  id SERIAL PRIMARY KEY,
  isim TEXT NOT NULL,
  ikon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanıcılar tablosu
CREATE TABLE kullanicilar (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  ad TEXT NOT NULL,
  soyad TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefon TEXT,
  profil_resmi TEXT,
  adres TEXT,
  meslek TEXT,
  hakkinda TEXT,
  ustalik_alani TEXT,
  ortalama_puan FLOAT DEFAULT 0,
  degerlendirme_sayisi INTEGER DEFAULT 0,
  is_usta BOOLEAN DEFAULT FALSE,
  admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İlanlar tablosu
CREATE TABLE ilanlar (
  id SERIAL PRIMARY KEY,
  baslik TEXT NOT NULL,
  aciklama TEXT NOT NULL,
  kategori_id INTEGER REFERENCES kategoriler(id),
  kullanici_id UUID REFERENCES kullanicilar(id),
  fiyat INTEGER,
  konum TEXT,
  resimler TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

------------------------------------------
-- 2. ÖRNEK VERİLER
------------------------------------------

-- Örnek kategori verileri
INSERT INTO kategoriler (isim, ikon) VALUES 
  ('Elektrikçi', 'Plug'),
  ('Tesisatçı', 'Wrench'),
  ('Boyacı', 'Paintbrush'),
  ('Marangoz', 'Hammer'),
  ('Temizlikçi', 'Sparkles'),
  ('Nakliyeci', 'Truck'),
  ('Çilingir', 'Key'),
  ('Kombi Servisi', 'Thermometer');

------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLİTİKALARI
------------------------------------------

-- RLS'yi aktif et
ALTER TABLE kullanicilar ENABLE ROW LEVEL SECURITY;
ALTER TABLE ilanlar ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar tablosu için RLS politikaları
DROP POLICY IF EXISTS "Public kullanıcılar verilerini görüntüleyebilir" ON kullanicilar;
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini güncelleyebilir" ON kullanicilar;
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini ekleyebilir" ON kullanicilar;
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini silebilir" ON kullanicilar;
DROP POLICY IF EXISTS "Kimliği doğrulanmış kullanıcılar profil ekleyebilir" ON kullanicilar;

-- 1. Herkes kullanıcı verilerini görüntüleyebilir
CREATE POLICY "Public kullanıcılar verilerini görüntüleyebilir" 
ON kullanicilar FOR SELECT 
USING (true);

-- 2. Kimliği doğrulanmış kullanıcılar kendi profillerini ekleyebilir
CREATE POLICY "Kimliği doğrulanmış kullanıcılar profil ekleyebilir" 
ON kullanicilar FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 3. Kullanıcılar kendi profillerini güncelleyebilir
CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir" 
ON kullanicilar FOR UPDATE 
USING (auth.uid() = id);

-- 4. Kullanıcılar kendi profillerini silebilir
CREATE POLICY "Kullanıcılar kendi profillerini silebilir" 
ON kullanicilar FOR DELETE 
USING (auth.uid() = id);

-- İlanlar tablosu için RLS politikaları
DROP POLICY IF EXISTS "Herkes ilanları görüntüleyebilir" ON ilanlar;
DROP POLICY IF EXISTS "Kullanıcılar kendi ilanlarını ekleyebilir" ON ilanlar;
DROP POLICY IF EXISTS "Kullanıcılar kendi ilanlarını güncelleyebilir" ON ilanlar;
DROP POLICY IF EXISTS "Kullanıcılar kendi ilanlarını silebilir" ON ilanlar;
DROP POLICY IF EXISTS "Kimliği doğrulanmış kullanıcılar ilan ekleyebilir" ON ilanlar;

-- 1. Herkes ilanları görüntüleyebilir
CREATE POLICY "Herkes ilanları görüntüleyebilir" 
ON ilanlar FOR SELECT 
USING (true);

-- 2. Herhangi bir kimliği doğrulanmış kullanıcı ilan ekleyebilir
CREATE POLICY "Kimliği doğrulanmış kullanıcılar ilan ekleyebilir" 
ON ilanlar FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 3. Kullanıcılar sadece kendi ilanlarını güncelleyebilir
CREATE POLICY "Kullanıcılar kendi ilanlarını güncelleyebilir" 
ON ilanlar FOR UPDATE 
USING (auth.uid() = kullanici_id);

-- 4. Kullanıcılar sadece kendi ilanlarını silebilir
CREATE POLICY "Kullanıcılar kendi ilanlarını silebilir" 
ON ilanlar FOR DELETE 
USING (auth.uid() = kullanici_id);

------------------------------------------
-- 4. YÖNETİMSEL FONKSİYONLAR
------------------------------------------

-- Admin kolonu ekleme fonksiyonu
CREATE OR REPLACE FUNCTION add_admin_column_to_kullanicilar()
RETURNS void AS $$
BEGIN
  -- Check if admin column exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'kullanicilar'
    AND column_name = 'admin'
  ) THEN
    -- Add the admin column
    ALTER TABLE kullanicilar ADD COLUMN admin BOOLEAN DEFAULT false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 