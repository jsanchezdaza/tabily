import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Header from './Header'
import Footer from './Footer'

function Welcome() {
  const { user } = useAuth()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left px-4 lg:px-8 order-2 lg:order-1">
              <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 rounded-full">
                <span className="text-emerald-700 font-medium text-sm">AI-Powered Travel</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome to <span className="text-emerald-500">tabily</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed">
                Plan your perfect trip with the most advanced AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to={user ? '/home' : '/login'}
                  className="border-2 border-emerald-300 text-emerald-300 px-8 py-3 rounded-full font-medium transition-all hover:bg-emerald-300/10 text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>

            <div className="flex justify-center items-center px-4 order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                <img
                  src="/tabily-home.png"
                  alt="World landmarks illustration"
                  className="relative w-full max-w-2xl h-auto drop-shadow-2xl rounded-2xl"
                />
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  )
}

export default Welcome
