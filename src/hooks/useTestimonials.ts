import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { testimonialService } from '@/services/testimonial.service'
import type { Testimonial } from '@/types/database.types'

export function useTestimonials(status?: string) {
  const { user } = useAuth()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchTestimonials = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const data = await testimonialService.getByProfileId(user.id, status)
      setTestimonials(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch testimonials'))
    } finally {
      setIsLoading(false)
    }
  }, [user, status])

  useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  const approve = async (id: string) => {
    const updated = await testimonialService.updateStatus(id, 'approved')
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? updated : t))
    )
    return updated
  }

  const reject = async (id: string) => {
    const updated = await testimonialService.updateStatus(id, 'rejected')
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? updated : t))
    )
    return updated
  }

  const toggleFeatured = async (id: string) => {
    const testimonial = testimonials.find((t) => t.id === id)
    if (!testimonial) return

    const updated = await testimonialService.toggleFeatured(id, !testimonial.is_featured)
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? updated : t))
    )
    return updated
  }

  const remove = async (id: string) => {
    await testimonialService.delete(id)
    setTestimonials((prev) => prev.filter((t) => t.id !== id))
  }

  const reorder = async (orderedTestimonials: Testimonial[]) => {
    const updates = orderedTestimonials.map((t, index) => ({
      id: t.id,
      display_order: index,
    }))
    await testimonialService.updateOrder(updates)
    setTestimonials(orderedTestimonials)
  }

  const pendingCount = testimonials.filter((t) => t.status === 'pending').length
  const approvedCount = testimonials.filter((t) => t.status === 'approved').length
  const rejectedCount = testimonials.filter((t) => t.status === 'rejected').length

  return {
    testimonials,
    isLoading,
    error,
    approve,
    reject,
    toggleFeatured,
    remove,
    reorder,
    refetch: fetchTestimonials,
    counts: {
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      total: testimonials.length,
    },
  }
}
