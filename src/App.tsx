import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'

// Pages
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ProfileEditPage } from '@/pages/dashboard/ProfileEditPage'
import { TestimonialsPage } from '@/pages/dashboard/TestimonialsPage'
import { SettingsPage } from '@/pages/dashboard/SettingsPage'
import { ProfilePage } from '@/pages/public/ProfilePage'
import { SubmitTestimonialPage } from '@/pages/public/SubmitTestimonialPage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Public Profile Routes */}
          <Route path="/p" element={<PublicLayout />}>
            <Route path=":slug" element={<ProfilePage />} />
            <Route path=":slug/testimonial" element={<SubmitTestimonialPage />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="profile" element={<ProfileEditPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
