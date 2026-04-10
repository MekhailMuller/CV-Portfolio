const SYSTEM_INTRO = "I'm ready to answer questions about Mekhail's projects and experience."

export async function chat(history, userMessage) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history, userMessage }),
  })
  if (!res.ok) throw new Error('AI request failed')
  const data = await res.json()
  return data.reply
}
