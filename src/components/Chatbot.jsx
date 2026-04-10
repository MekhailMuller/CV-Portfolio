import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { chat } from '../gemini'

const WELCOME = "Hi! I'm Mekhail's AI assistant. Ask me anything about his projects — the C-AMP BI system, FAR Chatbot, or IAM Legal Expert. I can explain architectures, tech stacks, design decisions, and more."

const SAMPLE_QUESTIONS = {
  'C-AMP BI': [
    'How does the C-AMP system translate natural language into SQL and what safeguards prevent malformed queries?',
    'Walk me through the multi-agent LangGraph workflow from user question to final chart output.',
    'How does the preprocess_routing node decide between chart vs table output and handle meta-queries?',
    'What is the role of the Express.js gateway and why does it contain zero business logic?',
    'How does C-AMP handle the inverted CGI scales (International vs GIAMA) in its prompts?',
    'Explain the strategic sampling approach used in generate_interpretation for large datasets.',
    'How does the SQL generation prompt handle financial year defaulting and NULL filtering?',
    'What are the differences between standard and detailed interpretation modes in C-AMP?',
    'How does the ChartTemplateManager detect chart types and execute Plotly code dynamically?',
    'What SQL injection prevention mechanisms does the SQLValidator implement?',
    'How does C-AMP support multiple LLM providers including Azure OpenAI and DeepSeek?',
    'What is the purpose of configv8.yaml and what domain-specific knowledge does it encode?',
    'How does the Azure Entra ID JWT authentication flow work in the API gateway?',
    'Describe the database schema — what tables exist and how do CGI ratings work across them?',
    'How does the PDF export pipeline convert Plotly figures into a structured document?',
  ],
  'FAR Chatbot': [
    'How does the ReAct agent architecture differ from the legacy custom StateGraph implementation?',
    'What safety mechanisms prevent the SQL tool from executing destructive operations like DROP or DELETE?',
    'How does the auto-append LIMIT 20 logic work and when does it skip aggregation queries?',
    'Explain the conversation memory system — how does MemorySaver use chat_id as thread_id?',
    'How does the API layer prevent concurrent messages on the same chat using activeChatRequests?',
    'What is the role of the @doi-chatbot/shared package and how does it handle PostgreSQL connections?',
    'How does the typing animation adapt its speed based on message length and handle tables?',
    'Describe the three database tables (asset_envelope, facility, land_parcel) and their relationships.',
    'How does the vector database retrieval tool use pgvector and AzureOpenAIEmbeddings for semantic search?',
    'What is the difference between short-term memory (12 messages) and default memory (2 messages)?',
    'How does the system handle Azure Managed Identity for passwordless PostgreSQL authentication?',
    'Walk me through the end-to-end flow from user question to bot response across all services.',
    'How does the frontend handle PDF and Word export of chat conversations?',
  ],
  'IAM Legal Expert': [
    'How does the RAG pipeline combine vector search with Neo4j knowledge graph traversal for answers?',
    'Walk me through the 12-step enhanced_query flow from input validation to final response.',
    'How does the Neo4j service process PDFs — from blob download to entity extraction to graph creation?',
    'What role does spaCy NER play in extracting entities and how are relationships built between them?',
    'How does the AzureOpenAIChatModel refresh Azure AD tokens before each LLM request?',
    'Explain the dual knowledge graph approach — Neo4j as primary and RDF as fallback.',
    'How does the PgVector metadata filter work with source paths and date ranges?',
    'What South African legislation and ISO standards are in the document corpus?',
    'How does the system deduplicate retrieved documents from both vector and knowledge graph searches?',
    'How does the frontend SidePanel integrate PDF selection, date filtering, and top-k configuration?',
    'What is the relationship between the 4 containerised services and how do they communicate?',
  ],
  'IAM Infrastructure': [
    'How is the VNet structured with its three subnets and what service delegations are configured?',
    'Explain the dual PostgreSQL setup — why is one private-only and the other publicly accessible?',
    'How does the user-assigned Managed Identity get shared across backend, Neo4j, PgVector, and jumpbox?',
    'What is the purpose of the jumpbox VM and how is SSH access restricted?',
    'How do the CI/CD pipelines flow from Docker build to ACR push to dev deployment with manual approval gates?',
    'What are the CPU and memory allocations for each Container App and why do they differ?',
    'How does the Private DNS zone enable containers to resolve the private PostgreSQL endpoint?',
    'What is the federated identity credential on the SWA Managed Identity used for?',
    'How does the Azure File Share mount work for the PgVector job to access documents?',
    'What monitoring and logging infrastructure is configured with Log Analytics?',
    'How does the Terraform project support three environments (dev, stg, prod) across all resources?',
  ],
}

export default function Chatbot() {
  const [messages, setMessages] = useState([{ role: 'bot', text: WELCOME }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(Object.keys(SAMPLE_QUESTIONS)[0])
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
      <div className="sample-questions">
        <h3 className="sample-questions-title">Sample Questions</h3>
        <div className="sample-tabs">
          {Object.keys(SAMPLE_QUESTIONS).map(tab => (
            <button
              key={tab}
              className={`sample-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="sample-list">
          {SAMPLE_QUESTIONS[activeTab].map((q, i) => (
            <button key={i} className="sample-q" onClick={() => setInput(q)}>
              {q}
            </button>
          ))}
        </div>
      </div>
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-status" />
          <h3>Portfolio AI</h3>
          <span>Powered by Cloudflare AI</span>
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
