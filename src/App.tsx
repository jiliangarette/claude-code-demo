import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

// Lazy-loaded pages for code splitting
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const SignupPage = lazy(() => import('@/pages/auth/SignupPage').then(m => ({ default: m.SignupPage })))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })))
const ProfileEditPage = lazy(() => import('@/pages/dashboard/ProfileEditPage').then(m => ({ default: m.ProfileEditPage })))
const TestimonialsPage = lazy(() => import('@/pages/dashboard/TestimonialsPage').then(m => ({ default: m.TestimonialsPage })))
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage').then(m => ({ default: m.SettingsPage })))
const ProfilePage = lazy(() => import('@/pages/public/ProfilePage').then(m => ({ default: m.ProfilePage })))
const SubmitTestimonialPage = lazy(() => import('@/pages/public/SubmitTestimonialPage').then(m => ({ default: m.SubmitTestimonialPage })))
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
