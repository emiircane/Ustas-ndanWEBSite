-- Kullanıcılar tablosu için RLS politikalarını düzenle
DROP POLICY IF EXISTS "Public kullanıcılar verilerini görüntüleyebilir" ON kullanicilar;
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini güncelleyebilir" ON kullanicilar;
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini ekleyebilir" ON kullanicilar;
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini silebilir" ON kullanicilar;

-- RLS'yi aktif et (eğer henüz aktif değilse)
ALTER TABLE kullanicilar ENABLE ROW LEVEL SECURITY;

-- Yeni politikalar oluştur
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