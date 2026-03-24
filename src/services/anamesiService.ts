import { supabase } from '@/lib/supabase/client'
import { Anamnese } from '@/types'

export const anamesiService = {
  async getByPatient(patientId: string): Promise<Anamnese[]> {
    const { data, error } = await supabase
      .from('anamnese')
      .select('*')
      .eq('paciente_id', patientId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },
  async create(anamnese: Partial<Anamnese>): Promise<Anamnese> {
    const { data, error } = await supabase.from('anamnese').insert([anamnese]).select().single()
    if (error) throw error
    return data
  },
}
