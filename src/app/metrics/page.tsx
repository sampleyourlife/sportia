'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { MetricsChart, OverviewRadarChart } from '@/components/MetricsChart'
import { AddMetricModal } from '@/components/AddMetricModal'

interface MetricData {
  weight: any[]
  strength: any[]
  endurance: any[]
  measurements: any[]
}

export default function MetricsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [metricsData, setMetricsData] = useState<MetricData>({
    weight: [],
    strength: [],
    endurance: [],
    measurements: []
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'weight' | 'strength' | 'endurance' | 'measurements'>('weight')
  const [selectedPeriod, setSelectedPeriod] = useState('3m')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchMetricsData()
    }
  }, [status, router, selectedPeriod])

  const fetchMetricsData = async () => {
    setIsLoading(true)
    try {
      const types = ['weight', 'strength', 'endurance', 'measurements']
      const promises = types.map(type => 
        fetch(`/api/metrics?type=${type}&period=${selectedPeriod}`).then(res => res.json())
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
    } finally {
      setIsLoading(false)
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Mes Métriques
          </h1>
          <p className="text-gray-300 text-lg">
            Suivez votre progression avec des graphiques détaillés
          </p>
        </div>

        {/* Filtres de période */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { value: '1m', label: '1 mois' },
              { value: '3m', label: '3 mois' },
              { value: '6m', label: '6 mois' },
              { value: '1y', label: '1 an' }
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedPeriod === period.value
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vue d'ensemble radar */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Vue d'ensemble</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal('weight')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-medium rounded-lg transition-all duration-300"
                >
                  + Ajouter métrique
                </button>
              </div>
            </div>
            <div className="h-96">
              <OverviewRadarChart data={metricsData} />
            </div>
          </div>
        </div>

        {/* Graphiques détaillés */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Poids et composition corporelle */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Poids & Composition</h2>
              <button
                onClick={() => openModal('weight')}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter
              </button>
            </div>
            <div className="h-80">
              <MetricsChart 
                data={metricsData.weight} 
                type="weight" 
                chartType="line"
              />
            </div>
          </div>

          {/* Force */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Force & Puissance</h2>
              <button
                onClick={() => openModal('strength')}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter
              </button>
            </div>
            <div className="h-80">
              <MetricsChart 
                data={metricsData.strength} 
                type="strength" 
                chartType="bar"
              />
            </div>
          </div>

          {/* Endurance */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Endurance Cardio</h2>
              <button
                onClick={() => openModal('endurance')}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter
              </button>
            </div>
            <div className="h-80">
              <MetricsChart 
                data={metricsData.endurance} 
                type="endurance" 
                chartType="line"
              />
            </div>
          </div>

          {/* Mensurations */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Mensurations</h2>
              <button
                onClick={() => openModal('measurements')}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter
              </button>
            </div>
            <div className="h-80">
              <MetricsChart 
                data={metricsData.measurements} 
                type="measurements" 
                chartType="line"
              />
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400 mb-1">
                {metricsData.weight.length}
              </div>
              <div className="text-sm text-gray-300">Mesures de poids</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {metricsData.strength.length}
              </div>
              <div className="text-sm text-gray-300">Tests de force</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {metricsData.endurance.length}
              </div>
              <div className="text-sm text-gray-300">Sessions cardio</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {metricsData.measurements.length}
              </div>
              <div className="text-sm text-gray-300">Mensurations</div>
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