import { supabase } from '@/lib/supabase/client'
import { Financial } from '@/types'

export const financialService = {
  async getAll(orgId: string): Promise<Financial[]> {
    const { data, error } = await supabase
      .from('financeiro')
      .select('*')
      .eq('organization_id', orgId)
      .order('data_lancamento', { ascending: false })
    if (error) throw error
    return data || []
  },
  async create(financial: Partial<Financial>): Promise<Financial> {
    const { data, error } = await supabase.from('financeiro').insert([financial]).select().single()
    if (error) throw error
    return data
  },
}
