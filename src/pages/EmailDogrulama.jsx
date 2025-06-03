import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';

function EmailDogrulama() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  useEffect(() => {
    // State'ten e-posta bilgisini al
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // State yoksa anasayfaya yönlendir
      navigate('/');
    }
  }, [location, navigate]);
  
  // Geri sayım sayacı
  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(60);
    }
    
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);
  
  const handleResendEmail = async () => {
    setResendDisabled(true);
    // Burada Supabase ile e-posta doğrulama bağlantısını tekrar gönderme işlemi yapılabilir
    // Şu an sadece geri sayım etkin
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
        {/* Üst dekoratif çizgi */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500"></div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
              <Mail className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
              E-posta Doğrulama
            </h2>
            <p className="text-gray-600 mt-2">
              Hesabınızı aktifleştirmek için e-postanızı doğrulayın
            </p>
          </div>
          
          <div className="bg-orange-50 p-6 rounded-xl mb-6 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Neredeyse Tamam!</h3>
            <p className="text-gray-600 mb-4">
              <span className="font-medium text-orange-600">{email}</span> adresine bir doğrulama bağlantısı gönderdik.
              Lütfen e-postanızı kontrol edin ve hesabınızı doğrulamak için bağlantıya tıklayın.
            </p>
            
            <div className="text-sm text-gray-500 mb-4">
              E-posta kutunuzda bulamıyor musunuz?
              <ul className="list-disc list-inside mt-2 text-left">
                <li>Spam klasörünü kontrol edin</li>
                <li>E-posta adresinizi doğru girdiğinizden emin olun</li>
                <li>Birkaç dakika bekleyin, bazen e-postalar gecikmeli ulaşabilir</li>
              </ul>
            </div>
            
            <button 
              onClick={handleResendEmail} 
              disabled={resendDisabled}
              className={`mt-2 py-2 px-4 rounded-lg flex items-center justify-center mx-auto 
                ${resendDisabled 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${resendDisabled ? 'animate-spin' : ''}`} />
              {resendDisabled 
                ? `Yeniden gönderilecek (${countdown}s)` 
                : 'Doğrulama E-postasını Yeniden Gönder'}
            </button>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => navigate('/giris')}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Giriş Sayfasına Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailDogrulama; 