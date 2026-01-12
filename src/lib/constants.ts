export const APP_NAME = 'ConsultantProfile'

export const RESERVED_SLUGS = [
  'admin',
  'api',
  'login',
  'signup',
  'dashboard',
  'settings',
  'profile',
  'testimonials',
  'help',
  'support',
  'terms',
  'privacy',
  'about',
  'contact',
  'p',
] as const

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
} as const

export const TESTIMONIAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export const PROFILE_THEMES = [
  { id: 'default', name: 'Default', primaryColor: '#1a1a2e' },
  { id: 'ocean', name: 'Ocean', primaryColor: '#0077b6' },
  { id: 'forest', name: 'Forest', primaryColor: '#2d6a4f' },
  { id: 'sunset', name: 'Sunset', primaryColor: '#e85d04' },
  { id: 'lavender', name: 'Lavender', primaryColor: '#7b2cbf' },
] as const
