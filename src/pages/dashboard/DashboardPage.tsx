import { Link } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useTestimonials } from '@/hooks/useTestimonials'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  User,
  MessageSquare,
  Eye,
  ExternalLink,
  ArrowRight,
  Clock,
} from 'lucide-react'

export function DashboardPage() {
  const { profile, isLoading: profileLoading } = useProfile()
  const { testimonials, counts, isLoading: testimonialsLoading } = useTestimonials()

  const isLoading = profileLoading || testimonialsLoading

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const pendingTestimonials = testimonials.filter((t) => t.status === 'pending').slice(0, 3)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
          </p>
        </div>
        {profile?.slug && profile?.is_published && (
          <Link to={`/p/${profile.slug}`} target="_blank">
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Public Profile
            </Button>
          </Link>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {profile?.is_published ? (
                <Badge variant="success">Published</Badge>
              ) : (
                <Badge variant="secondary">Draft</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {profile?.is_published
                ? 'Your profile is visible to the public'
                : 'Complete your profile to publish'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.approved}</div>
            <p className="text-xs text-muted-foreground">
              {counts.pending > 0
                ? `${counts.pending} pending review`
                : 'All testimonials reviewed'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Quick preview of your consultant profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.profile_photo_url || ''} />
                <AvatarFallback className="text-lg">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">
                  {profile?.full_name || 'Your Name'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.headline || 'Add a headline'}
                </p>
                {profile?.slug && (
                  <p className="text-xs text-muted-foreground mt-1">
                    /p/{profile.slug}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Link to="/dashboard/profile">
                <Button className="w-full">
                  Edit Profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Pending Testimonials */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Testimonials</CardTitle>
            <CardDescription>Review and approve client feedback</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingTestimonials.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No pending testimonials</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex items-start gap-3 p-3 rounded-lg border"
                  >
                    <Clock className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {testimonial.client_name}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {testimonial.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link to="/dashboard/testimonials">
                <Button variant="outline" className="w-full">
                  View All Testimonials
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
