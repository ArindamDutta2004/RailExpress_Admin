import { CreditCard, QrCode } from 'lucide-react';
import upiQr from '../assets/upi-qr.png';

interface PaymentSectionProps {
  bookingId: string;
  amount?: number;
  type: 'advance' | 'final';
  onPaymentSuccess: () => void;
}

const PaymentSection = ({ bookingId: _bookingId, amount, type, onPaymentSuccess: _onPaymentSuccess }: PaymentSectionProps) => {
  const title = type === 'advance' ? 'Advance Payment' : 'Final Payment';
  const bgColor = type === 'advance' ? 'bg-blue-50' : 'bg-green-50';
  const borderColor = type === 'advance' ? 'border-blue-200' : 'border-green-200';

  if (!amount) {
    return (
      <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
        <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
        <p className="text-sm text-gray-600">Payment information will be available once the previous step is completed.</p>
      </div>
    );
  }

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="w-5 h-5 text-gray-700" />
        <h4 className="font-semibold text-gray-800">{title}</h4>
      </div>

      <div className="bg-white rounded-lg p-4 mb-3">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">Amount to Pay:</span>
          <span className="text-2xl font-bold text-gray-800">₹{amount}</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <QrCode className="w-4 h-4" />
            <span>Scan QR Code to Pay</span>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <img
              src={upiQr}
              alt={`${type} payment QR code`}
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-600 space-y-1">
        <p>1. Scan the QR code using any UPI app</p>
        <p>2. Complete the payment</p>
        <p>3. Wait for admin verification</p>
        <p>4. Your booking will be updated automatically</p>
      </div>
    </div>
  );
};

export default PaymentSection;
