// ========================================
// VARIABLES GLOBALES
// ========================================
let currentAudio = null;
let audioPlayer = null;
let currentAudioData = null;
let isDragging = false;

// ========================================
// INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    audioPlayer = document.getElementById('audioPlayer');
    initializeApp();
    setupEventListeners();
    checkOnlineStatus();
    setupInstallPrompt();
});

// ========================================
// INITIALISATION DE L'APPLICATION
// ========================================
function initializeApp() {
    renderAudioCards();
    setupCategoryFilters();
    loadLastPlayedAudio();
}

// ========================================
// RENDU DES CARTES AUDIO
// ========================================
function renderAudioCards(filter = 'all') {
    const audioList = document.getElementById('audioList');
    audioList.innerHTML = '';
    
    const filteredData = filter === 'all' 
        ? audioData 
        : audioData.filter(audio => audio.category === filter);
    
    filteredData.forEach((audio, index) => {
        const card = createAudioCard(audio, index);
        audioList.appendChild(card);
    });
}

function createAudioCard(audio, index) {
    const card = document.createElement('div');
    card.className = 'audio-card';
    card.style.animationDelay = `${index * 0.05}s`;
    
    // Créer la structure de la carte
    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    
    const audioIcon = document.createElement('div');
    audioIcon.className = 'audio-icon';
    audioIcon.textContent = audio.icon;
    
    const cardInfo = document.createElement('div');
    cardInfo.className = 'card-info';
    
    const audioNumber = document.createElement('div');
    audioNumber.className = 'audio-number';
    audioNumber.textContent = audio.number;
    
    const audioTitle = document.createElement('h3');
    audioTitle.className = 'audio-title';
    audioTitle.textContent = audio.title;
    
    const audioCategory = document.createElement('div');
    audioCategory.className = 'audio-category';
    audioCategory.textContent = audio.categoryName;
    
    const cardDuration = document.createElement('span');
    cardDuration.className = 'card-duration';
    cardDuration.innerHTML = `⏱️ ${audio.duration}`;
    
    // Assembler la carte
    cardInfo.appendChild(audioNumber);
    cardInfo.appendChild(audioTitle);
    cardInfo.appendChild(audioCategory);
    
    cardHeader.appendChild(audioIcon);
    cardHeader.appendChild(cardInfo);
    
    card.appendChild(cardHeader);
    card.appendChild(cardDuration);
    
    // Événement de clic
    card.addEventListener('click', () => openPlayer(audio));
    
    return card;
}

// ========================================
// FILTRES PAR CATÉGORIE
// ========================================
function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            categoryButtons.forEach(b => b.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            btn.classList.add('active');
            
            // Filtrer les audios
            const category = btn.dataset.category;
            renderAudioCards(category);
        });
    });
}

// ========================================
// LECTEUR AUDIO
// ========================================
function openPlayer(audioData) {
    currentAudioData = audioData;
    const modal = document.getElementById('playerModal');
    
    // Mettre à jour les informations
    document.getElementById('playerNumber').textContent = audioData.number;
    document.getElementById('playerTitle').textContent = audioData.title;
    document.getElementById('adviceText').textContent = audioData.advice;
    
    // Charger l'audio
    audioPlayer.src = audioData.audioFile;
    audioPlayer.load();
    
    // Afficher la modal (utiliser 'active' au lieu de 'show')
    modal.classList.add('active');
    
    // Sauvegarder le dernier audio écouté
    saveLastPlayedAudio(audioData.id);
    
    // Réinitialiser les contrôles
    resetPlayerControls();
}

function closePlayer() {
    const modal = document.getElementById('playerModal');
    modal.classList.remove('active');
    
    // Arrêter la lecture
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    
    // Réinitialiser l'interface
    updatePlayButton(false);
    updateWaveform(false);
}

function resetPlayerControls() {
    // Réinitialiser la vitesse à normale
    audioPlayer.playbackRate = 1;
    
    // Réinitialiser la boucle
    document.getElementById('loopToggle').checked = false;
    audioPlayer.loop = false;
    
    // Réinitialiser le bouton play
    updatePlayButton(false);
    updateWaveform(false);
}

// ========================================
// CONTRÔLES DE LECTURE
// ========================================
function setupEventListeners() {
    // Fermeture du modal
    document.getElementById('closeModal').addEventListener('click', closePlayer);
    document.getElementById('playerModal').addEventListener('click', (e) => {
        if (e.target.id === 'playerModal') closePlayer();
    });
    
    // Bouton Play/Pause
    document.getElementById('playPauseBtn').addEventListener('click', togglePlay);
    
    // Boutons de navigation
    document.getElementById('seekBackward').addEventListener('click', () => seek(-10));
    document.getElementById('seekForward').addEventListener('click', () => seek(10));
    
    // Toggle boucle
    document.getElementById('loopToggle').addEventListener('change', (e) => {
        audioPlayer.loop = e.target.checked;
    });
    
    // Barre de progression
    setupProgressBar();
    
    // Événements de l'audio
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', () => {
        document.getElementById('duration').textContent = formatTime(audioPlayer.duration);
    });
    audioPlayer.addEventListener('ended', () => {
        if (!audioPlayer.loop) {
            updatePlayButton(false);
            updateWaveform(false);
        }
    });
    
    // Gestion des erreurs audio
    audioPlayer.addEventListener('error', (e) => {
        console.error('Erreur de chargement audio:', e);
        alert('❌ Erreur : Impossible de charger cet audio.\n\nVérifiez que le fichier existe dans le dossier "audios/".\n\nFichier demandé : ' + audioPlayer.src);
    });
    
    // Événement de chargement réussi
    audioPlayer.addEventListener('canplaythrough', () => {
        console.log('✅ Audio chargé avec succès:', audioPlayer.src);
    });
    
    // Raccourcis clavier
    document.addEventListener('keydown', handleKeyboard);
}

