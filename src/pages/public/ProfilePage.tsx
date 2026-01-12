import { useParams } from 'react-router-dom'
import { usePublicProfile } from '@/hooks/usePublicProfile'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  MessageCircle,
  Mail,
  Linkedin,
  Twitter,
  Globe,
  Star,
  Award,
  GraduationCap,
  Medal,
  QrCode
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

const credentialIcons: Record<string, typeof Award> = {
  degree: GraduationCap,
  certification: Award,
  license: Medal,
  award: Star,
}

export function ProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const { profile, credentials, testimonials, isLoading, notFound } = usePublicProfile(slug || '')

  const profileUrl = `${window.location.origin}/p/${slug}`

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleWhatsAppClick = () => {
    if (profile?.whatsapp_number) {
      const number = profile.whatsapp_number.replace(/[^0-9]/g, '')
      window.open(`https://wa.me/${number}`, '_blank')
    }
  }

  const handleEmailClick = () => {
    if (profile?.contact_email) {
      window.location.href = `mailto:${profile.contact_email}`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="container max-w-3xl py-12">
          <div className="text-center mb-8">
            <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground">
            This profile doesn't exist or is not published.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container max-w-3xl py-12 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Avatar className="h-32 w-32 mx-auto mb-4 border-4 border-background shadow-xl">
            <AvatarImage src={profile?.profile_photo_url || ''} />
            <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
              {getInitials(profile?.full_name)}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold">{profile?.full_name}</h1>
          {profile?.headline && (
            <p className="text-lg text-muted-foreground mt-1">{profile.headline}</p>
          )}

          {/* Social Links */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {profile?.linkedin_url && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(profile.linkedin_url!, '_blank')}
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            )}
            {profile?.twitter_url && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(profile.twitter_url!, '_blank')}
              >
                <Twitter className="h-5 w-5" />
              </Button>
            )}
            {profile?.website_url && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(profile.website_url!, '_blank')}
              >
                <Globe className="h-5 w-5" />
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <QrCode className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan to View Profile</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <QRCodeSVG value={profileUrl} size={200} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {profile?.whatsapp_number && (
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp
            </Button>
          )}
          {profile?.contact_email && (
            <Button variant="outline" className="flex-1" onClick={handleEmailClick}>
              <Mail className="mr-2 h-5 w-5" />
              Email
            </Button>
          )}
        </div>

        {/* Bio */}
        {profile?.bio && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="font-semibold mb-3">About</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Credentials */}
        {credentials.length > 0 && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="font-semibold mb-4">Credentials</h2>
              <div className="space-y-3">
                {credentials.map((credential) => {
                  const Icon = credentialIcons[credential.credential_type || 'degree'] || Award
                  return (
                    <div
                      key={credential.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="p-2 rounded-full bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{credential.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {credential.institution}
                          {credential.year_obtained && ` • ${credential.year_obtained}`}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <div>
            <h2 className="font-semibold mb-4">What Clients Say</h2>
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className={testimonial.is_featured ? 'border-primary' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.client_photo_url || ''} />
                        <AvatarFallback>
                          {testimonial.client_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{testimonial.client_name}</p>
                            {testimonial.client_title && (
                              <p className="text-sm text-muted-foreground">
                                {testimonial.client_title}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {testimonial.is_featured && (
                              <Badge variant="secondary">Featured</Badge>
                            )}
                            <StarRating rating={testimonial.rating} />
                          </div>
                        </div>
                        <p className="mt-2 text-muted-foreground">"{testimonial.content}"</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Powered by ConsultantProfile</p>
        </div>
      </div>
    </div>
  )
}
