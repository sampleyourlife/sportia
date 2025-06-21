'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface AddMetricModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  type: 'weight' | 'strength' | 'endurance' | 'measurements'
}

export function AddMetricModal({ isOpen, onClose, onSuccess, type }: AddMetricModalProps) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<any>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString()
        })
      })

      if (response.ok) {
        setFormData({})
        onSuccess()
        onClose()
      } else {
        console.error('Erreur lors de l\'ajout de la métrique')
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen) return null

  const renderFields = () => {
    switch (type) {
      case 'weight':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Poids (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weight || ''}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="70.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Masse grasse (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.bodyFat || ''}
                onChange={(e) => handleInputChange('bodyFat', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="15.2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Masse musculaire (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.muscleMass || ''}
                onChange={(e) => handleInputChange('muscleMass', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="55.0"
              />
            </div>
          </>
        )
      
      case 'strength':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Développé couché (kg)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.benchPress || ''}
                onChange={(e) => handleInputChange('benchPress', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Squat (kg)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.squat || ''}
                onChange={(e) => handleInputChange('squat', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Soulevé de terre (kg)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.deadlift || ''}
                onChange={(e) => handleInputChange('deadlift', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="140"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tractions
                </label>
                <input
                  type="number"
                  value={formData.pullUps || ''}
                  onChange={(e) => handleInputChange('pullUps', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pompes
                </label>
                <input
                  type="number"
                  value={formData.pushUps || ''}
                  onChange={(e) => handleInputChange('pushUps', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="30"
                />
              </div>
            </div>
          </>
        )
      
      case 'endurance':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Temps cardio (minutes)
              </label>
              <input
                type="number"
                value={formData.cardioTime || ''}
                onChange={(e) => handleInputChange('cardioTime', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.distance || ''}
                onChange={(e) => handleInputChange('distance', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="5.2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  FC repos (bpm)
                </label>
                <input
                  type="number"
                  value={formData.restingHR || ''}
                  onChange={(e) => handleInputChange('restingHR', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  FC max (bpm)
                </label>
                <input
                  type="number"
                  value={formData.maxHR || ''}
                  onChange={(e) => handleInputChange('maxHR', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="180"
                />
              </div>
            </div>
          </>
        )
      
      case 'measurements':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Poitrine (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.chest || ''}
                  onChange={(e) => handleInputChange('chest', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="95"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Taille (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.waist || ''}
                  onChange={(e) => handleInputChange('waist', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="80"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Biceps (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.biceps || ''}
                  onChange={(e) => handleInputChange('biceps', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="35"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cuisses (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.thighs || ''}
                  onChange={(e) => handleInputChange('thighs', e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="55"
                />
              </div>
            </div>
          </>
        )
      
      default:
        return null
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'weight': return 'Ajouter mesures corporelles'
      case 'strength': return 'Ajouter mesures de force'
      case 'endurance': return 'Ajouter mesures d\'endurance'
      case 'measurements': return 'Ajouter mensurations'
      default: return 'Ajouter métrique'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/90 backdrop-blur-lg border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFields()}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              rows={3}
              placeholder="Ajouter des notes..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}