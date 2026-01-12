import { z } from 'zod'
import { RESERVED_SLUGS, PASSWORD_REQUIREMENTS } from './constants'

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')

export const passwordSchema = z
  .string()
  .min(PASSWORD_REQUIREMENTS.minLength, `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const slugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(50, 'Slug must be at most 50 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
  .refine(
    (slug) => !RESERVED_SLUGS.includes(slug as typeof RESERVED_SLUGS[number]),
    'This slug is reserved'
  )

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  headline: z.string().max(200).optional().nullable(),
  bio: z.string().max(5000).optional().nullable(),
  slug: slugSchema,
  whatsapp_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional()
    .nullable()
    .or(z.literal('')),
  linkedin_url: z
    .string()
    .url('Invalid URL')
    .optional()
    .nullable()
    .or(z.literal('')),
  twitter_url: z
    .string()
    .url('Invalid URL')
    .optional()
    .nullable()
    .or(z.literal('')),
  website_url: z
    .string()
    .url('Invalid URL')
    .optional()
    .nullable()
    .or(z.literal('')),
  contact_email: z
    .string()
    .email('Invalid email')
    .optional()
    .nullable()
    .or(z.literal('')),
})

export const credentialSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  institution: z.string().max(200).optional().nullable(),
  year_obtained: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 10)
    .optional()
    .nullable(),
  credential_type: z.enum(['degree', 'certification', 'license', 'award']).optional().nullable(),
})

export const testimonialSubmissionSchema = z.object({
  client_name: z.string().min(2, 'Name is required').max(100),
  client_email: z.string().email('Invalid email').optional().nullable().or(z.literal('')),
  client_title: z.string().max(100).optional().nullable(),
  content: z.string().min(10, 'Testimonial must be at least 10 characters').max(2000),
  rating: z.number().min(1).max(5).optional().nullable(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must consent to public display',
  }),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type CredentialFormData = z.infer<typeof credentialSchema>
export type TestimonialSubmissionFormData = z.infer<typeof testimonialSubmissionSchema>
