import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/context/AppContext'
import { AuthProvider } from '@/hooks/use-auth'
import Layout from '@/components/Layout'
import Index from '@/pages/Index'
import Signup from '@/pages/Signup'
import ForgotPassword from '@/pages/ForgotPassword'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import ProfDashboard from '@/pages/professional/ProfDashboard'
import ProfPatients from '@/pages/professional/ProfPatients'
import ProfPatientForm from '@/pages/professional/ProfPatientForm'
import ProfAgenda from '@/pages/professional/ProfAgenda'
import ProfAnamnesePage from '@/pages/professional/anamnese/ProfAnamnesePage'
import PatientDashboard from '@/pages/patient/PatientDashboard'
import NotFound from '@/pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/prof/dashboard" element={<ProfDashboard />} />
              <Route path="/prof/pacientes" element={<ProfPatients />} />
              <Route path="/prof/pacientes/novo" element={<ProfPatientForm />} />
              <Route path="/prof/pacientes/:id" element={<ProfPatientForm />} />
              <Route path="/prof/agenda" element={<ProfAgenda />} />
              <Route path="/prof/anamnese" element={<ProfAnamnesePage />} />
              <Route path="/prof/anamnese/:pacienteId" element={<ProfAnamnesePage />} />
              <Route path="/paciente/dashboard" element={<PatientDashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
