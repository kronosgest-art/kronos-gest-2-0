import { useState, useEffect } from 'react'
import { Patient } from '@/types'

type PatientStore = {
  selectedPatient: Patient | null
  setSelectedPatient: (patient: Patient | null) => void
}

// Singleton para estado global via Hook Customizado (alternativa leve ao Zustand)
let selectedPatient: Patient | null = null
const listeners = new Set<() => void>()

export const usePatientStore = (): PatientStore => {
  const [, forceRender] = useState({})

  useEffect(() => {
    const listener = () => forceRender({})
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return {
    selectedPatient,
    setSelectedPatient: (patient) => {
      selectedPatient = patient
      listeners.forEach((l) => l())
    },
  }
}
