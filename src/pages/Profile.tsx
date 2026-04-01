import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(seed)}`;

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await api.put('/account/change-password', { oldPassword, newPassword });
      setMessage('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to change password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen admin-animated-bg p-6 page">
      <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <img src={avatarUrl(user?.email || 'admin')} alt="avatar" className="w-16 h-16 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-white">Admin {user?.name}</h1>
            <p className="text-white/70">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Old password"
            className="w-full px-3 py-2 rounded-lg bg-white/90"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full px-3 py-2 rounded-lg bg-white/90"
          />
          {error && <p className="text-red-200 text-sm">{error}</p>}
          {message && <p className="text-green-200 text-sm">{message}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 press"
            >
              {loading ? 'Updating...' : 'Change Password'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 press"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

