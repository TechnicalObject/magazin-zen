/* eslint-disable jsx-a11y/anchor-has-content */
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import LoginComponent from '@/components/LoginComponent'

export default function LoginMenu() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const closeMenu = () => setIsOpen(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef])
  
  useEffect(() => {
    const handleUserLogin = () => {
      closeMenu()
    }
    window.addEventListener('userLogin', handleUserLogin)
    return () => {
      window.removeEventListener('userLogin', handleUserLogin)
    }
  },[])

  return (
    <div className="relative" ref={menuRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-medium text-gray-900 dark:text-gray-100 sm:block"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 256 256"
          className="h-6 w-6 text-gray-900 hover:text-primary-500 dark:text-gray-100
          dark:hover:text-primary-400"
        >
          <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
        </svg>
        {/* {session.user?.name || 'Profile'} */}
      </button>

      {/* Dropdown Menu */}
      {isOpen && session && (
        <div id="account-component" className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
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
      {isOpen && !session && (
        <div id="account-component" className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-md shadow-lg p-2 z-10">
          {/* <Link
            href="/login"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={closeMenu}
          >
            Přihlásit
          </Link> */}
          <LoginComponent />
        </div>
      )}
    </div>
  )
}