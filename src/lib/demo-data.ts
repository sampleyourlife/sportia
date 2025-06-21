// Données de démonstration pour les métriques

export const generateDemoMetrics = () => {
  const now = new Date()
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  
  // Générer des dates sur 3 mois
  const dates = []
  for (let i = 0; i < 12; i++) {
    const date = new Date(threeMonthsAgo.getTime() + (i * 7 * 24 * 60 * 60 * 1000))
    dates.push(date.toISOString().split('T')[0])
  }

  // Données de poids avec progression réaliste
  const weightData = dates.map((date, index) => ({
    id: `weight-${index}`,
    userId: 'demo-user',
    date,
    weight: 75 + (index * 0.2) + (Math.random() - 0.5) * 2, // Progression légère avec variation
    bodyFat: 15 - (index * 0.1) + (Math.random() - 0.5) * 1,
    muscleMass: 55 + (index * 0.15) + (Math.random() - 0.5) * 0.5,
    notes: index % 3 === 0 ? 'Mesure après entraînement' : null,
    createdAt: new Date(date)
  }))

  // Données de force avec progression
  const strengthData = dates.filter((_, i) => i % 2 === 0).map((date, index) => ({
    id: `strength-${index}`,
    userId: 'demo-user',
    date,
    benchPress: 80 + (index * 2.5) + (Math.random() - 0.5) * 5,
    squat: 120 + (index * 3) + (Math.random() - 0.5) * 8,
    deadlift: 140 + (index * 4) + (Math.random() - 0.5) * 10,
    pullUps: 8 + Math.floor(index * 0.5) + Math.floor(Math.random() * 3),
    pushUps: 25 + (index * 2) + Math.floor(Math.random() * 5),
    notes: index % 2 === 0 ? 'Test de force hebdomadaire' : null,
    createdAt: new Date(date)
  }))

  // Données d'endurance
  const enduranceData = dates.filter((_, i) => i % 3 === 0).map((date, index) => ({
    id: `endurance-${index}`,
    userId: 'demo-user',
    date,
    cardioTime: 30 + (index * 2) + Math.floor(Math.random() * 10),
    distance: 3 + (index * 0.3) + (Math.random() - 0.5) * 1,
    vo2Max: 45 + (index * 0.5) + (Math.random() - 0.5) * 2,
    restingHR: 65 - (index * 0.5) + Math.floor(Math.random() * 5),
    maxHR: 185 + Math.floor(Math.random() * 10),
    notes: index % 2 === 0 ? 'Session cardio matinale' : null,
    createdAt: new Date(date)
  }))

  // Données de mensurations
  const measurementsData = dates.filter((_, i) => i % 4 === 0).map((date, index) => ({
    id: `measurements-${index}`,
    userId: 'demo-user',
    date,
    chest: 95 + (index * 0.5) + (Math.random() - 0.5) * 1,
    waist: 80 - (index * 0.3) + (Math.random() - 0.5) * 1,
    hips: 90 + (index * 0.2) + (Math.random() - 0.5) * 0.5,
    biceps: 35 + (index * 0.3) + (Math.random() - 0.5) * 0.5,
    thighs: 55 + (index * 0.4) + (Math.random() - 0.5) * 1,
    neck: 38 + (index * 0.1) + (Math.random() - 0.5) * 0.3,
    notes: index % 2 === 0 ? 'Mesures mensuelles' : null,
    createdAt: new Date(date)
  }))

  return {
    weight: weightData,
    strength: strengthData,
    endurance: enduranceData,
    measurements: measurementsData
  }
}

// Fonction pour simuler l'API en mode démo
export const getDemoMetrics = (type?: string, period?: string) => {
  const allData = generateDemoMetrics()
  
  if (type && type !== 'all') {
    return allData[type as keyof typeof allData] || []
  }
  
  return allData
}