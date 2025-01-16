'use client'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Profile } from '@/components/social-icons/icons'

export default function Header() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/" aria-label={siteMetadata.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Logo />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className="hidden h-6 text-2xl font-semibold sm:block">
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        {headerNavLinks
          .filter((link) =>
            // Skryjeme Login a Register pokud je uživatel přihlášený
            session ? !['login', 'register'].includes(link.href.slice(1)) : link,
          )
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="hidden font-medium text-gray-900 dark:text-gray-100 sm:block"
            >
              {link.title}
            </Link>
          ))}
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
        {session ? (
          <div className="relative">
            {/* Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="font-medium text-gray-900 dark:text-gray-100 sm:block"
            >
              <Profile width={24} height={24} fill="currentColor" />
              {/* {session.user?.name || 'Profile'} */}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Profil
                </Link>
                <button
                  onClick={() => {
                    closeMenu() // Close menu before signing out
                    signOut()
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Odhlásit
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="hidden font-medium text-gray-900 dark:text-gray-100 sm:block"
          >
            Přihlásit
          </Link>
        )}
      </div>
    </header>
  )
}
