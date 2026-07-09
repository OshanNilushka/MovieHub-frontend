import { useState, useEffect } from 'react';

// 💡 ඩේටාබේස් එකෙන් එන 'movies' array එක මෙතනින් ඇතුලට ගන්නවා
function HeroAndFilters({ movies, onSearch, onGenreChange, onLanguageChange }) {
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeLang, setActiveLang] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);

  const genres = ["All", "Drama", "History", "Action", "Crime", "Animation", "Comedy", "Sports", "Thriller", "Biography", "Sci-Fi", "Mystery", "Horror", "Family", "Adventure", "Romance", "Fantasy", "Music"];
  const languages = ["All", "Sinhala", "English", "Tamil", "Hindi"];

  // 🎬 SLIDESHOW MOVIE ARRAY: DB එකේ තියෙන පලවෙනි Movies 5ම Carousel එකට ගන්නවා
  const featuredMovies = movies && movies.length > 0 ? movies.slice(0, 5) : [
    {
      _id: 'default',
      title: "LOADING TITLES...",
      posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600",
      description: "Fetching the latest blockbuster titles directly from the database server. Please wait a moment...",
      quality: "HD",
      rating: 0.0,
      releaseYear: 2026,
      genre: ["System"]
    }
  ];

  // Auto-switch to the next image every 10 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredMovies.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [featuredMovies.length, currentIndex]);

  return (
    <div className="relative bg-neutral-950 text-white font-sans">
      
      {/* 🖼️ CAROUSEL BACKDROP & DETAILS */}
      <div className="relative h-[65vh] w-full overflow-hidden bg-neutral-950 group">
        
        {featuredMovies.map((movie, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={movie._id || index}
              className={`absolute inset-0 w-full h-full bg-cover bg-center flex items-end p-6 md:p-12 transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0 pointer-events-none'
              }`}
              style={{ 
                backgroundImage: `linear-gradient(to top, #0a0a0a 10%, rgba(10, 10, 10, 0.4) 50%, rgba(10, 10, 10, 0.85) 100%), url('${movie.posterUrl}')` 
              }}
            >
              <div className={`max-w-3xl z-10 space-y-4 transform transition-all duration-700 delay-200 ${
                isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}>
                
                {/* 🎯 Dynamic Title from DB */}
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase drop-shadow-md">
                  {movie.title}
                </h2>
                
                {/* 🏷️ Dynamic Badges from DB */}
                <div className="flex items-center gap-3 text-xs font-bold text-neutral-300">
                  <span className="bg-white text-black px-2 py-0.5 rounded-sm font-black uppercase">
                    {movie.quality || 'WEB-DL'}
                  </span>
                  <span className="border border-neutral-700 px-2 py-0.5 rounded-sm text-yellow-500 bg-neutral-900/50 backdrop-blur-sm">
                    ⭐ IMDb: {movie.rating?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-neutral-400">{movie.releaseYear}</span>
                  <span className="text-red-500">
                    {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
                  </span>
                </div>
                
                {/* 📝 Dynamic Description from DB */}
                <p className="text-neutral-400 text-xs md:text-sm max-w-xl leading-relaxed line-clamp-3 font-medium">
                  {movie.description}
                </p>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-5 py-3 rounded flex items-center gap-2 transition shadow-lg shadow-red-600/20 cursor-pointer">
                    ▶ Watch Now
                  </button>
                  <button className="bg-neutral-900/80 hover:bg-neutral-800 text-white font-bold text-xs uppercase px-4 py-3 rounded border border-neutral-800 transition cursor-pointer">
                    + My List
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* 🎛️ Navigation Arrows */}
        {featuredMovies.length > 1 && (
          <>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-red-600 text-white p-3 rounded-full border border-neutral-800/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
              aria-label="Previous Slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={() => setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-red-600 text-white p-3 rounded-full border border-neutral-800/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer"
              aria-label="Next Slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        {/* 🔘 Capsule Slide Indicators */}
        {featuredMovies.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {featuredMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex ? 'w-6 bg-red-600' : 'w-2 bg-neutral-600 hover:bg-neutral-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 🔍 ADVANCED SEARCH & FILTERS BAR */}
      <div className="p-6 bg-neutral-900/40 border-b border-neutral-900/60 space-y-4 max-w-7xl mx-auto rounded-xl mt-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Input Box */}
          <div className="relative w-full md:max-w-md">
            <input 
              type="text" 
              placeholder="Search movies, series, genres..." 
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 text-xs text-white pl-4 pr-10 py-3 rounded-lg focus:outline-none focus:border-red-600 transition"
            />
            <span className="absolute right-4 top-3.5 text-neutral-500 text-sm">🔍</span>
          </div>

          {/* Language Selection Filter */}
          <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {languages.map(lang => (
              <button
                key={lang}
                /* 🎯 FIXED: setSelectedLang වෙනුවට setActiveLang නිවැරදිව ආදේශ කලා */
                onClick={() => { setActiveLang(lang); onLanguageChange(lang); }}
                className={`text-[11px] font-bold px-4 py-2 rounded-md uppercase tracking-wider transition ${
                  activeLang === lang ? 'bg-red-600 text-white shadow-md shadow-red-600/10' : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-900'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Genre Badges Filters Row */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => { setActiveGenre(genre); onGenreChange(genre); }}
              className={`text-[10px] font-bold px-3.5 py-1.5 rounded-full border transition whitespace-nowrap ${
                activeGenre === genre ? 'bg-white text-black border-white' : 'bg-transparent border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

export default HeroAndFilters;