import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { profileService } from '@/services/profile.service'
import type { Profile, ProfileUpdate, Credential, CredentialInsert } from '@/types/database.types'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const data = await profileService.getProfile(user.id)
      setProfile(data)

      if (data) {
        const creds = await profileService.getCredentials(data.id)
        setCredentials(creds)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!user) throw new Error('Not authenticated')

    const updated = await profileService.updateProfile(user.id, updates)
    setProfile(updated)
    return updated
  }

  const uploadPhoto = async (file: File) => {
    if (!user) throw new Error('Not authenticated')

    const url = await profileService.uploadProfilePhoto(user.id, file)
    await updateProfile({ profile_photo_url: url })
    return url
  }

  const addCredential = async (credential: Omit<CredentialInsert, 'profile_id'>) => {
    if (!user) throw new Error('Not authenticated')

    const newCredential = await profileService.createCredential({
      ...credential,
      profile_id: user.id,
    })
    setCredentials((prev) => [...prev, newCredential])
    return newCredential
  }

  const updateCredential = async (id: string, updates: Partial<Credential>) => {
    const updated = await profileService.updateCredential(id, updates)
    setCredentials((prev) =>
      prev.map((c) => (c.id === id ? updated : c))
    )
    return updated
  }

  const deleteCredential = async (id: string) => {
    await profileService.deleteCredential(id)
    setCredentials((prev) => prev.filter((c) => c.id !== id))
  }

  const reorderCredentials = async (orderedCredentials: Credential[]) => {
    const updates = orderedCredentials.map((c, index) => ({
      id: c.id,
      display_order: index,
    }))
    await profileService.reorderCredentials(updates)
    setCredentials(orderedCredentials)
  }

  return {
    profile,
    credentials,
    isLoading,
    error,
    updateProfile,
    uploadPhoto,
    addCredential,
    updateCredential,
    deleteCredential,
    reorderCredentials,
    refetch: fetchProfile,
  }
}
