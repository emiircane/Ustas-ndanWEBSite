-- İlanlar tablosu için RLS politikalarını düzenle
DROP POLICY IF EXISTS "Herkes ilanları görüntüleyebilir" ON ilanlar;
DROP POLICY IF EXISTS "Kullanıcılar kendi ilanlarını ekleyebilir" ON ilanlar;
DROP POLICY IF EXISTS "Kullanıcılar kendi ilanlarını güncelleyebilir" ON ilanlar;
DROP POLICY IF EXISTS "Kullanıcılar kendi ilanlarını silebilir" ON ilanlar;

-- RLS'yi aktif et (eğer henüz aktif değilse)
ALTER TABLE ilanlar ENABLE ROW LEVEL SECURITY;

-- Yeni politikalar oluştur
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