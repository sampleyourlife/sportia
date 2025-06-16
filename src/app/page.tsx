'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import WorkoutGenerator from '@/components/WorkoutGenerator'
import WorkoutDisplay from '@/components/WorkoutDisplay'
import Chatbot from '@/components/Chatbot'

interface Workout {
  id: string
  name: string
  exercises: Exercise[]
  duration: string
  difficulty: string
  day?: string
}

interface Exercise {
  name: string
  sets: number
  reps: string
  rest: string
  muscle: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [workoutType, setWorkoutType] = useState<'single' | 'weekly'>('single')
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  const handleWorkoutGenerated = (generatedWorkouts: Workout[]) => {
    setWorkouts(generatedWorkouts)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent break-words">
            FitAI Generator
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Générez vos séances de musculation personnalisées grâce à l'intelligence artificielle.
            Créez une séance instantanée ou un programme complet sur une semaine.
          </p>
        </div>

        {/* Workout Generator */}
        <WorkoutGenerator 
          onWorkoutGenerated={handleWorkoutGenerated}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          workoutType={workoutType}
          setWorkoutType={setWorkoutType}
        />

        {/* Workout Display */}
        {workouts.length > 0 && (
          <WorkoutDisplay 
            workouts={workouts}
            workoutType={workoutType}
          />
        )}

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 break-words">IA Avancée</h3>
            <p className="text-gray-300 leading-relaxed">
              Notre intelligence artificielle analyse vos préférences et génère des séances optimisées pour vos objectifs.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 break-words">Personnalisation</h3>
            <p className="text-gray-300 leading-relaxed">
              Choisissez vos équipements, votre niveau, vos groupes musculaires et bien plus pour des séances sur mesure.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 break-words">Suivi Progressif</h3>
            <p className="text-gray-300 leading-relaxed">
              Suivez vos performances et laissez l'IA adapter vos futurs entraînements en fonction de vos progrès.
            </p>
          </div>
        </div>
      </main>

      {/* Chatbot Button */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:scale-110 z-40 flex items-center justify-center group"
      >
        <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">🤖</span>
        </div>
      </button>

      {/* Chatbot */}
      <Chatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </div>
  )
}