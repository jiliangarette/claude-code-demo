import { useState } from 'react'
import { useTestimonials } from '@/hooks/useTestimonials'
import { useProfile } from '@/hooks/useProfile'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/useToast'
import {
  Check,
  X,
  Star,
  StarOff,
  Trash2,
  Copy,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import type { Testimonial } from '@/types/database.types'

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

function TestimonialCard({
  testimonial,
  onApprove,
  onReject,
  onToggleFeatured,
  onDelete,
}: {
  testimonial: Testimonial
  onApprove?: () => void
  onReject?: () => void
  onToggleFeatured?: () => void
  onDelete: () => void
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={testimonial.client_photo_url || ''} />
              <AvatarFallback>{getInitials(testimonial.client_name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
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
                    <Badge variant="default">Featured</Badge>
                  )}
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>
              <p className="mt-2 text-sm">{testimonial.content}</p>
              <div className="mt-4 flex items-center gap-2">
                {testimonial.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={onApprove}>
                      <Check className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={onReject}>
                      <X className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
                {testimonial.status === 'approved' && onToggleFeatured && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onToggleFeatured}
                  >
                    {testimonial.is_featured ? (
                      <>
                        <StarOff className="mr-1 h-4 w-4" />
                        Unfeature
                      </>
                    ) : (
                      <>
                        <Star className="mr-1 h-4 w-4" />
                        Feature
                      </>
                    )}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete()
                setShowDeleteDialog(false)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function TestimonialsPage() {
  const { profile } = useProfile()
  const { testimonials, counts, isLoading, approve, reject, toggleFeatured, remove } = useTestimonials()
  const [copied, setCopied] = useState(false)

  const testimonialUrl = profile?.slug
    ? `${window.location.origin}/p/${profile.slug}/testimonial`
    : ''

  const copyLink = () => {
    navigator.clipboard.writeText(testimonialUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: 'Link copied',
      description: 'Testimonial request link copied to clipboard.',
    })
  }

  const handleApprove = async (id: string) => {
    try {
      await approve(id)
      toast({ title: 'Testimonial approved' })
    } catch {
      toast({ title: 'Error', description: 'Failed to approve', variant: 'destructive' })
    }
  }

  const handleReject = async (id: string) => {
    try {
      await reject(id)
      toast({ title: 'Testimonial rejected' })
    } catch {
      toast({ title: 'Error', description: 'Failed to reject', variant: 'destructive' })
    }
  }

  const handleToggleFeatured = async (id: string) => {
    try {
      await toggleFeatured(id)
      toast({ title: 'Updated' })
    } catch {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await remove(id)
      toast({ title: 'Testimonial deleted' })
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' })
    }
  }

  const pendingTestimonials = testimonials.filter((t) => t.status === 'pending')
  const approvedTestimonials = testimonials.filter((t) => t.status === 'approved')
  const rejectedTestimonials = testimonials.filter((t) => t.status === 'rejected')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24" />
        <div className="space-y-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">
            Manage feedback from your clients
          </p>
        </div>
      </div>

      {/* Request Link Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Request Testimonials</CardTitle>
          <CardDescription>
            Share this link with clients to collect testimonials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input value={testimonialUrl} readOnly className="flex-1" />
            <Button onClick={copyLink} variant="outline">
              {copied ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending
            {counts.pending > 0 && (
              <Badge variant="secondary" className="ml-1">
                {counts.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved
            <Badge variant="secondary" className="ml-1">
              {counts.approved}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Rejected
            <Badge variant="secondary" className="ml-1">
              {counts.rejected}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingTestimonials.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No pending testimonials</p>
              </CardContent>
            </Card>
          ) : (
            pendingTestimonials.map((t) => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                onApprove={() => handleApprove(t.id)}
                onReject={() => handleReject(t.id)}
                onDelete={() => handleDelete(t.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedTestimonials.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No approved testimonials yet</p>
              </CardContent>
            </Card>
          ) : (
            approvedTestimonials.map((t) => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                onToggleFeatured={() => handleToggleFeatured(t.id)}
                onDelete={() => handleDelete(t.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedTestimonials.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>No rejected testimonials</p>
              </CardContent>
            </Card>
          ) : (
            rejectedTestimonials.map((t) => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                onDelete={() => handleDelete(t.id)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
