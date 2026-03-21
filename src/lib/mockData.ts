export type AppointmentStatus = 'pendente' | 'confirmado' | 'cancelado'

export interface Appointment {
  id: string
  patientName: string
  date: string
  time: string
  type: string
  status: AppointmentStatus
  notes?: string
}

export const initialAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Ana Silva',
    date: 'Hoje',
    time: '09:00',
    type: 'Terapia Integrativa',
    status: 'confirmado',
  },
  {
    id: '2',
    patientName: 'Carlos Santos',
    date: 'Hoje',
    time: '10:30',
    type: 'Acupuntura',
    status: 'pendente',
  },
  {
    id: '3',
    patientName: 'Mariana Costa',
    date: 'Hoje',
    time: '14:00',
    type: 'Nutrição Clinica',
    status: 'confirmado',
  },
  {
    id: '4',
    patientName: 'João Oliveira',
    date: 'Amanhã',
    time: '11:00',
    type: 'Terapia Integrativa',
    status: 'pendente',
  },
]

export const clinicsData = [
  {
    id: 'c1',
    name: 'Zenith Saúde',
    owner: 'Dra. Marina',
    plan: 'Premium',
    usage: 85,
    status: 'Ativa',
  },
  {
    id: 'c2',
    name: 'Vitality Med',
    owner: 'Dr. Roberto',
    plan: 'Gold',
    usage: 45,
    status: 'Ativa',
  },
  {
    id: 'c3',
    name: 'Equilíbrio Corpo',
    owner: 'Dra. Sandra',
    plan: 'Trial',
    usage: 95,
    status: 'Trial',
  },
  {
    id: 'c4',
    name: 'Instituto Ser',
    owner: 'Dr. Paulo',
    plan: 'Basic',
    usage: 10,
    status: 'Suspensa',
  },
]

export const chartData = [
  { month: 'Jan', creditos: 1200 },
  { month: 'Fev', creditos: 1900 },
  { month: 'Mar', creditos: 1500 },
  { month: 'Abr', creditos: 2200 },
  { month: 'Mai', creditos: 2800 },
  { month: 'Jun', creditos: 3400 },
]

export const prescriptionsData = [
  { id: 'p1', date: '10/10/2023', title: 'Fórmula Fitoterápica', doctor: 'Dr. Silva' },
  { id: 'p2', date: '05/09/2023', title: 'Guia Nutricional', doctor: 'Dra. Marina' },
]

export const timelineData = [
  {
    id: 't1',
    date: '10 Out 2023',
    title: 'Sessão de Acompanhamento',
    notes: 'Paciente relatou melhora no sono.',
  },
  {
    id: 't2',
    date: '05 Set 2023',
    title: 'Primeira Consulta',
    notes: 'Avaliação geral e anamnese completa.',
  },
]
