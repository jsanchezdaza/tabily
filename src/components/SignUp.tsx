import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Header from './Header'
import Footer from './Footer'
import PasswordInput from './PasswordInput'
import { MIN_PASSWORD_LENGTH, VALIDATION_MESSAGES } from '../constants/validation'
import { validateEmail } from '../utils/validation'

interface FormErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  auth?: string
}

function SignUp() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const { signUpWithEmail } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}

    const trimmedName = fullName.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName) {
      newErrors.fullName = VALIDATION_MESSAGES.NAME_REQUIRED
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = VALIDATION_MESSAGES.PASSWORDS_DO_NOT_MATCH
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsLoading(true)
        const { error } = await signUpWithEmail(trimmedEmail, password, trimmedName)

        if (error) {
          setErrors({ auth: error.message })
        } else {
          setSubmittedEmail(trimmedEmail)
          setSuccess(true)
        }
      } catch {
        setErrors({ auth: 'An unexpected error occurred. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (success) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
                  <svg
                    className="h-6 w-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                <p className="text-gray-600 mb-6">
                  We've sent a verification link to <strong>{submittedEmail}</strong>. Please check
                  your inbox and click the link to verify your account.
                </p>
                <Link
                  to="/login"
                  className="inline-block w-full bg-emerald-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-emerald-400 transition duration-200 shadow-md hover:shadow-lg"
                >
                  Back to Sign In
                </Link>
                <button
                  onClick={() => {
                    setSuccess(false)
                    setErrors({})
                  }}
                  className="mt-4 w-full text-sm text-gray-600 hover:text-gray-800 transition"
                >
                  Use a different email address?
                </button>
              </div>
            </div>

            <Footer />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Start planning your perfect trip</p>
            </div>

            {errors.auth && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.auth}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent outline-none transition"
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
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
                name="password"
                label="Password"
                value={password}
                onChange={setPassword}
                error={errors.password}
              />

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={errors.confirmPassword}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-300 text-gray-900 py-3 rounded-lg font-medium hover:bg-emerald-400 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
                Sign In
              </Link>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  )
}

export default SignUp
