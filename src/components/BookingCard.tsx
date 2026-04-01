import { useState } from 'react';
import { MapPin, Calendar, User, Phone, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import PaymentSection from './PaymentSection';
import FeedbackSection from './FeedbackSection';

interface Booking {
  _id: string;
  fromStation: string;
  toStation: string;
  journeyDate: string;
  passengerName: string;
  age: number;
  phone: string;
  statusPhase1: string;
  statusPhase2: string;
  paymentStatus: string;
  currentStep: number;
  advanceAmount?: number;
  remainingAmount?: number;
  totalAmount?: number;
  advanceQR?: string;
  finalQR?: string;
  ticketPDF?: string;
  billPDF?: string;
  createdAt: string;
}

interface BookingCardProps {
  booking: Booking;
  onUpdate: () => void;
}

const BookingCard = ({ booking, onUpdate }: BookingCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'done':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'done':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStepLabel = (step: number) => {
    const steps = [
      'Booking Created',
      'Admin Approval Pending',
      'Admin Approved',
      'Advance Payment Pending',
      'Advance Payment Done',
      'Ticket Generation Pending',
      'Ticket Generated',
      'Final Payment Pending',
      'Final Payment Done',
      'Booking Completed'
    ];
    return steps[step] || `Step ${step}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const showAdvancePayment = booking.currentStep >= 2 && booking.currentStep < 5;
  const showTicketDownload = booking.currentStep >= 5 && booking.currentStep < 9;
  const showFinalPayment = booking.currentStep >= 5 && booking.currentStep < 9;
  const showFeedback = booking.currentStep >= 9 && booking.paymentStatus === 'completed';

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
      <div
        className="p-4 bg-white cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-800">
                {booking.fromStation} → {booking.toStation}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(booking.journeyDate)}</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(booking.paymentStatus)}`}>
            {getStatusIcon(booking.paymentStatus)}
            {booking.paymentStatus}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{booking.passengerName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span>{booking.phone}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(booking.currentStep / 9) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium text-gray-600">
            {Math.round((booking.currentStep / 9) * 100)}%
          </span>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          {getStepLabel(booking.currentStep)}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Age:</span>
              <span className="ml-2 font-medium">{booking.age}</span>
            </div>
            <div>
              <span className="text-gray-600">Current Step:</span>
              <span className="ml-2 font-medium">{booking.currentStep}</span>
            </div>
            <div>
              <span className="text-gray-600">Phase 1:</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${getStatusColor(booking.statusPhase1)}`}>
                {booking.statusPhase1}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Phase 2:</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${getStatusColor(booking.statusPhase2)}`}>
                {booking.statusPhase2}
              </span>
            </div>
          </div>

          {showAdvancePayment && (
            <PaymentSection
              bookingId={booking._id}
              amount={booking.advanceAmount}
              qrCode={booking.advanceQR}
              type="advance"
              onPaymentSuccess={onUpdate}
            />
          )}

          {showTicketDownload && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">Download Documents</h4>
              <div className="grid grid-cols-2 gap-3">
                {booking.ticketPDF && (
                  <a
                    href={booking.ticketPDF}
                    download
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center text-sm"
                  >
                    Download Ticket
                  </a>
                )}
                {booking.billPDF && (
                  <a
                    href={booking.billPDF}
                    download
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center text-sm"
                  >
                    Download Bill
                  </a>
                )}
              </div>
            </div>
          )}

          {showFinalPayment && (
            <PaymentSection
              bookingId={booking._id}
              amount={booking.remainingAmount}
              qrCode={booking.finalQR}
              type="final"
              onPaymentSuccess={onUpdate}
            />
          )}

          {showFeedback && (
            <FeedbackSection bookingId={booking._id} onFeedbackSuccess={onUpdate} />
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCard;
