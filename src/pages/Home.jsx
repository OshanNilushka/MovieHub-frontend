import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeroAndFilters from '../components/HeroAndFilters';
import { API_URL } from '../config';


function Home() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const navigate = useNavigate();

  const handleMovieClick = (movieId) => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login', { state: { from: `/movies/${movieId}` } });
    } else {
      navigate(`/movies/${movieId}`);
    }
  };
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLang, setSelectedLang] = useState('All');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/movies`);
        setMovies(response.data);
        setFilteredMovies(response.data);
      } catch (error) {
        console.error("❌ Error fetching movies from database:", error);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    let result = movies;

    if (searchQuery) {
      result = result.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre !== 'All') {
      result = result.filter(movie => 
        movie.genre && movie.genre.includes(selectedGenre)
      );
    }

    if (selectedLang !== 'All') {
      result = result.filter(movie => 
        movie.language && movie.language.toLowerCase() === selectedLang.toLowerCase()
      );
    }

    setFilteredMovies(result);
  }, [searchQuery, selectedGenre, selectedLang, movies]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans antialiased selection:bg-red-600 selection:text-white pt-[72px]">
      
      {/* ❌ මෙතන තිබ්බ <Navbar /> එක අයින් කලා! මොකද ඒක App.jsx එකෙන් Global එනවා */}

      {/* 📡 DYNAMIC HERO BANNER & SEARCH SYSTEMS */}
      <HeroAndFilters 
        movies={movies} 
        onSearch={setSearchQuery} 
        onGenreChange={setSelectedGenre} 
        onLanguageChange={setSelectedLang} 
      />

      {/* 🍿 PREMIUM DYNAMIC MOVIE GRID */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        
        <div className="flex items-center gap-3 mb-8">
          <span className="w-1 h-5 bg-red-600 rounded-full"></span>
          <h2 className="text-lg font-black uppercase tracking-wider text-neutral-100">
            {selectedGenre !== 'All' ? `${selectedGenre} Movies` : 'Latest Uploaded Movies'}
          </h2>
          <span className="text-xs font-bold text-neutral-500 bg-neutral-900 px-2.5 py-0.5 rounded border border-neutral-800">
            {filteredMovies.length} Available
          </span>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-900 rounded-xl bg-neutral-900/10">
            <p className="text-neutral-500 font-medium text-sm">No titles found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filteredMovies.map((movie) => (
              <div 
                key={movie._id} 
                onClick={() => handleMovieClick(movie._id)}
                className="group relative bg-neutral-900 border border-neutral-900/60 hover:border-neutral-800 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-2xl hover:shadow-black/50"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-950">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <span className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md border border-neutral-800 text-[10px] font-black px-2 py-0.5 rounded text-neutral-200 uppercase tracking-wide">{movie.quality || 'WEB-DL'}</span>
                  <span className="absolute top-2.5 right-2.5 bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-lg">★ {movie.rating?.toFixed(1) || '0.0'}</span>
                  <span className="absolute bottom-2.5 left-2.5 bg-red-600/90 backdrop-blur text-[9px] font-black uppercase px-2 py-0.5 rounded text-white tracking-wider shadow-md">{movie.language}</span>
                </div>

                <div className="p-3.5 space-y-1 bg-gradient-to-t from-neutral-950 to-neutral-900">
                  <h3 className="font-bold text-xs text-neutral-200 group-hover:text-red-500 transition line-clamp-1 uppercase tracking-wide">{movie.title}</h3>
                  <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500">
                    <span>{movie.releaseYear}</span>
                    <span className="text-red-600/80 tracking-tight line-clamp-1 max-w-[75px] text-right">{Array.isArray(movie.genre) ? movie.genre[0] : movie.genre}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

    </div>
  );
}

export default Home;