'use client'

import { useState } from 'react'
// First install lucide-react: npm install lucide-react
// First install the package: npm install @types/lucide-react lucide-react
// First install the required packages:
// npm install lucide-react @types/lucide-react
// First install the required packages:
// npm install lucide-react @types/lucide-react
// @ts-ignore
import { Search, Dumbbell, Clock, Target, Settings } from 'lucide-react'
// Note: LucideIcon type is not used in this file, so we can safely remove this import

interface Exercise {
  name: string
  sets: number
  reps: string
  rest: string
  muscle: string
}

interface Workout {
  id: string
  name: string
  exercises: Exercise[]
  duration: string
  difficulty: string
  day?: string
}

interface WorkoutGeneratorProps {
  onWorkoutGenerated: (workouts: Workout[], type: 'single' | 'weekly') => void
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
  workoutType: 'single' | 'weekly'
  setWorkoutType: (type: 'single' | 'weekly') => void
}

const WorkoutGenerator: React.FC<WorkoutGeneratorProps> = ({
  onWorkoutGenerated,
  isGenerating,
  setIsGenerating,
  workoutType,
  setWorkoutType
}) => {
  const [query, setQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [equipment, setEquipment] = useState<string[]>([])
  const [duration, setDuration] = useState('45')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [muscleGroups, setMuscleGroups] = useState<string[]>([])

  const equipmentOptions = [
    'Haltères', 'Barre', 'Machines', 'Poids du corps', 'Kettlebells', 
    'Élastiques', 'TRX', 'Banc', 'Pull-up bar', 'Câbles'
  ]

  const muscleGroupOptions = [
    'Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 
    'Quadriceps', 'Ischio-jambiers', 'Mollets', 'Abdominaux', 'Fessiers'
  ]

  const toggleEquipment = (item: string) => {
    setEquipment(prev => 
      prev.includes(item) 
        ? prev.filter(e => e !== item)
        : [...prev, item]
    )
  }

  const toggleMuscleGroup = (muscle: string) => {
    setMuscleGroups(prev => 
      prev.includes(muscle) 
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    )
  }

  const generateMockWorkout = (type: 'single' | 'weekly'): Workout[] => {
    const exercises: Exercise[] = [
      { name: 'Développé couché', sets: 4, reps: '8-12', rest: '2-3 min', muscle: 'Pectoraux' },
      { name: 'Tractions', sets: 3, reps: '6-10', rest: '2 min', muscle: 'Dos' },
      { name: 'Squats', sets: 4, reps: '10-15', rest: '2-3 min', muscle: 'Quadriceps' },
      { name: 'Développé militaire', sets: 3, reps: '8-12', rest: '2 min', muscle: 'Épaules' },
      { name: 'Curl biceps', sets: 3, reps: '10-15', rest: '1-2 min', muscle: 'Biceps' }
    ]

    if (type === 'single') {
      return [{
        id: '1',
        name: query || 'Séance Full Body',
        exercises,
        duration: `${duration} min`,
        difficulty
      }]
    } else {
      const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
      return days.map((day, index) => ({
        id: `${index + 1}`,
        name: `${day} - ${['Push', 'Pull', 'Legs', 'Upper', 'Lower'][index]}`,
        exercises: exercises.slice(0, 3 + Math.floor(Math.random() * 3)),
        duration: `${duration} min`,
        difficulty,
        day
      }))
    }
  }

  const handleGenerate = async (type: 'single' | 'weekly') => {
    if (!query.trim()) return
    
    setIsGenerating(true)
    setWorkoutType(type)
    
    try {
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          equipment,
          duration,
          difficulty,
          muscleGroups,
          workoutType: type
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération')
      }

      const data = await response.json()
      
      // Adapter les données selon le type de réponse
      let workouts: Workout[]
      if (type === 'weekly') {
        workouts = data.workouts || []
      } else {
        workouts = data.workout ? [data.workout] : []
      }
      
      onWorkoutGenerated(workouts, type)
    } catch (error) {
      console.error('Erreur:', error)
      // Fallback vers les données mockées en cas d'erreur
      const workouts = generateMockWorkout(type)
      onWorkoutGenerated(workouts, type)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Barre de recherche principale */}
      <div className="relative mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center space-x-4">
              <Search className="text-amber-400 w-6 h-6 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Décrivez votre séance idéale..."
                className="flex-1 bg-transparent text-white placeholder-gray-300 text-lg focus:outline-none min-w-0"
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate('single')}
              />
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-gray-300 hover:text-amber-400 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Options avancées */}
      {showAdvanced && (
        <div className="mb-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-amber-400" />
            Options avancées
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Équipements */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">Équipements disponibles</label>
              <div className="flex flex-wrap gap-2">
                {equipmentOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleEquipment(item)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      equipment.includes(item)
                        ? 'bg-amber-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Groupes musculaires */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">Groupes musculaires ciblés</label>
              <div className="flex flex-wrap gap-2">
                {muscleGroupOptions.map((muscle) => (
                  <button
                    key={muscle}
                    onClick={() => toggleMuscleGroup(muscle)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      muscleGroups.includes(muscle)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

            {/* Durée et difficulté */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">Durée (minutes)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 heure</option>
                <option value="75">1h15</option>
                <option value="90">1h30</option>
                <option value="120">2 heures</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-3">Niveau de difficulté</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Boutons de génération */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => handleGenerate('single')}
          disabled={!query.trim() || isGenerating}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Dumbbell className="w-5 h-5" />
          <span>{isGenerating ? 'Génération...' : 'Générer une séance'}</span>
        </button>
        
        <button
          onClick={() => handleGenerate('weekly')}
          disabled={!query.trim() || isGenerating}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Clock className="w-5 h-5" />
          <span>{isGenerating ? 'Génération...' : 'Programme hebdomadaire'}</span>
        </button>
      </div>
    </div>
  )
}

export default WorkoutGenerator