-- Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  ad TEXT NOT NULL,
  soyad TEXT NOT NULL,
  telefon TEXT,
  adres TEXT,
  profil_fotografi TEXT DEFAULT 'https://www.gravatar.com/avatar/?d=mp',
  rol TEXT DEFAULT 'user' CHECK (rol IN ('user', 'admin')),
  uzmanlik_alanlari TEXT[],
  deneyim_yili INTEGER DEFAULT 0,
  ortalama_puan NUMERIC(3,2) DEFAULT 0,
  puanlama_sayisi INTEGER DEFAULT 0,
  engellendi BOOLEAN DEFAULT FALSE,
  engelleme_tarihi TIMESTAMP WITH TIME ZONE,
  olusturulma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT now(),
  guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- İlanlar tablosu
CREATE TABLE IF NOT EXISTS ilanlar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kullanici_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  baslik TEXT NOT NULL,
  aciklama TEXT NOT NULL,
  kategori TEXT NOT NULL,
  konum TEXT,
  fotograflar TEXT[],
  etiketler TEXT[],
  goruntuleme_sayisi INTEGER DEFAULT 0,
  durum TEXT DEFAULT 'beklemede' CHECK (durum IN ('beklemede', 'onaylandi', 'reddedildi')),
  red_sebebi TEXT,
  aktif BOOLEAN DEFAULT FALSE,
  olusturulma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT now(),
  guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Değerlendirmeler tablosu
CREATE TABLE IF NOT EXISTS degerlendirmeler (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ilan_id UUID REFERENCES ilanlar(id) ON DELETE CASCADE NOT NULL,
  kullanici_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  puan INTEGER NOT NULL CHECK (puan BETWEEN 1 AND 5),
  yorum TEXT,
  olusturulma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT now(),
  guncelleme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (ilan_id, kullanici_id)
);

-- Onay işlemleri tablosu
CREATE TABLE IF NOT EXISTS onaylar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ilan_id UUID REFERENCES ilanlar(id) ON DELETE CASCADE NOT NULL,
  admin_id UUID REFERENCES users(id) NOT NULL,
  durum TEXT NOT NULL CHECK (durum IN ('onaylandi', 'reddedildi')),
  red_sebebi TEXT,
  islem_tarihi TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Favoriler tablosu
CREATE TABLE IF NOT EXISTS favoriler (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kullanici_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  ilan_id UUID REFERENCES ilanlar(id) ON DELETE CASCADE NOT NULL,
  olusturulma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (kullanici_id, ilan_id)
);

-- Mesajlar tablosu
CREATE TABLE IF NOT EXISTS mesajlar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gonderen_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  alici_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  ilan_id UUID REFERENCES ilanlar(id) ON DELETE SET NULL,
  icerik TEXT NOT NULL,
  okundu BOOLEAN DEFAULT FALSE,
  gonderilme_tarihi TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bildirimler tablosu
