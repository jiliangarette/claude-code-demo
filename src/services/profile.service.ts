import { supabase } from '@/lib/supabase'
import type { Profile, ProfileUpdate, Credential, CredentialInsert, CredentialUpdate } from '@/types/database.types'

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      throw error
    }
    return data as Profile
  },

  async getProfileBySlug(slug: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data as Profile
  },

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates as never)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data as Profile
  },

  async checkSlugAvailable(slug: string, currentUserId?: string): Promise<boolean> {
    let query = supabase
      .from('profiles')
      .select('id')
      .eq('slug', slug)

    if (currentUserId) {
      query = query.neq('id', currentUserId)
    }

    const { data, error } = await query

    if (error) throw error
    return (data as unknown[]).length === 0
  },

  async uploadProfilePhoto(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/profile.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName)

    return data.publicUrl
  },

  // Credentials
  async getCredentials(profileId: string): Promise<Credential[]> {
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('profile_id', profileId)
      .order('display_order', { ascending: true })

    if (error) throw error
    return data as Credential[]
  },

  async createCredential(credential: CredentialInsert): Promise<Credential> {
    const { data, error } = await supabase
      .from('credentials')
      .insert(credential as never)
      .select()
      .single()

    if (error) throw error
    return data as Credential
  },

  async updateCredential(id: string, updates: CredentialUpdate): Promise<Credential> {
    const { data, error } = await supabase
      .from('credentials')
      .update(updates as never)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Credential
  },

  async deleteCredential(id: string): Promise<void> {
    const { error } = await supabase
      .from('credentials')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async reorderCredentials(credentials: { id: string; display_order: number }[]): Promise<void> {
    const updates = credentials.map(({ id, display_order }) =>
      supabase
        .from('credentials')
        .update({ display_order } as never)
        .eq('id', id)
    )

    await Promise.all(updates)
  },
}
