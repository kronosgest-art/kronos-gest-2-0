import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Server, Activity } from 'lucide-react'

export function SystemStatusCard() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [latency, setLatency] = useState<number | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  useEffect(() => {
    let isMounted = true

    async function checkConnection() {
      const start = Date.now()
      try {
        const { error } = await supabase.from('organizations').select('id').limit(1)
        if (!isMounted) return

        if (error) {
          throw error
        }

        setLatency(Date.now() - start)
        setStatus('connected')
        setLastChecked(new Date())
      } catch (err) {
        if (!isMounted) return
        setStatus('error')
        setLastChecked(new Date())
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <Card className="hover-lift border-t-4 border-t-blue-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Status do Banco de Dados</CardTitle>
        <Server className="h-4 w-4 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mt-2">
          {status === 'checking' && (
            <>
              <div className="h-3 w-3 rounded-full bg-yellow-400 animate-pulse" />
              <div className="text-2xl font-bold text-slate-700">Verificando...</div>
            </>
          )}
          {status === 'connected' && (
            <>
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <div className="text-2xl font-bold text-emerald-700">Online</div>
            </>
          )}
          {status === 'error' && (
            <>
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="text-2xl font-bold text-red-700">Offline</div>
            </>
          )}
        </div>
        <div className="flex flex-col mt-3 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Latência: {latency ? `${latency}ms` : '--'}
          </div>
          <div className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            Provedor: Supabase PostgreSQL
          </div>
          {lastChecked && (
            <div className="text-slate-400 mt-1">
              Última verificação: {lastChecked.toLocaleTimeString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
