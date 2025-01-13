'use client'

import Providers from '@/components/Providers'
import Header from '@/components/Header'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <main className="mb-auto">{children}</main>
    </Providers>
  )
}
