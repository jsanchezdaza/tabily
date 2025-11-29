import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import PageLayout from './layout/PageLayout'
import Card from './ui/Card'
import Button from './ui/Button'
import GoogleIcon from './icons/GoogleIcon'
import AuthErrorBanner from './auth/AuthErrorBanner'
import PasswordInput from './PasswordInput'
import { MIN_PASSWORD_LENGTH, VALIDATION_MESSAGES } from '../constants/validation'
import { validateEmail } from '../utils/validation'

interface FormErrors {
  email?: string
  password?: string
  auth?: string
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const { signInWithEmail, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.email = VALIDATION_MESSAGES.EMAIL_INVALID
    }

    if (!password) {
      newErrors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = VALIDATION_MESSAGES.PASSWORD_TOO_SHORT
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsLoading(true)
        const { error } = await signInWithEmail(trimmedEmail, password)

        if (error) {
          setErrors({ auth: error.message })
        }
      } catch {
        setErrors({ auth: 'An unexpected error occurred. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const { error } = await signInWithGoogle()

      if (error) {
        setErrors({ auth: error.message })
      }
    } catch {
      setErrors({ auth: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to tabily</h1>
              <p className="text-gray-600">Plan your perfect trip with AI</p>
            </div>

            {errors.auth && <AuthErrorBanner message={errors.auth} />}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>

              <PasswordInput
                id="password"
                label="Password"
                value={password}
                onChange={setPassword}
                error={errors.password}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                variant="google"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="mt-4 w-full flex items-center justify-center gap-3"
              >
                <GoogleIcon />
                Continue with Google
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-emerald-600 font-medium hover:text-emerald-700">
                Sign Up
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}

export default Login
