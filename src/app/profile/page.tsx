'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import UserProfile from '@/components/UserProfile'
import Link from 'next/link'
import { ArrowLeft, User, Settings } from 'lucide-react'

interface UserProfileData {
  age?: number
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  weight?: number
  height?: number
  experienceLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  fitnessGoals: string[]
  activityLevel?: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE'
  medicalConditions?: string
  preferences?: {
    preferredWorkoutTime?: string
    availableEquipment?: string[]
    workoutDuration?: number
    workoutFrequency?: number
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profileData, setProfileData] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFirstTime, setIsFirstTime] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    loadProfile()
  }, [session, status, router])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
        
        // Vérifier si c'est la première fois (profil vide)
        const isEmpty = !data.age && !data.gender && !data.weight && !data.height && 
                       !data.experienceLevel && (!data.fitnessGoals || data.fitnessGoals.length === 0)
        setIsFirstTime(isEmpty)
      } else {
        // Profil n'existe pas encore
        setIsFirstTime(true)
        setProfileData({
          fitnessGoals: [],
          preferences: {
            availableEquipment: []
          }
        })
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error)
      setIsFirstTime(true)
      setProfileData({
        fitnessGoals: [],
        preferences: {
          availableEquipment: []
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = (updatedProfile: UserProfileData) => {
    setProfileData(updatedProfile)
    setIsFirstTime(false)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Chargement de votre profil...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg shadow-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Retour à l'accueil</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-300" />
              <span className="font-medium text-white">{session.user?.name || session.user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="py-8">
        {isFirstTime && (
          <div className="max-w-4xl mx-auto px-6 mb-8">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-700 rounded-full flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Bienvenue ! Configurons votre profil
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Pour vous proposer des entraînements parfaitement adaptés à vos besoins, 
                    nous avons besoin de quelques informations sur vous. Ces données nous permettront de :
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 mb-4">
                    <li>Personnaliser l'intensité et la difficulté de vos entraînements</li>
                    <li>Adapter les exercices à votre niveau d'expérience</li>
                    <li>Respecter vos objectifs et contraintes</li>
                    <li>Assurer votre sécurité en tenant compte de vos limitations</li>
                  </ul>
                  <p className="text-sm text-amber-400">
                    💡 <strong>Astuce :</strong> Plus votre profil est complet, plus nos recommandations seront précises !
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <UserProfile 
          initialData={profileData || undefined}
          onProfileUpdate={handleProfileUpdate}
        />
      </div>

      {/* Footer informatif */}
      <div className="bg-white/5 backdrop-blur-lg border-t border-white/10 mt-12">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center text-gray-300">
            <h4 className="font-semibold text-white mb-2">Vos données sont sécurisées</h4>
            <p className="text-sm">
              Toutes les informations de votre profil sont stockées de manière sécurisée et ne sont utilisées 
              que pour personnaliser votre expérience d'entraînement. Vous pouvez modifier ou supprimer 
              ces données à tout moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}