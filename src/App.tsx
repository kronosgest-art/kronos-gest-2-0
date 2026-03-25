import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/context/AppContext'
import { AuthProvider } from '@/hooks/use-auth'
import Layout from '@/components/Layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

import Login from '@/pages/Login'
import Signup from '@/pages/Signup'

import AdminDashboard from '@/pages/admin/Dashboard'
import ProfDashboard from '@/pages/professional/Dashboard'
import Patients from '@/pages/professional/Patients'
import PatientDetail from '@/pages/professional/PatientDetail'
import Anamesis from '@/pages/professional/Anamesis'
import Exams from '@/pages/professional/Exams'
import Prescriptions from '@/pages/professional/Prescriptions'
import Appointments from '@/pages/professional/Appointments'
import Financial from '@/pages/professional/Financial'
import Settings from '@/pages/professional/Settings'
import Credits from '@/pages/professional/Credits'
import PatientDashboard from '@/pages/patient/Dashboard'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route element={<Layout />}>
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['profissional']} />}>
                <Route path="/professional/dashboard" element={<ProfDashboard />} />
                <Route path="/professional/patients" element={<Patients />} />
                <Route path="/professional/patients/:id" element={<PatientDetail />} />
                <Route path="/professional/patients/:pacienteId/anamesis" element={<Anamesis />} />
                <Route path="/professional/patients/:pacienteId/exams" element={<Exams />} />
                <Route
                  path="/professional/patients/:pacienteId/prescriptions"
                  element={<Prescriptions />}
                />
                <Route path="/professional/appointments" element={<Appointments />} />
                <Route path="/professional/financial" element={<Financial />} />
                <Route path="/professional/creditos" element={<Credits />} />
                <Route path="/professional/settings" element={<Settings />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['paciente']} />}>
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
              </Route>
            </Route>
          </Routes>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
