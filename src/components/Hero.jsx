import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import { useRef } from 'react'

function AnimatedSphere() {
  const mesh = useRef()
  useFrame((_, delta) => { mesh.current.rotation.y += delta * 0.3 })
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.5}>
      <mesh ref={mesh} scale={2.2}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial color="#6c63ff" distort={0.35} speed={2} roughness={0.2} metalness={0.8} />
      </mesh>
    </Float>
  )
}

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <p className="hero-label">Full-Stack AI Engineer</p>
        <h1>
          Building <span className="gradient">intelligent</span> systems
          that matter
        </h1>
        <p>
          I design and ship production AI applications — from RAG pipelines and
          multi-agent LLM systems to cloud-native infrastructure on Azure.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}>
            View Projects
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById('chat').scrollIntoView({ behavior: 'smooth' })}>
            Ask My AI
          </button>
        </div>
      </div>
      <div className="hero-canvas">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#a78bfa" />
          <AnimatedSphere />
        </Canvas>
      </div>
    </section>
  )
}