function togglePlay() {
    if (audioPlayer.paused) {
        const playPromise = audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('🎵 Lecture démarrée');
                    updatePlayButton(true);
                    updateWaveform(true);
                })
                .catch((error) => {
                    console.error('❌ Erreur de lecture:', error);
                    alert('Impossible de lire l\'audio. Vérifiez que le fichier existe.');
                });
        }
    } else {
        audioPlayer.pause();
        updatePlayButton(false);
        updateWaveform(false);
    }
}

function updatePlayButton(isPlaying) {
    const playBtn = document.getElementById('playPauseBtn');
    const playIcon = playBtn.querySelector('.play-icon');
    playIcon.textContent = isPlaying ? '⏸️' : '▶️';
}

function updateWaveform(isPlaying) {
    const waveform = document.getElementById('waveform');
    if (isPlaying) {
        waveform.classList.add('playing');
    } else {
        waveform.classList.remove('playing');
    }
}

function seek(seconds) {
    audioPlayer.currentTime = Math.max(0, Math.min(audioPlayer.duration, audioPlayer.currentTime + seconds));
}

// ========================================
// BARRE DE PROGRESSION
// ========================================
function setupProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const progressHandle = document.getElementById('progressHandle');
    
    // Click sur la barre
    progressBar.addEventListener('click', (e) => {
        if (!isDragging) {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = percent * audioPlayer.duration;
        }
    });
    
    // Drag du handle
    progressHandle.addEventListener('mousedown', startDrag);
    progressHandle.addEventListener('touchstart', startDrag);
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
}

function startDrag(e) {
    isDragging = true;
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    
    const progressBar = document.getElementById('progressBar');
    const rect = progressBar.getBoundingClientRect();
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

function stopDrag() {
    isDragging = false;
}

function updateProgress() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    if (isNaN(duration)) return;
    
    const percent = (currentTime / duration) * 100;
    
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressHandle').style.left = percent + '%';
    document.getElementById('currentTime').textContent = formatTime(currentTime);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ========================================
// RACCOURCIS CLAVIER
// ========================================
function handleKeyboard(e) {
    const modal = document.getElementById('playerModal');
    if (!modal.classList.contains('active')) return;
    
    switch(e.key) {
        case ' ':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            seek(-10);
            break;
        case 'ArrowRight':
            e.preventDefault();
            seek(10);
            break;
        case 'Escape':
            closePlayer();
            break;
    }
}

// ========================================
// SAUVEGARDE DU DERNIER AUDIO ÉCOUTÉ
// ========================================
function saveLastPlayedAudio(audioId) {
    localStorage.setItem('lastPlayedAudio', audioId);
}

function loadLastPlayedAudio() {
    const lastAudioId = localStorage.getItem('lastPlayedAudio');
    if (lastAudioId) {
        // Vous pouvez ajouter un indicateur visuel sur la dernière carte écoutée
        console.log('Dernier audio écouté:', lastAudioId);
    }
}

// ========================================
// STATUT HORS LIGNE
// ========================================
function checkOnlineStatus() {
    const indicator = document.getElementById('offlineIndicator');
    
    function updateStatus() {
        const statusHTML = navigator.onLine 
            ? '<span class="status-dot online"></span> Connecté'
            : '<span class="status-dot offline"></span> Hors ligne';
        
        indicator.innerHTML = statusHTML;
    }
    
    updateStatus();
    
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
}

// ========================================
// PROMPT D'INSTALLATION PWA
// ========================================
let deferredPrompt = null;

function setupInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    const installButton = document.getElementById('installButton');
    const skipButton = document.getElementById('skipInstall');
    
    // Vérifier si l'app est déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return;
    }
    
    // Vérifier si l'utilisateur a déjà refusé l'installation
    if (localStorage.getItem('installPromptDismissed') === 'true') {
        return;
    }
    
    // Capturer l'événement beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Afficher le prompt après 3 secondes
        setTimeout(() => {
            installPrompt.classList.add('active');
        }, 3000);
    });
    
    // Bouton d'installation
    installButton.addEventListener('click', async () => {
        if (!deferredPrompt) {
            alert('L\'installation n\'est pas disponible sur ce navigateur.');
            return;
        }
        
        deferredPrompt.prompt();
        
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ L\'utilisateur a accepté l\'installation');
        }
        
        deferredPrompt = null;
        installPrompt.classList.remove('active');
    });
    
    // Bouton ignorer
    skipButton.addEventListener('click', () => {
        installPrompt.classList.remove('active');
        localStorage.setItem('installPromptDismissed', 'true');
    });
}

// ========================================
// DÉTECTION D'INSTALLATION
// ========================================
window.addEventListener('appinstalled', () => {
    console.log('✅ Application installée avec succès!');
});

// ========================================
// EXPORT POUR DEBUG
// ========================================
window.debugApp = {
    audioPlayer,
    currentAudioData,
    audioData,
    openPlayer,
    closePlayer,
    togglePlay
};

console.log('🎓 English Kids App initialisée avec succès!');
console.log(`📚 ${audioData.length} audios chargés`);
