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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Retour à l'accueil</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">{session.user?.name || session.user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="py-8">
        {isFirstTime && (
          <div className="max-w-4xl mx-auto px-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Bienvenue ! Configurons votre profil
                  </h3>
                  <p className="text-blue-800 mb-4">
                    Pour vous proposer des entraînements parfaitement adaptés à vos besoins, 
                    nous avons besoin de quelques informations sur vous. Ces données nous permettront de :
                  </p>
                  <ul className="list-disc list-inside text-blue-800 space-y-1 mb-4">
                    <li>Personnaliser l'intensité et la difficulté de vos entraînements</li>
                    <li>Adapter les exercices à votre niveau d'expérience</li>
                    <li>Respecter vos objectifs et contraintes</li>
                    <li>Assurer votre sécurité en tenant compte de vos limitations</li>
                  </ul>
                  <p className="text-sm text-blue-700">
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
      <div className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <h4 className="font-semibold text-gray-900 mb-2">Vos données sont sécurisées</h4>
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