import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">PersonalCRM+</h1>
          <Link href="/signin" className="px-4 py-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            Sign In
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">Manage relationships and newsletters with ease</h2>
          <p className="text-xl text-gray-600">Your all-in-one solution for personal CRM and newsletter management</p>
        </section>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">Simplify Your Networking</h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Organize contacts effortlessly
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Send personalized newsletters
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Track interactions and set reminders
              </li>
            </ul>
            <Link href="/signup" className="inline-block mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
          </div>
          <div className="relative h-64 md:h-auto">
            <Image
              src="/crm-dashboard.webp"
              alt="PersonalCRM+ Dashboard"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>

        <section className="mt-24">
          <h2 className="text-3xl font-semibold text-blue-800 text-center mb-12">Choose Your Plan</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-blue-700 mb-4">Free Plan</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Unlimited contacts
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  100 broadcasts per month
                </li>
              </ul>
              <p className="text-3xl font-bold text-blue-800 mb-6">$0 <span className="text-lg font-normal text-gray-600">/month</span></p>
              <Link href="/signup" className="block w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md border-2 border-blue-500">
              <h3 className="text-2xl font-bold text-blue-700 mb-4">Pro Plan</h3>
              <p className="text-gray-600 mb-6">For power users and growing businesses</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Unlimited contacts
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  1000 broadcasts per month
                </li>
              </ul>
              <p className="text-3xl font-bold text-blue-800 mb-6">$13 <span className="text-lg font-normal text-gray-600">/month</span></p>
              <Link href="/signup-pro" className="block w-full text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}