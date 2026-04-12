import { useState } from 'react';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, User, Phone, Hash } from 'lucide-react';

interface BookingFormProps {
  onBookingSuccess: () => void;
  disabled: boolean;
}

const BookingForm = ({ onBookingSuccess, disabled }: BookingFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    fromStation: '',
    toStation: '',
    journeyDate: '',
    passengerName: '',
    dateOfBirth: '',
    age: '',
    phone: '',
    preferredTrainsText: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.fromStation || !formData.toStation || !formData.journeyDate ||
        !formData.passengerName || !formData.dateOfBirth || !formData.age || !formData.phone) {
      setError('All fields are required');
      return false;
    }

    if (formData.fromStation === formData.toStation) {
      setError('From Station and To Station cannot be the same');
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.journeyDate);
    if (selectedDate < today) {
      setError('Journey date must be today or a future date');
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Phone number must be exactly 10 digits');
      return false;
    }

    const preferredTrains = formData.preferredTrainsText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (preferredTrains.length > 6) {
      setError('You can add up to 6 preferred trains');
      return false;
    }

    if (/^\d+$/.test(formData.passengerName)) {
      setError('Passenger name cannot be only numbers');
      return false;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 1) {
      setError('Age must be at least 1');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading || disabled) return;

    if (!validateForm()) return;

    setLoading(true);

    try {
      await bookingAPI.create({
        fromStation: formData.fromStation,
        toStation: formData.toStation,
        journeyDate: formData.journeyDate,
        passengerName: formData.passengerName,
        dateOfBirth: formData.dateOfBirth,
        bookingType: 'reservation', // Default for admin
        age: parseInt(formData.age),
        phone: formData.phone,
        preferredTrains: formData.preferredTrainsText
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean),
      });

      setSuccess('Booking created successfully!');
      setFormData({
        fromStation: '',
        toStation: '',
        journeyDate: '',
        passengerName: '',
        dateOfBirth: '',
        age: '',
        phone: '',
        preferredTrainsText: '',
      });

      setTimeout(() => {
        onBookingSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Booking</h2>

      {disabled && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
          Booking form is currently locked. Please wait for admin approval on pending bookings.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fromStation" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                From Station
              </div>
            </label>
            <input
              type="text"
              id="fromStation"
              name="fromStation"
              value={formData.fromStation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., Mumbai Central"
              disabled={loading || disabled}
            />
          </div>

          <div>
            <label htmlFor="toStation" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                To Station
              </div>
            </label>
            <input
              type="text"
              id="toStation"
              name="toStation"
              value={formData.toStation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., Delhi Junction"
              disabled={loading || disabled}
            />
          </div>
        </div>

        <div>
          <label htmlFor="journeyDate" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Journey Date
            </div>
          </label>
          <input
            type="date"
            id="journeyDate"
            name="journeyDate"
            value={formData.journeyDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            disabled={loading || disabled}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label htmlFor="passengerName" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Passenger Name
              </div>
            </label>
            <input
              type="text"
              id="passengerName"
              name="passengerName"
              value={formData.passengerName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Full name"
              disabled={loading || disabled}
            />
          </div>

          <div className="md:col-span-1">
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={loading || disabled}
            />
          </div>

          <div className="md:col-span-1">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Age
              </div>
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Age"
              disabled={loading || disabled}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </div>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="10 digit phone number"
            disabled={loading || disabled}
          />
        </div>

        <div>
          <label htmlFor="preferredTrainsText" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Trains (Optional)
          </label>
          <textarea
            id="preferredTrainsText"
            name="preferredTrainsText"
            value={formData.preferredTrainsText}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder={`Add one train per line:\n1. 12345 - Train Name\n2. 22334 - Train Name\n(Up to 6 entries)`}
            disabled={loading || disabled}
          />
        </div>

        <button
          type="submit"
          disabled={loading || disabled}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Booking...' : 'Create Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
