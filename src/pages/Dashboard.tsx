import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import { Booking } from '../types';
import Navigation from '../components/Navigation';
import { LogOut, Search, Filter } from 'lucide-react';

const Dashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filterPhase1, setFilterPhase1] = useState('');
  const [filterPhase2, setFilterPhase2] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filterPhase1, filterPhase2, filterDate, searchTerm]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/booking/all');
      setBookings(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    if (filterPhase1) {
      filtered = filtered.filter(b => b.statusPhase1 === filterPhase1);
    }

    if (filterPhase2) {
      filtered = filtered.filter(b => b.statusPhase2 === filterPhase2);
    }

    if (filterDate) {
      filtered = filtered.filter(b => b.date === filterDate);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.customerName.toLowerCase().includes(term) ||
        b.phone.includes(term) ||
        b.email.toLowerCase().includes(term) ||
        b.from.toLowerCase().includes(term) ||
        b.to.toLowerCase().includes(term)
      );
    }

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'waiting': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'advance pending': 'bg-orange-100 text-orange-800',
      'advance paid': 'bg-blue-100 text-blue-800',
      'booking pending': 'bg-purple-100 text-purple-800',
      'booking done': 'bg-green-100 text-green-800',
      'not booked': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatOwner = (owner?: 'suman' | 'debjit' | 'arindam' | null) => {
    if (owner === 'debjit') return 'Debjit';
    if (owner === 'arindam') return 'Arindam';
    if (owner === 'suman') return 'Suman';
    return '—';
  };

  return (
    <div className="min-h-screen admin-animated-bg page">
      <header className="bg-white/80 backdrop-blur shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome, {user?.name}</p>
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
        <div className="glass-card hover-glow rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name, phone, email..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Phase 1
              </label>
              <select
                value={filterPhase1}
                onChange={(e) => setFilterPhase1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">All</option>
                <option value="waiting">Waiting</option>
                <option value="approved">Approved</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Phase 2
              </label>
              <select
                value={filterPhase2}
                onChange={(e) => setFilterPhase2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">All</option>
                <option value="advance pending">Advance Pending</option>
                <option value="advance paid">Advance Paid</option>
                <option value="booking pending">Booking Pending</option>
                <option value="booking done">Booking Done</option>
                <option value="not booked">Not Booked</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="glass-card rounded-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        ) : error ? (
          <div className="glass-card rounded-lg px-4 py-3 text-red-100 border border-red-300/40 bg-red-500/20">
            {error}
          </div>
        ) : (
          <div className="glass-card hover-glow rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/30 bg-white/70 backdrop-blur">
              <h2 className="text-lg font-semibold text-slate-900">
                All Bookings ({filteredBookings.length})
              </h2>
            </div>

            <div className="overflow-x-auto max-h-[65vh]">
              <table className="min-w-full divide-y divide-slate-200 table-glass">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Journey
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Step
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Phase 1
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Phase 2
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Refund QR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      QR Used
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900">{booking.customerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{booking.phone}</div>
                        <div className="text-xs text-slate-600">{booking.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{booking.from} → {booking.to}</div>
                        <div className="text-xs text-slate-600">{booking.passengers} passenger(s)</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                          {(booking.bookingType || 'reservation').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Step {booking.currentStep}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.statusPhase1)}`}>
                          {booking.statusPhase1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.statusPhase2)}`}>
                          {booking.statusPhase2}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.refundQRProof ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Uploaded
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.paymentStatus === 'completed' ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                            {formatOwner(booking.finalQROwner || booking.advanceQROwner)}
                          </span>
                        ) : booking.paymentStatus === 'advance paid' ? (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                            {formatOwner(booking.advanceQROwner)}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => navigate(`/booking/${booking.id}`)}
                          className="text-blue-700 hover:text-blue-900 font-semibold press"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredBookings.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No bookings found
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
