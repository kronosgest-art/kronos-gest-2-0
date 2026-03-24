import { supabase } from '@/lib/supabase/client'
import { Exam } from '@/types'

export const examService = {
  async getByPatient(patientId: string): Promise<Exam[]> {
    const { data, error } = await supabase
      .from('exames')
      .select('*')
      .eq('paciente_id', patientId)
      .order('data_exame', { ascending: false })
    if (error) throw error
    return data || []
  },
  async create(exam: Partial<Exam>): Promise<Exam> {
    const { data, error } = await supabase.from('exames').insert([exam]).select().single()
    if (error) throw error
    return data
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('exames').delete().eq('id', id)
    if (error) throw error
  },
}
