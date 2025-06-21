'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User, Save, Camera, TrendingUp } from 'lucide-react'

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

interface UserProfileProps {
  onProfileUpdate?: (profile: UserProfileData) => void
  initialData?: UserProfileData
}

const UserProfile: React.FC<UserProfileProps> = ({ onProfileUpdate, initialData }) => {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfileData>({
    fitnessGoals: [],
    preferences: {
      availableEquipment: []
    },
    ...initialData
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const genderOptions = [
    { value: 'MALE', label: 'Homme' },
    { value: 'FEMALE', label: 'Femme' },
    { value: 'OTHER', label: 'Autre' },
    { value: 'PREFER_NOT_TO_SAY', label: 'Préfère ne pas dire' }
  ]

  const experienceLevels = [
    { value: 'BEGINNER', label: 'Débutant (0-6 mois)', description: 'Nouveau dans le fitness' },
    { value: 'INTERMEDIATE', label: 'Intermédiaire (6 mois - 2 ans)', description: 'Quelques bases acquises' },
    { value: 'ADVANCED', label: 'Avancé (2+ ans)', description: 'Expérience solide' },
    { value: 'EXPERT', label: 'Expert (5+ ans)', description: 'Très expérimenté' }
  ]

  const fitnessGoalOptions = [
    { value: 'WEIGHT_LOSS', label: 'Perte de poids', icon: '🔥' },
    { value: 'MUSCLE_GAIN', label: 'Prise de masse musculaire', icon: '💪' },
    { value: 'STRENGTH', label: 'Gain de force', icon: '🏋️' },
    { value: 'ENDURANCE', label: 'Endurance cardiovasculaire', icon: '🏃' },
    { value: 'FLEXIBILITY', label: 'Flexibilité et mobilité', icon: '🧘' },
    { value: 'GENERAL_FITNESS', label: 'Forme générale', icon: '⚡' },
    { value: 'SPORT_SPECIFIC', label: 'Performance sportive', icon: '🏆' },
    { value: 'REHABILITATION', label: 'Rééducation', icon: '🩺' }
  ]

  const activityLevels = [
    { value: 'SEDENTARY', label: 'Sédentaire', description: 'Peu ou pas d\'exercice' },
    { value: 'LIGHTLY_ACTIVE', label: 'Légèrement actif', description: 'Exercice léger 1-3 jours/semaine' },
    { value: 'MODERATELY_ACTIVE', label: 'Modérément actif', description: 'Exercice modéré 3-5 jours/semaine' },
    { value: 'VERY_ACTIVE', label: 'Très actif', description: 'Exercice intense 6-7 jours/semaine' },
    { value: 'EXTREMELY_ACTIVE', label: 'Extrêmement actif', description: 'Exercice très intense, travail physique' }
  ]

  const equipmentOptions = [
    'Haltères', 'Barre', 'Machines', 'Poids du corps', 'Kettlebells',
    'Élastiques', 'TRX', 'Banc', 'Pull-up bar', 'Câbles', 'Tapis de course',
    'Vélo d\'appartement', 'Rameur', 'Swiss ball'
  ]

  const handleInputChange = (field: keyof UserProfileData, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handlePreferenceChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }))
    setSaved(false)
  }

  const toggleFitnessGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter(g => g !== goal)
        : [...prev.fitnessGoals, goal]
    }))
    setSaved(false)
  }

  const toggleEquipment = (equipment: string) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        availableEquipment: prev.preferences?.availableEquipment?.includes(equipment)
          ? prev.preferences.availableEquipment.filter(e => e !== equipment)
          : [...(prev.preferences?.availableEquipment || []), equipment]
      }
    }))
    setSaved(false)
  }

  const calculateBMI = () => {
    if (profile.weight && profile.height) {
      const heightInM = profile.height / 100
      return (profile.weight / (heightInM * heightInM)).toFixed(1)
    }
    return null
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Insuffisance pondérale', color: 'text-blue-600' }
    if (bmi < 25) return { category: 'Poids normal', color: 'text-green-600' }
    if (bmi < 30) return { category: 'Surpoids', color: 'text-yellow-600' }
    return { category: 'Obésité', color: 'text-red-600' }
  }

  const handleSave = async () => {
    if (!session?.user?.email) return

    setLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        setSaved(true)
        onProfileUpdate?.(profile)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setLoading(false)
    }
  }

  const bmi = calculateBMI()
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Profil Utilisateur Détaillé</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations de base */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">Informations de base</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Âge</label>
                <input
                  type="number"
                  min="13"
                  max="100"
                  value={profile.age || ''}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || undefined)}
                  className="input-field"
                  placeholder="25"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                <select
                  value={profile.gender || ''}
                  onChange={(e) => handleInputChange('gender', e.target.value || undefined)}
                  className="input-field"
                >
                  <option value="">Sélectionner</option>
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Poids (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  step="0.1"
                  value={profile.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || undefined)}
                  className="input-field"
                  placeholder="70.0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Taille (cm)</label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={profile.height || ''}
                  onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || undefined)}
                  className="input-field"
                  placeholder="175"
                />
              </div>
            </div>

            {bmi && (
              <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-gray-300" />
                  <span className="font-medium text-gray-300">IMC (Indice de Masse Corporelle)</span>
                </div>
                <div className="text-2xl font-bold text-white">{bmi}</div>
                {bmiInfo && (
                  <div className={`text-sm font-medium ${bmiInfo.color}`}>
                    {bmiInfo.category}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Niveau d'expérience */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">Expérience et activité</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Niveau d'expérience</label>
              <div className="space-y-2">
                {experienceLevels.map(level => (
                  <label key={level.value} className="flex items-start gap-3 p-3 border border-white/20 rounded-lg hover:bg-white/5 cursor-pointer">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={level.value}
                      checked={profile.experienceLevel === level.value}
                      onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-white">{level.label}</div>
                      <div className="text-sm text-gray-300">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Niveau d'activité actuel</label>
              <div className="space-y-2">
                {activityLevels.map(level => (
                  <label key={level.value} className="flex items-start gap-3 p-3 border border-white/20 rounded-lg hover:bg-white/5 cursor-pointer">
                    <input
                      type="radio"
                      name="activityLevel"
                      value={level.value}
                      checked={profile.activityLevel === level.value}
                      onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-white">{level.label}</div>
                      <div className="text-sm text-gray-300">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Objectifs fitness */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2 mb-4">Objectifs fitness (sélection multiple)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fitnessGoalOptions.map(goal => (
              <label key={goal.value} className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                profile.fitnessGoals.includes(goal.value)
                  ? 'border-blue-400 bg-blue-500/20'
                  : 'border-white/20 hover:border-white/30 bg-white/5'
              }`}>
                <input
                  type="checkbox"
                  checked={profile.fitnessGoals.includes(goal.value)}
                  onChange={() => toggleFitnessGoal(goal.value)}
                  className="sr-only"
                />
                <span className="text-2xl">{goal.icon}</span>
                <span className="text-sm font-medium text-white">{goal.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Équipements disponibles */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2 mb-4">Équipements disponibles</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {equipmentOptions.map(equipment => (
              <label key={equipment} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                profile.preferences?.availableEquipment?.includes(equipment)
                  ? 'border-blue-400 bg-blue-500/20'
                  : 'border-white/20 hover:border-white/30 bg-white/5'
              }`}>
                <input
                  type="checkbox"
                  checked={profile.preferences?.availableEquipment?.includes(equipment) || false}
                  onChange={() => toggleEquipment(equipment)}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-white">{equipment}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Préférences d'entraînement */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2 mb-4">Préférences d'entraînement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Durée préférée (minutes)</label>
              <select
                value={profile.preferences?.workoutDuration || ''}
                onChange={(e) => handlePreferenceChange('workoutDuration', parseInt(e.target.value) || undefined)}
                className="input-field"
              >
                <option value="">Sélectionner</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 heure</option>
                <option value="90">1h30</option>
                <option value="120">2 heures</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Fréquence par semaine</label>
              <select
                value={profile.preferences?.workoutFrequency || ''}
                onChange={(e) => handlePreferenceChange('workoutFrequency', parseInt(e.target.value) || undefined)}
                className="input-field"
              >
                <option value="">Sélectionner</option>
                <option value="1">1 fois</option>
                <option value="2">2 fois</option>
                <option value="3">3 fois</option>
                <option value="4">4 fois</option>
                <option value="5">5 fois</option>
                <option value="6">6 fois</option>
                <option value="7">7 fois</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Moment préféré</label>
              <select
                value={profile.preferences?.preferredWorkoutTime || ''}
                onChange={(e) => handlePreferenceChange('preferredWorkoutTime', e.target.value || undefined)}
                className="input-field"
              >
                <option value="">Sélectionner</option>
                <option value="morning">Matin (6h-10h)</option>
                <option value="midday">Midi (10h-14h)</option>
                <option value="afternoon">Après-midi (14h-18h)</option>
                <option value="evening">Soir (18h-22h)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Conditions médicales */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2 mb-4">Conditions médicales et limitations</h3>
          <textarea
            value={profile.medicalConditions || ''}
            onChange={(e) => handleInputChange('medicalConditions', e.target.value || undefined)}
            className="input-field h-24 resize-none"
            placeholder="Mentionnez toute condition médicale, blessure passée ou limitation physique qui pourrait affecter votre entraînement..."
          />
          <p className="text-xs text-gray-400 mt-2">
            Ces informations nous aideront à personnaliser vos entraînements en toute sécurité.
          </p>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              saved
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
            }`}
          >
            <Save className="w-4 h-4" />
            {loading ? 'Sauvegarde...' : saved ? 'Sauvegardé !' : 'Sauvegarder le profil'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfile