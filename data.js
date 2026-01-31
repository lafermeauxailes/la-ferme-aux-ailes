// Base de données des 13 audios - La Ferme aux Ailes
const audioData = [
    // ========== PARTIE 1 : PREMIERS PAS ==========
    {
        id: 1,
        number: "Audio 01",
        title: "Précision sur les 10 commandements",
        category: "partie1",
        categoryName: "Premiers Pas",
        icon: "📋",
        duration: "4:30",
        advice: "Écoutez attentivement ces commandements fondamentaux. Prenez des notes et revenez-y régulièrement.",
        audioFile: "audios/audio01.mp3"
    },
    {
        id: 2,
        number: "Audio 02",
        title: "Recommandation de fiche",
        category: "partie1",
        categoryName: "Premiers Pas",
        icon: "📝",
        duration: "3:45",
        advice: "Imprimez les fiches recommandées et gardez-les à portée de main dans votre poulailler.",
        audioFile: "audios/audio02.mp3"
    },
    {
        id: 3,
        number: "Audio 03",
        title: "L'introduction",
        category: "partie1",
        categoryName: "Premiers Pas",
        icon: "🎯",
        duration: "5:20",
        advice: "Cette introduction pose les bases de tout votre élevage. Écoutez-la plusieurs fois avant de démarrer.",
        audioFile: "audios/audio03.mp3"
    },

    // ========== PARTIE 2 : BÂTIMENT DES POULES ==========
    {
        id: 4,
        number: "Audio 04",
        title: "La construction du poulailler",
        category: "partie2",
        categoryName: "Bâtiment des Poules",
        icon: "🏗️",
        duration: "6:15",
        advice: "Prenez des mesures pendant l'écoute. Un bon poulailler = des poules en bonne santé !",
        audioFile: "audios/audio04.mp3"
    },
    {
        id: 5,
        number: "Audio 05",
        title: "Contrôle qualité à la réception",
        category: "partie2",
        categoryName: "Bâtiment des Poules",
        icon: "✅",
        duration: "4:50",
        advice: "Utilisez cette checklist avant d'installer vos poules. Ne négligez aucun point !",
        audioFile: "audios/audio05.mp3"
    },

    // ========== PARTIE 3 : ALIMENTATION ==========
    {
        id: 6,
        number: "Audio 06",
        title: "Alimentation 1er âge",
        category: "partie3",
        categoryName: "Alimentation",
        icon: "🐣",
        duration: "5:30",
        advice: "L'alimentation du 1er âge conditionne toute la croissance future. Suivez les doses précisément.",
        audioFile: "audios/audio06.mp3"
    },
    {
        id: 7,
        number: "Audio 07",
        title: "Alimentation 2ème âge",
        category: "partie3",
        categoryName: "Alimentation",
        icon: "🐥",
        duration: "5:00",
        advice: "Phase critique de développement. Notez les quantités recommandées dans votre carnet.",
        audioFile: "audios/audio07.mp3"
    },
    {
        id: 8,
        number: "Audio 08",
        title: "Alimentation 3ème âge (entrée en ponte)",
        category: "partie3",
        categoryName: "Alimentation",
        icon: "🥚",
        duration: "6:00",
        advice: "L'entrée en ponte nécessite une alimentation spécifique. Adaptez progressivement.",
        audioFile: "audios/audio08.mp3"
    },
    {
        id: 9,
        number: "Audio 09",
        title: "Calcul de ratio alimentaire",
        category: "partie3",
        categoryName: "Alimentation",
        icon: "🔢",
        duration: "7:15",
        advice: "Gardez une calculatrice à portée de main. Ces calculs vous feront économiser beaucoup d'argent !",
        audioFile: "audios/audio09.mp3"
    },

    // ========== PARTIE 4 : PROPHYLAXIE ==========
    {
        id: 10,
        number: "Audio 10",
        title: "La Prophylaxie vétérinaire",
        category: "partie4",
        categoryName: "Prophylaxie",
        icon: "💉",
        duration: "8:30",
        advice: "La prévention est la clé d'un élevage rentable. Établissez votre calendrier vaccinal dès maintenant.",
        audioFile: "audios/audio10.mp3"
    },
    {
        id: 11,
        number: "Audio 11",
        title: "Les fiches de suivi",
        category: "partie4",
        categoryName: "Prophylaxie",
        icon: "📊",
        duration: "5:45",
        advice: "Téléchargez et imprimez ces fiches. Un bon suivi = zéro surprise désagréable.",
        audioFile: "audios/audio11.mp3"
    },

    // ========== ANNEXE ==========
    {
        id: 12,
        number: "Audio 12",
        title: "Conclusion",
        category: "annexe",
        categoryName: "Annexe",
        icon: "🎓",
        duration: "4:00",
        advice: "Récapitulatif de tous les points essentiels. Écoutez-le avant chaque nouvelle étape de votre élevage.",
        audioFile: "audios/audio12.mp3"
    }
];

// Exporter pour utilisation dans app.js
window.audioData = audioData;
