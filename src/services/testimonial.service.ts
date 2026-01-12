import { supabase } from '@/lib/supabase'
import type { Testimonial, TestimonialInsert } from '@/types/database.types'

export const testimonialService = {
  async getByProfileId(profileId: string, status?: string): Promise<Testimonial[]> {
    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('profile_id', profileId)
      .order('display_order', { ascending: true })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error
    return data as Testimonial[]
  },

  async getApprovedByProfileId(profileId: string): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('profile_id', profileId)
      .eq('status', 'approved')
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true })

    if (error) throw error
    return data as Testimonial[]
  },

  async create(testimonial: TestimonialInsert): Promise<Testimonial> {
    const insertData = {
      ...testimonial,
      submission_token: crypto.randomUUID(),
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert(insertData as never)
      .select()
      .single()

    if (error) throw error
    return data as Testimonial
  },

  async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
      } as never)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Testimonial
  },

  async toggleFeatured(id: string, isFeatured: boolean): Promise<Testimonial> {
    const { data, error } = await supabase
      .from('testimonials')
      .update({ is_featured: isFeatured } as never)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Testimonial
  },

  async updateOrder(testimonials: { id: string; display_order: number }[]): Promise<void> {
    const updates = testimonials.map(({ id, display_order }) =>
      supabase
        .from('testimonials')
        .update({ display_order } as never)
        .eq('id', id)
    )

    await Promise.all(updates)
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async uploadClientPhoto(testimonialId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${testimonialId}/photo.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('testimonial-photos')
      .upload(fileName, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('testimonial-photos')
      .getPublicUrl(fileName)

    return data.publicUrl
  },
}
