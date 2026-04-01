export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  from: string;
  to: string;
  date: string;
  passengers: number;
  bookingType?: 'tatkal' | 'reservation';
  passengers?: number;
  passengerDetails?: Array<{ name: string; dateOfBirth: string; age: number }>;
  paymentStatus?: 'pending' | 'advance pending' | 'advance paid' | 'completed' | 'cancelled';
  statusPhase1: 'waiting' | 'approved' | 'cancelled';
  statusPhase2: 'advance pending' | 'advance paid' | 'booking pending' | 'booking done' | 'not booked';
  currentStep: number;
  advanceAmount?: number;
  remainingAmount?: number;
  totalAmount?: number;
  advanceUserMarkedPaid?: boolean;
  finalUserMarkedPaid?: boolean;
  ticketUrl?: string;
  billUrl?: string;
  refundQRProof?: string;
  advanceQROwner?: 'suman' | 'debjit' | 'arindam' | null;
  finalQROwner?: 'suman' | 'debjit' | 'arindam' | null;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  phone: string;
  userName?: string;
  rating?: number;
  comment?: string;
  message?: string;
  createdAt: string;
}
