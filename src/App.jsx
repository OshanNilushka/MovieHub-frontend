import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-950 text-white font-sans antialiased flex flex-col justify-between">
        
        {/* 🚀 GLOBAL NAVBAR: මුළු සයිට් එකටම එක පාරයි එන්නේ */}
        <Navbar />
        
        {/* 🔀 ROUTES SYSTEM: පිටු ඩප්ලිකේට් වෙන්න නොදී URL එකට අදාළ එක පිටුවක් විතරක් පෙන්වනවා */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
          </Routes>
        </div>

        {/* 📌 GLOBAL FOOTER: මුළු සයිට් එකේම පතුලට එන්නේ */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;