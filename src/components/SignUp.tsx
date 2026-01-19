import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import PageLayout from './layout/PageLayout'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import AuthErrorBanner from './auth/AuthErrorBanner'
import SignUpSuccessMessage from './auth/SignUpSuccessMessage'
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
      <PageLayout>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card>
              <SignUpSuccessMessage
                email={submittedEmail}
                onUseAnotherEmail={() => {
                  setSuccess(false)
                  setErrors({})
                }}
              />
            </Card>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Start planning your perfect trip</p>
            </div>

            {errors.auth && <AuthErrorBanner message={errors.auth} />}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="fullName"
                name="fullName"
                label="Full Name"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="John Doe"
                error={errors.fullName}
              />

              <Input
                id="email"
                name="email"
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                error={errors.email}
              />

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

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700">
                Sign In
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}

export default SignUp
