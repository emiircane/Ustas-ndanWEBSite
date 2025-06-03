-- Admin kullanıcısı oluşturma SQL
-- Bu SQL kodlarını Supabase SQL Editor'de çalıştırın

-- 1. Admin kullanıcısı için UUID oluştur
DO $$
DECLARE
  admin_id UUID := '00000000-0000-0000-0000-000000000000'; -- Sabit bir UUID kullanıyoruz
  admin_email VARCHAR := 'admin@ustasindanapp.com';
  admin_password VARCHAR := 'Admin123!';
  admin_hashed_password VARCHAR;
BEGIN
  -- Şifreyi hash'le
  admin_hashed_password := crypt(admin_password, gen_salt('bf'));
  
  -- 2. Auth kullanıcısı ekle (eğer yoksa)
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
  VALUES (
    admin_id, 
    admin_email,
    admin_hashed_password,
    NOW(),
    'authenticated'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = admin_email,
      encrypted_password = admin_hashed_password,
      updated_at = NOW();
  
  -- 3. Kullanıcı profilini oluştur ve admin olarak işaretle
  INSERT INTO public.kullanicilar (
    id, 
    ad, 
    soyad, 
    email, 
    admin, 
    is_usta
  )
  VALUES (
    admin_id,
    'Admin',
    'Kullanıcı',
    admin_email,
    TRUE,
    FALSE
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    admin = TRUE,
    ad = 'Admin',
    soyad = 'Kullanıcı',
    email = admin_email;
    
  -- Bilgilendirme mesajı
  RAISE NOTICE 'Admin kullanıcısı oluşturuldu veya güncellendi: %', admin_email;
END $$; 