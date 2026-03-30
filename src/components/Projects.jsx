import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, MeshWobbleMaterial, OrbitControls, Edges } from '@react-three/drei'
import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { PROJECTS } from '../projectData'

/* ── 3D Shapes ── */

function TorusKnotShape({ color, isActive }) {
  const ref = useRef()
  const ringRef = useRef()
  useFrame((_, d) => { ref.current.rotation.x += d * 0.2; ref.current.rotation.y += d * 0.3; ringRef.current.rotation.z += d * 0.4 })
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1}>
      <group scale={isActive ? 1.6 : 1.2}>
        <mesh ref={ref}>
          <dodecahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial color={color} distort={0.12} speed={2} roughness={0.15} metalness={0.9} />
          <Edges color={color} threshold={15} lineWidth={1} />
        </mesh>
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.5, 0.03, 16, 64]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  )
}

function IcosahedronShape({ color, isActive }) {
  const ref = useRef()
  const wireRef = useRef()
  useFrame((_, d) => { ref.current.rotation.y += d * 0.25; wireRef.current.rotation.y -= d * 0.15; wireRef.current.rotation.x += d * 0.1 })
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.2}>
      <group scale={isActive ? 1.8 : 1.3}>
        <mesh ref={ref}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial color={color} distort={0.25} speed={2} roughness={0.2} metalness={0.85} transparent opacity={0.85} />
        </mesh>
        <mesh ref={wireRef}>
          <icosahedronGeometry args={[1.3, 1]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

function OctahedronShape({ color, isActive }) {
  const groupRef = useRef()
  const innerRef = useRef()
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(60 * 3)
    for (let i = 0; i < 60; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.8 + Math.random() * 0.5
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])
  useFrame((_, d) => { groupRef.current.rotation.y += d * 0.15; innerRef.current.rotation.x += d * 0.3; innerRef.current.rotation.z += d * 0.2 })
  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1}>
      <group ref={groupRef} scale={isActive ? 1.6 : 1.2}>
        <mesh ref={innerRef}>
          <octahedronGeometry args={[1, 0]} />
          <MeshWobbleMaterial color={color} factor={0.3} speed={2} roughness={0.1} metalness={0.9} />
          <Edges color={color} threshold={15} lineWidth={1.5} />
        </mesh>
        <points geometry={particleGeo}>
          <pointsMaterial color={color} size={0.04} transparent opacity={0.6} sizeAttenuation />
        </points>
      </group>
    </Float>
  )
}

function ProjectShape({ shape, color, isActive }) {
  switch (shape) {
    case 'torus-knot': return <TorusKnotShape color={color} isActive={isActive} />
    case 'icosahedron': return <IcosahedronShape color={color} isActive={isActive} />
    case 'octahedron': return <OctahedronShape color={color} isActive={isActive} />
    default: return null
  }
}

function Scene({ activeIndex }) {
  const p = PROJECTS[activeIndex]
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-4, -4, -4]} intensity={0.8} color={p.color} />
      <pointLight position={[3, -2, 4]} intensity={0.5} color="#a78bfa" />
      <ProjectShape shape={p.shape} color={p.color} isActive />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

export default function Projects() {
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const p = PROJECTS[active]

  return (
    <section className="projects-section" id="projects">
      <p className="section-label">Featured Work</p>
      <h2 className="section-title">Projects</h2>
      <div className="project-3d-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Scene activeIndex={active} />
        </Canvas>
        <div className="project-overlay-row">
          <button className="project-arrow project-arrow-left" onClick={() => setActive((active - 1 + PROJECTS.length) % PROJECTS.length)} aria-label="Previous project">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div className="project-overlay">
            <p className="project-type">{p.type}</p>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <div className="tech-stack">
              {p.tech.map(t => <span className="skill-tag" key={t}>{t}</span>)}
            </div>
            <button className="btn-deep-dive" onClick={() => navigate(`/project/${p.id}`)}>
              Deep Dive →
            </button>
          </div>
          <button className="project-arrow project-arrow-right" onClick={() => setActive((active + 1) % PROJECTS.length)} aria-label="Next project">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
          </button>
        </div>
        <div className="project-nav">
          {PROJECTS.map((_, i) => (
            <button key={i} className={`project-dot${i === active ? ' active' : ''}`} onClick={() => setActive(i)} aria-label={`View project ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
