'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { MetricsChart, OverviewRadarChart } from '@/components/MetricsChart'
import { AddMetricModal } from '@/components/AddMetricModal'
import Link from 'next/link'

interface UserStats {
  totalWorkouts: number
  weeklyGoal: number
  currentStreak: number
  favoriteExercise: string
  totalTimeSpent: number
  averageWorkoutDuration: number
}

interface RecentWorkout {
  id: string
  name: string
  date: string
  duration: string
  difficulty: string
  exerciseCount: number
}

interface MetricData {
  weight: any[]
  strength: any[]
  endurance: any[]
  measurements: any[]
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [recentWorkouts, setRecentWorkouts] = useState<RecentWorkout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [metricsData, setMetricsData] = useState<MetricData>({
    weight: [],
    strength: [],
    endurance: [],
    measurements: []
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'weight' | 'strength' | 'endurance' | 'measurements'>('weight')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchMetricsData()
      // Simuler des données pour le moment
      setTimeout(() => {
        setUserStats({
          totalWorkouts: 24,
          weeklyGoal: 4,
          currentStreak: 7,
          favoriteExercise: 'Squats',
          totalTimeSpent: 1800, // en minutes
          averageWorkoutDuration: 45
        })

        setRecentWorkouts([
          {
            id: '1',
            name: 'Entraînement Haut du Corps',
            date: '2024-01-20',
            duration: '45min',
            difficulty: 'Intermédiaire',
            exerciseCount: 8
          },
          {
            id: '2',
            name: 'Cardio HIIT',
            date: '2024-01-18',
            duration: '30min',
            difficulty: 'Avancé',
            exerciseCount: 6
          },
          {
            id: '3',
            name: 'Jambes et Fessiers',
            date: '2024-01-16',
            duration: '50min',
            difficulty: 'Intermédiaire',
            exerciseCount: 10
          }
        ])
        setIsLoading(false)
      }, 1000)
    }
  }, [status, router])

  const fetchMetricsData = async () => {
    try {
      const types = ['weight', 'strength', 'endurance', 'measurements']
      const promises = types.map(type => 
        fetch(`/api/metrics?type=${type}&period=3m`).then(res => res.json())
      )
      
      const results = await Promise.all(promises)
      setMetricsData({
        weight: Array.isArray(results[0]) ? results[0] : (results[0]?.data || []),
        strength: Array.isArray(results[1]) ? results[1] : (results[1]?.data || []),
        endurance: Array.isArray(results[2]) ? results[2] : (results[2]?.data || []),
        measurements: Array.isArray(results[3]) ? results[3] : (results[3]?.data || [])
      })
    } catch (error) {
      console.error('Erreur lors du chargement des métriques:', error)
      // En cas d'erreur, s'assurer que les données sont des tableaux vides
      setMetricsData({
        weight: [],
        strength: [],
        endurance: [],
        measurements: []
      })
    }
  }

  const openModal = (type: 'weight' | 'strength' | 'endurance' | 'measurements') => {
    setModalType(type)
    setIsModalOpen(true)
  }

  const handleMetricAdded = () => {
    fetchMetricsData()
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const weeklyProgress = userStats ? Math.min((userStats.totalWorkouts % 7) / userStats.weeklyGoal * 100, 100) : 0
  const streakProgress = userStats ? Math.min(userStats.currentStreak / 30 * 100, 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Bonjour, {session.user?.name || 'Athlète'} 👋
          </h1>
          <p className="text-gray-300 text-lg">
            Voici un aperçu de vos performances et progrès
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Workouts */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-green-400 text-sm font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{userStats?.totalWorkouts}</h3>
            <p className="text-gray-400 text-sm">Entraînements totaux</p>
          </div>

          {/* Weekly Progress */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-amber-400 text-sm font-medium">{Math.round(weeklyProgress)}%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{userStats ? userStats.totalWorkouts % 7 : 0}/{userStats?.weeklyGoal}</h3>
            <p className="text-gray-400 text-sm">Objectif hebdomadaire</p>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
              <div 
                className="bg-gradient-to-r from-emerald-600 to-teal-700 h-2 rounded-full transition-all duration-500"
                style={{ width: `${weeklyProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <span className="text-orange-400 text-sm font-medium">🔥</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{userStats?.currentStreak} jours</h3>
            <p className="text-gray-400 text-sm">Série actuelle</p>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
              <div 
                className="bg-gradient-to-r from-orange-600 to-red-700 h-2 rounded-full transition-all duration-500"
                style={{ width: `${streakProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Total Time */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-purple-400 text-sm font-medium">⏱️</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{userStats ? Math.round(userStats.totalTimeSpent / 60) : 0}h</h3>
            <p className="text-gray-400 text-sm">Temps total d'entraînement</p>
          </div>
        </div>

        {/* Section Graphiques et Métriques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Graphique Vue d'ensemble */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Vue d'ensemble</h2>
              <button
                onClick={() => openModal('weight')}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
              >
                + Ajouter
              </button>
            </div>
            <div className="h-64">
              <OverviewRadarChart data={metricsData} />
            </div>
          </div>

          {/* Graphique Poids */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Évolution du poids</h2>
              <button
                onClick={() => openModal('weight')}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
              >
                + Ajouter
              </button>
            </div>
            <div className="h-64">
              <MetricsChart 
                data={metricsData.weight} 
                type="weight" 
                chartType="line"
              />
            </div>
          </div>

          {/* Graphique Force */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Progression force</h2>
              <button
                onClick={() => openModal('strength')}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
              >
                + Ajouter
              </button>
            </div>
            <div className="h-64">
              <MetricsChart 
                data={metricsData.strength} 
                type="strength" 
                chartType="bar"
              />
            </div>
          </div>

          {/* Graphique Endurance */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Endurance cardio</h2>
              <button
                onClick={() => openModal('endurance')}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
              >
                + Ajouter
              </button>
            </div>
            <div className="h-64">
              <MetricsChart 
                data={metricsData.endurance} 
                type="endurance" 
                chartType="line"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Workouts */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Entraînements récents</h2>
                <Link 
                  href="/"
                  className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                >
                  Voir tout →
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentWorkouts.map((workout) => (
                  <div key={workout.id} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{workout.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>📅 {new Date(workout.date).toLocaleDateString('fr-FR')}</span>
                          <span>⏱️ {workout.duration}</span>
                          <span>💪 {workout.exerciseCount} exercices</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          workout.difficulty === 'Débutant' ? 'bg-green-500/20 text-green-400' :
                          workout.difficulty === 'Intermédiaire' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {workout.difficulty}
                        </span>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Actions rapides</h2>
              <div className="space-y-3">
                <Link 
                  href="/"
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Nouvel entraînement</span>
                </Link>
                
                <Link 
                  href="/profile"
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Mon profil</span>
                </Link>
                
                <button 
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes vos statistiques ? Cette action est irréversible.')) {
                      // Réinitialiser les statistiques
                      setUserStats({
                        totalWorkouts: 0,
                        weeklyGoal: 4,
                        currentStreak: 0,
                        favoriteExercise: 'Aucun',
                        totalTimeSpent: 0,
                        averageWorkoutDuration: 0
                      })
                      setRecentWorkouts([])
                      // Ici vous pourriez ajouter un appel API pour réinitialiser en base de données
                      alert('Statistiques réinitialisées avec succès !')
                    }
                  }}
                  className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 hover:border-red-500 text-red-400 hover:text-red-300 font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Réinitialiser les stats</span>
                </button>
              </div>
            </div>

            {/* Personal Records */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Records personnels</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Exercice favori</p>
                    <p className="text-gray-400 text-sm">{userStats?.favoriteExercise}</p>
                  </div>
                  <div className="text-2xl">🏆</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Durée moyenne</p>
                    <p className="text-gray-400 text-sm">{userStats?.averageWorkoutDuration} minutes</p>
                  </div>
                  <div className="text-2xl">⏱️</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Meilleure série</p>
                    <p className="text-gray-400 text-sm">14 jours consécutifs</p>
                  </div>
                  <div className="text-2xl">🔥</div>
                </div>
              </div>
            </div>

            {/* Weekly Goal */}
            <div className="bg-gradient-to-r from-emerald-600/20 to-teal-700/20 backdrop-blur-lg rounded-2xl p-6 border border-emerald-500/30">
              <h2 className="text-xl font-bold text-white mb-2">Objectif de la semaine</h2>
              <p className="text-emerald-300 text-sm mb-4">
                Plus que {userStats ? userStats.weeklyGoal - (userStats.totalWorkouts % 7) : 0} entraînements pour atteindre votre objectif !
              </p>
              <div className="w-full bg-emerald-900/30 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${weeklyProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal pour ajouter des métriques */}
         <AddMetricModal
           isOpen={isModalOpen}
           onClose={() => setIsModalOpen(false)}
           type={modalType}
           onSuccess={handleMetricAdded}
         />
      </main>
    </div>
  )
}