import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

interface WorkoutRequest {
  query: string
  equipment?: string[]
  duration?: string
  difficulty?: string
  muscleGroups?: string[]
  workoutType?: 'single' | 'weekly'
}

export async function POST(request: NextRequest) {
  let body: WorkoutRequest
  try {
    // Récupérer la session utilisateur
    const session = await getServerSession(authOptions)
    
    body = await request.json()
    const { query, equipment = [], duration = '45', difficulty = 'intermediate', muscleGroups = [], workoutType = 'single' } = body

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 })
    }

    // Récupérer le profil utilisateur si connecté
    let userProfile = null
    if (session?.user?.email) {
      try {
        userProfile = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: { profile: true }
        })
      } catch (error) {
        console.log('Erreur lors de la récupération du profil:', error)
        // Continuer sans le profil si erreur
      }
    }

    // Construire le prompt pour OpenRouter avec les données de profil
    const prompt = buildWorkoutPrompt(query, equipment, duration, difficulty, muscleGroups, workoutType, userProfile || undefined)

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'StrategIA Generator',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3-14b:free',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en fitness et nutrition. Tu génères des programmes d\'entraînement personnalisés au format JSON strict. Tous les noms d\'exercices et descriptions doivent être en français. Réponds UNIQUEMENT avec du JSON valide, sans texte supplémentaire.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parser la réponse JSON de l'IA
    let workoutData
    try {
      workoutData = JSON.parse(aiResponse)
    } catch (error) {
      // Si le parsing échoue, utiliser des données de fallback
      workoutData = generateFallbackWorkout(query, workoutType, duration, difficulty)
    }

    return NextResponse.json(workoutData)

  } catch (error) {
    console.error('Error generating workout:', error)
    
    // Retourner des données de fallback en cas d'erreur
    const fallbackData = generateFallbackWorkout('Entraînement général', 'single', '45', 'intermediate')
    return NextResponse.json(fallbackData)
  }
}

