# Canal+ Mobile App

Application mobile Flutter pour Canal+ Tchad avec authentification par téléphone et gestion des abonnements.

## 🚀 Fonctionnalités

- **Authentification par téléphone** (+235 Tchad)
- **Inscription et connexion sécurisées**
- **Réinitialisation de mot de passe par SMS**
- **Interface utilisateur moderne** avec thème Canal+
- **Formatage automatique** des numéros de téléphone
- **Navigation sécurisée** avec GoRouter

## 🛠 Technologies

- **Flutter** 3.x
- **Dart** 3.x
- **Supabase** (Backend & Base de données)
- **GoRouter** (Navigation)
- **Riverpod** (State Management)
- **SHA-256** (Hachage des mots de passe)

## 📱 Pages Implémentées

- **Splash Screen** - Écran de démarrage
- **Login** - Connexion par téléphone/décodeur
- **Register** - Inscription avec validation
- **Forgot Password** - Récupération mot de passe
- **SMS Verification** - Validation code SMS (111111)
- **Reset Password** - Nouveau mot de passe
- **Home** - Dashboard principal

## 🔧 Installation

### Prérequis
- Flutter SDK 3.x
- Dart SDK 3.x
- Android Studio / VS Code
- Git

### Configuration
```bash
# Cloner le repository
git clone https://github.com/votre-username/canal-plus-mobile.git
cd canal-plus-mobile

# Installer les dépendances
flutter pub get

# Lancer l'application
flutter run
```

### Configuration Supabase
1. Créer un projet sur [Supabase](https://supabase.com)
2. Configurer les clés dans `lib/core/config/supabase_config.dart`
3. Exécuter le script SQL pour créer les tables

## 📊 Base de Données

### Tables Principales
- **user_profiles** - Profils utilisateurs
- **auth_sessions** - Sessions d'authentification
- **sms_codes** - Codes de vérification SMS

### Schéma SQL
```sql
-- Voir database_schema.sql pour le schéma complet
```

## 🎨 Design System

### Couleurs Canal+
- **Primary**: Orange Canal+ (#FF6B00)
- **Secondary**: Noir Canal+ (#000000)
- **Background**: Blanc (#FFFFFF)
- **Text**: Gris foncé (#333333)

### Composants
- **AuthHeader** - En-tête avec logo et navigation
- **CustomTextField** - Champs de saisie personnalisés
- **ToggleSwitch** - Commutateur téléphone/décodeur
- **PhoneFormatter** - Formatage automatique numéros

## 🔐 Sécurité

- **Hachage SHA-256** des mots de passe
- **Validation côté client et serveur**
- **Normalisation des numéros** de téléphone
- **Sessions sécurisées** avec Supabase
- **Protection RLS** sur les données

## 📞 Authentification

### Format Numéros Tchad
- **Saisie**: `91912191`
- **Affichage**: `91 91 21 91`
- **Stockage**: `+23591912191`

### Code SMS Test
- **Code fixe**: `111111`
- **Production**: Intégration Twilio/Firebase

## 🚀 Déploiement

### Web (Flutter Web)
```bash
flutter build web
# Déployer sur Netlify/Vercel
```

### Mobile (APK)
```bash
flutter build apk --release
```

### CI/CD GitHub Actions
- **Auto-deploy** sur push main
- **Tests automatiques**
- **Build multi-plateforme**

## 📝 Développement

### Structure du Projet
```
lib/
├── core/           # Configuration et services
├── features/       # Fonctionnalités par module
│   └── auth/       # Authentification
└── main.dart       # Point d'entrée
```

### Commandes Utiles
```bash
# Tests
flutter test

# Analyse du code
flutter analyze

# Formatage
dart format .

# Build
flutter build web
flutter build apk
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Email**: support@canalplus.td
- **Téléphone**: +235 XX XX XX XX
- **Documentation**: [Wiki du projet](https://github.com/votre-username/canal-plus-mobile/wiki)

## 🔄 Changelog

### v1.0.0 (2025-01-23)
- ✅ Authentification par téléphone
- ✅ Formatage automatique numéros
- ✅ Réinitialisation mot de passe
- ✅ Interface utilisateur complète
- ✅ Navigation sécurisée
- ✅ Intégration Supabase

---

**Développé avec ❤️ pour Canal+ Tchad**
