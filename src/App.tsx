import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/context/AppContext'
import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import ProfDashboard from '@/pages/professional/ProfDashboard'
import ProfPatients from '@/pages/professional/ProfPatients'
import ProfAgenda from '@/pages/professional/ProfAgenda'
import PatientDashboard from '@/pages/patient/PatientDashboard'
import NotFound from '@/pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/prof/dashboard" element={<ProfDashboard />} />
            <Route path="/prof/pacientes" element={<ProfPatients />} />
            <Route path="/prof/agenda" element={<ProfAgenda />} />
            <Route path="/paciente/dashboard" element={<PatientDashboard />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AppProvider>
  </BrowserRouter>
)

export default App
