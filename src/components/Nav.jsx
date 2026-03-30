import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav>
      <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>Mekhail<span>.</span></Link>
      <ul className="nav-links">
        <li><a href="/#skills">Skills</a></li>
        <li><a href="/#projects">Projects</a></li>
        <li><a href="/#chat">AI Chat</a></li>
      </ul>
    </nav>
  )
}
