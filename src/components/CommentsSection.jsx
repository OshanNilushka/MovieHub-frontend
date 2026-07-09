import { useState, useEffect } from 'react';
import axios from 'axios';

function CommentsSection({ movieId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch comments from backend
  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/movie/${movieId}`);
      setComments(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in to post comments! ❌");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/comments/movie/${movieId}`, 
        { content: trimmedComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting comment ❌');
    }
  };

  // Edit Comment Submit
  const handleEditSubmit = async (commentId) => {
    const trimmedEditingContent = editingContent.trim();
    if (!trimmedEditingContent) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/comments/${commentId}`, 
        { content: trimmedEditingContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(comments.map(c => c._id === commentId ? res.data : c));
      setEditingCommentId(null);
      setEditingContent('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error editing comment ❌');
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment? 🗑️')) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting comment ❌');
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-8 bg-neutral-900/50 border border-neutral-900 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
        <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
        <h3 className="text-lg font-black uppercase tracking-wider text-neutral-100">Discussion & Reviews</h3>
        <span className="text-xs font-bold text-neutral-500 bg-neutral-950 px-2.5 py-0.5 rounded border border-neutral-800/80">
          {comments.length} Comments
        </span>
      </div>

      {/* Write Comment Form */}
      <form onSubmit={handleAddComment} className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center font-black text-sm uppercase text-white shadow-lg shrink-0">
            {currentUser?.username?.substring(0, 2)}
          </div>
          <div className="flex-grow space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Post a review or join the discussion..."
              rows="3"
              required
              className="w-full bg-neutral-950 border border-neutral-800 hover:border-neutral-700/85 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition duration-200 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-lg shadow-red-600/10 hover:shadow-red-600/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-6 text-neutral-500 text-xs font-medium">Loading reviews...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-neutral-900 rounded-xl bg-neutral-950/20">
          <p className="text-neutral-500 font-medium text-xs">No comments posted yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6 divide-y divide-neutral-900">
          {comments.map((comment) => {
            const isOwner = comment.user === currentUser?.id;
            const isEditing = editingCommentId === comment._id;

            return (
              <div key={comment._id} className="pt-6 first:pt-0 flex gap-4 items-start group">
                {/* User Avatar */}
                <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-xs uppercase text-neutral-300 shrink-0">
                  {comment.username.substring(0, 2)}
                </div>

                {/* Comment Content Column */}
                <div className="flex-grow space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-xs text-neutral-200">{comment.username}</span>
                      {isOwner && (
                        <span className="bg-red-500/10 text-red-500 text-[8px] font-black uppercase px-1.5 py-0.2 rounded border border-red-500/20">
                          You
                        </span>
                      )}
                      <span className="text-[10px] text-neutral-500 font-medium">{formatDate(comment.createdAt)}</span>
                    </div>

                    {/* Owner Action Buttons */}
                    {isOwner && !isEditing && (
                      <div className="flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setEditingContent(comment.content);
                          }}
                          className="text-[10px] font-bold text-neutral-400 hover:text-white uppercase tracking-wider transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-[10px] font-bold text-red-500/80 hover:text-red-500 uppercase tracking-wider transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 mt-2">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows="2"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none transition duration-200 resize-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditSubmit(comment._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded transition cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-neutral-300 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CommentsSection;
