'use client'

import { Line, Bar, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface MetricData {
  date: string
  [key: string]: any
}

interface MetricsChartProps {
  type: 'weight' | 'strength' | 'endurance' | 'measurements'
  data: any[]
  chartType?: 'line' | 'bar'
}

export function MetricsChart({ type, data, chartType = 'line' }: MetricsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="text-2xl mb-2">📊</div>
          <div>Aucune donnée disponible</div>
        </div>
      </div>
    )
  }

  const getChartData = () => {
    const labels = data.map(d => new Date(d.date).toLocaleDateString('fr-FR', { 
      month: 'short', 
      day: 'numeric' 
    }))

    let datasets: any[] = []
    let colors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444']

    switch (type) {
      case 'weight':
        datasets = [
          {
            label: 'Poids (kg)',
            data: data.map(d => d.weight),
            borderColor: colors[0],
            backgroundColor: `${colors[0]}20`,
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          },
          {
            label: 'Masse grasse (%)',
            data: data.map(d => d.bodyFat),
            borderColor: colors[1],
            backgroundColor: `${colors[1]}20`,
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          }
        ]
        break
      case 'strength':
        datasets = [
          {
            label: 'Développé couché (kg)',
            data: data.map(d => d.benchPress),
            backgroundColor: colors[0],
            borderColor: colors[0],
            borderWidth: 1,
          },
          {
            label: 'Squat (kg)',
            data: data.map(d => d.squat),
            backgroundColor: colors[1],
            borderColor: colors[1],
            borderWidth: 1,
          },
          {
            label: 'Soulevé de terre (kg)',
            data: data.map(d => d.deadlift),
            backgroundColor: colors[2],
            borderColor: colors[2],
            borderWidth: 1,
          }
        ]
        break
      case 'endurance':
        datasets = [
          {
            label: 'Distance (km)',
            data: data.map(d => d.distance),
            borderColor: colors[0],
            backgroundColor: `${colors[0]}20`,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Temps cardio (min)',
            data: data.map(d => d.cardioTime),
            borderColor: colors[1],
            backgroundColor: `${colors[1]}20`,
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          }
        ]
        break
      case 'measurements':
        datasets = [
          {
            label: 'Poitrine (cm)',
            data: data.map(d => d.chest),
            borderColor: colors[0],
            backgroundColor: `${colors[0]}20`,
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          },
          {
            label: 'Biceps (cm)',
            data: data.map(d => d.biceps),
            borderColor: colors[1],
            backgroundColor: `${colors[1]}20`,
            borderWidth: 2,
            fill: false,
            tension: 0.4,
          }
        ]
        break
    }

    return { labels, datasets }
  }
  const chartData = getChartData()

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#9ca3af',
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#f59e0b',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
      },
    },
  }

  if (chartType === 'bar' || type === 'strength') {
    return (
      <div className="h-full">
        <Bar data={chartData} options={options} />
      </div>
    )
  }

  return (
    <div className="h-full">
      <Line data={chartData} options={options} />
    </div>
  )
}

// Composant pour graphique radar (vue d'ensemble)
interface RadarChartProps {
  data: {
    weight: any[]
    strength: any[]
    endurance: any[]
    measurements: any[]
  }
}

export function OverviewRadarChart({ data }: RadarChartProps) {
  // Calculer des scores basés sur les données disponibles
  const getScore = (dataArray: any[], field?: string) => {
    if (!dataArray || dataArray.length === 0) return 0
    const latest = dataArray[dataArray.length - 1]
    if (field && latest && latest[field] !== undefined && latest[field] !== null) {
      return Math.min(100, (latest[field] / 100) * 100)
    }
    return Math.min(100, dataArray.length * 10)
  }

  const scores = {
    strength: getScore(data.strength),
    endurance: getScore(data.endurance),
    flexibility: 50, // Score fixe pour la démonstration
    muscle: getScore(data.weight, 'muscleMass'),
    cardio: getScore(data.endurance, 'cardioTime')
  }
  const chartData = {
    labels: ['Force', 'Endurance', 'Flexibilité', 'Masse musculaire', 'Cardio'],
    datasets: [
      {
        label: 'Progression',
        data: [scores.strength, scores.endurance, scores.flexibility, scores.muscle, scores.cardio],
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        borderWidth: 2,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        pointLabels: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
        ticks: {
          color: '#9ca3af',
          backdropColor: 'transparent',
        },
        min: 0,
        max: 100,
      },
    },
  }

  return (
    <div className="h-full">
      <Radar data={chartData} options={options} />
    </div>
  )
}