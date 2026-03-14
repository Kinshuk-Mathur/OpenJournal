// Loading Screen Logic
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Hide loading screen after 1 second (faster!)
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1000);
});

const journalText = document.getElementById('journalText');
const typeSound = document.getElementById('typeSound');
const paperSheet = document.getElementById('paperSheet');
const imageInput = document.getElementById('imageInput');
const soundToggle = document.getElementById('soundToggle');
const musicToggle = document.getElementById('musicToggle');
const homepage = document.getElementById('homepage');
const editor = document.getElementById('editor');
const journalsGrid = document.getElementById('journalsGrid');
const typingText = document.getElementById('typingText');

let currentJournalId = null;
let isMuted = false;
let isMusicMuted = false;
let currentMusicIndex = 0;

// Playlist Configuration
const playlist = [
    { name: "Lofi Beats 1", file: "assets/music2.mp3", duration: "3:24" },
    { name: "Lofi Beats 2", file: "assets/music4.mp3", duration: "2:58" },
    { name: "Lofi Beats 3", file: "assets/music5.mp3", duration: "3:12" },
    { name: "Lofi Beats 4", file: "assets/music3.mp3", duration: "3:12" },
    { name: "Lofi Beats 5", file: "assets/music1.mp3", duration: "3:12" },
    { name: "Lofi Beats 6", file: "assets/music6.mp3", duration: "3:12" }
];

// Background Music Elements
const bgMusics = playlist.map(song => {
    const audio = new Audio(song.file);
    audio.volume = 0.13;
    return audio;
});

// Music auto-start on first interaction
let musicStarted = false;

function startMusic() {
    if (!musicStarted && !isMusicMuted) {
        playCurrentMusic();
        musicStarted = true;
    }
}

// Try to start music on various user interactions
document.addEventListener('click', startMusic, { once: false });
document.addEventListener('keydown', startMusic, { once: false });
document.addEventListener('scroll', startMusic, { once: false });

// Also try on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!musicStarted) {
            playCurrentMusic();
        }
    }, 500);
});

// Play current music
function playCurrentMusic() {
    if (!isMusicMuted && bgMusics[currentMusicIndex]) {
        const music = bgMusics[currentMusicIndex];
        if (music) {
            music.play().then(() => {
                console.log('Music playing successfully!');
                musicStarted = true;
            }).catch(e => {
                console.log('Autoplay prevented. User interaction needed.');
            });
        }
    }
}

// When a song ends, play the next one
bgMusics.forEach((music, index) => {
    if (music) {
        music.addEventListener('ended', () => {
            currentMusicIndex = (currentMusicIndex + 1) % bgMusics.length;
            playCurrentMusic();
        });
    }
});

// Music Toggle - Click shows menu
let menuTimeout;
musicToggle.addEventListener('click', () => {
    const musicMenu = document.getElementById('musicMenu');
    const playlistPanel = document.getElementById('playlistPanel');
    
    // Close playlist if open
    playlistPanel.classList.remove('active');
    
    // Toggle menu
    musicMenu.classList.toggle('show');
    
    // Auto-hide menu after 5 seconds
    clearTimeout(menuTimeout);
    if (musicMenu.classList.contains('show')) {
        menuTimeout = setTimeout(() => {
            musicMenu.classList.remove('show');
        }, 5000);
    }
});

// Toggle Mute
document.getElementById('toggleMute').addEventListener('click', () => {
    isMusicMuted = !isMusicMuted;
    
    const muteIcon = document.getElementById('muteIcon');
    const muteText = document.getElementById('muteText');
    const musicButton = document.getElementById('musicToggle');
    
    if (isMusicMuted) {
        bgMusics.forEach(m => m && m.pause());
        muteIcon.textContent = '🔊';
        muteText.textContent = 'Unmute Music';
        musicButton.textContent = '🔇';
    } else {
        playCurrentMusic();
        muteIcon.textContent = '🔇';
        muteText.textContent = 'Mute Music';
        musicButton.textContent = '🎵';
    }
    
    // Close menu
    document.getElementById('musicMenu').classList.remove('show');
});

// Open Playlist
document.getElementById('openPlaylist').addEventListener('click', () => {
    document.getElementById('musicMenu').classList.remove('show');
    document.getElementById('playlistPanel').classList.toggle('active');
});

// Close Playlist
document.getElementById('closePlaylist').addEventListener('click', () => {
    document.getElementById('playlistPanel').classList.remove('active');
});

