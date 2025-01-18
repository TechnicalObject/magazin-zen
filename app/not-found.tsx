'use client'

import Link from '@/components/Link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="mb-8 text-4xl font-bold">404 - Stránka nenalezena</h2>
      <Link
        href="/"
        className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
      >
        Zpět na hlavní stránku
      </Link>
    </div>
  )
}
