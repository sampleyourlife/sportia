import { NextRequest, NextResponse } from 'next/server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

const COACH_SYSTEM_PROMPT = `Tu es un coach virtuel spécialisé en sport, nutrition, récupération, bien-être et développement mental.
Ton objectif est d'accompagner l'utilisateur de manière personnalisée vers ses objectifs (perte de poids, prise de muscle, tonification, performance sportive, bien-être global).

Tu es capable de répondre à plusieurs types de demandes :

✅ 1. Exercices et entraînements
- Expliquer des exercices (muscles ciblés, exécution correcte, erreurs à éviter)
- Donner des routines selon objectifs : prise de muscle, sèche, cardio, HIIT, mobilité, etc.
- Suggérer des variantes pour adapter selon le matériel ou le niveau
- Proposer des programmes complets (par jour, par semaine)

✅ 2. Nutrition
- Conseiller des repas équilibrés, collation pré/post entraînement
- Calculer les besoins caloriques (approximatif) selon l'objectif
- Donner des idées de recettes rapides et saines
- Adapter les conseils aux préférences (végétarien, végan, allergies)

✅ 3. Récupération et prévention des blessures
- Conseiller sur le sommeil, les étirements, massages, automassages
- Donner des routines de mobilité articulaire
- Conseiller sur les micronutriments importants pour la récupération
- Expliquer comment éviter les blessures courantes

✅ 4. Motivation et mental
- Utiliser des citations inspirantes, encourager
- Donner des techniques de discipline mentale (visualisation, objectifs SMART)
- Proposer des défis hebdomadaires pour garder la motivation
- Personnaliser les encouragements selon le profil utilisateur

✅ 5. Suivi personnalisé
- Poser des questions pour adapter les conseils : âge, objectif, fréquence d'entraînement, contraintes alimentaires
- Être capable de proposer un ajustement du programme si l'utilisateur signale de la fatigue ou une blessure

✅ 6. Questions spéciales
- Répondre à des questions spécifiques : prise de compléments, calcul macros, gestion plateau de progression
- Donner des conseils bien-être général (gestion du stress, posture quotidienne)

✅ 7. Partie "Urgence"
- Réagir en cas de doute sur une douleur suspecte avec un message de prudence : "Je ne suis pas médecin, si la douleur est vive, consulte un professionnel de santé."

🎯 Ton : Professionnel, motivant, accessible. Bienveillance + exigence, comme un bon coach.
Pose des questions quand nécessaire pour personnaliser tes réponses. Privilégie les explications simples, pratiques et actionnables.

Réponds toujours en français et utilise des emojis pour rendre tes réponses plus engageantes. Garde tes réponses concises mais complètes (maximum 300 mots par réponse).`

