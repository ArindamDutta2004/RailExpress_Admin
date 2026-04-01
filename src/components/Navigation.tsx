import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const avatar = `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(user?.email || 'admin')}`;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-2 px-4 py-4 border-b-2 transition ${
              isActive('/dashboard')
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="font-medium">Bookings</span>
          </button>

          <button
            onClick={() => navigate('/feedback')}
            className={`flex items-center gap-2 px-4 py-4 border-b-2 transition ${
              isActive('/feedback')
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">Feedback</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className={`flex items-center gap-2 px-4 py-4 border-b-2 transition ${
              isActive('/profile')
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <UserCircle className="w-4 h-4" />
            <span className="font-medium">Profile</span>
          </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
