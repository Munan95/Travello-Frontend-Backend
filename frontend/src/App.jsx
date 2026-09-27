import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { DestinationsPage } from '@/pages/DestinationsPage';
import { DestinationDetailPage } from '@/pages/DestinationDetailPage';
import { ToursPage } from '@/pages/ToursPage';
import { TourDetailPage } from '@/pages/TourDetailPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { VerifyOtpPage } from '@/pages/VerifyOtpPage';
import { MyBookingsPage } from '@/pages/MyBookingsPage';
import { AdminPage } from '@/pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="destinations" element={<DestinationsPage />} />
          <Route path="destinations/:id" element={<DestinationDetailPage />} />
          <Route path="tours" element={<ToursPage />} />
          <Route path="tours/:id" element={<TourDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-otp" element={<VerifyOtpPage />} />
          <Route
            path="bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