function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  // Réponses variées pour les exercices
  if (lowerMessage.includes('exercice') || lowerMessage.includes('entraînement') || lowerMessage.includes('musculation')) {
    const exerciseResponses = [
      `💪 Super ! Parlons entraînement !\n\nQuel type d'exercice t'intéresse ?\n• **Force** : squats, deadlifts, développé couché\n• **Cardio** : course, vélo, rameur, HIIT\n• **Mobilité** : yoga, étirements, pilates\n• **Fonctionnel** : kettlebell, poids du corps\n\nDis-moi ton objectif et ton niveau, je t'aiderai à choisir ! 🎯`,
      `🏋️ Excellente question sur l'entraînement !\n\nPour te donner les meilleurs conseils :\n• Quel est ton objectif ? (muscle, cardio, force...)\n• Ton niveau actuel ?\n• Matériel disponible ?\n• Temps par séance ?\n\n**Conseil du jour** : La régularité bat l'intensité ! Mieux vaut 3x20min par semaine que 1x60min ! 📅\n\nRaconte-moi ta situation ! 💬`,
      `💪 J'adore parler sport !\n\n**Règles d'or de l'entraînement** :\n• Échauffement = obligatoire (5-10min)\n• Progression graduelle\n• Récupération = partie de l'entraînement\n• Technique > charge\n\nQue veux-tu travailler aujourd'hui ? Dis-moi tout ! 🚀`
    ]
    return exerciseResponses[Math.floor(Math.random() * exerciseResponses.length)]
  }
  
  // Réponses variées pour la nutrition
  if (lowerMessage.includes('nutrition') || lowerMessage.includes('alimentation') || lowerMessage.includes('repas') || lowerMessage.includes('manger')) {
    const nutritionResponses = [
      `🥗 Parlons nutrition ! C'est 70% de tes résultats !\n\n**Les bases** :\n• Protéines : 1,6-2,2g/kg de poids\n• Glucides : ton carburant principal\n• Lipides : 20-30% des calories\n• Eau : 35ml/kg de poids minimum\n\n**Question** : Quel est ton objectif nutritionnel ? Prise de masse, sèche, ou maintien ? 🎯`,
      `🍎 Super question sur l'alimentation !\n\n**Timing des repas** ⏰\n• Petit-déj : protéines + glucides\n• Pré-training : glucides 1-2h avant\n• Post-training : protéines dans les 30min\n• Dîner : léger, riche en protéines\n\nDis-moi tes habitudes actuelles, on peut optimiser ! 💪`,
      `🥘 J'adore parler nutrition !\n\n**Aliments stars** ⭐\n• Protéines : œufs, poulet, poisson, légumineuses\n• Glucides : avoine, riz, patates douces\n• Lipides : avocat, noix, huile d'olive\n\nTu as des restrictions alimentaires ? Végé, allergies ? Je m'adapte ! 🌱`
    ]
    return nutritionResponses[Math.floor(Math.random() * nutritionResponses.length)]
  }
  
  // Réponses pour la récupération
  if (lowerMessage.includes('récupération') || lowerMessage.includes('repos') || lowerMessage.includes('sommeil') || lowerMessage.includes('étirement')) {
    return `😴 La récupération, c'est 50% de tes résultats !\n\n**Les piliers de la récupération** :\n• **Sommeil** : 7-9h par nuit, qualité > quantité\n• **Nutrition** : protéines pour la réparation musculaire\n• **Hydratation** : aide à éliminer les toxines\n• **Étirements** : 10-15min après chaque séance\n\n**Techniques avancées** 🔧\n• Automassages avec rouleau\n• Bains froids/chauds alternés\n• Méditation ou relaxation\n• Jour de repos actif (marche, yoga léger)\n\n**Signaux d'alarme** ⚠️\nFatigue persistante, baisse de performance, irritabilité = il faut ralentir !\n\nAs-tu des problèmes spécifiques de récupération ? Je peux t'aider à optimiser ! 🎯`
  }
  
  // Réponses pour la motivation
  if (lowerMessage.includes('motivation') || lowerMessage.includes('difficile') || lowerMessage.includes('abandonner') || lowerMessage.includes('démotivé')) {
    return `🔥 Je comprends, on passe tous par des moments difficiles !\n\n**Rappelle-toi pourquoi tu as commencé** 💭\nTon "pourquoi" est plus fort que ton "comment". Visualise-toi dans 6 mois si tu continues !\n\n**Stratégies qui marchent** :\n• **Objectifs SMART** : spécifiques, mesurables, atteignables\n• **Petites victoires** : célèbre chaque progrès\n• **Routine** : même 15min valent mieux que 0\n• **Communauté** : entoure-toi de personnes motivées\n\n**Citation du jour** ✨\n"Le succès, c'est tomber 7 fois et se relever 8 fois"\n\n**Défi de la semaine** 🎯\nFixe-toi UN petit objectif pour cette semaine. Lequel choisis-tu ?\n\nTu n'es pas seul(e) dans cette aventure ! 💪`
  }
  
  // Réponses générales variées
  const generalResponses = [
    `👋 Salut ! Je suis ton coach IA et je suis là pour t'accompagner !\n\nJe peux t'aider avec :\n• 💪 **Entraînements** personnalisés\n• 🥗 **Nutrition** adaptée à tes objectifs\n• 😴 **Récupération** optimisée\n• 🧠 **Motivation** et mental\n• 📊 **Suivi** de tes progrès\n\nPour te donner les meilleurs conseils, peux-tu me dire :\n• Quel est ton objectif principal ?\n• Ton niveau actuel en sport ?\n• Ce qui te pose le plus de difficultés ?\n\nPlus tu me donnes d'infos, plus je peux personnaliser mes conseils ! 🎯\n\nAlors, par quoi on commence ? 🚀`,
    `🔥 Hey ! Prêt(e) à transformer tes habitudes ?\n\n**Mes spécialités** :\n• Programmes d'entraînement sur mesure\n• Plans nutritionnels équilibrés\n• Techniques de récupération\n• Coaching mental et motivation\n\n**Dis-moi** : Tu débutes ou tu veux optimiser tes résultats ? Quel est ton défi actuel ? 💪\n\nJe suis là pour t'aider à réussir ! ⭐`,
    `💪 Salut champion(ne) !\n\nQue tu sois débutant(e) ou confirmé(e), je suis là pour t'accompagner vers tes objectifs !\n\n**Aujourd'hui, on peut parler de** :\n• Ton programme d'entraînement\n• Tes habitudes alimentaires\n• Ta récupération\n• Tes blocages ou motivations\n\nQu'est-ce qui t'amène ? Raconte-moi ! 🎯`
  ]
  return generalResponses[Math.floor(Math.random() * generalResponses.length)]
}

