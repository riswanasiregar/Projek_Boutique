import { Outlet, useLocation } from 'react-router-dom';

const pageConfig = {
  '/login':    { img: '/img/login.png',    title: 'Welcome' },
  '/register': { img: '/img/register.png', title: 'Sign Up' },
  '/forgot':   { img: '/img/login.png',    title: 'Reset Password' },
};

export default function AuthLayout() {
  const { pathname } = useLocation();
  const config = pageConfig[pathname] || pageConfig['/login'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-auth-bg font-jakarta">
      <div className="flex w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl"
        style={{ minHeight: '580px' }}>

        {/* Kiri — putih + gambar */}
        <div className="hidden lg:flex lg:w-[48%] flex-col items-center justify-between p-8 bg-neutral">
          <div className="w-full">
            <span className="text-xl font-bold text-primary-3 font-jakarta">Ris.Style</span>
          </div>
          <div className="flex-1 flex items-center justify-center py-4">
            <img src={config.img} alt="Illustration"
              className="w-full max-w-xs object-contain" style={{ maxHeight: '320px' }} />
          </div>
          <div className="text-center">
            <p className="text-base text-primary-2 font-jakarta">
              Welcome to <span className="font-bold text-primary-3">Ris.Style</span>
            </p>
          </div>
        </div>

        {/* Kanan — biru primary-3 */}
        <div className="w-full lg:w-[52%] flex flex-col justify-center px-10 py-12 bg-primary-3 font-jakarta">
          <h1 className="text-4xl font-bold mb-8 text-neutral font-jakarta">
            {config.title}
          </h1>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
