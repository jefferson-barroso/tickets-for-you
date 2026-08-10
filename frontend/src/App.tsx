import { Navigate, Route, Routes } from 'react-router-dom'

import { RequireRole } from './features/auth/RequireRole'
import EventDetailsPage from './pages/EventDetailsPage'
import GateValidationPage from './pages/GateValidationPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MyTicketsPage from './pages/MyTicketsPage'
import PaymentPage from './pages/PaymentPage'
import SharedTicketPage from './pages/SharedTicketPage'
import OrganizerPage from './pages/OrganizerPage'
import { AccessibilityToolbar } from './components/acessibility/AccessibilityToolbar'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Homepage" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/events/:eventId" element={<EventDetailsPage />} />

        <Route
          path="/reservations/:reservationId/payment"
          element={
            <RequireRole allowedRoles={['CLIENTE']}>
              <PaymentPage />
            </RequireRole>
          }
        />

        <Route
          path="/tickets"
          element={
            <RequireRole allowedRoles={['CLIENTE']}>
              <MyTicketsPage />
            </RequireRole>
          }
        />

        <Route path="/tickets/shared/:token" element={<SharedTicketPage />} />

        <Route
          path="/gate"
          element={
            <RequireRole allowedRoles={['PORTARIA']}>
              <GateValidationPage />
            </RequireRole>
          }
        />

        <Route
          path="/organizer"
          element={
            <RequireRole allowedRoles={['ORGANIZADOR']}>
              <OrganizerPage />
            </RequireRole>
          }
        />


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AccessibilityToolbar />
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        closeButton
        toastOptions={{
          className: 'border border-t4u-primary/30 bg-stone-900 text-white',
        }}
      />
    </>
  )
}

export default App