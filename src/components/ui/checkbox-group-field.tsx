import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'

interface CheckboxGroupFieldProps {
  control: any
  name: string
  label: string
  options: { label: string; value: string }[]
}

export function CheckboxGroupField({ control, name, label, options }: CheckboxGroupFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className="space-y-3 bg-white p-4 rounded-xl border shadow-sm">
          <div className="border-b pb-2">
            <FormLabel className="text-base font-semibold text-brand">{label}</FormLabel>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {options.map((item) => (
              <FormField
                key={item.value}
                control={control}
                name={name}
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 hover:bg-slate-50 p-1.5 rounded transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), item.value])
                              : field.onChange(
                                  (field.value || []).filter(
                                    (value: string) => value !== item.value,
                                  ),
                                )
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-sm cursor-pointer w-full">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  )
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
