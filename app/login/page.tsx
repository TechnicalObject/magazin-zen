'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from '@/components/Link'
import LoginComponent from '@/components/LoginComponent'

export default function LoginPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-3xl font-bold dark:text-white">Přihlášení</h1>
        <LoginComponent />
      </div>
    </div>
  )
}
