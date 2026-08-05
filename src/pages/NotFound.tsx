import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'

export default function NotFound() {
  useDocument('Page Not Found — Indesian', 'The page you are looking for does not exist.')
  return (
    <div className="container notfound">
      <h1>404</h1>
      <p>We couldn't find the page you were looking for.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  )
}
