import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getDemoMetrics } from '@/lib/demo-data'

// GET /api/metrics - Récupérer les métriques
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // weight, strength, endurance, measurements
    const period = searchParams.get('period') || '3m' // 1m, 3m, 6m, 1y
    const limit = parseInt(searchParams.get('limit') || '50')

    // Calculer la date de début selon la période
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '1m':
        startDate.setMonth(now.getMonth() - 1)
        break
      case '3m':
        startDate.setMonth(now.getMonth() - 3)
        break
      case '6m':
        startDate.setMonth(now.getMonth() - 6)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 3)
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const metrics = await prisma.userMetrics.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate
        }
      },
      orderBy: {
        date: 'asc'
      },
      take: limit
    })

    // Si aucune donnée réelle, retourner des données de démonstration
    if (metrics.length === 0) {
      const demoData = getDemoMetrics(type || undefined, period || undefined)
      return NextResponse.json(demoData)
    }

    // Filtrer selon le type demandé
    let filteredData = metrics
    if (type) {
      filteredData = metrics.filter(metric => {
        switch (type) {
          case 'weight':
            return metric.weight !== null
          case 'strength':
            return metric.benchPress !== null || metric.squat !== null || metric.deadlift !== null
          case 'endurance':
            return metric.cardioTime !== null || metric.distance !== null || metric.vo2Max !== null
          case 'measurements':
            return metric.chest !== null || metric.waist !== null || metric.biceps !== null
          default:
            return true
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: filteredData,
      count: filteredData.length
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des métriques:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des métriques' },
      { status: 500 }
    )
  }
}

// POST /api/metrics - Ajouter une nouvelle métrique
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const {
      date,
      weight,
      bodyFat,
      muscleMass,
      chest,
      waist,
      hips,
      biceps,
      thighs,
      neck,
      benchPress,
      squat,
      deadlift,
      pullUps,
      pushUps,
      cardioTime,
      distance,
      vo2Max,
      restingHR,
      maxHR,
      flexibility,
      notes
    } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    const metric = await prisma.userMetrics.create({
      data: {
        userId: user.id,
        date: date ? new Date(date) : new Date(),
        weight: weight ? parseFloat(weight) : null,
        bodyFat: bodyFat ? parseFloat(bodyFat) : null,
        muscleMass: muscleMass ? parseFloat(muscleMass) : null,
        chest: chest ? parseFloat(chest) : null,
        waist: waist ? parseFloat(waist) : null,
        hips: hips ? parseFloat(hips) : null,
        biceps: biceps ? parseFloat(biceps) : null,
        thighs: thighs ? parseFloat(thighs) : null,
        neck: neck ? parseFloat(neck) : null,
        benchPress: benchPress ? parseFloat(benchPress) : null,
        squat: squat ? parseFloat(squat) : null,
        deadlift: deadlift ? parseFloat(deadlift) : null,
        pullUps: pullUps ? parseInt(pullUps) : null,
        pushUps: pushUps ? parseInt(pushUps) : null,
        cardioTime: cardioTime ? parseInt(cardioTime) : null,
        distance: distance ? parseFloat(distance) : null,
        vo2Max: vo2Max ? parseFloat(vo2Max) : null,
        restingHR: restingHR ? parseInt(restingHR) : null,
        maxHR: maxHR ? parseInt(maxHR) : null,
        flexibility: flexibility || null,
        notes: notes || null
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: metric,
      message: 'Métrique ajoutée avec succès'
    })

  } catch (error) {
    console.error('Erreur lors de l\'ajout de la métrique:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'ajout de la métrique' },
      { status: 500 }
    )
  }
}