// Build Playlist UI
function buildPlaylist() {
    const playlistSongs = document.getElementById('playlistSongs');
    playlistSongs.innerHTML = '';
    
    playlist.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        if (index === currentMusicIndex) {
            songItem.classList.add('playing');
        }
        
        songItem.innerHTML = `
            <span class="song-icon">🎵</span>
            <span class="song-name">${song.name}</span>
            <span class="song-duration">${song.duration}</span>
        `;
        
        songItem.addEventListener('click', () => {
            playSong(index);
        });
        
        playlistSongs.appendChild(songItem);
    });
}

// Play specific song
function playSong(index) {
    // Stop current song
    if (bgMusics[currentMusicIndex]) {
        bgMusics[currentMusicIndex].pause();
        bgMusics[currentMusicIndex].currentTime = 0;
    }
    
    // Update index and play new song
    currentMusicIndex = index;
    isMusicMuted = false;
    musicToggle.textContent = '🎵';
    
    playCurrentMusic();
    updateNowPlaying();
    buildPlaylist(); // Rebuild to update playing state
}

// Update "Now Playing" display
function updateNowPlaying() {
    const nowPlaying = document.querySelector('.now-playing .song-title');
    if (nowPlaying) {
        nowPlaying.textContent = playlist[currentMusicIndex].name;
    }
}

// Initialize playlist on load
window.addEventListener('load', () => {
    buildPlaylist();
    updateNowPlaying();
});

// Typing Animation Texts
const typingTexts = [
    "Your thoughts. Your space.",
    "Overthinking? Your space.",
    "Too many thoughts. One space.",
    "Brain dump zone.",
    "Your digital diary awaits...",
    "Your diary's cooler cousin."
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 120;

function typeWriter() {
    const currentText = typingTexts[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 60;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typingSpeed = 500;
    }

    setTimeout(typeWriter, typingSpeed);
}

// Start typing animation
typeWriter();

// Set natural volume (10%)
typeSound.volume = 0.10;

// Sound Toggle
soundToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    soundToggle.textContent = isMuted ? '🔇' : '🔊';
    typeSound.muted = isMuted;
});

// Typing Sound
journalText.addEventListener('keydown', () => {
    if (!isMuted) {
        typeSound.currentTime = 0;
        typeSound.play();
    }
});

// Image Upload
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const wrapper = document.createElement('div');
            wrapper.className = 'sticker';
            wrapper.style.top = Math.random() * 200 + 100 + 'px';
            wrapper.style.left = Math.random() * 200 + 50 + 'px';
            
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.width = '100%';
            img.style.display = 'block';
            
            const controls = document.createElement('div');
            controls.className = 'sticker-controls';
            controls.innerHTML = `
                <button class="sticker-btn" onclick="resizeSticker(this, 0.8)">−</button>
                <button class="sticker-btn" onclick="resizeSticker(this, 1.2)">+</button>
                <button class="sticker-btn" onclick="deleteSticker(this)">×</button>
            `;
            
            wrapper.appendChild(img);
            wrapper.appendChild(controls);
            makeDraggable(wrapper);
            paperSheet.appendChild(wrapper);
        }
        reader.readAsDataURL(file);
    }
});

function resizeSticker(btn, scale) {
    const sticker = btn.closest('.sticker');
    const currentWidth = sticker.offsetWidth;
    sticker.style.maxWidth = (currentWidth * scale) + 'px';
}

function deleteSticker(btn) {
    btn.closest('.sticker').remove();
}

function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;
    
    el.onmousedown = dragMouseDown;
    el.ontouchstart = dragMouseDown;

    function dragMouseDown(e) {
        if (e.target.classList.contains('sticker-btn')) {
            return;
        }
        
        e.preventDefault();
        isDragging = true;
        const touch = e.touches ? e.touches[0] : e;
        
        // Get position relative to paper-sheet container
        const rect = paperSheet.getBoundingClientRect();
        pos3 = touch.clientX - rect.left + paperSheet.scrollLeft;
        pos4 = touch.clientY - rect.top + paperSheet.scrollTop;
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        document.ontouchend = closeDragElement;
        document.ontouchmove = elementDrag;
    }

    function elementDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches ? e.touches[0] : e;
        
        // Calculate position relative to paper-sheet
        const rect = paperSheet.getBoundingClientRect();
        const newX = touch.clientX - rect.left + paperSheet.scrollLeft;
        const newY = touch.clientY - rect.top + paperSheet.scrollTop;
        
        pos1 = pos3 - newX;
        pos2 = pos4 - newY;
        pos3 = newX;
        pos4 = newY;
        
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        isDragging = false;
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;
    }
}