CREATE TABLE IF NOT EXISTS bildirimler (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kullanici_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  baslik TEXT NOT NULL,
  icerik TEXT NOT NULL,
  tur TEXT NOT NULL CHECK (tur IN ('ilan_onay', 'ilan_red', 'mesaj', 'degerlendirme', 'sistem')),
  ilgili_id UUID,
  okundu BOOLEAN DEFAULT FALSE,
  olusturulma_tarihi TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Kullanıcılar tablosu için tetikleyici
CREATE OR REPLACE FUNCTION update_user_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.guncelleme_tarihi = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_timestamp_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_user_timestamp();

-- İlanlar tablosu için tetikleyici
CREATE OR REPLACE FUNCTION update_ilan_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.guncelleme_tarihi = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ilanlar_timestamp_trigger
BEFORE UPDATE ON ilanlar
FOR EACH ROW
EXECUTE FUNCTION update_ilan_timestamp();

-- Değerlendirmeler tablosu için tetikleyici
CREATE OR REPLACE FUNCTION update_degerlendirme_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.guncelleme_tarihi = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER degerlendirmeler_timestamp_trigger
BEFORE UPDATE ON degerlendirmeler
FOR EACH ROW
EXECUTE FUNCTION update_degerlendirme_timestamp();

-- Değerlendirme eklendiğinde/güncellendiğinde ortalama puanı güncelle
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
DECLARE
  ilan_user_id UUID;
  avg_rating NUMERIC(3,2);
  rating_count INTEGER;
BEGIN
  -- İlana ait kullanıcı ID'sini al
  SELECT i.kullanici_id INTO ilan_user_id FROM ilanlar i WHERE i.id = NEW.ilan_id;
  
  -- Kullanıcının tüm ilanlarındaki değerlendirmelerin ortalamasını hesapla
  SELECT 
    COALESCE(AVG(d.puan), 0)::NUMERIC(3,2),
    COUNT(d.id)
  INTO 
    avg_rating,
    rating_count
  FROM degerlendirmeler d
  JOIN ilanlar i ON d.ilan_id = i.id
  WHERE i.kullanici_id = ilan_user_id;
  
  -- Kullanıcının ortalama puanını güncelle
  UPDATE users 
  SET 
    ortalama_puan = avg_rating,
    puanlama_sayisi = rating_count
  WHERE id = ilan_user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_trigger
AFTER INSERT OR UPDATE ON degerlendirmeler
FOR EACH ROW
EXECUTE FUNCTION update_user_rating();

-- RLS Politikaları --

-- Güvenlik özellikleri için ROW LEVEL SECURITY (RLS) etkinleştirme
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ilanlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE degerlendirmeler ENABLE ROW LEVEL SECURITY;
ALTER TABLE onaylar ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoriler ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesajlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE bildirimler ENABLE ROW LEVEL SECURITY;

-- Kullanıcı tablosu için politikalar
-- Herkes profilleri görüntüleyebilir
CREATE POLICY users_select_policy ON users 
  FOR SELECT USING (true);

-- Kullanıcı kendi profilini düzenleyebilir
CREATE POLICY users_update_own_policy ON users 
  FOR UPDATE USING (auth.uid() = id);

-- Adminler her kullanıcıyı düzenleyebilir
CREATE POLICY users_admin_all_policy ON users 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- İlanlar için politikalar
-- Onaylanmış ve aktif ilanları herkes görebilir
CREATE POLICY ilanlar_select_public_policy ON ilanlar 
  FOR SELECT USING (durum = 'onaylandi' AND aktif = true);

-- Kullanıcı kendi tüm ilanlarını görüntüleyebilir
CREATE POLICY ilanlar_select_own_policy ON ilanlar 
  FOR SELECT USING (auth.uid() = kullanici_id);

-- Kullanıcı kendi ilanlarını oluşturabilir
CREATE POLICY ilanlar_insert_policy ON ilanlar 
  FOR INSERT WITH CHECK (auth.uid() = kullanici_id);

-- Kullanıcı kendi ilanlarını düzenleyebilir
CREATE POLICY ilanlar_update_own_policy ON ilanlar 
  FOR UPDATE USING (auth.uid() = kullanici_id);

-- Kullanıcı kendi ilanlarını silebilir
CREATE POLICY ilanlar_delete_own_policy ON ilanlar 
  FOR DELETE USING (auth.uid() = kullanici_id);

-- Adminler tüm ilanları yönetebilir
CREATE POLICY ilanlar_admin_all_policy ON ilanlar 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Değerlendirmeler için politikalar
-- Değerlendirmeleri herkes görebilir
CREATE POLICY degerlendirmeler_select_policy ON degerlendirmeler 
  FOR SELECT USING (true);

-- Kullanıcı kendi değerlendirmelerini ekleyebilir
CREATE POLICY degerlendirmeler_insert_policy ON degerlendirmeler 
  FOR INSERT WITH CHECK (auth.uid() = kullanici_id);

-- Kullanıcı kendi değerlendirmelerini güncelleyebilir
CREATE POLICY degerlendirmeler_update_own_policy ON degerlendirmeler 
  FOR UPDATE USING (auth.uid() = kullanici_id);

-- Kullanıcı kendi değerlendirmelerini silebilir
CREATE POLICY degerlendirmeler_delete_own_policy ON degerlendirmeler 
  FOR DELETE USING (auth.uid() = kullanici_id);

-- Adminler tüm değerlendirmeleri yönetebilir
CREATE POLICY degerlendirmeler_admin_all_policy ON degerlendirmeler 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Onay işlemleri için politikalar
-- Onay işlemlerini sadece adminler görebilir ve yönetebilir
CREATE POLICY onaylar_admin_all_policy ON onaylar 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Favoriler için politikalar
-- Kullanıcı kendi favorilerini ekleyebilir
CREATE POLICY favoriler_insert_policy ON favoriler 
  FOR INSERT WITH CHECK (auth.uid() = kullanici_id);

-- Kullanıcı kendi favorilerini görebilir
CREATE POLICY favoriler_select_own_policy ON favoriler 
  FOR SELECT USING (auth.uid() = kullanici_id);

-- Kullanıcı kendi favorilerini silebilir
CREATE POLICY favoriler_delete_own_policy ON favoriler 
  FOR DELETE USING (auth.uid() = kullanici_id);

-- Adminler tüm favorileri yönetebilir
CREATE POLICY favoriler_admin_all_policy ON favoriler 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Mesajlar için politikalar
-- Kullanıcı kendi mesajlarını görebilir (gönderilen veya alınan)
CREATE POLICY mesajlar_select_own_policy ON mesajlar 
  FOR SELECT USING (auth.uid() = gonderen_id OR auth.uid() = alici_id);

-- Kullanıcı mesaj gönderebilir
CREATE POLICY mesajlar_insert_policy ON mesajlar 
  FOR INSERT WITH CHECK (auth.uid() = gonderen_id);

-- Kullanıcı kendi mesajlarının okundu durumunu güncelleyebilir
CREATE POLICY mesajlar_update_own_policy ON mesajlar 
  FOR UPDATE USING (auth.uid() = alici_id);

-- Adminler tüm mesajları yönetebilir
CREATE POLICY mesajlar_admin_all_policy ON mesajlar 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Bildirimler için politikalar
-- Kullanıcı kendi bildirimlerini görebilir
CREATE POLICY bildirimler_select_own_policy ON bildirimler 
  FOR SELECT USING (auth.uid() = kullanici_id);

-- Bildirim eklemek için politika (sistem veya admin)
CREATE POLICY bildirimler_insert_policy ON bildirimler 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Kullanıcı kendi bildirimlerinin okundu durumunu güncelleyebilir
CREATE POLICY bildirimler_update_own_policy ON bildirimler 
  FOR UPDATE USING (auth.uid() = kullanici_id);

-- Adminler tüm bildirimleri yönetebilir
CREATE POLICY bildirimler_admin_all_policy ON bildirimler 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- İlk admin kullanıcısını oluşturma (Yalnızca test ortamında kullanın)
-- INSERT INTO users (id, email, ad, soyad, telefon, rol)
-- VALUES (
--   '00000000-0000-0000-0000-000000000000', -- Bu ID'yi auth.users tablosundan gerçek bir kullanıcı ID'siyle değiştirin
--   'admin@example.com',
--   'Admin',
--   'User',
--   '5551234567',
--   'admin'
-- ); 