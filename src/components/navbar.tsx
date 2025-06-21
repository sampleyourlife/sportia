'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent hover:from-amber-300 hover:to-yellow-400 transition-all">
              🧠 StrategIA
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/dashboard" className="text-gray-300 hover:text-amber-400 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link href="/metrics" className="text-gray-300 hover:text-amber-400 transition-colors font-medium">
                  Métriques
                </Link>
                <Link href="/profile" className="text-gray-300 hover:text-amber-400 transition-colors font-medium">
                  Profil
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300 truncate max-w-32">Bonjour, {session.user?.name || session.user?.email}</span>
                  <button
                    onClick={() => signOut()}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Se déconnecter
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Se connecter
                </Link>
                <Link href="/auth/signup" className="bg-slate-700/50 hover:bg-slate-600/50 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 border border-slate-600/50">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-amber-400 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-slate-700/50 bg-slate-900/80">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-gray-300 hover:text-amber-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/metrics"
                    className="block px-3 py-2 text-gray-300 hover:text-amber-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Métriques
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-gray-300 hover:text-amber-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  <div className="px-3 py-2">
                    <p className="text-sm text-gray-400 mb-2">Connecté en tant que:</p>
                    <p className="text-sm font-medium text-white break-words">{session.user?.name || session.user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="block px-3 py-2 text-amber-400 hover:text-amber-300 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-3 py-2 text-gray-300 hover:text-amber-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}