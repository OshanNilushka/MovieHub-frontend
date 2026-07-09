import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommentsSection from '../components/CommentsSection';

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🛡️ Access Control: check if logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!storedUser || !token) {
      // Redirect to login if user is guest
      navigate('/login', { state: { from: `/movies/${id}` }, replace: true });
      return;
    }

    setCurrentUser(JSON.parse(storedUser));

    // Fetch movie details
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/movies/${id}`);
        setMovie(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Error fetching movie details ❌');
        navigate('/');
      }
    };

    fetchMovie();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Loading Movie Details...</p>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans antialiased pt-[72px] pb-24 relative overflow-hidden">
      
      {/* 🌌 GLASSMORPHIC BLURRED BACKGROUND BANNER */}
      <div 
        className="absolute top-0 left-0 w-full h-[550px] bg-cover bg-center opacity-15 blur-2xl pointer-events-none"
        style={{ backgroundImage: `url(${movie.posterUrl})` }}
      />
      <div className="absolute top-0 left-0 w-full h-[550px] bg-gradient-to-b from-transparent via-neutral-950/80 to-neutral-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* 🏡 Back Button */}
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-850 hover:border-neutral-800 px-4 py-2.5 rounded-full backdrop-blur transition duration-300 shadow-md cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Directory
        </button>

        {/* 🍿 HEADER DETAILS LAYOUT */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start bg-neutral-900/20 p-4 rounded-3xl border border-neutral-900/40 backdrop-blur-sm">
          {/* Movie Poster */}
          <div className="w-full md:w-80 shrink-0 aspect-[2/3] md:aspect-auto rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900">
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="w-full md:h-[450px] object-cover"
            />
          </div>

          {/* Details Content */}
          <div className="flex-grow space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-red-600/90 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider shadow-sm">
                  {movie.language}
                </span>
                <span className="bg-neutral-900 border border-neutral-800 text-[10px] font-black text-neutral-300 uppercase px-2.5 py-0.5 rounded tracking-wider">
                  {movie.quality}
                </span>
                <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-0.5 shadow">
                  ★ {movie.rating?.toFixed(1) || '0.0'} IMDB
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wide bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-xs font-bold text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4 text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <span>Release Date: {movie.releaseDate || movie.releaseYear}</span>
                </div>
              </div>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genre?.map((g, index) => (
                <span 
                  key={index}
                  className="bg-neutral-900 border border-neutral-805 hover:border-neutral-700 text-neutral-300 font-bold text-[10.5px] uppercase tracking-wider px-3.5 py-1.5 rounded-full transition"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">Synopsis</h3>
              <p className="text-neutral-300 text-sm leading-relaxed font-medium max-w-3xl">
                {movie.description}
              </p>
            </div>

            {/* Cast members */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400">Starring Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, idx) => (
                    <span 
                      key={idx}
                      className="bg-neutral-950 border border-neutral-900 text-neutral-400 text-xs font-bold px-3 py-1.5 rounded-lg"
                    >
                      👤 {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Download Link */}
            {movie.downloadUrl && (
              <div className="pt-2">
                <a 
                  href={movie.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-950/20 hover:scale-[1.02] active:scale-[0.98] transition duration-300 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download Movie (MP4)
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 🎬 VIDEO PLAYER SECTION */}
        <div className="bg-neutral-900/30 border border-neutral-900 rounded-3xl p-6 md:p-8 backdrop-blur space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
            <h2 className="text-xl font-black uppercase tracking-wider text-neutral-100">Watch Video / Trailer</h2>
          </div>

          {movie.streamingUrl ? (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl">
              {movie.streamingUrl.includes('youtube.com') || movie.streamingUrl.includes('youtu.be') ? (
                <iframe
                  src={movie.streamingUrl}
                  title={`${movie.title} - Stream`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              ) : (
                <video
                  src={movie.streamingUrl}
                  controls
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/40">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-neutral-600 mb-3 animate-pulse">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Streaming Not Available</h4>
              <p className="text-xs text-neutral-500 font-medium mt-1 max-w-md">
                Direct online video streaming is currently unavailable for this title. Please check download options or check back later!
              </p>
            </div>
          )}
        </div>

        {/* 💬 DISCUSSION SECTION */}
        <CommentsSection 
          movieId={movie._id}
          currentUser={currentUser}
        />

      </div>
    </div>
  );
}

export default MovieDetails;
