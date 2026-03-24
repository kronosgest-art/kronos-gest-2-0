import { supabase } from '@/lib/supabase/client'
import { Prescription } from '@/types'

export const prescriptionService = {
  async getByPatient(patientId: string): Promise<Prescription[]> {
    const { data, error } = await supabase
      .from('prescricoes')
      .select('*')
      .eq('paciente_id', patientId)
      .order('data_prescricao', { ascending: false })
    if (error) throw error
    return data || []
  },
  async create(prescription: Partial<Prescription>): Promise<Prescription> {
    const { data, error } = await supabase
      .from('prescricoes')
      .insert([prescription])
      .select()
      .single()
    if (error) throw error
    return data
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('prescricoes').delete().eq('id', id)
    if (error) throw error
  },
}
