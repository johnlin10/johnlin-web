import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const { isAdmin } = useAuth()
  if (!isAdmin) {
    return <Navigate to="/login" />
  }
  return children
}

export default ProtectedRoute
