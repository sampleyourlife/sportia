'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-slate-900/90 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent hover:from-amber-300 hover:to-yellow-400 transition-all">
              🧠 StrategIA
            </Link>
          </div>

          {/* Desktop Menu - Ultra compact */}
          <div className="hidden md:flex items-center space-x-2">
            {session ? (
              <>
                {/* Quick Actions */}
                <Link href="/dashboard" className="p-2 text-gray-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-all" title="Dashboard">
                  📊
                </Link>
                <Link href="/metrics" className="p-2 text-gray-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-all" title="Métriques">
                  📈
                </Link>
                <Link href="/profile" className="p-2 text-gray-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-all" title="Profil">
                  👤
                </Link>
                
                {/* User Avatar Menu */}
                 <div className="relative" ref={userMenuRef}>
                   <button
                     onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                     className="flex items-center space-x-2 p-1 hover:bg-slate-800/50 rounded-lg transition-all"
                   >
                     <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                       {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
                     </div>
                   </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800/95 backdrop-blur-lg border border-slate-700/50 rounded-lg shadow-xl z-50">
                      <div className="p-4 border-b border-slate-700/50">
                        <p className="text-sm font-medium text-white truncate">{session.user?.name || 'Utilisateur'}</p>
                        <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link href="/dashboard" className="flex items-center px-4 py-2 text-gray-300 hover:text-amber-400 hover:bg-slate-700/50 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                           📊 <span className="ml-2">Dashboard</span>
                         </Link>
                         <Link href="/metrics" className="flex items-center px-4 py-2 text-gray-300 hover:text-amber-400 hover:bg-slate-700/50 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                           📈 <span className="ml-2">Métriques</span>
                         </Link>
                         <Link href="/profile" className="flex items-center px-4 py-2 text-gray-300 hover:text-amber-400 hover:bg-slate-700/50 transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                           👤 <span className="ml-2">Profil</span>
                         </Link>
                        <div className="border-t border-slate-700/50 my-2"></div>
                        <button
                          onClick={() => {
                            signOut()
                            setIsUserMenuOpen(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700/50 transition-colors"
                        >
                          🚪 <span className="ml-2">Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  )}
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
          <div className="md:hidden flex items-center space-x-2">
            {session && (
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-300 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-all"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  {/* Analytics Section */}
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Analytics</p>
                    <div className="space-y-1 ml-2">
                      <Link
                        href="/dashboard"
                        className="block px-3 py-2 text-gray-300 hover:text-amber-400 transition-colors rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        📊 Dashboard
                      </Link>
                      <Link
                        href="/metrics"
                        className="block px-3 py-2 text-gray-300 hover:text-amber-400 transition-colors rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        📈 Métriques
                      </Link>
                    </div>
                  </div>
                  <div className="border-t border-slate-700/50 my-2"></div>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-gray-300 hover:text-amber-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👤 Profil
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