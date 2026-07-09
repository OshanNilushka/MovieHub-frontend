import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'movies' | 'users'

  // Modals state
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // User Form Modal State & Errors
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const initialUserFormState = {
    username: '',
    email: '',
    password: '',
    role: 'member'
  };
  const [userFormValues, setUserFormValues] = useState(initialUserFormState);
  const [userFormErrors, setUserFormErrors] = useState({});

  // Movie Form State & Errors
  const initialFormState = {
    title: '',
    description: '',
    posterUrl: '',
    trailerUrl: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    rating: 0,
    language: 'English',
    quality: 'WEB-DL',
    cast: '',
    releaseDate: '',
    streamingUrl: '',
    downloadUrl: ''
  };
  const [formValues, setFormValues] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    // Direct redirection if not authenticated or not admin
    if (!parsedUser || parsedUser.role !== 'admin' || !token) {
      navigate('/');
      return;
    }

    setUser(parsedUser);

    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch movies
        const moviesRes = await axios.get(`${API_URL}/api/movies`);
        setMovies(moviesRes.data);

        // Fetch registered users (Admin only)
        const usersRes = await axios.get(`${API_URL}/api/users`, headers);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        // If unauthorized or token expires, send back
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Session expired or unauthorized! Please log in again.");
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Open movie modal for adding new movie
  const openAddMovieModal = () => {
    setEditingMovie(null);
    setFormValues(initialFormState);
    setFormErrors({});
    setIsMovieModalOpen(true);
  };

  // Open movie modal for editing existing movie
  const openEditMovieModal = (movie) => {
    setEditingMovie(movie);
    setFormErrors({});
    setFormValues({
      title: movie.title || '',
      description: movie.description || '',
      posterUrl: movie.posterUrl || '',
      trailerUrl: movie.trailerUrl || '',
      genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre || '',
      releaseYear: movie.releaseYear || new Date().getFullYear(),
      rating: movie.rating || 0,
      language: movie.language || 'English',
      quality: movie.quality || 'WEB-DL',
      cast: Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast || '',
      releaseDate: movie.releaseDate || '',
      streamingUrl: movie.streamingUrl || '',
      downloadUrl: movie.downloadUrl || ''
    });
    setIsMovieModalOpen(true);
  };

  // Client-side validation for movie form inputs
  const validateMovieForm = () => {
    const errs = {};
    if (!formValues.title.trim()) {
      errs.title = "Movie title is required! ❌";
    }
    if (!formValues.description.trim()) {
      errs.description = "Synopsis/Description is required! ❌";
    }

    if (!formValues.posterUrl.trim()) {
      errs.posterUrl = "Poster image URL is required! ❌";
    } else {
      try {
        new URL(formValues.posterUrl);
      } catch (_) {
        errs.posterUrl = "Poster URL must be a valid absolute URL! ❌";
      }
    }

    const year = Number(formValues.releaseYear);
    if (!formValues.releaseYear || isNaN(year) || year < 1880 || year > 2100) {
      errs.releaseYear = "Release year must be a valid year between 1880 and 2100! ❌";
    }

    const ratingVal = Number(formValues.rating);
    if (isNaN(ratingVal) || ratingVal < 0 || ratingVal > 10) {
      errs.rating = "IMDb rating must be a valid score between 0.0 and 10.0! ❌";
    }

    const validateOptionalUrl = (val, key, label) => {
      if (val && val.trim() !== "") {
        try {
          new URL(val);
        } catch (_) {
          errs[key] = `${label} must be a valid absolute URL! ❌`;
        }
      }
    };

    validateOptionalUrl(formValues.trailerUrl, "trailerUrl", "Trailer URL");
    validateOptionalUrl(formValues.streamingUrl, "streamingUrl", "Streaming URL");
    validateOptionalUrl(formValues.downloadUrl, "downloadUrl", "Download URL");

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save movie handler (Add/Edit)
  const handleSaveMovie = async (e) => {
    e.preventDefault();
    if (!validateMovieForm()) return;

    const token = localStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    // Format fields (convert comma strings back to array lists)
    const genresArray = formValues.genre
      ? formValues.genre.split(',').map(g => g.trim()).filter(Boolean)
      : [];
    const castArray = formValues.cast
      ? formValues.cast.split(',').map(c => c.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formValues,
      genre: genresArray,
      cast: castArray,
      releaseYear: Number(formValues.releaseYear),
      rating: Number(formValues.rating)
    };

    try {
      if (editingMovie) {
        // Edit movie
        const res = await axios.put(`${API_URL}/api/movies/update/${editingMovie._id}`, payload, headers);
        setMovies(prev => prev.map(m => m._id === editingMovie._id ? res.data : m));
        alert("Movie details updated successfully! 🎉");
      } else {
        // Add movie
        const res = await axios.post(`${API_URL}/api/movies/add`, payload, headers);
        setMovies(prev => [res.data, ...prev]);
        alert("New movie added successfully! 🎉");
      }
      setIsMovieModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error saving movie details! ❌");
    }
  };

  // Delete movie handler
  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm("Are you sure you want to delete this movie? This action is permanent! 🗑️")) {
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    try {
      await axios.delete(`${API_URL}/api/movies/delete/${movieId}`, headers);
      setMovies(prev => prev.filter(m => m._id !== movieId));
      alert("Movie deleted successfully! 🎉");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting movie! ❌");
    }
  };

  // View user file handler
  const openUserModal = (selectedUserObj) => {
    setSelectedUser(selectedUserObj);
    setIsUserModalOpen(true);
  };

  const handleUserInputChange = (field, value) => {
    setUserFormValues(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when editing field
    if (userFormErrors[field]) {
      setUserFormErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Real-time email validation
    if (field === 'email') {
      if (!value) {
        setUserFormErrors(prev => ({ ...prev, email: 'Email address is required! ❌' }));
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          setUserFormErrors(prev => ({ ...prev, email: 'Enter a valid email address! ❌' }));
        } else {
          setUserFormErrors(prev => ({ ...prev, email: 'Email format is valid! ✔️' }));
        }
      }
    }
  };

  const getUserEmailBorderClass = () => {
    if (!userFormValues.email) return 'border-neutral-800 focus:border-red-600 focus:ring-red-600';
    if (userFormErrors.email && userFormErrors.email.includes('✔️')) {
      return 'border-green-600 focus:border-green-600 focus:ring-green-600';
    }
    if (userFormErrors.email && userFormErrors.email.includes('❌')) {
      return 'border-red-600 focus:border-red-600 focus:ring-red-600';
    }
    return 'border-neutral-800 focus:border-red-600 focus:ring-red-600';
  };

  const openAddUserModal = () => {
    setEditingUser(null);
    setUserFormValues(initialUserFormState);
    setUserFormErrors({});
    setIsUserFormOpen(true);
  };

  const openEditUserModal = (targetUser) => {
    setEditingUser(targetUser);
    setUserFormErrors({});
    setUserFormValues({
      username: targetUser.username || '',
      email: targetUser.email || '',
      password: '', // blank on update unless changing
      role: targetUser.role || 'member'
    });
    setIsUserFormOpen(true);
  };

  const validateUserForm = () => {
    const errs = {};
    if (!userFormValues.username.trim()) {
      errs.username = "Username is required! ❌";
    } else if (userFormValues.username.trim().length < 3) {
      errs.username = "Username must be at least 3 characters! ❌";
    }

    if (!userFormValues.email.trim()) {
      errs.email = "Email is required! ❌";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userFormValues.email)) {
        errs.email = "Enter a valid email address! ❌";
      }
    }

    // Password is only strictly required on Add New User
    if (!editingUser && !userFormValues.password) {
      errs.password = "Password is required! ❌";
    } else if (userFormValues.password && userFormValues.password.length < 6) {
      errs.password = "Password must be at least 6 characters! ❌";
    }

    setUserFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!validateUserForm()) return;

    const token = localStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    const payload = {
      username: userFormValues.username.trim(),
      email: userFormValues.email.trim(),
      role: userFormValues.role,
    };
    if (userFormValues.password) {
      payload.password = userFormValues.password;
    }

    try {
      if (editingUser) {
        // Edit User
        const res = await axios.put(`${API_URL}/api/users/update/${editingUser._id}`, payload, headers);
        setUsers(prev => prev.map(u => u._id === editingUser._id ? res.data : u));
        alert("User details updated successfully! 🎉");
      } else {
        // Add User
        const res = await axios.post(`${API_URL}/api/users/add`, payload, headers);
        setUsers(prev => [res.data, ...prev]);
        alert("New user added successfully! 🎉");
      }
      setIsUserFormOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error saving user details! ❌");
    }
  };

  const handleDeleteUser = async (targetUserId) => {
    // Self deletion protection check
    const currentAdminUser = JSON.parse(localStorage.getItem('user'));
    if (targetUserId === currentAdminUser?.id) {
      alert("You cannot delete your own admin account! ❌");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user? This action is permanent! 🗑️")) {
      return;
    }

    const token = localStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const res = await axios.delete(`${API_URL}/api/users/delete/${targetUserId}`, headers);
      setUsers(prev => prev.filter(u => u._id !== targetUserId));
      alert(res.data.message || "User deleted successfully! 🎉");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting user! ❌");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 pt-24 max-w-7xl mx-auto">
      
      {/* 🚀 Top Dashboard Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-neutral-900 pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-neutral-100 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-red-600 rounded-full inline-block"></span>
            Admin Dashboard
          </h2>
          <p className="text-xs text-neutral-500 font-medium mt-1">Manage system catalogs, users, and general data points.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={openAddMovieModal} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg shadow-lg shadow-red-600/10 active:scale-[0.98] transition cursor-pointer"
          >
            + Add New Movie
          </button>
        </div>
      </div>

      {/* 🎛️ Navigation Tabs */}
      <div className="flex border-b border-neutral-900 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'overview' ? 'border-red-600 text-red-500' : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('movies')}
          className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'movies' ? 'border-red-600 text-red-500' : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Movie Database ({movies.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
            activeTab === 'users' ? 'border-red-600 text-red-500' : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Registered Users ({users.length})
        </button>
      </div>

      {/* 📊 TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Analytics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-xl flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Total Movies</span>
                <h3 className="text-3xl font-black text-white mt-1">{movies.length}</h3>
              </div>
              <div className="p-3 bg-red-600/10 text-red-500 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-7.5c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125zm0-3h7.5m-7.5 0a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h7.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125zm0-3h7.5m-7.5 0a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h7.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-xl flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Registered Users</span>
                <h3 className="text-3xl font-black text-white mt-1">{users.length}</h3>
              </div>
              <div className="p-3 bg-blue-600/10 text-blue-500 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-xl flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">System Status</span>
                <h3 className="text-3xl font-black text-green-500 mt-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                  Online
                </h3>
              </div>
              <div className="p-3 bg-green-600/10 text-green-500 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-xl flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Current Session</span>
                <h3 className="text-sm font-bold text-neutral-200 mt-2 truncate max-w-[150px]">👋 {user?.username}</h3>
                <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider block mt-0.5">{user?.role} Role</span>
              </div>
              <div className="p-3 bg-amber-600/10 text-amber-500 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Logs / Quick Admin Information Card */}
          <div className="bg-neutral-900/20 border border-neutral-900 rounded-xl p-6">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">Admin Notes & System Guidelines</h4>
            <ul className="text-xs text-neutral-400 space-y-2 list-disc list-inside">
              <li>Protect the default admin account: do not share credentials with unregistered users.</li>
              <li>Movie items added through this dashboard will sync dynamically to the homepage.</li>
              <li>Always provide valid poster URLs (preferably HTTPS images from unsplash or movie archives).</li>
              <li>Deleting a movie will permanently wipe it and its metadata from MongoDB Atlas.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 🎬 TAB 2: MOVIE DATABASE MANAGEMENT */}
      {activeTab === 'movies' && (
        <div className="bg-neutral-900/40 border border-neutral-900 rounded-xl overflow-hidden shadow-xl animate-fadeIn">
          <div className="p-4 border-b border-neutral-900 bg-neutral-900/50 flex justify-between items-center">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Movie Inventory Listing</h4>
          </div>

          {movies.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-500">
              No movies found in the database. Try adding one!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 text-neutral-500 uppercase font-bold bg-neutral-950/40">
                    <th className="p-4 w-20">Poster</th>
                    <th className="p-4">Title</th>
                    <th className="p-4 w-24">Year</th>
                    <th className="p-4 w-28">Language</th>
                    <th className="p-4 w-24">Rating</th>
                    <th className="p-4 w-36 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie) => (
                    <tr key={movie._id} className="border-b border-neutral-900/60 hover:bg-neutral-900/40 transition">
                      <td className="p-4">
                        <img 
                          src={movie.posterUrl || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=100'} 
                          alt="" 
                          className="w-9 h-12 object-cover rounded bg-neutral-950 border border-neutral-800" 
                        />
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-neutral-200 block uppercase tracking-wide truncate max-w-[200px] md:max-w-xs">{movie.title}</span>
                        <span className="text-[10px] text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded uppercase mt-1 inline-block">{movie.quality || 'WEB-DL'}</span>
                      </td>
                      <td className="p-4 text-neutral-400">{movie.releaseYear}</td>
                      <td className="p-4">
                        <span className="bg-red-600/10 text-red-500 border border-red-600/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                          {movie.language}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-amber-500">★ {movie.rating?.toFixed(1) || '0.0'}</td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => openEditMovieModal(movie)}
                            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 font-bold text-[10px] uppercase px-3 py-1.5 rounded transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteMovie(movie._id)}
                            className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 hover:border-red-600 font-bold text-[10px] uppercase px-3 py-1.5 rounded transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 👥 TAB 3: REGISTERED USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-neutral-900/40 border border-neutral-900 rounded-xl overflow-hidden shadow-xl animate-fadeIn">
          <div className="p-4 border-b border-neutral-900 bg-neutral-900/50 flex justify-between items-center">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">System Users Directory</h4>
            <button 
              onClick={openAddUserModal}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg active:scale-95 transition cursor-pointer"
            >
              + Add User
            </button>
          </div>

          {users.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-500">
              No registered users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-900 text-neutral-500 uppercase font-bold bg-neutral-950/40">
                    <th className="p-4">Username</th>
                    <th className="p-4">Email</th>
                    <th className="p-4 w-28">Role</th>
                    <th className="p-4 w-36">Registration Date</th>
                    <th className="p-4 w-48 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item._id} className="border-b border-neutral-900/60 hover:bg-neutral-900/40 transition">
                      <td className="p-4 font-bold text-neutral-200">{item.username}</td>
                      <td className="p-4 text-neutral-400">{item.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.role === 'admin' 
                            ? 'bg-amber-600/10 text-amber-500 border border-amber-600/20' 
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}>
                          {item.role}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => openUserModal(item)}
                            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 font-bold text-[10px] uppercase px-2.5 py-1.5 rounded transition cursor-pointer"
                          >
                            Details
                          </button>
                          <button 
                            onClick={() => openEditUserModal(item)}
                            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-bold text-[10px] uppercase px-2.5 py-1.5 rounded transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(item._id)}
                            className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 hover:border-red-600 font-bold text-[10px] uppercase px-2.5 py-1.5 rounded transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* 📑 DIALOG MODAL 1: ADD OR EDIT MOVIE */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl my-8 max-h-[85vh] overflow-y-auto">
            {/* Modal Head */}
            <div className="flex justify-between items-center pb-4 border-b border-neutral-800 mb-5">
              <h3 className="text-base font-black uppercase tracking-wider text-neutral-200">
                {editingMovie ? `Edit: ${editingMovie.title}` : 'Add New Movie Title'}
              </h3>
              <button 
                onClick={() => setIsMovieModalOpen(false)}
                className="text-neutral-500 hover:text-white bg-neutral-950 p-1.5 rounded-full border border-neutral-800 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveMovie} className="space-y-4">
              {/* Row 1: Title and Release Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Movie Title *</label>
                  <input 
                    type="text" 
                    value={formValues.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Interstellar"
                    className={`w-full bg-neutral-950 border ${
                      formErrors.title ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : 'border-neutral-800 focus:border-red-600 focus:ring-red-600'
                    } focus:ring-1 rounded-lg p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none`}
                  />
                  {formErrors.title && (
                    <p className="text-[10px] text-red-500 font-bold tracking-wide mt-1">{formErrors.title}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Release Year *</label>
                  <input 
                    type="number" 
                    value={formValues.releaseYear}
                    onChange={(e) => handleInputChange('releaseYear', e.target.value)}
                    placeholder="e.g. 2014"
                    className={`w-full bg-neutral-950 border ${
                      formErrors.releaseYear ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : 'border-neutral-800 focus:border-red-600 focus:ring-red-600'
                    } focus:ring-1 rounded-lg p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none`}
                  />
                  {formErrors.releaseYear && (
                    <p className="text-[10px] text-red-500 font-bold tracking-wide mt-1">{formErrors.releaseYear}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Poster URL and Trailer URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Poster URL *</label>
                  <input 
                    type="text" 
                    value={formValues.posterUrl}
                    onChange={(e) => handleInputChange('posterUrl', e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/... (Poster image)"
                    className={`w-full bg-neutral-950 border ${
                      formErrors.posterUrl ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : 'border-neutral-800 focus:border-red-600 focus:ring-red-600'
                    } focus:ring-1 rounded-lg p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none`}
                  />
                  {formErrors.posterUrl && (
                    <p className="text-[10px] text-red-500 font-bold tracking-wide mt-1">{formErrors.posterUrl}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Trailer Embed URL</label>
                  <input 
                    type="text" 
                    value={formValues.trailerUrl}
                    onChange={(e) => handleInputChange('trailerUrl', e.target.value)}
                    placeholder="e.g. https://www.youtube.com/embed/zSWdZVtXT7E"
                    className={`w-full bg-neutral-950 border ${
                      formErrors.trailerUrl ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : 'border-neutral-800 focus:border-red-600 focus:ring-red-600'
                    } focus:ring-1 rounded-lg p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none`}
                  />
                  {formErrors.trailerUrl && (
                    <p className="text-[10px] text-red-500 font-bold tracking-wide mt-1">{formErrors.trailerUrl}</p>
                  )}
                </div>
              </div>

              {/* Row 3: Genres & Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Genres (Comma separated)</label>
                  <input 
                    type="text" 
                    value={formValues.genre}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                    placeholder="e.g. Sci-Fi, Adventure, Drama"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">IMDb Rating (e.g., 8.6)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={formValues.rating}
                    onChange={(e) => handleInputChange('rating', e.target.value)}
                    placeholder="e.g. 8.6"
                    className={`w-full bg-neutral-950 border ${
                      formErrors.rating ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : 'border-neutral-800 focus:border-red-600 focus:ring-red-600'
                    } focus:ring-1 rounded-lg p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none`}
                  />
                  {formErrors.rating && (
                    <p className="text-[10px] text-red-500 font-bold tracking-wide mt-1">{formErrors.rating}</p>
                  )}
                </div>
              </div>

              {/* Row 4: Language & Quality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Language</label>
                  <select 
                    value={formValues.language} 
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Malayalam">Malayalam</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Quality</label>
                  <select 
                    value={formValues.quality} 
                    onChange={(e) => handleInputChange('quality', e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="WEB-DL">WEB-DL</option>
                    <option value="BluRay">BluRay</option>
                    <option value="HDTV">HDTV</option>
                    <option value="CAMRip">CAMRip</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Cast (Comma separated) */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Cast members (Comma separated)</label>
                <input 
                  type="text" 
                  value={formValues.cast}
                  onChange={(e) => handleInputChange('cast', e.target.value)}
                  placeholder="e.g. Matthew McConaughey, Anne Hathaway, Jessica Chastain"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none"
                />
              </div>

              {/* Row 6: Description */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Description *</label>
                <textarea 
                  rows="3"
                  value={formValues.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a brief plot synopsis..."
                  className={`w-full bg-neutral-950 border ${
                    formErrors.description ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : 'border-neutral-800 focus:border-red-600 focus:ring-red-600'
                  } focus:ring-1 rounded-lg p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none`}
                ></textarea>
                {formErrors.description && (
                  <p className="text-[10px] text-red-500 font-bold tracking-wide mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Row 7: Links (Streaming and Download) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Streaming Server Link</label>
                  <input 
                    type="text" 
                    value={formValues.streamingUrl}
                    onChange={(e) => handleInputChange('streamingUrl', e.target.value)}
                    placeholder="e.g. https://server.com/play/movie.mp4"
                    className={`w-full bg-neutral-950 border ${
                      formErrors.streamingUrl ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : 'border-neutral-800 focus:border-red-600 focus:ring-red-600'
                    } focus:ring-1 rounded-lg p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none`}
                  />
                  {formErrors.streamingUrl && (
                    <p className="text-[10px] text-red-500 font-bold tracking-wide mt-1">{formErrors.streamingUrl}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Download Link</label>
                  <input 
                    type="text" 
                    value={formValues.downloadUrl}
                    onChange={(e) => handleInputChange('downloadUrl', e.target.value)}
                    placeholder="e.g. https://archive.org/download/..."
                    className={`w-full bg-neutral-950 border ${
                      formErrors.downloadUrl ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : 'border-neutral-800 focus:border-red-600 focus:ring-red-600'
                    } focus:ring-1 rounded-lg p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none`}
                  />
                  {formErrors.downloadUrl && (
                    <p className="text-[10px] text-red-500 font-bold tracking-wide mt-1">{formErrors.downloadUrl}</p>
                  )}
                </div>
              </div>

              {/* Save / Cancel buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-800 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsMovieModalOpen(false)}
                  className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg active:scale-[0.98] transition cursor-pointer"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📑 DIALOG MODAL 2: USER PROFILE FILE VIEW */}
      {isUserModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            {/* Modal Head */}
            <div className="flex justify-between items-center pb-4 border-b border-neutral-800 mb-5">
              <h3 className="text-base font-black uppercase tracking-wider text-neutral-200">
                User Details File
              </h3>
              <button 
                onClick={() => setIsUserModalOpen(false)}
                className="text-neutral-500 hover:text-white bg-neutral-950 p-1.5 rounded-full border border-neutral-800 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800/60">
                <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-red-500 text-lg uppercase shadow">
                  {selectedUser.username.substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-neutral-200 text-sm tracking-wide uppercase">{selectedUser.username}</h4>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest mt-0.5 ${
                    selectedUser.role === 'admin' ? 'bg-amber-600/10 text-amber-500' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {selectedUser.role} Account
                  </span>
                </div>
              </div>

              {/* Data Fields */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between border-b border-neutral-900 pb-2">
                  <span className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">User ID</span>
                  <span className="font-mono text-neutral-300 select-all">{selectedUser._id}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-900 pb-2">
                  <span className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">Email Address</span>
                  <span className="text-neutral-300 font-medium">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-900 pb-2">
                  <span className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">Joined Date</span>
                  <span className="text-neutral-300 font-medium">
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-neutral-900 pb-2">
                  <span className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">Last Profile Update</span>
                  <span className="text-neutral-300 font-medium">
                    {new Date(selectedUser.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => setIsUserModalOpen(false)}
                  className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition cursor-pointer"
                >
                  Close File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📑 DIALOG MODAL 3: ADD OR EDIT USER */}
      {isUserFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            {/* Modal Head */}
            <div className="flex justify-between items-center pb-4 border-b border-neutral-800 mb-5">
              <h3 className="text-base font-black uppercase tracking-wider text-neutral-200">
                {editingUser ? `Edit User: ${editingUser.username}` : 'Add New System User'}
              </h3>
              <button 
                onClick={() => setIsUserFormOpen(false)}
                className="text-neutral-500 hover:text-white bg-neutral-950 p-1.5 rounded-full border border-neutral-800 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveUser} className="space-y-4">
              {/* Username */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Username *</label>
                <input 
                  type="text" 
                  value={userFormValues.username} 
                  onChange={(e) => handleUserInputChange('username', e.target.value)} 
                  placeholder="e.g. johndoe"
                  className={`w-full bg-neutral-950 border ${
                    userFormErrors.username ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : 'border-neutral-800 focus:border-red-600 focus:ring-red-600'
                  } focus:ring-1 rounded-lg p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none`}
                />
                {userFormErrors.username && (
                  <p className="text-[10px] text-red-500 font-bold tracking-wide mt-1">{userFormErrors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Email Address *</label>
                <input 
                  type="text" 
                  value={userFormValues.email} 
                  onChange={(e) => handleUserInputChange('email', e.target.value)} 
                  placeholder="e.g. john@example.com"
                  className={`w-full bg-neutral-950 border ${getUserEmailBorderClass()} focus:ring-1 rounded-lg p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none`}
                />
                {userFormErrors.email && (
                  <p className={`text-[10px] font-bold tracking-wide mt-1 ${
                    userFormErrors.email.includes('✔️') ? 'text-green-500' : 'text-red-500'
                  }`}>{userFormErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  {editingUser ? 'New Password (Leave empty to keep current)' : 'Password *'}
                </label>
                <input 
                  type="password" 
                  value={userFormValues.password} 
                  onChange={(e) => handleUserInputChange('password', e.target.value)} 
                  placeholder={editingUser ? '••••••••' : 'Password (min 6 characters)'}
                  className={`w-full bg-neutral-950 border ${
                    userFormErrors.password ? 'border-red-600 focus:border-red-600 focus:ring-red-600' : 'border-neutral-800 focus:border-red-600 focus:ring-red-600'
                  } focus:ring-1 rounded-lg p-2.5 text-xs text-white placeholder-neutral-700 focus:outline-none`}
                />
                {userFormErrors.password && (
                  <p className="text-[10px] text-red-500 font-bold tracking-wide mt-1">{userFormErrors.password}</p>
                )}
              </div>

              {/* Role Select */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Account Role *</label>
                <select 
                  value={userFormValues.role} 
                  onChange={(e) => handleUserInputChange('role', e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-neutral-800 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsUserFormOpen(false)}
                  className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg active:scale-[0.98] transition cursor-pointer"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;