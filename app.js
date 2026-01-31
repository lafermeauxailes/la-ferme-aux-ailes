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
    
    card.innerHTML = `
        <div class="card-header">
            <div class="audio-icon">${audio.icon}</div>
            <div class="card-info">
                <div class="audio-number">${audio.number}</div>
                <h3 class="audio-title">${audio.title}</h3>
                <div class="audio-category">${audio.categoryName}</div>
            </div>
        </div>
        <span class="card-duration">⏱️ ${audio.duration}</span>
    `;
    
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
    
    // Afficher la modal
    modal.classList.add('show');
    
    // Sauvegarder le dernier audio écouté
    saveLastPlayedAudio(audioData.id);
    
    // Réinitialiser les contrôles
    resetPlayerControls();
}

function closePlayer() {
    const modal = document.getElementById('playerModal');
    modal.classList.remove('show');
    
    // Arrêter la lecture
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    
    // Réinitialiser l'interface
    updatePlayButton(false);
    updateWaveform(false);
}

function resetPlayerControls() {
    // Réinitialiser la vitesse à normale
    const speedButtons = document.querySelectorAll('.speed-btn');
    speedButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.speed === '1');
    });
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
    
    // Boutons de vitesse
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', () => changeSpeed(btn));
    });
    
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
    
    // Raccourcis clavier
    document.addEventListener('keydown', handleKeyboard);
}

function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        updatePlayButton(true);
        updateWaveform(true);
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

function changeSpeed(btn) {
    // Retirer la classe active de tous les boutons
    document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
    
    // Ajouter la classe active au bouton cliqué
    btn.classList.add('active');
    
    // Changer la vitesse de lecture
    const speed = parseFloat(btn.dataset.speed);
    audioPlayer.playbackRate = speed;
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
    if (!modal.classList.contains('show')) return;
    
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
        // ou proposer de reprendre là où l'utilisateur s'est arrêté
    }
}

// ========================================
// STATUT HORS LIGNE
// ========================================
function checkOnlineStatus() {
    const indicator = document.getElementById('offlineIndicator');
    const statusDot = indicator.querySelector('.status-dot');
    
    function updateStatus() {
        if (navigator.onLine) {
            indicator.innerHTML = '<span class="status-dot online"></span> Connecté';
            statusDot.classList.remove('offline');
            statusDot.classList.add('online');
        } else {
            indicator.innerHTML = '<span class="status-dot offline"></span> Hors ligne';
            statusDot.classList.remove('online');
            statusDot.classList.add('offline');
        }
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
        // L'app est déjà installée, ne pas afficher le prompt
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
            installPrompt.classList.add('show');
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
            console.log('L\'utilisateur a accepté l\'installation');
        }
        
        deferredPrompt = null;
        installPrompt.classList.remove('show');
    });
    
    // Bouton ignorer
    skipButton.addEventListener('click', () => {
        installPrompt.classList.remove('show');
        localStorage.setItem('installPromptDismissed', 'true');
    });
}

// ========================================
// DÉTECTION D'INSTALLATION
// ========================================
window.addEventListener('appinstalled', () => {
    console.log('Application installée avec succès!');
    // Vous pouvez afficher une notification de succès ici
});

// ========================================
// GESTION DES ERREURS AUDIO
// ========================================
audioPlayer.addEventListener('error', (e) => {
    console.error('Erreur de chargement audio:', e);
    alert('Erreur : Impossible de charger cet audio. Vérifiez que le fichier existe dans le dossier "audios/".');
});

// ========================================
// EXPORT POUR DEBUG
// ========================================
window.debugApp = {
    audioPlayer,
    currentAudioData,
    audioData,
    openPlayer,
    closePlayer
};

console.log('🎓 English Kids App initialisée avec succès!');
console.log(`📚 ${audioData.length} audios chargés`);
