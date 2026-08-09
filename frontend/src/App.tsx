import { Navigate, Route, Routes } from 'react-router-dom'

import EventDetailsPage from './pages/EventDetailsPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PaymentPage from './pages/PaymentPage'
import MyTicketsPage from './pages/MyTicketsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Homepage" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/events/:eventId" element={<EventDetailsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route
        path="/reservations/:reservationId/payment"
        element={<PaymentPage />}
      />
      <Route path="/tickets" element={<MyTicketsPage />} />
    </Routes>
    
  )
}

export default App