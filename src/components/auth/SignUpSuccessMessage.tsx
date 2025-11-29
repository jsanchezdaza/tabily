import { Link } from 'react-router-dom'
import Button from '../ui/Button'

interface SignUpSuccessMessageProps {
  email: string
  onUseAnotherEmail: () => void
}

const SignUpSuccessMessage = ({ email, onUseAnotherEmail }: SignUpSuccessMessageProps) => {
  return (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
        <svg
          className="h-6 w-6 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
      <p className="text-gray-600 mb-6">
        We've sent a verification link to <strong>{email}</strong>. Please check your inbox and
        click the link to verify your account.
      </p>
      <Link to="/login" className="block w-full">
        <Button className="w-full">Back to Sign In</Button>
      </Link>
      <button
        onClick={onUseAnotherEmail}
        className="mt-4 w-full text-sm text-gray-600 hover:text-gray-800 transition"
      >
        Use a different email address?
      </button>
    </div>
  )
}

export default SignUpSuccessMessage