// Journal Management
function loadJournals() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('journal_'));
    journalsGrid.innerHTML = `
        <div class="journal-card add-journal-card" onclick="createNewJournal()">
            <div class="plus-icon">+</div>
            <p>Create New Journal</p>
        </div>
    `;

    if (keys.length === 0) {
        journalsGrid.innerHTML += `
            <div class="empty-state">
                <h2>No journals yet</h2>
                <p>Click the + button to start your first journal entry</p>
            </div>
        `;
    }

    keys.forEach(key => {
        try {
            const journal = JSON.parse(localStorage.getItem(key));
            const card = document.createElement('div');
            card.className = 'journal-card';
            card.innerHTML = `
                <h3>${journal.title}</h3>
                <div class="date">${journal.date}</div>
                <div class="preview">${journal.text.substring(0, 100)}${journal.text.length > 100 ? '...' : ''}</div>
            `;
            card.onclick = () => openJournal(key);
            journalsGrid.appendChild(card);
        } catch (e) {
            console.error('Error loading journal:', key, e);
        }
    });
}

function createNewJournal() {
    currentJournalId = 'journal_' + Date.now();
    journalText.value = '';
    document.getElementById('journalTitle').textContent = 'New Journal Entry';
    paperSheet.querySelectorAll('.sticker').forEach(s => s.remove());
    homepage.style.display = 'none';
    editor.style.display = 'block';
}

function openJournal(id) {
    currentJournalId = id;
    try {
        const journal = JSON.parse(localStorage.getItem(id));
        journalText.value = journal.text;
        document.getElementById('journalTitle').textContent = journal.title;
        
        paperSheet.querySelectorAll('.sticker').forEach(s => s.remove());
        if (journal.images) {
            journal.images.forEach(imgData => {
                const wrapper = document.createElement('div');
                wrapper.className = 'sticker';
                wrapper.style.top = imgData.top;
                wrapper.style.left = imgData.left;
                wrapper.style.maxWidth = imgData.width;
                
                const img = document.createElement('img');
                img.src = imgData.src;
                img.style.width = '100%';
                img.style.display = 'block';
                
                const controls = document.createElement('div');
                controls.className = 'sticker-controls';
                controls.innerHTML = `
                    <button class="sticker-btn" onclick="resizeSticker(this, 0.8)">−</button>
                    <button class="sticker-btn" onclick="resizeSticker(this, 1.2)">+</button>
                    <button class="sticker-btn" onclick="deleteSticker(this)">×</button>
                `;
                
                wrapper.appendChild(img);
                wrapper.appendChild(controls);
                makeDraggable(wrapper);
                paperSheet.appendChild(wrapper);
            });
        }
        
        homepage.style.display = 'none';
        editor.style.display = 'block';
    } catch (e) {
        alert('❌ Error loading journal. It may be corrupted.');
        console.error('Load error:', e);
    }
}

function saveJournal() {
    try {
        const images = [];
        paperSheet.querySelectorAll('.sticker').forEach(sticker => {
            const img = sticker.querySelector('img');
            images.push({
                src: img.src,
                top: sticker.style.top,
                left: sticker.style.left,
                width: sticker.style.maxWidth
            });
        });

        const journal = {
            title: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            date: new Date().toLocaleString(),
            text: journalText.value,
            images: images
        };

        const journalString = JSON.stringify(journal);
        
        // Check if we're approaching localStorage limit (5MB = ~5,000,000 chars)
        if (journalString.length > 4500000) {
            alert('⚠️ Journal is too large! Try removing some images or splitting into multiple entries.');
            return;
        }

        localStorage.setItem(currentJournalId, journalString);
        alert('✨ Journal saved successfully!');
        backToHome();
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            alert('⚠️ Storage full! Try:\n• Remove some old journals\n• Use fewer/smaller images\n• Split into multiple entries');
        } else {
            alert('❌ Error saving journal: ' + e.message);
        }
        console.error('Save error:', e);
    }
}

function backToHome() {
    homepage.style.display = 'block';
    editor.style.display = 'none';
    loadJournals();
}

// Initialize
loadJournals();