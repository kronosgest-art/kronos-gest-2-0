import { useFormContext } from 'react-hook-form'
import { AnamneseFormValues } from '../schema'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function LifestyleTab() {
  const { control } = useFormContext<AnamneseFormValues>()

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-brand mb-1">V. Estilo de Vida e Hábitos</h3>
        <p className="text-sm text-muted-foreground">
          Informações sobre rotina, alimentação e exposição a toxinas.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
        <FormField
          control={control}
          name="alimentacao_descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold text-brand">Padrão Alimentar</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva brevemente como é a alimentação diária, restrições, frequência de ultraprocessados..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
          <FormField
            control={control}
            name="consumo_agua_litros"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consumo de Água (Litros/dia)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 2.5"
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
            name="horas_sono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Média de Sono (Horas/noite)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="Ex: 7"
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
            name="nivel_estresse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível de Estresse Percebido</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Baixo">Baixo</SelectItem>
                    <SelectItem value="Moderado">Moderado</SelectItem>
                    <SelectItem value="Alto">Alto</SelectItem>
                    <SelectItem value="Muito Alto">Muito Alto</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-2 border-t mt-4">
          <h4 className="text-sm font-medium mb-4">Toxinas e Hábitos Complementares</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <FormField
              control={control}
              name="tabagismo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tabagismo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Não Fumante">Não Fumante</SelectItem>
                      <SelectItem value="Fumante Ocasional">Fumante Ocasional</SelectItem>
                      <SelectItem value="Fumante Diário">Fumante Diário</SelectItem>
                      <SelectItem value="Ex-fumante">Ex-fumante</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="consumo_alcool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumo de Álcool</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Não Consome">Não Consome</SelectItem>
                      <SelectItem value="Ocasionalmente">Ocasionalmente</SelectItem>
                      <SelectItem value="Finais de Semana">Finais de Semana</SelectItem>
                      <SelectItem value="Diariamente">Diariamente</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="pratica_atividade_fisica"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-8">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-5 w-5"
                    />
                  </FormControl>
                  <FormLabel className="text-base font-normal cursor-pointer">
                    Pratica Atividade Física Regular
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
