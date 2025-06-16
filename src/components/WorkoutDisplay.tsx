'use client'

// First install the package with: npm install lucide-react
// or: yarn add lucide-react
import { Clock, Target, Zap, Calendar, Dumbbell, RotateCcw } from 'lucide-react'

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

interface WorkoutDisplayProps {
  workouts: Workout[]
  workoutType: 'single' | 'weekly'
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ workouts, workoutType }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20'
      case 'advanced': return 'text-red-400 bg-red-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Débutant'
      case 'intermediate': return 'Intermédiaire'
      case 'advanced': return 'Avancé'
      default: return difficulty
    }
  }



  if (workouts.length === 0) {
    return null
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-12">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {workoutType === 'weekly' ? '🗓️ Votre Programme Hebdomadaire' : '💪 Votre Séance Personnalisée'}
        </h2>
        <p className="text-gray-300">
          {workoutType === 'weekly' 
            ? 'Programme complet sur 5 jours pour une progression optimale'
            : 'Séance adaptée à vos objectifs et équipements'
          }
        </p>
      </div>

      {/* Grille des séances */}
      <div className={`grid gap-4 sm:gap-6 ${workoutType === 'weekly' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' : 'grid-cols-1 max-w-md mx-auto'}`}>
        {workouts.map((workout, index) => (
          <div
            key={workout.id}
            className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-yellow-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              {/* En-tête de la carte */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {workout.day && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-400 text-sm font-medium">{workout.day}</span>
                    </div>
                  )}
                  <h3 className="text-white font-bold text-lg leading-tight break-words">{workout.name}</h3>
                </div>
                <Dumbbell className="w-6 h-6 text-amber-400 flex-shrink-0 ml-2" />
              </div>

              {/* Informations de la séance */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{workout.duration}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(workout.difficulty)}`}>
                    {getDifficultyLabel(workout.difficulty)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{workout.exercises.length} exercices</span>
                </div>
              </div>

              {/* Liste des exercices */}
              <div className="space-y-3">
                <h4 className="text-white font-semibold text-sm mb-3 flex items-center">
                  <RotateCcw className="w-4 h-4 mr-2 text-amber-400" />
                  Exercices
                </h4>
                {workout.exercises.map((exercise, exerciseIndex) => (
                  <div
                    key={exerciseIndex}
                    className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-white font-medium text-sm leading-tight flex-1 pr-2 break-words">{exercise.name}</h5>
                      <span className="text-amber-400 text-xs font-medium ml-2 flex-shrink-0">{exercise.muscle}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                      <div>
                        <span className="text-gray-400">Séries:</span> <span className="text-white font-medium">{exercise.sets}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Reps:</span> <span className="text-white font-medium">{exercise.reps}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Repos:</span> <span className="text-white font-medium">{exercise.rest}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton d'action */}
              <button className="w-full mt-6 bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-3 rounded-lg font-semibold text-sm hover:from-amber-700 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Commencer la séance
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton pour régénérer */}
      <div className="text-center mt-8">
        <button className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300">
          <RotateCcw className="w-4 h-4" />
          <span>Générer un nouveau programme</span>
        </button>
      </div>
    </div>
  )
}

// Styles CSS pour l'animation
const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`

// Injection des styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}

export default WorkoutDisplay