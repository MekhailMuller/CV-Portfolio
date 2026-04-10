import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Chatbot from './components/Chatbot'
import ProjectDeepDive from './components/ProjectDeepDive'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function Home() {
  return (
    <>
      <Hero />
      <Skills />
      <Projects />
      <Chatbot />
      <footer>© 2026 Mekhail — Built with React, Three.js & Cloudflare AI</footer>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDeepDive />} />
      </Routes>
    </BrowserRouter>
  )
}
