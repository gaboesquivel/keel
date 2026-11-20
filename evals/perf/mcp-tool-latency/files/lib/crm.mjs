// Looks up a client's preferred contact in the freelancer's CRM.
// The CRM is simulated: each lookup is a network round trip of about 150 ms.
export async function contactFor(client) {
  await new Promise((r) => setTimeout(r, 150))
  return { name: `Accounts at ${client.name}`, email: client.email, prefers: 'email' }
}
