import { useAuth } from './hooks/useAuth'
import Login from './components/Login'
import Home from './components/Home'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  return user ? <Home /> : <Login />
}

export default App
