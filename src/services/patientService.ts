import { supabase } from '@/lib/supabase/client'
import { Patient } from '@/types'

export const patientService = {
  async getAll(orgId: string): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('organization_id', orgId)
      .order('nome')
    if (error) throw error
    return data || []
  },
  async getById(id: string): Promise<Patient> {
    const { data, error } = await supabase.from('pacientes').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },
  async create(patient: Partial<Patient>): Promise<Patient> {
    const { data, error } = await supabase.from('pacientes').insert([patient]).select().single()
    if (error) throw error
    return data
  },
  async update(id: string, patient: Partial<Patient>): Promise<Patient> {
    const { data, error } = await supabase
      .from('pacientes')
      .update(patient)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
}
