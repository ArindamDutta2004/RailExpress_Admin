import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { BACKEND_BASE } from '../config/api';
import { Booking } from '../types';
import { ArrowLeft, CheckCircle, XCircle, Upload } from 'lucide-react';
import sumanQr from '../assets/suman-qr.png';
import arindamQr from '../assets/arindam-qr.png';
import debjitQr from '../assets/debjit-qr.png';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [advanceAmount, setAdvanceAmount] = useState('');
  const [remainingAmount, setRemainingAmount] = useState('');
  const [qrOwner, setQrOwner] = useState<'suman' | 'debjit' | 'arindam'>('suman');
  const [ticketFile, setTicketFile] = useState<File | null>(null);
  const [billFile, setBillFile] = useState<File | null>(null);
  const [refundProofFile, setRefundProofFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [refundActionLoading, setRefundActionLoading] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/booking/${id}`);
      setBooking(response.data);
      const b = response.data as Booking;
      if (b.currentStep === 7 && b.finalQROwner) {
        setQrOwner(b.finalQROwner);
      } else if (b.advanceQROwner) {
        setQrOwner(b.advanceQROwner);
      }
      setError('');
    } catch (err) {
      setError('Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!booking || booking.currentStep !== 3) return;

    setActionLoading(true);
    try {
      await api.put(`/booking/${id}/approve`);
      await fetchBooking();
    } catch (err) {
      alert('Failed to approve booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!booking || booking.currentStep !== 3) return;

    setActionLoading(true);
    try {
      await api.put(`/booking/${id}/cancel`);
      await fetchBooking();
    } catch (err) {
      alert('Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetAdvance = async () => {
    if (!booking || booking.currentStep !== 4 || !advanceAmount) return;

    setActionLoading(true);
    try {
      const requestData = {
        advanceAmount: parseFloat(advanceAmount),
        remainingAmount: remainingAmount ? parseFloat(remainingAmount) : undefined,
        qrOwner,
      };
      await api.put(`/booking/${id}/advance`, requestData);
      await fetchBooking();
      setAdvanceAmount('');
      setRemainingAmount('');
    } catch (err) {
      alert('Failed to set advance amount');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmAdvancePayment = async () => {
    if (!booking || booking.currentStep !== 5) return;

    setActionLoading(true);
    try {
      await api.put(`/booking/${id}/confirm-advance-payment`);
      await fetchBooking();
    } catch (err) {
      alert('Failed to confirm advance payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateQROwner = async () => {
    if (!booking || ![5, 7].includes(booking.currentStep)) return;
    setActionLoading(true);
    try {
      await api.put(`/booking/${id}/qr-owner`, { qrOwner });
      await fetchBooking();
      alert('QR owner updated successfully');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        `Failed to update QR owner (status ${
          (err as { response?: { status?: number } })?.response?.status ?? 'unknown'
        })`;
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBookingDone = async () => {
    if (!booking || booking.currentStep !== 6) return;

    setActionLoading(true);
    try {
      await api.put(`/booking/${id}/booking-done`);
      await fetchBooking();
    } catch (err) {
      alert('Failed to mark booking as done');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmFinalPayment = async () => {
    if (!booking || booking.currentStep !== 7) return;

    setActionLoading(true);
    try {
      await api.put(`/booking/${id}/confirm-final-payment`);
      await fetchBooking();
    } catch (err) {
      alert('Failed to confirm final payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBookingNotDone = async () => {
    if (!booking || booking.currentStep !== 6) return;

    setActionLoading(true);
    try {
      await api.put(`/booking/${id}/booking-not-done`);
      await fetchBooking();
    } catch (err) {
      alert('Failed to mark booking as not done');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTicketUpload = async () => {
    if (!booking || booking.statusPhase2 !== 'booking done' || !ticketFile) return;

    if (ticketFile.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }

    if (ticketFile.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('ticket', ticketFile);
      formData.append('bookingId', booking.id);

      await api.post('/upload/ticket', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchBooking();
      setTicketFile(null);
      alert('Ticket uploaded successfully');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to upload ticket';
      alert(msg);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleBillUpload = async () => {
    if (!booking || booking.statusPhase2 !== 'booking done' || !billFile) return;

    if (billFile.type !== 'application/pdf') {
      alert('Only PDF files are allowed');
      return;
    }

    if (billFile.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('bill', billFile);
      formData.append('bookingId', booking.id);

      await api.post('/upload/bill', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchBooking();
      setBillFile(null);
      alert('Bill uploaded successfully');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to upload bill';
      alert(msg);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleRefundProofUpload = async () => {
    if (!booking || !refundProofFile) return;
    setRefundActionLoading(true);
    try {
      const attempts: Array<{
        url: string;
        payload: FormData;
      }> = [];

      const form1 = new FormData();
      form1.append('refundProof', refundProofFile);
      attempts.push({ url: `/booking/${booking.id}/refund-proof`, payload: form1 });

      const form2 = new FormData();
      form2.append('refundProof', refundProofFile);
      form2.append('bookingId', booking.id);
      attempts.push({ url: '/upload/refund-proof', payload: form2 });

      // Extra compatibility fallbacks for older servers.
      const form3 = new FormData();
      form3.append('refundProof', refundProofFile);
      form3.append('bookingId', booking.id);
      attempts.push({ url: `/upload/refund-proof/${booking.id}`, payload: form3 });

      const form4 = new FormData();
      form4.append('refundProof', refundProofFile);
      form4.append('bookingId', booking.id);
      attempts.push({ url: '/booking/refund-proof', payload: form4 });

      let lastError: unknown = null;
      for (const attempt of attempts) {
        try {
          await api.post(attempt.url, attempt.payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          lastError = null;
          break;
        } catch (err: unknown) {
          lastError = err;
        }
      }
      if (lastError) throw lastError;

      setRefundProofFile(null);
      await fetchBooking();
      alert('Refund proof uploaded and marked processed');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const data = (err as { response?: { data?: unknown } })?.response?.data;
      let msg = 'Failed to upload refund proof';
      if (data && typeof data === 'object' && 'message' in (data as Record<string, unknown>)) {
        msg = String((data as { message?: string }).message || msg);
      } else if (status === 404) {
        msg = 'Refund-proof upload route not found on backend. Please restart backend and try again.';
      }
      alert(msg);
    } finally {
      setRefundActionLoading(false);
    }
  };

  const normalizeUploadUrl = (url?: string) => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    // Backend saves as `/uploads/<file>.pdf` but some records may come as `uploads/<file>.pdf`.
    const idxAbs = url.indexOf('/uploads/');
    if (idxAbs !== -1) return `${BACKEND_BASE}${url.slice(idxAbs)}`;

    const idxAbs2 = url.indexOf('/uploads');
    if (idxAbs2 !== -1) return `${BACKEND_BASE}${url.slice(idxAbs2)}`;

    const idxRel = url.indexOf('uploads/');
    if (idxRel !== -1) return `${BACKEND_BASE}/${url.slice(idxRel)}`;

    return url;
  };

  const formatOwner = (owner?: 'suman' | 'debjit' | 'arindam' | null) => {
    if (owner === 'debjit') return 'Debjit';
    if (owner === 'arindam') return 'Arindam';
    if (owner === 'suman') return 'Suman';
    return 'Not selected';
  };
  const selectedOwnerQr =
    qrOwner === 'arindam' ? arindamQr : qrOwner === 'debjit' ? debjitQr : sumanQr;

  if (loading) {
    return (
      <div className="min-h-screen admin-animated-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-white/80">Loading booking...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen admin-animated-bg flex items-center justify-center">
        <div className="glass-card rounded px-6 py-4">
          {error || 'Booking not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen admin-animated-bg page">
      <header className="bg-white/80 backdrop-blur shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-2 press"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-white">Booking Details</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card hover-glow rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/70">Name</p>
                  <p className="font-medium text-white/90">{booking.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Phone</p>
                  <p className="font-medium text-white/90">{booking.phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-white/70">Email</p>
                  <p className="font-medium text-white/90">{booking.email}</p>
                </div>
              </div>
            </div>

            <div className="glass-card hover-glow rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Journey Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/70">From</p>
                  <p className="font-medium text-white/90">{booking.from}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">To</p>
                  <p className="font-medium text-white/90">{booking.to}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Date</p>
                  <p className="font-medium text-white/90">
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Passengers</p>
                  <p className="font-medium text-white/90">{booking.passengers}</p>
                </div>
                {booking.passengerDetails && booking.passengerDetails.length > 0 && (
                  <div className="lg:col-span-2 mt-2">
                    <p className="text-sm text-white/70">Passenger Details</p>
                    <ul className="mt-1 list-disc list-inside text-white/80 text-sm">
                      {booking.passengerDetails.map((p, index) => (
                        <li key={`passenger-detail-${index}`}>
                          {p.name} ({p.age} yrs) - {new Date(p.dateOfBirth).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {booking.preferredTrains && booking.preferredTrains.length > 0 && (
                  <div className="lg:col-span-2 mt-2">
                    <p className="text-sm text-white/70">Preferred Trains (Optional)</p>
                    <ul className="mt-1 list-disc list-inside text-white/80 text-sm">
                      {booking.preferredTrains.map((train, index) => (
                        <li key={`preferred-train-${index}`}>{train}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card hover-glow rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
              <div className="grid grid-cols-2 gap-4">
                {booking.totalAmount && (
                  <div>
                    <p className="text-sm text-white/70">Total Amount</p>
                    <p className="font-medium text-white/90">₹{booking.totalAmount}</p>
                  </div>
                )}
                {booking.advanceAmount && (
                  <div>
                    <p className="text-sm text-white/70">Advance Amount</p>
                    <p className="font-medium text-white/90">₹{booking.advanceAmount}</p>
                  </div>
                )}
                {booking.remainingAmount && (
                  <div>
                    <p className="text-sm text-white/70">Remaining Amount</p>
                    <p className="font-medium text-white/90">₹{booking.remainingAmount}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-white/70">Advance QR Owner</p>
                  <p className="font-medium text-white/90">{formatOwner(booking.advanceQROwner)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Final QR Owner</p>
                  <p className="font-medium text-white/90">{formatOwner(booking.finalQROwner)}</p>
                </div>
              </div>
            </div>

            {(booking.statusPhase1 === 'cancelled' || booking.paymentStatus === 'cancelled') && (
              <div className="glass-card hover-glow rounded-lg p-6 text-white">
                <h2 className="text-lg font-semibold mb-2">Refund / Return Money</h2>
                <p className="text-sm text-white/75">
                  Refund will be done in 1-2 days. If not received, contact{' '}
                  <span className="font-semibold text-white/90">8942938405</span> or email{' '}
                  <span className="font-semibold text-white/90">sumankhan2909@gmail.com</span>.
                </p>
                <div className="mt-3 bg-white/85 rounded-xl p-4 text-slate-900">
                  <div className="text-sm font-semibold mb-2">User uploaded QR / proof</div>
                  {booking.refundQRProof ? (
                    <a
                      href={normalizeUploadUrl(booking.refundQRProof)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-700 hover:underline"
                    >
                      View uploaded proof
                    </a>
                  ) : (
                    <div className="text-sm text-slate-600">No refund proof uploaded yet.</div>
                  )}
                  <div className="mt-3 text-xs text-slate-700">
                    Status:{' '}
                    <span className="font-semibold uppercase tracking-wide">
                      {booking.refundVerificationStatus || 'pending'}
                    </span>
                    {booking.refundVerifiedBy && (
                      <span>
                        {' '}
                        • Verified by {booking.refundVerifiedBy}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-col md:flex-row gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setRefundProofFile(e.target.files?.[0] || null)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleRefundProofUpload}
                      disabled={!refundProofFile || refundActionLoading}
                      className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {refundActionLoading ? 'Uploading...' : 'Upload Refund Proof'}
                    </button>
                  </div>
                  {booking.refundProofScreenshot && (
                    <a
                      href={normalizeUploadUrl(booking.refundProofScreenshot)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-emerald-700 hover:underline"
                    >
                      View admin uploaded refund proof
                    </a>
                  )}
                </div>
              </div>
            )}

            {booking.currentStep >= 8 && booking.statusPhase2 === 'booking done' && (
              <div className="glass-card hover-glow rounded-lg p-6 text-white">
                <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Ticket PDF {booking.ticketUrl && '(Uploaded)'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setTicketFile(e.target.files?.[0] || null)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <button
                        onClick={handleTicketUpload}
                        disabled={!ticketFile || uploadLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 press"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </button>
                    </div>
                    {booking.ticketUrl && (
                      <a
                        href={normalizeUploadUrl(booking.ticketUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-sky-200 hover:underline mt-2 inline-block"
                      >
                        View uploaded ticket
                      </a>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Bill PDF {booking.billUrl && '(Uploaded)'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setBillFile(e.target.files?.[0] || null)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <button
                        onClick={handleBillUpload}
                        disabled={!billFile || uploadLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 press"
                      >
                        <Upload className="w-4 h-4" />
                        Upload
                      </button>
                    </div>
                    {booking.billUrl && (
                      <a
                        href={normalizeUploadUrl(booking.billUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-sky-200 hover:underline mt-2 inline-block"
                      >
                        View uploaded bill
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="glass-card hover-glow rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Status</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-white/70 mb-1">Current Step</p>
                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                    Step {booking.currentStep}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-white/70 mb-1">Phase 1 Status</p>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    booking.statusPhase1 === 'approved' ? 'bg-green-100 text-green-800' :
                    booking.statusPhase1 === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.statusPhase1}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-white/70 mb-1">Phase 2 Status</p>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    booking.statusPhase2 === 'booking done' ? 'bg-green-100 text-green-800' :
                    booking.statusPhase2 === 'not booked' ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {booking.statusPhase2}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card hover-glow rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Actions</h2>

              {booking.currentStep === 3 && (
                <div className="space-y-2">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed press"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Booking
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed press"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Booking
                  </button>
                </div>
              )}

              {booking.currentStep === 4 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Advance Amount
                    </label>
                    <input
                      type="number"
                      value={advanceAmount}
                      onChange={(e) => setAdvanceAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      QR Option (Send to user)
                    </label>
                    <select
                      value={qrOwner}
                      onChange={(e) => setQrOwner(e.target.value as 'suman' | 'debjit' | 'arindam')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="suman">Suman</option>
                      <option value="arindam">Arindam</option>
                      <option value="debjit">Debjit</option>
                    </select>
                    <p className="mt-1 text-xs text-white/70">
                      Each option maps to its own unique QR and is sent accordingly.
                    </p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                        Selected QR Owner: {
                          qrOwner === 'debjit' ? 'Debjit' :
                          qrOwner === 'arindam' ? 'Arindam' :
                          'Suman'
                        }
                      </span>
                    </div>
                    <div className="mt-3 bg-white/85 rounded-xl p-3 inline-block">
                      <img src={selectedOwnerQr} alt="Selected QR preview" className="w-28 h-28 object-contain" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Remaining Amount (Optional)
                    </label>
                    <input
                      type="number"
                      value={remainingAmount}
                      onChange={(e) => setRemainingAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSetAdvance}
                    disabled={!advanceAmount || actionLoading}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed press"
                  >
                    Set Advance Amount
                  </button>
                </div>
              )}

              {booking.currentStep === 6 && (
                <div className="space-y-2">
                  <button
                    onClick={handleBookingDone}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed press"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Booking Done
                  </button>
                  <button
                    onClick={handleBookingNotDone}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed press"
                  >
                    <XCircle className="w-4 h-4" />
                    Not Booked
                  </button>
                </div>
              )}

              {booking.currentStep === 5 && (
                <div className="space-y-2">
                  <div className="bg-white/85 rounded-xl p-3 text-slate-900">
                    <label className="block text-sm font-medium mb-1">Change QR Owner</label>
                    <div className="flex gap-2">
                      <select
                        value={qrOwner}
                        onChange={(e) => setQrOwner(e.target.value as 'suman' | 'debjit' | 'arindam')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-slate-900 outline-none"
                      >
                        <option value="suman">Suman</option>
                        <option value="arindam">Arindam</option>
                        <option value="debjit">Debjit</option>
                      </select>
                      <button
                        onClick={handleUpdateQROwner}
                        disabled={actionLoading}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
                      >
                        Update
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-slate-700">
                      Saved on server: <span className="font-semibold">{formatOwner(booking.advanceQROwner)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/70">
                    User payment status:{' '}
                    <span className="font-semibold">
                      {booking.advanceUserMarkedPaid ? 'Marked as paid by user' : 'Pending user payment'}
                    </span>
                  </p>
                  <button
                    onClick={handleConfirmAdvancePayment}
                    disabled={actionLoading || !booking.advanceUserMarkedPaid}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed press"
                  >
                    Confirm Advance Payment
                  </button>
                </div>
              )}

              {booking.currentStep === 7 && (
                <div className="space-y-2">
                  <div className="bg-white/85 rounded-xl p-3 text-slate-900">
                    <label className="block text-sm font-medium mb-1">Change QR Owner</label>
                    <div className="flex gap-2">
                      <select
                        value={qrOwner}
                        onChange={(e) => setQrOwner(e.target.value as 'suman' | 'debjit' | 'arindam')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-slate-900 outline-none"
                      >
                        <option value="suman">Suman</option>
                        <option value="arindam">Arindam</option>
                        <option value="debjit">Debjit</option>
                      </select>
                      <button
                        onClick={handleUpdateQROwner}
                        disabled={actionLoading}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
                      >
                        Update
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-slate-700">
                      Saved on server: <span className="font-semibold">{formatOwner(booking.finalQROwner)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/70">
                    User final payment status:{' '}
                    <span className="font-semibold">
                      {booking.finalUserMarkedPaid ? 'Marked as paid by user' : 'Pending user final payment'}
                    </span>
                  </p>
                  <button
                    onClick={handleConfirmFinalPayment}
                    disabled={actionLoading || !booking.finalUserMarkedPaid}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed press"
                  >
                    Confirm Final Payment
                  </button>
                </div>
              )}

              {booking.currentStep !== 3 &&
                booking.currentStep !== 4 &&
                booking.currentStep !== 5 &&
                booking.currentStep !== 6 &&
                booking.currentStep !== 7 && (
                <p className="text-sm text-white/60 text-center py-4">
                  No actions available for current step
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingDetail;
