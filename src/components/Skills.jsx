const skills = [
  { title: 'AI / LLM Engineering', tags: ['LangChain', 'LangGraph', 'RAG', 'Multi-Agent', 'Prompt Engineering', 'Vector DBs'] },
  { title: 'Backend Development', tags: ['Python', 'FastAPI', 'Flask', 'Node.js', 'Express', 'TypeScript', 'Bun'] },
  { title: 'Frontend Development', tags: ['React', 'Vite', 'Tailwind CSS', 'Three.js', 'MSAL Auth'] },
  { title: 'Cloud & Infrastructure', tags: ['Azure', 'Terraform', 'Container Apps', 'Docker', 'CI/CD Pipelines'] },
  { title: 'Databases', tags: ['PostgreSQL', 'PGVector', 'Neo4j', 'SQLite', 'SQLAlchemy'] },
  { title: 'DevOps & Security', tags: ['Azure Entra ID', 'Managed Identity', 'VNet', 'Private DNS', 'JWT Auth'] },
]

export default function Skills() {
  return (
    <section id="skills">
      <p className="section-label">Expertise</p>
      <h2 className="section-title">Skills & Technologies</h2>
      <div className="skills-grid">
        {skills.map(s => (
          <div className="skill-card" key={s.title}>
            <h3>{s.title}</h3>
            <div className="skill-tags">
              {s.tags.map(t => <span className="skill-tag" key={t}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
