import { useFormContext } from 'react-hook-form'
import { AnamneseFormValues } from '../schema'
import { CheckboxGroupField } from '@/components/ui/checkbox-group-field'
import {
  CARDIO_OPTS,
  GASTRO_OPTS,
  HEPATICA_OPTS,
  PANCREATICA_OPTS,
  RENAL_OPTS,
  PULMONAR_OPTS,
  NERVOSA_OPTS,
  OSSEA_OPTS,
  ENDOCRINA_OPTS,
  IMUNOLOGICA_OPTS,
} from '../constants'

export function SystemsTab() {
  const { control } = useFormContext<AnamneseFormValues>()

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-brand mb-1">IV. Avaliação por Sistemas</h3>
        <p className="text-sm text-muted-foreground">
          Assinale os sintomas e queixas frequentes relatados pelo paciente.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CheckboxGroupField
          control={control}
          name="gastrointestinal"
          label="Sistema Gastrointestinal"
          options={GASTRO_OPTS}
        />
        <CheckboxGroupField
          control={control}
          name="hepatica"
          label="Sistema Hepático/Biliar"
          options={HEPATICA_OPTS}
        />
        <CheckboxGroupField
          control={control}
          name="pancreatica"
          label="Sistema Pancreático"
          options={PANCREATICA_OPTS}
        />
        <CheckboxGroupField
          control={control}
          name="endocrina"
          label="Sistema Endócrino/Metabólico"
          options={ENDOCRINA_OPTS}
        />
        <CheckboxGroupField
          control={control}
          name="nervosa"
          label="Sistema Nervoso/Cognitivo"
          options={NERVOSA_OPTS}
        />
        <CheckboxGroupField
          control={control}
          name="imunologica"
          label="Sistema Imunológico"
          options={IMUNOLOGICA_OPTS}
        />
        <CheckboxGroupField
          control={control}
          name="cardiovascular"
          label="Sistema Cardiovascular"
          options={CARDIO_OPTS}
        />
        <CheckboxGroupField
          control={control}
          name="renal"
          label="Sistema Renal/Urinário"
          options={RENAL_OPTS}
        />
        <CheckboxGroupField
          control={control}
          name="pulmonar"
          label="Sistema Pulmonar/Respiratório"
          options={PULMONAR_OPTS}
        />
        <CheckboxGroupField
          control={control}
          name="ossea_articular"
          label="Sistema Ósseo/Articular/Muscular"
          options={OSSEA_OPTS}
        />
      </div>
    </div>
  )
}
