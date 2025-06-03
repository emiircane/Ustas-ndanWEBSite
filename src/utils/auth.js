import { supabase } from '../supabase';

// Kullanıcının oturum durumunu kontrol et
export const checkAuth = async () => {
  const { data: session } = await supabase.auth.getSession();
  return session?.session?.user || null;
};

// Kullanıcının admin olup olmadığını kontrol et
export const checkAdmin = async () => {
  const user = await checkAuth();
  
  if (!user) return false;
  
  // Kullanıcı verilerini getir
  const { data, error } = await supabase
    .from('kullanicilar')
    .select('admin')
    .eq('id', user.id)
    .single();
  
  if (error || !data) return false;
  
  return data.admin === true;
};

// Admin sayfalarını korumak için kullanılacak fonksiyon
export const requireAdmin = async (router) => {
  const isAdmin = await checkAdmin();
  
  if (!isAdmin) {
    // Admin değilse ana sayfaya yönlendir
    router.push('/');
    return false;
  }
  
  return true;
};

// Admin kullanıcısı bilgileri (uygulama içinde kullanım için)
export const ADMIN_EMAIL = 'admin@ustasindanapp.com';
export const ADMIN_PASSWORD = 'Admin123!';

// Admin olarak giriş yap
export const loginAsAdmin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  
  if (error) throw error;
  return data;
}; 