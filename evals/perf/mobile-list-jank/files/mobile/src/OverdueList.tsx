import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

export type Invoice = {
  id: number
  number: string
  due_at: number
  balance: number
  lastReminder: number | null
  client: { id: number; name: string }
}

function Row({ invoice, all }: { invoice: Invoice; all: Invoice[] }) {
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  const clientTotal = all.filter((i) => i.client.id === invoice.client.id).reduce((s, i) => s + i.balance, 0)
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.client}>{invoice.client.name}</Text>
        <Text style={styles.muted}>
          {invoice.number} · due {new Date(invoice.due_at).toLocaleDateString()} · client owes {currency.format(clientTotal / 100)}
        </Text>
      </View>
      <Text style={styles.amount}>{currency.format(invoice.balance / 100)}</Text>
      <Pressable accessibilityLabel={`Send reminder for ${invoice.number}`} style={styles.remind}>
        <Text>✉</Text>
      </Pressable>
    </View>
  )
}

export function OverdueList({ invoices }: { invoices: Invoice[] }) {
  const sorted = [...invoices].sort((a, b) => b.balance - a.balance)
  return (
    <ScrollView>
      {sorted.map((invoice) => (
        <Row key={invoice.id} invoice={invoice} all={sorted} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  client: { fontWeight: '600' },
  muted: { color: '#666', fontSize: 12 },
  amount: { fontVariant: ['tabular-nums'], marginHorizontal: 8 },
  remind: { padding: 8 },
})
