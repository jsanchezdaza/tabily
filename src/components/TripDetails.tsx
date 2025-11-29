import { useParams } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function TripDetails() {
  const { tripId } = useParams<{ tripId: string }>()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white lg:bg-gradient-to-br lg:from-blue-50 lg:via-white lg:to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Trip Plan</h1>
            <p className="text-gray-600 mb-4">Trip ID: {tripId}</p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <p className="text-emerald-800">
                Your trip has been created! The AI-powered itinerary feature is coming soon.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default TripDetails
