import { z } from 'zod'

const numOrUndefined = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => (v === '' || v === null || v === undefined ? undefined : Number(v)))

export const anamneseSchema = z.object({
  paciente_id: z.string().min(1, 'Selecione um paciente obrigatório'),
  peso: numOrUndefined,
  altura: numOrUndefined,
  imc: numOrUndefined,
  circunferencia_cintura: numOrUndefined,
  circunferencia_quadril: numOrUndefined,

  queixa_principal: z.string().optional(),
  objetivos_tratamento: z.string().optional(),

  doencas_diagnosticadas: z.array(z.string()).default([]),
  medicamentos_uso: z.string().optional(),
  alergias_sensibilidades: z.array(z.string()).default([]),
  historico_familiar: z.array(z.string()).default([]),

  cardiovascular: z.array(z.string()).default([]),
  gastrointestinal: z.array(z.string()).default([]),
  hepatica: z.array(z.string()).default([]),
  pancreatica: z.array(z.string()).default([]),
  renal: z.array(z.string()).default([]),
  pulmonar: z.array(z.string()).default([]),
  nervosa: z.array(z.string()).default([]),
  ossea_articular: z.array(z.string()).default([]),
  endocrina: z.array(z.string()).default([]),
  imunologica: z.array(z.string()).default([]),

  alimentacao_descricao: z.string().optional(),
  consumo_agua_litros: numOrUndefined,
  horas_sono: numOrUndefined,
  nivel_estresse: z.string().optional(),
  pratica_atividade_fisica: z.boolean().default(false),
  tabagismo: z.string().optional(),
  consumo_alcool: z.string().optional(),

  pele_problemas: z.array(z.string()).default([]),
  cabelo_problemas: z.array(z.string()).default([]),
  unhas_problemas: z.array(z.string()).default([]),
  corporal_problemas: z.array(z.string()).default([]),
  olhos_problemas: z.array(z.string()).default([]),

  observacoes_profissional: z.string().optional(),
})

export type AnamneseFormValues = z.infer<typeof anamneseSchema>
