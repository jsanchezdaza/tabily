import { ReactNode } from 'react'
import Header from '../Header'
import Footer from '../Footer'

interface PageLayoutProps {
  children: ReactNode
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white lg:bg-gradient-to-br lg:from-blue-50 lg:via-white lg:to-purple-50 flex flex-col">
        {children}
        <Footer />
      </div>
    </>
  )
}

export default PageLayout
