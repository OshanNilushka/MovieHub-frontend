import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('Invalid email address! ❌');
    } else {
      setStatus('Subscribed successfully! 🎉');
      setEmail('');
      setTimeout(() => setStatus(''), 4000);
    }
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    if (!val) {
      setStatus('');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setStatus('Invalid email format! ❌');
    } else {
      setStatus('Email format valid! ✔️');
    }
  };

  return (
    <footer className="relative bg-neutral-950 border-t border-neutral-900/80 pt-16 pb-8 text-neutral-400 text-xs mt-20 overflow-hidden">
      
      {/* 🔮 Glow decoration */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">
        
        {/* Column 1: Brand Info (Takes up 4 cols) */}
        <div className="md:col-span-4 space-y-5">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/')}>
            <h2 className="text-xl font-black text-red-600 tracking-tighter uppercase flex items-center gap-1">
              Movie<span className="text-white bg-red-600 px-1.5 py-0.5 rounded text-xs font-bold">HUB</span>
            </h2>
          </div>
          <p className="leading-relaxed text-neutral-500 pr-4 text-justify">
            Your premium destination for high-quality movie summaries, streaming catalogs, and discussion forums. Discover new releases, critically acclaimed hits, and global cinema classics in one unified space.
          </p>
          
          {/* Social Icons */}
          <div className="flex gap-4 pt-1">
            {/* YouTube */}
            <a href="#" className="text-neutral-500 hover:text-red-500 transition duration-300 transform hover:scale-110" aria-label="YouTube">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            {/* Twitter / X */}
            <a href="#" className="text-neutral-500 hover:text-sky-400 transition duration-300 transform hover:scale-110" aria-label="Twitter">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Discord */}
            <a href="#" className="text-neutral-500 hover:text-[#5865F2] transition duration-300 transform hover:scale-110" aria-label="Discord">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
              </svg>
            </a>
            {/* GitHub */}
            <a href="#" className="text-neutral-500 hover:text-white transition duration-300 transform hover:scale-110" aria-label="GitHub">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Navigation Links (Takes up 2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-white font-bold uppercase tracking-wider text-[11px] border-b border-neutral-900 pb-2 w-fit">Explore</h3>
          <ul className="space-y-2.5 font-medium">
            <li onClick={() => navigate('/')} className="hover:text-red-500 hover:translate-x-1 cursor-pointer transition-all duration-200 flex items-center gap-1">
              <span>Home</span>
            </li>
            <li onClick={() => navigate('/')} className="hover:text-red-500 hover:translate-x-1 cursor-pointer transition-all duration-200 flex items-center gap-1">
              <span>All Movies</span>
            </li>
            <li onClick={() => navigate('/login')} className="hover:text-red-500 hover:translate-x-1 cursor-pointer transition-all duration-200 flex items-center gap-1">
              <span>Sign In</span>
            </li>
            <li onClick={() => navigate('/register')} className="hover:text-red-500 hover:translate-x-1 cursor-pointer transition-all duration-200 flex items-center gap-1">
              <span>Register</span>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal & Safety (Takes up 2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-white font-bold uppercase tracking-wider text-[11px] border-b border-neutral-900 pb-2 w-fit">Safety & Legal</h3>
          <ul className="space-y-2.5 font-medium">
            <li className="hover:text-red-500 hover:translate-x-1 cursor-pointer transition-all duration-200">Terms of Service</li>
            <li className="hover:text-red-500 hover:translate-x-1 cursor-pointer transition-all duration-200">Privacy Policy</li>
            <li className="hover:text-red-500 hover:translate-x-1 cursor-pointer transition-all duration-200">DMCA Notice</li>
            <li className="hover:text-red-500 hover:translate-x-1 cursor-pointer transition-all duration-200">Contact Support</li>
          </ul>
        </div>

        {/* Column 4: Newsletter Subscription (Takes up 4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <h3 className="text-white font-bold uppercase tracking-wider text-[11px] border-b border-neutral-900 pb-2 w-fit">Join Newsletter</h3>
          <p className="text-neutral-500 leading-relaxed">
            Subscribe to our weekly mailing list to receive immediate summaries of trending film catalog updates.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="your@email.com"
                className={`flex-grow bg-neutral-950 border ${
                  status && status.includes('✔️') 
                    ? 'border-green-600 focus:ring-green-600 focus:border-green-600' 
                    : status && status.includes('❌') 
                      ? 'border-red-600 focus:ring-red-600 focus:border-red-600' 
                      : 'border-neutral-900 focus:border-red-600 focus:ring-red-600'
                } focus:ring-1 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none transition`}
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-rose-600 hover:to-red-600 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-lg active:scale-95 transition shadow-lg shadow-red-600/10 cursor-pointer"
              >
                Join
              </button>
            </div>
            {status && (
              <p className={`text-[10px] font-bold tracking-wide mt-1 ${
                status.includes('✔️') || status.includes('🎉') ? 'text-green-500' : 'text-red-500'
              }`}>{status}</p>
            )}
          </form>
        </div>

      </div>

      {/* DMCA & Safety Disclaimer Bottom */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 border-t border-neutral-900/60 mt-10">
        <p className="text-neutral-600 leading-relaxed text-[10px] text-justify">
          <strong>DMCA Content Protection Notice:</strong> MovieHUB is an educational web prototype index of movie summaries, cast lists, and streaming links. We do not store, host, or upload copyright protected media assets on our web servers. All media data parameters are fetched dynamically from public directories and APIs. If you are a copyright owner requesting material deletion, please email support for rapid teardown.
        </p>
      </div>

      {/* Copyright Bar */}
      <div className="bg-neutral-950/80 border-t border-neutral-900/40 py-5 px-6 text-neutral-600 text-[11px] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>© 2026 MovieHUB Network. All Rights Reserved. Built with Vite & React.</span>
          <div className="flex gap-4 font-medium">
            <span className="hover:text-neutral-400 cursor-pointer transition">Terms</span>
            <span className="hover:text-neutral-400 cursor-pointer transition">Privacy</span>
            <span className="hover:text-neutral-400 cursor-pointer transition">Contact</span>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;