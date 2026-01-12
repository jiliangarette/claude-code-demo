import { useState, useEffect } from 'react'
import { profileService } from '@/services/profile.service'
import { testimonialService } from '@/services/testimonial.service'
import type { Profile, Credential, Testimonial } from '@/types/database.types'

interface PublicProfileData {
  profile: Profile | null
  credentials: Credential[]
  testimonials: Testimonial[]
}

export function usePublicProfile(slug: string) {
  const [data, setData] = useState<PublicProfileData>({
    profile: null,
    credentials: [],
    testimonials: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)

        const profile = await profileService.getProfileBySlug(slug)

        if (!profile) {
          setData({ profile: null, credentials: [], testimonials: [] })
          return
        }

        const [credentials, testimonials] = await Promise.all([
          profileService.getCredentials(profile.id),
          testimonialService.getApprovedByProfileId(profile.id),
        ])

        setData({ profile, credentials, testimonials })
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchData()
    }
  }, [slug])

  return {
    ...data,
    isLoading,
    error,
    notFound: !isLoading && !data.profile,
  }
}
