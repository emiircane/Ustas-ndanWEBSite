# Ustasından – Hizmet Veren Platformu

**Ustasından**, çevrendeki güvenilir hizmet verenleri kolayca bulmanı sağlayan modern bir web uygulamasıdır. Elektrikçiden çilingire, tesisatçıdan temizlikçiye kadar birçok kategoride ustalara ulaşmanı sağlar.

## 🚀 Özellikler

- 🔍 Popüler hizmet kategorileri listesi
- 🧑‍🔧 Detaylı ustaları listeleme sayfası
- 🧰 Gelişmiş filtreleme: il, deneyim, hizmet türü, ustalık belgesi
- 🎨 Modern, responsive ve animasyonlu kullanıcı arayüzü
- 💬 Usta puanları ve değerlendirme ekranı (dummy verilerle)
- ⚡ Kategori ikonları: `lucide-react` ile estetik ve sade

## 🛠️ Kullanılan Teknolojiler

- **React**
- **React Router**
- **Tailwind CSS**
- **Lucide React**
- **Supabase**
- `useState`, `useParams` gibi modern React hook'ları

## 🖼️ Sayfa Yapısı

- `/` – Ana Sayfa (kategori seçimi, öne çıkan ustalar)
- `/kategori/:isim` – Seçilen kategoriye göre usta listesi
- `/giris`, `/kayit`, `/ayarlar` – Kullanıcı sistemine giriş-çıkış bölümleri

## ⚙️ Kurulum

```bash
git clone https://github.com/emiircane/Ustasindan-Web-Site.git
npm install
```

### Çevre Değişkenleri

1. `client` klasöründe `.env` adında bir dosya oluşturun
2. Aşağıdaki değişkenleri ekleyin:
```
VITE_SUPABASE_URL=https://your-supabase-project-url.supabase.co
VITE_SUPABASE_KEY=your-supabase-anon-key
```
3. Supabase proje bilgilerinizi bu dosyaya ekleyin

```bash
npm run dev