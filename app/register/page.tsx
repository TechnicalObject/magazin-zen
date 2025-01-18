'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from '@/components/Link'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/login')
      } else {
        setError(data.error || 'Došlo k chybě při registraci')
        console.error('Registration failed:', data)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('Došlo k chybě při registraci')
    }
  }

  return (
    <div className="min-h-screen py-8 dark:bg-gray-900">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-3xl font-bold dark:text-white">Registrace</h1>
        {error && <div className="mb-4 rounded bg-red-100 p-4 text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium dark:text-gray-200">
              Jméno
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium dark:text-gray-200">
              Heslo
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Registrovat se
          </button>
        </form>
        <p className="mt-4 text-center dark:text-gray-200">
          Již máte účet?{' '}
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Přihlaste se
          </Link>
        </p>
      </div>
    </div>
  )
}
