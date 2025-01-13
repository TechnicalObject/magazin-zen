'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SectionContainer from '@/components/SectionContainer'

interface UserStats {
  commentCount: number
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/user/stats')
        if (!response.ok) throw new Error('Failed to fetch stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        setError('Nepodařilo se načíst statistiky')
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchStats()
    }
  }, [session])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Změna hesla se nezdařila')
      }

      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Změna hesla se nezdařila')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <SectionContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">Načítání...</div>
        </div>
      </SectionContainer>
    )
  }

  if (!session) {
    return null
  }

  return (
    <SectionContainer>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Profil
          </h1>
        </div>

        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center space-y-2 pt-8">
            <h3 className="pt-4 pb-2 text-2xl font-bold leading-8 tracking-tight">
              {session.user?.name}
            </h3>
            <div className="text-gray-500 dark:text-gray-400">{session.user?.email}</div>
          </div>

          <div className="prose max-w-none pb-8 pt-8 dark:prose-invert xl:col-span-2">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Statistiky</h2>
                  <p>Počet komentářů: {stats?.commentCount || 0}</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">Změna hesla</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium dark:text-gray-200"
                      >
                        Současné heslo
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium dark:text-gray-200"
                      >
                        Nové heslo
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        required
                      />
                    </div>
                    {passwordError && <div className="text-red-500">{passwordError}</div>}
                    {passwordSuccess && (
                      <div className="text-green-500">Heslo bylo úspěšně změněno</div>
                    )}
                    <button
                      type="submit"
                      className="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:hover:bg-primary-400"
                    >
                      Změnit heslo
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
