# Sport App

Une application moderne construite avec Next.js 15, TypeScript, Tailwind CSS, Prisma et NextAuth.

## 🚀 Technologies utilisées

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique pour JavaScript
- **Tailwind CSS** - Framework CSS utilitaire
- **Prisma** - ORM moderne pour la base de données
- **NextAuth.js** - Authentification complète
- **SQLite** - Base de données (facilement changeable)

## 📦 Installation

1. **Cloner le projet** (si applicable)
   ```bash
   git clone <url-du-repo>
   cd sport-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env.local
   ```
   
   Modifiez le fichier `.env.local` avec vos propres valeurs :
   - `NEXTAUTH_SECRET` : Générez une clé secrète forte
   - `DATABASE_URL` : URL de votre base de données (SQLite par défaut)
   - Optionnel : Configurez les providers OAuth (Google, GitHub)

4. **Initialiser la base de données**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

   L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🗄️ Base de données

### Commandes Prisma utiles

```bash
# Générer le client Prisma
npm run db:generate

# Pousser les changements vers la DB
npm run db:push

# Créer une migration
npm run db:migrate

# Ouvrir Prisma Studio
npm run db:studio
```

### Modèles de données

Le schéma Prisma inclut :
- **User** : Utilisateurs de l'application
- **Account** : Comptes liés (OAuth)
- **Session** : Sessions utilisateur
- **VerificationToken** : Tokens de vérification

## 🔐 Authentification

L'application utilise NextAuth.js avec :
- **Credentials Provider** : Connexion par email/mot de passe
- **OAuth Providers** : Google et GitHub (à configurer)
- **Adapter Prisma** : Stockage des sessions en base

### Pages d'authentification
- `/auth/signin` : Page de connexion
- `/auth/signup` : Page d'inscription

## 🎨 Styling

Tailwind CSS est configuré avec :
- **Classes utilitaires personnalisées** dans `globals.css`
- **Composants réutilisables** (boutons, inputs, cards)
- **Design responsive** pour mobile et desktop
- **Mode sombre** supporté

## 📁 Structure du projet

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── api/               # Routes API
│   │   └── auth/          # Endpoints d'authentification
│   ├── auth/              # Pages d'authentification
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants réutilisables
│   ├── navbar.tsx         # Barre de navigation
│   └── providers.tsx      # Providers React
├── lib/                   # Utilitaires et configurations
│   ├── auth.ts           # Configuration NextAuth
│   └── prisma.ts         # Client Prisma
└── types/                 # Types TypeScript
    └── next-auth.d.ts     # Types NextAuth
```

## 🚀 Déploiement

### Vercel (recommandé)

1. Connectez votre repository à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Variables d'environnement pour la production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## 🛠️ Développement

### Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linter ESLint
```

### Ajout de nouvelles fonctionnalités

1. **Nouveaux modèles Prisma** : Modifiez `prisma/schema.prisma`
2. **Nouvelles pages** : Ajoutez dans `src/app/`
3. **Nouveaux composants** : Ajoutez dans `src/components/`
4. **Nouvelles API** : Ajoutez dans `src/app/api/`

## 📝 Fonctionnalités incluses

- ✅ Authentification complète (inscription, connexion, déconnexion)
- ✅ Interface utilisateur moderne et responsive
- ✅ Base de données avec Prisma ORM
- ✅ Validation des formulaires
- ✅ Gestion des erreurs
- ✅ Types TypeScript complets
- ✅ Configuration ESLint
- ✅ Styles Tailwind CSS

## 🔄 Prochaines étapes

Pour étendre l'application, vous pouvez ajouter :
- Dashboard utilisateur
- Gestion de profil
- Upload d'images
- API REST complète
- Tests unitaires
- Notifications
- Système de rôles

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la documentation des technologies utilisées
2. Consultez les logs de développement
3. Vérifiez la configuration des variables d'environnement

---

**Bon développement ! 🚀**