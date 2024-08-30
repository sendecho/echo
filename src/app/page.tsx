import Image from 'next/image'
import Link from 'next/link'
import { WaitlistForm } from '@/components/waitlist-form'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">PersonalCRM+</h1>
          <Link href="/signin" className="px-4 py-2 text-gray-600 font-semibold hover:text-gray-800 transition-colors">
            Log in
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold mb-4">The easiest way to manage relationships</h2>
        <p className="text-xl text-gray-600 mb-8">
          Contacts, notes, and newsletters — finally connected to elevate your networking.
        </p>

        <WaitlistForm />

        {/* Feature tabs */}
        <div className="mt-16">
          {/* Add tabs for different features */}
        </div>

        {/* Main feature showcase */}
        <div className="mt-16">
          <Image
            src="/crm-dashboard.webp"
            alt="PersonalCRM+ Dashboard"
            width={800}
            height={600}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Additional content */}
        <section className="mt-24 text-left">
          <h3 className="text-2xl font-semibold mb-4">Modern relationship management is broken.</h3>
          <p className="text-gray-600 mb-4">Contacts, notes, and communications are disconnected.</p>
          <p className="text-gray-600 mb-4">Updates are scattered across multiple tools.</p>
          {/* Add more content explaining the problem and solution */}
        </section>

        <section className="mt-16 text-left">
          <h3 className="text-2xl font-semibold mb-4">We're building a connected tool that elevates your networking:</h3>
          <ul className="space-y-4">
            <li className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Contacts, notes, and communications in one place — searchable and easy to find.
            </li>
            {/* Add more feature points */}
          </ul>
        </section>
      </main>
    </div>
  )
}