# Railway Ticket Booking Admin System

Complete Admin Frontend for managing railway ticket bookings with step-based workflow control.

## Features

### Authentication
- Secure admin login with JWT tokens
- Role-based access control (admin only)
- Automatic token refresh and session management

### Dashboard
- View all bookings in a table format
- Real-time status tracking
- Advanced filtering options:
  - Status Phase 1 (waiting, approved, cancelled)
  - Status Phase 2 (advance pending, advance paid, booking pending, booking done, not booked)
  - Date filter
  - Search by customer name, phone, email, journey details

### Booking Management

#### Step-Based Control System

**Step 3 - Approval Stage**
- Approve or cancel booking requests
- Transition to Phase 1: approved/cancelled

**Step 4 - Advance Payment**
- Set advance amount
- Set remaining amount (optional)
- Mark advance as collected

**Step 6 - Booking Confirmation**
- Mark booking as done
- Mark booking as not done
- Determines final booking status

**Step 7 - Document Upload**
- Upload ticket PDF (max 2MB)
- Upload bill PDF (max 2MB)
- Only available when booking is marked as done

### Feedback Management
- View all customer feedback
- Display full phone numbers and messages
- Delete feedback entries
- Timestamps for all submissions

### Security Features
- JWT token authentication
- Automatic token injection in API calls
- Protected routes with authentication guards
- Session timeout handling
- 401 auto-redirect to login

## Tech Stack

- **React.js** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **Lucide React** - Icons

## Installation

```bash
npm install
```

## Configuration

The admin frontend connects to the backend API at:
```
http://localhost:5000/api/admin
```

## Development

```bash
npm run dev
```

The admin panel runs on:
```
http://localhost:3001
```

## Build

```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /auth/login` - Admin login

### Bookings
- `GET /booking/all` - Get all bookings
- `GET /booking/:id` - Get booking details
- `PUT /booking/:id/approve` - Approve booking
- `PUT /booking/:id/cancel` - Cancel booking
- `PUT /booking/:id/advance` - Set advance amount
- `PUT /booking/:id/booking-done` - Mark booking as done
- `PUT /booking/:id/booking-not-done` - Mark booking as not done

### File Upload
- `POST /upload/ticket` - Upload ticket PDF
- `POST /upload/bill` - Upload bill PDF

### Feedback
- `GET /feedback/all` - Get all feedback
- `DELETE /feedback/:id` - Delete feedback

## Status Workflow

### Phase 1 Status
1. **waiting** → Initial state
2. **approved** → After admin approval (Step 3)
3. **cancelled** → After admin cancellation (Step 3)

### Phase 2 Status
1. **advance pending** → After approval
2. **advance paid** → After advance amount set (Step 4)
3. **booking pending** → After advance confirmed
4. **booking done** → After successful booking (Step 6)
5. **not booked** → If booking failed (Step 6)

## File Upload Rules

- Only PDF files allowed
- Maximum file size: 2MB
- Upload enabled only when `statusPhase2 = booking done`
- Separate endpoints for ticket and bill uploads

## UI Features

- Responsive design for all screen sizes
- Loading states for all async operations
- Error handling with user-friendly messages
- Disabled states prevent invalid actions
- Confirmation dialogs for destructive actions
- Real-time status updates
- Clean, modern interface with Tailwind CSS

## Security Best Practices

- JWT tokens stored in localStorage
- Tokens automatically attached to all API requests
- 401 responses trigger automatic logout
- Protected routes require authentication
- Admin role validation on login
- No sensitive data in client-side code
