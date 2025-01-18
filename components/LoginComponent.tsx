'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from '@/components/Link'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError('Nesprávné přihlašovací údaje')
      } else {
        const event = new CustomEvent('userLogin', {
            detail: {
                timestamp: Date.now(),
            },
        })
        window.dispatchEvent(event)
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      setError('Došlo k chybě při přihlašování')
    }
  }

  return (
    <>
        {error && <div className="mb-4 rounded bg-red-100 p-4 text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
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
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600 focus:outline-none dark:hover:bg-primary-400"
          >
            {/* text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 */}
            Přihlásit se
          </button>
        </form>
        <p className="mt-4 text-center dark:text-gray-200">
          Nemáte účet?{' '}
          <Link
            href="/register"
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Registrujte se
          </Link>
        </p>
    </>
  )
}
