import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Client-side Validation Checks
  const validate = () => {
    const newErrors = {};
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      newErrors.username = 'Username is required! ❌';
    } else if (trimmedUsername.length < 3) {
      newErrors.username = 'Username must be at least 3 characters! ❌';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email address is required! ❌';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email address! ❌';
    }

    if (!password) {
      newErrors.password = 'Password is required! ❌';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters! ❌';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      setErrors(prev => ({ ...prev, email: 'Email address is required! ❌' }));
    } else if (!emailRegex.test(val)) {
      setErrors(prev => ({ ...prev, email: 'Enter a valid email address! ❌' }));
    } else {
      setErrors(prev => ({ ...prev, email: 'Email format is valid! ✔️' }));
    }
  };

  const getEmailBorderClass = () => {
    if (!email) return 'border-neutral-800 hover:border-neutral-700/80 focus:border-red-600 focus:ring-red-600';
    if (errors.email && errors.email.includes('✔️')) {
      return 'border-green-600 focus:border-green-600 focus:ring-green-600';
    }
    if (errors.email && errors.email.includes('❌')) {
      return 'border-red-600 focus:border-red-600 focus:ring-red-600';
    }
    return 'border-neutral-800 hover:border-neutral-700/80 focus:border-red-600 focus:ring-red-600';
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    axios.post('http://localhost:5000/api/auth/register', { username, email, password })
      .then((res) => {
        alert(res.data.message);
        navigate('/login');
      })
      .catch((err) => {
        const errMsg = err.response?.data?.message || "Registration Error ❌";
        alert(errMsg);
        // Map backend errors if needed
        if (errMsg.toLowerCase().includes('email')) {
          setErrors(prev => ({ ...prev, email: errMsg }));
        } else if (errMsg.toLowerCase().includes('username')) {
          setErrors(prev => ({ ...prev, username: errMsg }));
        } else if (errMsg.toLowerCase().includes('password')) {
          setErrors(prev => ({ ...prev, password: errMsg }));
        }
      });
  };

  return (
    <div 
      className="relative min-h-screen bg-neutral-950 flex justify-center items-center p-4 text-white bg-cover bg-center"
      style={{ 
        backgroundImage: "linear-gradient(to bottom, rgba(10, 10, 10, 0.85) 0%, rgba(10, 10, 10, 0.92) 100%), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600')" 
      }}
    >
      {/* 🏡 Floating Back to Home Button */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 px-4 py-2.5 rounded-full backdrop-blur transition duration-300 shadow-lg cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Home
      </button>

      {/* 💳 Premium Glassmorphic Card */}
      <div className="bg-neutral-900/70 border border-neutral-800/80 w-full max-w-md rounded-2xl p-8 md:p-10 shadow-2xl backdrop-blur-xl transition duration-300">
        
        {/* Title Group */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent inline-block">
            MovieHub
          </h2>
          <p className="text-xs text-neutral-400 mt-2 font-medium">Create your account to unlock premium features</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Username field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </span>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
                }} 
                className={`w-full bg-neutral-950/60 border ${
                  errors.username ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : 'border-neutral-800 hover:border-neutral-700/80 focus:border-red-600 focus:ring-red-600'
                } focus:ring-1 rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition duration-200`}
                placeholder="Username" 
              />
            </div>
            {errors.username && (
              <p className="text-[10px] text-red-500 font-bold tracking-wide mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </span>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => handleEmailChange(e.target.value)} 
                className={`w-full bg-neutral-950/60 border ${getEmailBorderClass()} focus:ring-1 rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition duration-200`}
                placeholder="your@email.com" 
              />
            </div>
            {errors.email && (
              <p className={`text-[10px] font-bold tracking-wide mt-1 ${
                errors.email.includes('✔️') ? 'text-green-500' : 'text-red-500'
              }`}>{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }} 
                className={`w-full bg-neutral-950/60 border ${
                  errors.password ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : 'border-neutral-800 hover:border-neutral-700/80 focus:border-red-600 focus:ring-red-600'
                } focus:ring-1 rounded-lg pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition duration-200`}
                placeholder="••••••••" 
              />
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-500 font-bold tracking-wide mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full mt-2 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-rose-600 hover:to-red-600 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20 hover:shadow-red-600/30 cursor-pointer"
          >
            Register
          </button>
        </form>

        {/* Navigation link */}
        <p className="text-xs text-neutral-500 text-center mt-8 font-medium">
          Already have an account?{' '}
          <span 
            onClick={() => navigate('/login')} 
            className="text-red-500 cursor-pointer hover:text-red-400 hover:underline transition"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;