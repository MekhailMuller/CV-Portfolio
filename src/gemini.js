import { GoogleGenerativeAI } from '@google/generative-ai'

let model = null
let projectContext = null

async function getModel() {
  if (model) return model
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (!key || key === 'your-gemini-api-key-here') throw new Error('Set VITE_GEMINI_API_KEY in .env')
  const genAI = new GoogleGenerativeAI(key)
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  return model
}

async function getContext() {
  if (projectContext) return projectContext
  const res = await fetch('/data/projects.json')
  projectContext = await res.json()
  return projectContext
}

const SYSTEM = `You are Mekhail's portfolio AI assistant. You answer questions about his projects, skills, and experience based ONLY on the project documentation provided below. Be concise, technical, and helpful. If asked something outside the project docs, say you can only discuss Mekhail's work. Format answers with markdown.`

export async function chat(history, userMessage) {
  const [m, ctx] = await Promise.all([getModel(), getContext()])

  const contextStr = Object.entries(ctx)
    .map(([name, text]) => `## ${name}\n${text.slice(0, 4000)}`)
    .join('\n\n---\n\n')

  const contents = [
    { role: 'user', parts: [{ text: `${SYSTEM}\n\n---\nPROJECT DOCUMENTATION:\n${contextStr}` }] },
    { role: 'model', parts: [{ text: "I'm ready to answer questions about Mekhail's projects and experience." }] },
    ...history.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
    { role: 'user', parts: [{ text: userMessage }] },
  ]

  const result = await m.generateContent({ contents })
  return result.response.text()
}
