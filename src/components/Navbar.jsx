import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  
  const user = JSON.parse(localStorage.getItem('user'));

  // Logout Logic
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

 
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/70 backdrop-blur-md border-b border-neutral-900/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* 1. 🚀 PREMIUM BRAND LOGO */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-1.5 group focus:outline-none">
               <h2 className="text-xl font-black text-red-600 tracking-tighter uppercase cursor-pointer flex items-center gap-1" onClick={() => navigate('/')}>
            Movie<span className="text-white bg-red-600 px-1.5 py-0.5 rounded text-xs font-bold">HUB</span>
          </h2>
              
            </Link>

            {/* 2. 🗺️ NAVIGATION LINKS */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                  isActive('/') ? 'text-red-500' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Home
              </Link>
              
              {}
              {user && user.role === 'admin' && (
                <Link 
                  to="/dashboard" 
                  className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                    isActive('/dashboard') ? 'text-red-500' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* 3. 👤 USER AUTH SECTION */}
          <div className="flex items-center gap-4">
            {user ? (
              // 🟢 LOGGED IN USER LAYOUT
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold text-neutral-200 truncate max-w-[120px]">
                    {user.username}
                  </span>
                  <span className="text-[9px] font-bold uppercase text-red-500 tracking-wider">
                    {user.role}
                  </span>
                </div>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded border border-neutral-800 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              // 🔴 GUEST USER LAYOUT (SIGN IN / REGISTER)
              <div className="flex items-center gap-2.5">
                <Link 
                  to="/login" 
                  className="text-neutral-400 hover:text-white font-bold text-[11.5px] uppercase tracking-wider px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-[11.5px] uppercase tracking-wider px-4 py-2 rounded shadow-lg shadow-red-600/10 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;