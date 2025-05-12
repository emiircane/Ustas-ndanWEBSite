-- Önce mevcut politikaları kaldıralım
DROP POLICY IF EXISTS "Public kullanıcılar verilerini görüntüleyebilir" ON kullanicilar;
DROP POLICY IF EXISTS "Kullanıcılar kendi profillerini güncelleyebilir" ON kullanicilar;

-- Yeni politikalar oluşturalım
-- 1. Herkes kullanıcı verilerini görüntüleyebilir
CREATE POLICY "Public kullanıcılar verilerini görüntüleyebilir" ON kullanicilar
  FOR SELECT USING (true);

-- 2. Kullanıcılar kendi profillerini ekleyebilir
CREATE POLICY "Kullanıcılar kendi profillerini ekleyebilir" ON kullanicilar
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Kullanıcılar kendi profillerini güncelleyebilir
CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir" ON kullanicilar
  FOR UPDATE USING (auth.uid() = id);

-- 4. Kullanıcılar kendi profillerini silebilir
CREATE POLICY "Kullanıcılar kendi profillerini silebilir" ON kullanicilar
  FOR DELETE USING (auth.uid() = id); 