'use client'

import Link from 'next/link'
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { isSignedIn, user } = useUser()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-16 bg-primary" /> // Placeholder to prevent layout shift
  }

  const isAdmin = user?.publicMetadata?.role === 'admin'

  const navItems = [

    ...(isAdmin ? [
      { href: '/admin/products', label: 'Products' },
      { href: '/admin/orders', label: 'Orders' },
    ] : [
      { href: '/cart', label: 'Cart' },
    ]),
  ]

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">PERFUME NL</Link>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Desktop navigation */}
        <nav className="hidden md:block">
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-primary-foreground/80 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {isSignedIn ? (
              <SignOutButton>
                <Button variant="secondary">Sign Out</Button>
              </SignOutButton>
            ) : (
              <SignInButton>
                <Button variant="secondary">Sign In</Button>
              </SignInButton>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="px-4 pt-2 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 hover:text-primary-foreground/80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isSignedIn ? (
              <SignOutButton>
                <Button variant="secondary" className="w-full">Sign Out</Button>
              </SignOutButton>
            ) : (
              <SignInButton>
                <Button variant="secondary" className="w-full">Sign In</Button>
              </SignInButton>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}