import Header from './Header'
import Footer from './Footer'

function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white lg:bg-gradient-to-br lg:from-blue-50 lg:via-white lg:to-purple-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Congrats, you are logged</h1>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Home