export async function POST(request: NextRequest) {
  try {
    const { message, userId, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message requis' },
        { status: 400 }
      )
    }

    console.log('Chatbot API appelée avec:', { message, userId, hasHistory: !!conversationHistory })

    // Si pas de clé API, utiliser la réponse de fallback
    if (!OPENROUTER_API_KEY) {
      console.log('Pas de clé API OpenRouter, utilisation du fallback')
      const fallbackResponse = generateFallbackResponse(message)
      return NextResponse.json({ response: fallbackResponse })
    }

    // Construire l'historique des messages
    const messages = [
      {
        role: 'system',
        content: COACH_SYSTEM_PROMPT
      }
    ]

    // Ajouter l'historique de conversation s'il existe
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: any) => {
        if (msg.isUser) {
          messages.push({ role: 'user', content: msg.content })
        } else {
          messages.push({ role: 'assistant', content: msg.content })
        }
      })
    }

    // Ajouter le message actuel
    messages.push({
      role: 'user',
      content: message
    })

    console.log('Envoi à OpenRouter avec', messages.length, 'messages')

    // Appel à l'API OpenRouter
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'StrategIA Coach'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3-14b:free',
        messages: messages,
        max_tokens: 800,
        temperature: 0.8
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erreur API OpenRouter:', response.status, response.statusText, errorText)
      const fallbackResponse = generateFallbackResponse(message)
      return NextResponse.json({ response: fallbackResponse })
    }

    const data = await response.json()
    console.log('Données reçues d\'OpenRouter:', JSON.stringify(data, null, 2))
    
    const aiResponse = data.choices?.[0]?.message?.content
    const reasoning = data.choices?.[0]?.message?.reasoning
    
    console.log('Contenu de la réponse IA:', aiResponse)
    console.log('Reasoning de la réponse IA:', reasoning)

    if (!aiResponse || aiResponse.trim() === '') {
      console.error('Réponse IA vide ou nulle:', data)
      // Si on a du reasoning mais pas de content, utiliser le reasoning
      if (reasoning && reasoning.trim() !== '') {
        console.log('Utilisation du reasoning comme réponse')
        return NextResponse.json({ response: reasoning })
      }
      const fallbackResponse = generateFallbackResponse(message)
      return NextResponse.json({ response: fallbackResponse })
    }

    console.log('Réponse IA reçue:', aiResponse.substring(0, 100) + '...')
    return NextResponse.json({ response: aiResponse })

  } catch (error) {
    console.error('Erreur chatbot:', error)
    const fallbackResponse = generateFallbackResponse('erreur')
    return NextResponse.json({ response: fallbackResponse })
  }
}