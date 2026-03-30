import { useParams, useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, MeshWobbleMaterial, OrbitControls, Edges } from '@react-three/drei'
import { useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'
import { PROJECTS } from '../projectData'

/* ── Reuse 3D shapes ── */
function TorusKnotShape({ color }) {
  const ref = useRef(); const ringRef = useRef()
  useFrame((_, d) => { ref.current.rotation.x += d * 0.15; ref.current.rotation.y += d * 0.2; ringRef.current.rotation.z += d * 0.4 })
  return <Float speed={1.2} rotationIntensity={0.2} floatIntensity={1}><group scale={2}><mesh ref={ref}><dodecahedronGeometry args={[1, 0]} /><MeshDistortMaterial color={color} distort={0.12} speed={2} roughness={0.15} metalness={0.9} /><Edges color={color} threshold={15} lineWidth={1} /></mesh><mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}><torusGeometry args={[1.5, 0.03, 16, 64]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.9} roughness={0.1} /></mesh></group></Float>
}
function IcosahedronShape({ color }) {
  const ref = useRef(); const wireRef = useRef()
  useFrame((_, d) => { ref.current.rotation.y += d * 0.2; wireRef.current.rotation.y -= d * 0.1 })
  return <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}><group scale={2}><mesh ref={ref}><icosahedronGeometry args={[1, 1]} /><MeshDistortMaterial color={color} distort={0.25} speed={2} roughness={0.2} metalness={0.85} transparent opacity={0.85} /></mesh><mesh ref={wireRef}><icosahedronGeometry args={[1.3, 1]} /><meshBasicMaterial color={color} wireframe transparent opacity={0.2} /></mesh></group></Float>
}
function OctahedronShape({ color }) {
  const groupRef = useRef(); const innerRef = useRef()
  const geo = useMemo(() => { const g = new THREE.BufferGeometry(); const p = new Float32Array(60 * 3); for (let i = 0; i < 60; i++) { const t = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = 1.8 + Math.random() * 0.5; p[i*3] = r*Math.sin(ph)*Math.cos(t); p[i*3+1] = r*Math.sin(ph)*Math.sin(t); p[i*3+2] = r*Math.cos(ph) } g.setAttribute('position', new THREE.BufferAttribute(p, 3)); return g }, [])
  useFrame((_, d) => { groupRef.current.rotation.y += d * 0.1; innerRef.current.rotation.x += d * 0.2 })
  return <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}><group ref={groupRef} scale={2}><mesh ref={innerRef}><octahedronGeometry args={[1, 0]} /><MeshWobbleMaterial color={color} factor={0.3} speed={2} roughness={0.1} metalness={0.9} /><Edges color={color} threshold={15} lineWidth={1.5} /></mesh><points geometry={geo}><pointsMaterial color={color} size={0.04} transparent opacity={0.6} sizeAttenuation /></points></group></Float>
}

function Shape({ shape, color }) {
  switch (shape) {
    case 'torus-knot': return <TorusKnotShape color={color} />
    case 'icosahedron': return <IcosahedronShape color={color} />
    case 'octahedron': return <OctahedronShape color={color} />
  }
}

export default function ProjectDeepDive() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = PROJECTS.find(p => p.id === id)
  const [visibleSections, setVisibleSections] = useState(new Set())

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVisibleSections(prev => new Set([...prev, e.target.dataset.section]))
      }),
      { threshold: 0.15 }
    )
    document.querySelectorAll('[data-section]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [project])

  if (!project) return <div className="dd-page"><p>Project not found.</p></div>

  const vis = s => visibleSections.has(s) ? 'dd-visible' : ''

  return (
    <div className="dd-page">
      {/* Hero banner with 3D object */}
      <div className="dd-hero" style={{ '--project-color': project.color }}>
        <div className="dd-hero-canvas">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.6} />
            <pointLight position={[-4, -4, -4]} intensity={1.8} color={project.color} />
            <pointLight position={[3, -2, 4]} intensity={0.5} color="#a78bfa" />
            <Shape shape={project.shape} color={project.color} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
          </Canvas>
        </div>
        <div className="dd-hero-content">
          <button className="dd-back" onClick={() => navigate('/')}>← Back to Portfolio</button>
          <p className="dd-type">{project.type}</p>
          <h1 className="dd-title">{project.title}</h1>
          <p className="dd-overview">{project.overview}</p>
          <div className="tech-stack" style={{ marginTop: '1.5rem' }}>
            {project.tech.map(t => <span className="skill-tag" key={t}>{t}</span>)}
          </div>
        </div>
      </div>

      {/* Architecture */}
      <section className="dd-section" data-section="arch">
        <div className={`dd-animate ${vis('arch')}`}>
          <p className="section-label">System Design</p>
          <h2 className="dd-section-title">Architecture</h2>
          <div className="dd-arch-flow">
            {project.architecture.map((node, i) => (
              <div key={i} className="dd-arch-node">
                <div className="dd-arch-number" style={{ background: project.color }}>{i + 1}</div>
                <div className="dd-arch-body">
                  <h3>{node.label}</h3>
                  <p>{node.detail}</p>
                </div>
                {i < project.architecture.length - 1 && <div className="dd-arch-connector" style={{ background: project.color }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="dd-section" data-section="highlights">
        <div className={`dd-animate ${vis('highlights')}`}>
          <p className="section-label">Key Features</p>
          <h2 className="dd-section-title">Technical Highlights</h2>
          <div className="dd-highlights-grid">
            {project.highlights.map((h, i) => (
              <div key={i} className="dd-highlight-card" style={{ '--delay': `${i * 0.1}s`, borderColor: `${project.color}33` }}>
                <div className="dd-highlight-index" style={{ color: project.color }}>{String(i + 1).padStart(2, '0')}</div>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="dd-section" data-section="security">
        <div className={`dd-animate ${vis('security')}`}>
          <p className="section-label">Protection</p>
          <h2 className="dd-section-title">Security & Auth</h2>
          <div className="dd-security-list">
            {project.security.map((s, i) => (
              <div key={i} className="dd-security-item">
                <div className="dd-security-icon" style={{ background: `${project.color}22`, color: project.color }}>✓</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom nav */}
      <section className="dd-section dd-bottom-nav">
        {PROJECTS.filter(p => p.id !== id).map(p => (
          <button key={p.id} className="dd-other-project" onClick={() => navigate(`/project/${p.id}`)} style={{ '--c': p.color }}>
            <span className="dd-other-type">{p.type}</span>
            <span className="dd-other-title">{p.title}</span>
            <span className="dd-other-arrow">→</span>
          </button>
        ))}
      </section>
    </div>
  )
}
