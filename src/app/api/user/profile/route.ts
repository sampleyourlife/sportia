import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profile: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Retourner les données de profil
    const profileData = {
      age: user.age,
      gender: user.gender,
      weight: user.weight,
      height: user.height,
      experienceLevel: user.experienceLevel,
      fitnessGoals: user.fitnessGoals,
      activityLevel: user.activityLevel,
      medicalConditions: user.medicalConditions,
      preferences: user.preferences,
      profile: user.profile
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const {
      age,
      gender,
      weight,
      height,
      experienceLevel,
      fitnessGoals,
      activityLevel,
      medicalConditions,
      preferences
    } = body

    // Validation des données
    if (age && (age < 13 || age > 100)) {
      return NextResponse.json({ error: 'Âge invalide' }, { status: 400 })
    }

    if (weight && (weight < 30 || weight > 300)) {
      return NextResponse.json({ error: 'Poids invalide' }, { status: 400 })
    }

    if (height && (height < 100 || height > 250)) {
      return NextResponse.json({ error: 'Taille invalide' }, { status: 400 })
    }

    const validGenders = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']
    if (gender && !validGenders.includes(gender)) {
      return NextResponse.json({ error: 'Genre invalide' }, { status: 400 })
    }

    const validExperienceLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']
    if (experienceLevel && !validExperienceLevels.includes(experienceLevel)) {
      return NextResponse.json({ error: 'Niveau d\'expérience invalide' }, { status: 400 })
    }

    const validActivityLevels = ['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTREMELY_ACTIVE']
    if (activityLevel && !validActivityLevels.includes(activityLevel)) {
      return NextResponse.json({ error: 'Niveau d\'activité invalide' }, { status: 400 })
    }

    const validFitnessGoals = ['WEIGHT_LOSS', 'MUSCLE_GAIN', 'STRENGTH', 'ENDURANCE', 'FLEXIBILITY', 'GENERAL_FITNESS', 'SPORT_SPECIFIC', 'REHABILITATION']
    if (fitnessGoals && Array.isArray(fitnessGoals)) {
      const invalidGoals = fitnessGoals.filter(goal => !validFitnessGoals.includes(goal))
      if (invalidGoals.length > 0) {
        return NextResponse.json({ error: 'Objectifs fitness invalides' }, { status: 400 })
      }
    }

    // Mettre à jour le profil utilisateur
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        age: age || null,
        gender: gender || null,
        weight: weight || null,
        height: height || null,
        experienceLevel: experienceLevel || null,
        fitnessGoals: fitnessGoals || [],
        activityLevel: activityLevel || null,
        medicalConditions: medicalConditions || null,
        preferences: preferences || null
      },
      include: {
        profile: true
      }
    })

    // Calculer l'IMC si poids et taille sont disponibles
    let bmi = null
    if (updatedUser.weight && updatedUser.height) {
      const heightInM = updatedUser.height / 100
      bmi = updatedUser.weight / (heightInM * heightInM)
    }

    // Retourner les données mises à jour
    const responseData = {
      age: updatedUser.age,
      gender: updatedUser.gender,
      weight: updatedUser.weight,
      height: updatedUser.height,
      experienceLevel: updatedUser.experienceLevel,
      fitnessGoals: updatedUser.fitnessGoals,
      activityLevel: updatedUser.activityLevel,
      medicalConditions: updatedUser.medicalConditions,
      preferences: updatedUser.preferences,
      profile: updatedUser.profile,
      calculatedBMI: bmi ? parseFloat(bmi.toFixed(1)) : null
    }

    return NextResponse.json({
      message: 'Profil mis à jour avec succès',
      profile: responseData
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// Route pour créer ou mettre à jour le profil détaillé (UserProfile)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const {
      bodyFatPercentage,
      muscleMass,
      workoutHistory,
      progressPhotos,
      measurements
    } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Créer ou mettre à jour le profil détaillé
    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        bodyFatPercentage: bodyFatPercentage || null,
        muscleMass: muscleMass || null,
        workoutHistory: workoutHistory || null,
        progressPhotos: progressPhotos || [],
        measurements: measurements || null
      },
      create: {
        userId: user.id,
        bodyFatPercentage: bodyFatPercentage || null,
        muscleMass: muscleMass || null,
        workoutHistory: workoutHistory || null,
        progressPhotos: progressPhotos || [],
        measurements: measurements || null
      }
    })

    return NextResponse.json({
      message: 'Profil détaillé mis à jour avec succès',
      profile
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil détaillé:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}