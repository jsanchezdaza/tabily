import Header from './Header'
import Footer from './Footer'
import TripPlannerContainer from './trip-planner/TripPlannerContainer'

function TripPlanner() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white lg:bg-gradient-to-br lg:from-blue-50 lg:via-white lg:to-purple-50 flex items-center justify-center p-4">
        <TripPlannerContainer />
        <Footer />
      </div>
    </>
  )
}

export default TripPlanner
