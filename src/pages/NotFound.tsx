import { Link } from 'react-router-dom'
import { useDocument } from '../hooks/useDocument'

export default function NotFound() {
  useDocument('Page Not Found — Indesian', 'The page you are looking for does not exist.')
  return (
    <div className="container-page text-center py-32">
      <h1 className="text-6xl font-bold text-primary-700 mb-4">404</h1>
      <p className="text-slate-500 mb-8 text-lg">We couldn't find the page you were looking for.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  )
}
