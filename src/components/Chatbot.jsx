import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { chat } from '../gemini'

const WELCOME = "Hi! I'm Mekhail's AI assistant. Ask me anything about his projects — the C-AMP BI system, FAR Chatbot, or IAM Legal Expert. I can explain architectures, tech stacks, design decisions, and more."

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: 'bot', text: WELCOME }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const hasInteracted = useRef(false)

  useEffect(() => {
    if (!hasInteracted.current) return
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const history = messages.filter(m => m.role !== 'bot' || m !== messages[0])
    setMessages(prev => [...prev, { role: 'user', text }])
    hasInteracted.current = true
    setLoading(true)
    try {
      const reply = await chat(history, text)
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: `Error: ${e.message}` }])
    }
    setLoading(false)
  }

  return (
    <section className="chatbot-section" id="chat">
      <p className="section-label">AI Assistant</p>
      <h2 className="section-title">Ask About My Work</h2>
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-status" />
          <h3>Portfolio AI</h3>
          <span>Powered by Gemini</span>
        </div>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              {m.role === 'bot' ? <ReactMarkdown>{m.text}</ReactMarkdown> : m.text}
            </div>
          ))}
          {loading && (
            <div className="chat-msg bot">
              <div className="typing-indicator"><span /><span /><span /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="chat-input-area">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about my projects, architecture, tech stack..."
            disabled={loading}
          />
          <button onClick={send} disabled={loading || !input.trim()}>Send</button>
        </div>
      </div>
    </section>
  )
}
