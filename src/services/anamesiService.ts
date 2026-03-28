import { supabase } from '@/lib/supabase/client'

export const anamesiService = {
  saveAnamnese: async (data: any) => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !sessionData?.session?.user) {
      throw new Error('Usuário não autenticado.')
    }

    const userId = sessionData.session.user.id

    // Persists the data in the anamnese table
    const { data: savedData, error } = await supabase
      .from('anamnese')
      .insert([
        {
          ...data,
          profissional_id: userId,
        },
      ])
      .select()

    if (error) {
      console.error('Erro no Supabase ao salvar anamnese:', error)
      throw new Error(`Falha no banco de dados: ${error.message}`)
    }

    return savedData
  },
}
