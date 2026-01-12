import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePublicProfile } from '@/hooks/usePublicProfile'
import { testimonialService } from '@/services/testimonial.service'
import { testimonialSubmissionSchema, type TestimonialSubmissionFormData } from '@/lib/validators'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { toast } from '@/hooks/useToast'
import { Star, CheckCircle, ArrowLeft } from 'lucide-react'

function StarRatingInput({
  value,
  onChange,
}: {
  value: number | null
  onChange: (rating: number) => void
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className="p-1 focus:outline-none"
        >
          <Star
            className={`h-8 w-8 transition-colors ${
              star <= (hovered || value || 0)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export function SubmitTestimonialPage() {
  const { slug } = useParams<{ slug: string }>()
  const { profile, isLoading: profileLoading, notFound } = usePublicProfile(slug || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [rating, setRating] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TestimonialSubmissionFormData>({
    resolver: zodResolver(testimonialSubmissionSchema),
    defaultValues: {
      consent: false,
    },
  })

  const onSubmit = async (data: TestimonialSubmissionFormData) => {
    if (!profile) return

    setIsSubmitting(true)
    try {
      await testimonialService.create({
        profile_id: profile.id,
        client_name: data.client_name,
        client_email: data.client_email || null,
        client_title: data.client_title || null,
        content: data.content,
        rating: rating,
      })
      setIsSubmitted(true)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit testimonial. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground">
            This profile doesn't exist or is not published.
          </p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Thank You!</CardTitle>
            <CardDescription>
              Your testimonial has been submitted successfully. It will be reviewed by{' '}
              {profile?.full_name || 'the consultant'} before being published.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to={`/p/${slug}`}>
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link
          to={`/p/${slug}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to profile
        </Link>

        <Card>
          <CardHeader className="text-center">
            <Avatar className="h-16 w-16 mx-auto mb-2">
              <AvatarImage src={profile?.profile_photo_url || ''} />
              <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
            </Avatar>
            <CardTitle>Share Your Experience</CardTitle>
            <CardDescription>
              Leave a testimonial for {profile?.full_name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Your Name *</Label>
                <Input
                  id="client_name"
                  placeholder="John Smith"
                  {...register('client_name')}
                  disabled={isSubmitting}
                />
                {errors.client_name && (
                  <p className="text-sm text-destructive">{errors.client_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_email">Your Email (optional)</Label>
                <Input
                  id="client_email"
                  type="email"
                  placeholder="john@example.com"
                  {...register('client_email')}
                  disabled={isSubmitting}
                />
                {errors.client_email && (
                  <p className="text-sm text-destructive">{errors.client_email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client_title">Your Title (optional)</Label>
                <Input
                  id="client_title"
                  placeholder="CEO at Company"
                  {...register('client_title')}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label>Rating (optional)</Label>
                <StarRatingInput
                  value={rating}
                  onChange={(r) => {
                    setRating(r)
                    setValue('rating', r)
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Your Testimonial *</Label>
                <Textarea
                  id="content"
                  placeholder="Share your experience working with this consultant..."
                  rows={5}
                  {...register('content')}
                  disabled={isSubmitting}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content.message}</p>
                )}
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-1"
                  {...register('consent')}
                  disabled={isSubmitting}
                />
                <Label htmlFor="consent" className="text-sm font-normal">
                  I consent to having this testimonial displayed publicly on the
                  consultant's profile
                </Label>
              </div>
              {errors.consent && (
                <p className="text-sm text-destructive">{errors.consent.message}</p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
                Submit Testimonial
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
