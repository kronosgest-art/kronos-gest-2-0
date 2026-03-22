import { useFormContext } from 'react-hook-form'
import { AnamneseFormValues } from '../schema'
import { CheckboxGroupField } from '@/components/ui/checkbox-group-field'
import { DOENCAS_OPTS, ALERGIAS_OPTS, FAMILIAR_OPTS } from '../constants'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

export function HealthTab() {
  const { control } = useFormContext<AnamneseFormValues>()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-brand mb-1">
          III. Histórico de Saúde e Familiar
        </h3>
        <p className="text-sm text-muted-foreground">
          Marque as condições existentes e informe os medicamentos em uso.
        </p>
      </div>

      <CheckboxGroupField
        control={control}
        name="doencas_diagnosticadas"
        label="Doenças Pré-existentes Diagnosticadas"
        options={DOENCAS_OPTS}
      />

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <FormField
          control={control}
          name="medicamentos_uso"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-brand border-b pb-2 mb-4 block w-full">
                Medicamentos em Uso Contínuo
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Liste os medicamentos, suplementos ou fitoterápicos que o paciente utiliza atualmente..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <CheckboxGroupField
        control={control}
        name="alergias_sensibilidades"
        label="Alergias e Sensibilidades Conhecidas"
        options={ALERGIAS_OPTS}
      />

      <CheckboxGroupField
        control={control}
        name="historico_familiar"
        label="Histórico Familiar de Doenças (Pais, Avós, Irmãos)"
        options={FAMILIAR_OPTS}
      />
    </div>
  )
}