interface UserProfile {
  age?: number | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;
  weight?: number | null;
  height?: number | null;
  experienceLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT' | null;
  activityLevel?: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE' | null;
  fitnessGoals?: ('WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'STRENGTH' | 'ENDURANCE' | 'FLEXIBILITY' | 'GENERAL_FITNESS' | 'SPORT_SPECIFIC' | 'REHABILITATION')[] | null;
  medicalConditions?: string | null;
}

function buildWorkoutPrompt(
  query: string,
  equipment: string[],
  duration: string,
  difficulty: string,
  muscleGroups: string[],
  workoutType: 'single' | 'weekly',
  userProfile?: UserProfile
): string {
  const equipmentText = equipment.length > 0 ? `Équipements disponibles: ${equipment.join(', ')}` : 'Aucun équipement spécifique'
  const muscleText = muscleGroups.length > 0 ? `Groupes musculaires ciblés: ${muscleGroups.join(', ')}` : 'Tous les groupes musculaires'
  
  // Construire les informations de profil utilisateur
  let profileText = ''
  if (userProfile) {
    const profileInfo = []
    
    if (userProfile.age) profileInfo.push(`Âge: ${userProfile.age} ans`)
    if (userProfile.gender) {
      const genderMap = {
        'MALE': 'Homme',
        'FEMALE': 'Femme',
        'OTHER': 'Autre',
        'PREFER_NOT_TO_SAY': 'Non spécifié'
      }
      profileInfo.push(`Genre: ${genderMap[userProfile.gender as keyof typeof genderMap] || userProfile.gender}`)
    }
    if (userProfile.weight) profileInfo.push(`Poids: ${userProfile.weight} kg`)
    if (userProfile.height) profileInfo.push(`Taille: ${userProfile.height} cm`)
    
    if (userProfile.experienceLevel) {
      const experienceMap = {
        'BEGINNER': 'Débutant (0-6 mois)',
        'INTERMEDIATE': 'Intermédiaire (6 mois - 2 ans)',
        'ADVANCED': 'Avancé (2+ ans)',
        'EXPERT': 'Expert (5+ ans)'
      }
      profileInfo.push(`Niveau d'expérience: ${experienceMap[userProfile.experienceLevel as keyof typeof experienceMap] || userProfile.experienceLevel}`)
    }
    
    if (userProfile.activityLevel) {
      const activityMap = {
        'SEDENTARY': 'Sédentaire',
        'LIGHTLY_ACTIVE': 'Légèrement actif',
        'MODERATELY_ACTIVE': 'Modérément actif',
        'VERY_ACTIVE': 'Très actif',
        'EXTREMELY_ACTIVE': 'Extrêmement actif'
      }
      profileInfo.push(`Niveau d'activité: ${activityMap[userProfile.activityLevel as keyof typeof activityMap] || userProfile.activityLevel}`)
    }
    
    if (userProfile.fitnessGoals && userProfile.fitnessGoals.length > 0) {
      const goalMap = {
        'WEIGHT_LOSS': 'Perte de poids',
        'MUSCLE_GAIN': 'Prise de masse musculaire',
        'STRENGTH': 'Gain de force',
        'ENDURANCE': 'Endurance cardiovasculaire',
        'FLEXIBILITY': 'Flexibilité et mobilité',
        'GENERAL_FITNESS': 'Forme générale',
        'SPORT_SPECIFIC': 'Performance sportive',
        'REHABILITATION': 'Rééducation'
      }
      const goals = userProfile.fitnessGoals.map((goal: string) => goalMap[goal as keyof typeof goalMap] || goal).join(', ')
      profileInfo.push(`Objectifs: ${goals}`)
    }
    
    if (userProfile.medicalConditions) {
      profileInfo.push(`Conditions médicales/limitations: ${userProfile.medicalConditions}`)
    }
    
    // Calculer l'IMC si possible
    if (userProfile.weight && userProfile.height) {
      const heightInM = userProfile.height / 100
      const bmi = (userProfile.weight / (heightInM * heightInM)).toFixed(1)
      profileInfo.push(`IMC: ${bmi}`)
    }
    
    if (profileInfo.length > 0) {
      profileText = `\n\nPROFIL UTILISATEUR:\n${profileInfo.join('\n')}`
    }
  }
  
  if (workoutType === 'weekly') {
    return `Génère un programme d'entraînement hebdomadaire complet de 7 jours basé sur: "${query}"

Paramètres:
- Durée par séance: ${duration} minutes
- Niveau: ${difficulty}
- ${equipmentText}
- ${muscleText}${profileText}

Crée exactement 7 séances d'entraînement, une pour chaque jour de la semaine (Lundi à Dimanche). Varie les groupes musculaires et les types d'exercices pour un programme équilibré.

IMPORTANT: Adapte l'entraînement selon le profil utilisateur:
- Respecte les objectifs fitness mentionnés
- Tiens compte du niveau d'expérience et d'activité
- Adapte l'intensité selon l'âge et la condition physique
- Évite les exercices contre-indiqués selon les conditions médicales
- Utilise l'IMC pour ajuster l'intensité cardiovasculaire

Adapte le nombre de sets selon le niveau:
- Débutant: 2-3 sets
- Intermédiaire: 3-4 sets  
- Avancé: 4-5 sets

Format JSON requis:
{
  "workouts": [
    {
      "id": "day1",
      "name": "Nom de la séance",
      "day": "Lundi",
      "exercises": [
        {
          "name": "Nom de l'exercice",
          "sets": 3,
          "reps": "12-15",
          "rest": "60s",
          "muscle": "Groupe musculaire"
        }
      ],
      "duration": "${duration}min",
      "difficulty": "${difficulty}"
    }
  ]
}`
  } else {
    return `Génère une séance d'entraînement basée sur: "${query}"

Paramètres:
- Durée: ${duration} minutes
- Niveau: ${difficulty}
- ${equipmentText}
- ${muscleText}${profileText}

IMPORTANT: Adapte l'entraînement selon le profil utilisateur:
- Respecte les objectifs fitness mentionnés
- Tiens compte du niveau d'expérience et d'activité
- Adapte l'intensité selon l'âge et la condition physique
- Évite les exercices contre-indiqués selon les conditions médicales
- Utilise l'IMC pour ajuster l'intensité cardiovasculaire

Adapte le nombre de sets selon le niveau:
- Débutant: 2-3 sets
- Intermédiaire: 3-4 sets
- Avancé: 4-5 sets

Format JSON requis:
{
  "workout": {
    "id": "single",
    "name": "Nom de la séance",
    "exercises": [
      {
        "name": "Nom de l'exercice",
        "sets": 3,
        "reps": "12-15",
        "rest": "60s",
        "muscle": "Groupe musculaire"
      }
    ],
    "duration": "${duration}min",
    "difficulty": "${difficulty}"
  }
}`
  }
}

function generateFallbackWorkout(query: string, workoutType: 'single' | 'weekly', duration: string = '45', difficulty: string = 'intermediate') {
  // Adapter le nombre de sets selon la difficulté
  const getBaseSets = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'débutant':
      case 'beginner':
        return 2;
      case 'avancé':
      case 'advanced':
        return 4;
      default: // intermédiaire/intermediate
        return 3;
    }
  };

  const baseSets = getBaseSets(difficulty);

  if (workoutType === 'weekly') {
    return {
      workouts: [
        {
          id: 'day1',
          name: 'Entraînement Haut du Corps',
          day: 'Lundi',
          exercises: [
            { name: 'Pompes', sets: baseSets, reps: '10-15', rest: '60s', muscle: 'Pectoraux' },
            { name: 'Tractions', sets: baseSets, reps: '8-12', rest: '90s', muscle: 'Dos' },
            { name: 'Dips', sets: baseSets, reps: '10-15', rest: '60s', muscle: 'Triceps' }
          ],
          duration: `${duration}min`,
          difficulty: difficulty
        },
        {
          id: 'day2',
          name: 'Entraînement Bas du Corps',
          day: 'Mardi',
          exercises: [
            { name: 'Squats', sets: baseSets + 1, reps: '15-20', rest: '90s', muscle: 'Quadriceps' },
            { name: 'Fentes', sets: baseSets, reps: '12 par jambe', rest: '60s', muscle: 'Fessiers' },
            { name: 'Mollets debout', sets: baseSets, reps: '20-25', rest: '45s', muscle: 'Mollets' }
          ],
          duration: `${duration}min`,
          difficulty: difficulty
        },
        {
          id: 'day3',
          name: 'Entraînement Cardio',
          day: 'Mercredi',
          exercises: [
            { name: 'Burpees', sets: baseSets + 1, reps: '10-12', rest: '90s', muscle: 'Corps entier' },
            { name: 'Mountain Climbers', sets: baseSets, reps: '30s', rest: '60s', muscle: 'Core' },
            { name: 'Jumping Jacks', sets: baseSets, reps: '45s', rest: '45s', muscle: 'Corps entier' }
          ],
          duration: `${duration}min`,
          difficulty: difficulty
        },
        {
          id: 'day4',
          name: 'Entraînement Épaules et Bras',
          day: 'Jeudi',
          exercises: [
            { name: 'Développé militaire', sets: baseSets, reps: '10-12', rest: '90s', muscle: 'Épaules' },
            { name: 'Curl biceps', sets: baseSets, reps: '12-15', rest: '60s', muscle: 'Biceps' },
            { name: 'Extensions triceps', sets: baseSets, reps: '12-15', rest: '60s', muscle: 'Triceps' }
          ],
          duration: `${duration}min`,
          difficulty: difficulty
        },
        {
          id: 'day5',
          name: 'Entraînement Full Body',
          day: 'Vendredi',
          exercises: [
            { name: 'Deadlifts', sets: baseSets, reps: '8-10', rest: '2min', muscle: 'Dos' },
            { name: 'Squats', sets: baseSets, reps: '12-15', rest: '90s', muscle: 'Quadriceps' },
            { name: 'Pompes', sets: baseSets, reps: '10-15', rest: '60s', muscle: 'Pectoraux' }
          ],
          duration: `${duration}min`,
          difficulty: difficulty
        },
        {
          id: 'day6',
          name: 'Entraînement Core et Flexibilité',
          day: 'Samedi',
          exercises: [
            { name: 'Planche', sets: baseSets, reps: '45-60s', rest: '60s', muscle: 'Core' },
            { name: 'Crunches', sets: baseSets, reps: '20-25', rest: '45s', muscle: 'Abdominaux' },
            { name: 'Étirements', sets: 1, reps: '10min', rest: '0s', muscle: 'Corps entier' }
          ],
          duration: `${duration}min`,
          difficulty: difficulty
        },
        {
          id: 'day7',
          name: 'Récupération Active',
          day: 'Dimanche',
          exercises: [
            { name: 'Marche rapide', sets: 1, reps: '20min', rest: '0s', muscle: 'Corps entier' },
            { name: 'Yoga doux', sets: 1, reps: '15min', rest: '0s', muscle: 'Corps entier' },
            { name: 'Étirements profonds', sets: 1, reps: '10min', rest: '0s', muscle: 'Corps entier' }
          ],
          duration: `${duration}min`,
          difficulty: 'beginner'
        }
      ]
    }
  } else {
    return {
      workout: {
        id: 'single',
        name: 'Entraînement Complet',
        exercises: [
          { name: 'Burpees', sets: baseSets, reps: '10-12', rest: '90s', muscle: 'Corps entier' },
          { name: 'Pompes', sets: baseSets, reps: '12-15', rest: '60s', muscle: 'Pectoraux' },
          { name: 'Squats', sets: baseSets + 1, reps: '15-20', rest: '60s', muscle: 'Quadriceps' },
          { name: 'Planche', sets: baseSets, reps: '30-45s', rest: '60s', muscle: 'Core' }
        ],
        duration: `${duration}min`,
        difficulty: difficulty
      }
    }
  }
}