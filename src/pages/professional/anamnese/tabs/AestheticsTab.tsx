import { useFormContext } from 'react-hook-form'
import { AnamneseFormValues } from '../schema'
import { CheckboxGroupField } from '@/components/ui/checkbox-group-field'
import { PELE_OPTS, CABELO_OPTS, UNHAS_OPTS, CORPORAL_OPTS, OLHOS_OPTS } from '../constants'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

export function AestheticsTab() {
  const { control } = useFormContext<AnamneseFormValues>()

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-brand mb-1">VI. Queixas Estéticas Específicas</h3>
        <p className="text-sm text-muted-foreground">
          Assinale as queixas estéticas que o paciente deseja tratar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CheckboxGroupField
          control={control}
          name="pele_problemas"
          label="Pele (Facial e Corporal)"
          options={PELE_OPTS}
        />
        <CheckboxGroupField
          control={control}
          name="cabelo_problemas"
          label="Cabelo e Couro Cabeludo"
          options={CABELO_OPTS}
        />
        <CheckboxGroupField
          control={control}
          name="unhas_problemas"
          label="Unhas"
          options={UNHAS_OPTS}
        />
        <CheckboxGroupField
          control={control}
          name="corporal_problemas"
          label="Queixas Corporais"
          options={CORPORAL_OPTS}
        />
        <div className="md:col-span-2">
          <CheckboxGroupField
            control={control}
            name="olhos_problemas"
            label="Região dos Olhos"
            options={OLHOS_OPTS}
          />
        </div>
      </div>

      <div className="mt-8 mb-4">
        <h3 className="text-xl font-semibold text-brand mb-1">VII. Observações do Profissional</h3>
      </div>

      <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm">
        <FormField
          control={control}
          name="observacoes_profissional"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-amber-900">
                Anotações Clínicas e Resumo da Consulta
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Registre aqui suas impressões, insights iniciais, ou detalhes que não se encaixaram nos outros campos..."
                  className="min-h-[150px] bg-white border-amber-200 focus-visible:ring-amber-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
