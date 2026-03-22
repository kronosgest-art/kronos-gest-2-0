import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { AnamneseFormValues } from '../schema'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function PersonalTab() {
  const { control, watch, setValue } = useFormContext<AnamneseFormValues>()

  const peso = watch('peso')
  const altura = watch('altura')
  const cint = watch('circunferencia_cintura')
  const quad = watch('circunferencia_quadril')

  useEffect(() => {
    if (peso && altura) {
      const h = altura > 3 ? altura / 100 : altura
      if (h > 0) setValue('imc', Number((peso / (h * h)).toFixed(2)))
    } else {
      setValue('imc', undefined)
    }
  }, [peso, altura, setValue])

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-brand border-b pb-2">I. Dados Antropométricos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="peso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peso (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 70.5"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="altura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altura (m ou cm)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 1.75"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="imc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IMC Calculado</FormLabel>
                <FormControl>
                  <Input readOnly className="bg-slate-50" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="circunferencia_cintura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cintura (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="circunferencia_quadril"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quadril (cm)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-2 justify-end pb-2">
            <FormLabel className="text-muted-foreground">Razão C/Q</FormLabel>
            <div className="h-10 px-3 py-2 border rounded-md bg-slate-50 text-sm flex items-center">
              {cint && quad && quad > 0 ? (cint / quad).toFixed(2) : '-'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
        <h3 className="text-lg font-semibold text-brand border-b pb-2">
          II. Queixa Principal e Expectativas
        </h3>
        <div className="space-y-4">
          <FormField
            control={control}
            name="queixa_principal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Queixa Principal</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="O que motivou a busca por atendimento?"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="objetivos_tratamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objetivos do Tratamento</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Quais são as expectativas e metas do paciente?"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
