import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Header from './Header'
import Footer from './Footer'

function Welcome() {
  const { user } = useAuth()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col overflow-x-hidden">
        <div className="flex-1 flex items-center justify-center p-4 lg:p-0">
          <div className="w-full lg:flex lg:items-center py-12 lg:py-20 lg:max-w-none">
            <div className="order-2 lg:order-1 lg:flex-1 lg:max-w-3xl px-4 lg:pl-8 lg:pr-8 xl:pl-20 text-center lg:text-left">
              <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 rounded-full">
                <span className="text-emerald-700 font-medium text-sm">AI-Powered Travel</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome to <span className="text-emerald-500">tabily</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed">
                Plan your perfect trip with the most advanced AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 lg:mb-0">
                <Link
                  to={user ? '/home' : '/login'}
                  className="border-2 border-emerald-300 text-emerald-300 px-8 py-3 rounded-full font-medium text-center transition-all hover:bg-emerald-300/10"
                >
                  Get Started
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:flex-1 flex justify-center items-center px-4 lg:px-0 lg:pr-0">
              <div className="relative w-full max-w-2xl lg:max-w-none">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-blue-200 rounded-3xl lg:rounded-l-3xl lg:rounded-r-none blur-3xl opacity-30 animate-pulse"></div>
                <img
                  src="/tabily-home.png"
                  alt="World landmarks illustration"
                  className="relative w-full h-auto drop-shadow-2xl rounded-2xl lg:rounded-l-2xl lg:rounded-r-none"
                />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Welcome
