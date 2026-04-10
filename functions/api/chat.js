import projectContext from '../context.json';

function extractChunks(query) {
  const words = query.toLowerCase().replace(/[?.,!]/g, '').split(/\s+/)
    .filter(w => w.length > 3 && !['what','how','does','this','that','with','from','about','have','been','they','their','which','where','when','would','could','should','there','these','those','into','also','than','then','each','other','some','them','were','will','your','more','between','after','before','through','during','without','within','using','used','based','explain','describe','walk','tell'].includes(w));

  const chunks = [];
  const WINDOW = 800;

  for (const [name, text] of Object.entries(projectContext)) {
    const lower = text.toLowerCase();
    const hits = new Set();

    for (const word of words) {
      let idx = lower.indexOf(word);
      while (idx !== -1) {
        const chunkStart = Math.max(0, idx - WINDOW / 2);
        const rounded = Math.floor(chunkStart / (WINDOW / 2)) * (WINDOW / 2);
        hits.add(rounded);
        idx = lower.indexOf(word, idx + word.length);
      }
    }

    for (const start of [...hits].sort((a, b) => a - b).slice(0, 6)) {
      const snippet = text.slice(start, start + WINDOW).trim();
      if (snippet) chunks.push(`[${name}]\n${snippet}`);
    }
  }

  if (chunks.length === 0) {
    for (const [name, text] of Object.entries(projectContext)) {
      chunks.push(`[${name}]\n${text.slice(0, 1500)}`);
    }
  }

  return chunks.join('\n\n---\n\n').slice(0, 6000);
}

export async function onRequestPost(context) {
  try {
    const { messages, userMessage } = await context.request.json();

    const relevantContext = extractChunks(userMessage);

    const history = messages.slice(-4).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text.slice(0, 200),
    }));

    const chatMessages = [
      { role: 'system', content: `You are Mekhail's portfolio AI assistant. Answer based ONLY on the context below. Be concise. Use markdown. If the question is not related to Mekhail's projects or work, respond with: "I appreciate the question, but I can only help with topics related to Mekhail's projects — C-AMP BI, FAR Chatbot, and IAM Legal Expert. Feel free to ask me anything about those!"\n\n${relevantContext}` },
      ...history,
      { role: 'user', content: userMessage },
    ];

    const result = await context.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: chatMessages,
      max_tokens: 1024,
    });

    return new Response(JSON.stringify({ reply: result.response }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
