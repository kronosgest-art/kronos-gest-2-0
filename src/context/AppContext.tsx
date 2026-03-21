import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Appointment, initialAppointments, AppointmentStatus } from '@/lib/mockData'
import { toast } from '@/hooks/use-toast'

interface AppContextType {
  appointments: Appointment[]
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)))
    if (status === 'confirmado') {
      toast({
        title: 'Sucesso',
        description: 'Agendamento confirmado com sucesso.',
      })
    } else if (status === 'cancelado') {
      toast({
        title: 'Cancelado',
        description: 'O agendamento foi cancelado.',
        variant: 'destructive',
      })
    }
  }

  return React.createElement(
    AppContext.Provider,
    { value: { appointments, updateAppointmentStatus } },
    children,
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
