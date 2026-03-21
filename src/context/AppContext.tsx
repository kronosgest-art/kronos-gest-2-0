import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Appointment, initialAppointments, AppointmentStatus } from '@/lib/mockData'
import { toast } from '@/hooks/use-toast'

export type Role = 'admin' | 'professional' | 'patient' | null

interface AppContextType {
  role: Role
  login: (role: Role) => void
  logout: () => void
  appointments: Appointment[]
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(null)
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)

  const login = (newRole: Role) => {
    setRole(newRole)
  }

  const logout = () => {
    setRole(null)
  }

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
    { value: { role, login, logout, appointments, updateAppointmentStatus } },
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
