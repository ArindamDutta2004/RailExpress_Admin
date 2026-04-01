import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import { Feedback as FeedbackType } from '../types';
import Navigation from '../components/Navigation';
import { Trash2, MessageSquare, LogOut } from 'lucide-react';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const { logout } = useAuth();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/feedback/all');
      setFeedbacks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    setDeleteLoading(id);
    try {
      await api.delete(`/feedback/${id}`);
      setFeedbacks(feedbacks.filter(f => f.id !== id));
    } catch (err) {
      alert('Failed to delete feedback');
    } finally {
      setDeleteLoading(null);
    }
  };

  const avatarUrl = (seed: string) =>
    `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;

  return (
    <div className="min-h-screen admin-animated-bg page">
      <header className="bg-white/80 backdrop-blur shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Feedback</h1>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="glass-card rounded-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading feedbacks...</p>
          </div>
        ) : error ? (
          <div className="glass-card rounded-lg px-4 py-3 text-red-100 border border-red-300/40 bg-red-500/20">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="glass-card hover-glow rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-900">
                  All Feedback ({feedbacks.length})
                </h2>
              </div>
            </div>

            {feedbacks.length === 0 ? (
              <div className="glass-card rounded-lg p-12 text-center text-white/80">
                No feedback received yet
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="glass-card hover-glow rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/80 text-slate-900 ring-1 ring-white/40">
                            Phone: {feedback.phone}
                          </span>
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/70 text-slate-700 ring-1 ring-white/30">
                            {new Date(feedback.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="bg-white/85 rounded-xl p-4 ring-1 ring-white/40">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={avatarUrl(`${feedback.userName || 'user'}-${feedback.phone || ''}`)}
                                alt="avatar"
                                className="w-8 h-8 rounded-full"
                              />
                              <p className="text-sm font-semibold text-slate-900">
                                {feedback.userName || 'User'}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-yellow-900 bg-yellow-100 px-2 py-1 rounded-lg ring-1 ring-yellow-200">
                              Rating: {feedback.rating ?? '-'}
                            </span>
                          </div>
                          <p className="text-slate-800 whitespace-pre-wrap">
                            {feedback.comment ?? feedback.message ?? 'No comment provided (legacy feedback).'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(feedback.id)}
                        disabled={deleteLoading === feedback.id}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed press"
                        title="Delete feedback"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Feedback;
