import { useEffect, useState } from 'react'
import { SafeAreaView, Text } from 'react-native'
import { OverdueList, type Invoice } from './src/OverdueList'

// Points at the Duesy server (node server.mjs). Set EXPO_PUBLIC_API_URL for a device on the LAN.
const API = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:4000'

export default function App() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null)
  useEffect(() => {
    fetch(`${API}/api/invoices`).then((r) => r.json()).then(setInvoices)
  }, [])
  if (!invoices) return <Text>Loading…</Text>
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OverdueList invoices={invoices} />
    </SafeAreaView>
  )
}
