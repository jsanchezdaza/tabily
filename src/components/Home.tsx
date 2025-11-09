import Header from './Header'

function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Congrats, you are logged
            </h1>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
