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

-- Kullanıcılar için Row Level Security (RLS) politikası
ALTER TABLE kullanicilar ENABLE ROW LEVEL SECURITY;

-- İlanlar için Row Level Security (RLS) politikası
ALTER TABLE ilanlar ENABLE ROW LEVEL SECURITY;

-- Public profilleri herkes okuyabilir
CREATE POLICY "Public kullanıcılar verilerini görüntüleyebilir" ON kullanicilar
  FOR SELECT USING (true);

-- Kullanıcılar kendi profillerini güncelleyebilir
CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir" ON kullanicilar
  FOR UPDATE USING (auth.uid() = id);

-- Herkes ilanları görüntüleyebilir
CREATE POLICY "Herkes ilanları görüntüleyebilir" ON ilanlar
  FOR SELECT USING (true);

-- Kullanıcılar kendi ilanlarını ekleyebilir
CREATE POLICY "Kullanıcılar kendi ilanlarını ekleyebilir" ON ilanlar
  FOR INSERT WITH CHECK (auth.uid() = kullanici_id);

-- Kullanıcılar kendi ilanlarını güncelleyebilir
CREATE POLICY "Kullanıcılar kendi ilanlarını güncelleyebilir" ON ilanlar
  FOR UPDATE USING (auth.uid() = kullanici_id);

-- Kullanıcılar kendi ilanlarını silebilir
CREATE POLICY "Kullanıcılar kendi ilanlarını silebilir" ON ilanlar
  FOR DELETE USING (auth.uid() = kullanici_id); 