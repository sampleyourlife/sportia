import { NextRequest, NextResponse } from 'next/server'

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
    body = await request.json()
    const { query, equipment = [], duration = '45', difficulty = 'intermediate', muscleGroups = [], workoutType = 'single' } = body

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 })
    }

    // Construire le prompt pour OpenRouter
    const prompt = buildWorkoutPrompt(query, equipment, duration, difficulty, muscleGroups, workoutType)

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'FitAI Generator',
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
      workoutData = generateFallbackWorkout(query, workoutType)
    }

    return NextResponse.json(workoutData)

  } catch (error) {
    console.error('Error generating workout:', error)
    
    // Retourner des données de fallback en cas d'erreur
    const fallbackData = generateFallbackWorkout('Entraînement général', 'single')
    return NextResponse.json(fallbackData)
  }
}

function buildWorkoutPrompt(
  query: string,
  equipment: string[],
  duration: string,
  difficulty: string,
  muscleGroups: string[],
  workoutType: 'single' | 'weekly'
): string {
  const equipmentText = equipment.length > 0 ? `Équipements disponibles: ${equipment.join(', ')}` : 'Aucun équipement spécifique'
  const muscleText = muscleGroups.length > 0 ? `Groupes musculaires ciblés: ${muscleGroups.join(', ')}` : 'Tous les groupes musculaires'
  
  if (workoutType === 'weekly') {
    return `Génère un programme d'entraînement hebdomadaire complet de 7 jours basé sur: "${query}"

Paramètres:
- Durée par séance: ${duration} minutes
- Niveau: ${difficulty}
- ${equipmentText}
- ${muscleText}

Crée exactement 7 séances d'entraînement, une pour chaque jour de la semaine (Lundi à Dimanche). Varie les groupes musculaires et les types d'exercices pour un programme équilibré.

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
- ${muscleText}

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

function generateFallbackWorkout(query: string, workoutType: 'single' | 'weekly') {
  if (workoutType === 'weekly') {
    return {
      workouts: [
        {
          id: 'day1',
          name: 'Entraînement Haut du Corps',
          day: 'Lundi',
          exercises: [
            { name: 'Pompes', sets: 3, reps: '10-15', rest: '60s', muscle: 'Pectoraux' },
            { name: 'Tractions', sets: 3, reps: '8-12', rest: '90s', muscle: 'Dos' },
            { name: 'Dips', sets: 3, reps: '10-15', rest: '60s', muscle: 'Triceps' }
          ],
          duration: '45min',
          difficulty: 'intermediate'
        },
        {
          id: 'day2',
          name: 'Entraînement Bas du Corps',
          day: 'Mardi',
          exercises: [
            { name: 'Squats', sets: 4, reps: '15-20', rest: '90s', muscle: 'Quadriceps' },
            { name: 'Fentes', sets: 3, reps: '12 par jambe', rest: '60s', muscle: 'Fessiers' },
            { name: 'Mollets debout', sets: 3, reps: '20-25', rest: '45s', muscle: 'Mollets' }
          ],
          duration: '45min',
          difficulty: 'intermediate'
        },
        {
          id: 'day3',
          name: 'Entraînement Cardio',
          day: 'Mercredi',
          exercises: [
            { name: 'Burpees', sets: 4, reps: '10-12', rest: '90s', muscle: 'Corps entier' },
            { name: 'Mountain Climbers', sets: 3, reps: '30s', rest: '60s', muscle: 'Core' },
            { name: 'Jumping Jacks', sets: 3, reps: '45s', rest: '45s', muscle: 'Corps entier' }
          ],
          duration: '45min',
          difficulty: 'intermediate'
        },
        {
          id: 'day4',
          name: 'Entraînement Épaules et Bras',
          day: 'Jeudi',
          exercises: [
            { name: 'Développé militaire', sets: 3, reps: '10-12', rest: '90s', muscle: 'Épaules' },
            { name: 'Curl biceps', sets: 3, reps: '12-15', rest: '60s', muscle: 'Biceps' },
            { name: 'Extensions triceps', sets: 3, reps: '12-15', rest: '60s', muscle: 'Triceps' }
          ],
          duration: '45min',
          difficulty: 'intermediate'
        },
        {
          id: 'day5',
          name: 'Entraînement Full Body',
          day: 'Vendredi',
          exercises: [
            { name: 'Deadlifts', sets: 3, reps: '8-10', rest: '2min', muscle: 'Dos' },
            { name: 'Squats', sets: 3, reps: '12-15', rest: '90s', muscle: 'Quadriceps' },
            { name: 'Pompes', sets: 3, reps: '10-15', rest: '60s', muscle: 'Pectoraux' }
          ],
          duration: '45min',
          difficulty: 'intermediate'
        },
        {
          id: 'day6',
          name: 'Entraînement Core et Flexibilité',
          day: 'Samedi',
          exercises: [
            { name: 'Planche', sets: 3, reps: '45-60s', rest: '60s', muscle: 'Core' },
            { name: 'Crunches', sets: 3, reps: '20-25', rest: '45s', muscle: 'Abdominaux' },
            { name: 'Étirements', sets: 1, reps: '10min', rest: '0s', muscle: 'Corps entier' }
          ],
          duration: '45min',
          difficulty: 'intermediate'
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
          duration: '45min',
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
          { name: 'Burpees', sets: 3, reps: '10-12', rest: '90s', muscle: 'Corps entier' },
          { name: 'Pompes', sets: 3, reps: '12-15', rest: '60s', muscle: 'Pectoraux' },
          { name: 'Squats', sets: 3, reps: '15-20', rest: '60s', muscle: 'Quadriceps' },
          { name: 'Planche', sets: 3, reps: '30-45s', rest: '60s', muscle: 'Core' }
        ],
        duration: '30min',
        difficulty: 'intermediate'
      }
    }
  }
}