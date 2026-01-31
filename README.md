# 🐔 LA FERME AUX AILES - APPLICATION AUDIO

Application Progressive Web App (PWA) pour accompagner le guide pratique d'élevage de poules pondeuses.

## 📦 CONTENU DE L'APPLICATION

### 12 Audios de Formation Professionnelle

**PARTIE 1 : PREMIERS PAS (3 audios)**
- Audio 01 : Précision sur les 10 commandements
- Audio 02 : Recommandation de fiche
- Audio 03 : L'introduction

**PARTIE 2 : BÂTIMENT DES POULES (2 audios)**
- Audio 04 : La construction du poulailler
- Audio 05 : Contrôle qualité à la réception

**PARTIE 3 : ALIMENTATION (4 audios)**
- Audio 06 : Alimentation 1er âge
- Audio 07 : Alimentation 2ème âge
- Audio 08 : Alimentation 3ème âge (entrée en ponte)
- Audio 09 : Calcul de ratio alimentaire

**PARTIE 4 : PROPHYLAXIE (2 audios)**
- Audio 10 : La Prophylaxie vétérinaire
- Audio 11 : Les fiches de suivi

**ANNEXE (1 audio)**
- Audio 12 : Conclusion

---

## ✨ FONCTIONNALITÉS

✅ **12 audios professionnels** avec voix de qualité  
✅ **3 vitesses d'écoute** : Lent 🐢 | Normal ▶️ | Rapide 🐰  
✅ **Lecture en boucle** pour mieux mémoriser  
✅ **Fonctionne 100% HORS LIGNE** après installation  
✅ **Navigation par catégories** pour trouver rapidement  
✅ **Conseils pratiques** pour chaque audio  
✅ **Design adapté agriculture** (couleurs vertes/naturelles)  
✅ **Installable** comme une vraie application mobile  

---

## 📋 STRUCTURE DES FICHIERS

```
la-ferme-aux-ailes/
├── index.html          # Page principale
├── style.css           # Styles (thème vert agriculture)
├── app.js              # Logique de l'application
├── data.js             # Base de données des 12 audios
├── manifest.json       # Configuration PWA
├── service-worker.js   # Fonctionnement hors ligne
├── icon-192.png        # Icône 192x192 (à créer)
├── icon-512.png        # Icône 512x512 (à créer)
├── netlify.toml        # Configuration Netlify (optionnel)
├── _headers            # Headers HTTP (optionnel)
└── audios/
    ├── audio01.mp3
    ├── audio02.mp3
    ├── audio03.mp3
    ├── audio04.mp3
    ├── audio05.mp3
    ├── audio06.mp3
    ├── audio07.mp3
    ├── audio08.mp3
    ├── audio09.mp3
    ├── audio10.mp3
    ├── audio11.mp3
    └── audio12.mp3
```

---

## 🚀 DÉPLOIEMENT

### Étape 1 : Préparez vos fichiers audio

Générez vos 12 audios avec ElevenLabs et nommez-les **EXACTEMENT** :
- `audio01.mp3`, `audio02.mp3`, ... jusqu'à `audio12.mp3`
- Format : MP3
- Qualité : 128 kbps minimum

### Étape 2 : Créez les icônes

1. Allez sur https://favicon.io/favicon-generator/
2. Créez une icône avec :
   - Texte : 🐔 ou "FA"
   - Couleur de fond : #4CAF50
   - Couleur du texte : #FFFFFF
3. Téléchargez et renommez :
   - `android-chrome-192x192.png` → `icon-192.png`
   - `android-chrome-512x512.png` → `icon-512.png`

### Étape 3 : Uploadez sur Netlify

**Via GitHub (Recommandé) :**
1. Créez un repository GitHub
2. Uploadez TOUS les fichiers (y compris le dossier `audios/`)
3. Connectez Netlify à votre repository
4. Déployez

**Via Netlify Drop :**
1. Allez sur https://app.netlify.com/drop
2. Glissez le dossier complet `la-ferme-aux-ailes/`
3. Attendez 2-3 minutes
4. Récupérez votre URL

### Étape 4 : Testez

Ouvrez l'URL et vérifiez :
- ✅ Les 12 audios sont listés
- ✅ Cliquez sur un audio → Il se charge
- ✅ Le son sort correctement
- ✅ Les 3 vitesses fonctionnent
- ✅ La lecture en boucle fonctionne

---

## 🎨 THÈME VISUEL

**Couleurs principales :**
- Vert primaire : #4CAF50 (agriculture, nature)
- Vert foncé : #388E3C
- Orange : #FFA726 (chaleur, poules)
- Jaune : #FFD54F (œufs, soleil)

**Icônes :**
- 🐔 Poule (logo principal)
- 🎯 Cible (premiers pas)
- 🏗️ Construction (bâtiment)
- 🌾 Épi de blé (alimentation)
- 💉 Seringue (prophylaxie)

---

## 📱 GUIDE D'INSTALLATION POUR VOS CLIENTS

### Android
1. Ouvrir le lien dans Chrome
2. Cliquer sur "Installer"
3. Icône apparaît sur l'écran d'accueil
4. Fonctionne hors ligne !

### iPhone
1. Ouvrir le lien dans Safari
2. Cliquer sur Partage ⬆️
3. "Sur l'écran d'accueil"
4. Confirmer
5. Fonctionne hors ligne !

---

## 💡 CONSEILS D'UTILISATION

**Pour les éleveurs :**
- Écoutez chaque audio AVANT de démarrer l'étape correspondante
- Utilisez la vitesse lente pour prendre des notes
- Activez la boucle pour écouter pendant que vous travaillez
- Revenez aux audios en cas de doute ou problème

**Pour maximiser l'apprentissage :**
- 📝 Prenez des notes pendant l'écoute
- 🔁 Réécoutez les parties importantes
- 📊 Suivez les fiches recommandées
- 📞 Contactez le support si besoin

---

## 🐛 DÉPANNAGE

**Le son ne sort pas :**
- Vérifiez que vos fichiers MP3 sont bien nommés (audio01.mp3, etc.)
- Vérifiez qu'ils sont dans le dossier `audios/`
- Testez les liens directs : `https://VOTRE-URL.netlify.app/audios/audio01.mp3`

**L'application ne s'installe pas :**
- Android : Utilisez Chrome (pas Firefox)
- iPhone : Utilisez Safari (obligatoire)

**Erreur 404 :**
- Le dossier `audios/` n'a pas été uploadé
- Vérifiez sur votre repository GitHub ou Netlify

---

## 📧 SUPPORT

Pour toute question ou problème :
- Email : support@lafermeauxailes.com
- WhatsApp : [Votre numéro]

---

## 📈 MISES À JOUR FUTURES

Version 1.0 (actuelle) :
✅ 12 audios de formation
✅ 3 vitesses d'écoute
✅ Lecture en boucle
✅ Mode hors ligne

Version 2.0 (à venir) :
🔜 Fiches PDF téléchargeables
🔜 Calculateur de rations intégré
🔜 Calendrier vaccinal interactif
🔜 Suivi de production

---

## ⚖️ LICENCE

© 2026 La Ferme aux Ailes - Tous droits réservés

Cette application est destinée aux clients ayant acheté le guide pratique d'élevage de poules pondeuses.

---

**Bon élevage ! 🐔🥚**
