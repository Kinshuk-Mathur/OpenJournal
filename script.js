/* ═══════════════════════════════════════════
   SYNAPSE JOURNAL — script.js
   ═══════════════════════════════════════════ */

// ── Loading Screen ──────────────────────────
window.addEventListener('load', () => {
    const bar = document.getElementById('loaderBar');
    if (bar) {
        // Animate bar to full, then hide screen
        setTimeout(() => { bar.style.width = '80%'; }, 100);
        setTimeout(() => { bar.style.width = '100%'; }, 700);
    }
    setTimeout(() => {
        const screen = document.getElementById('loadingScreen');
        if (screen) screen.classList.add('hidden');
    }, 1100);
});

// ── DOM refs ────────────────────────────────
const journalText  = document.getElementById('journalText');
const typeSound    = document.getElementById('typeSound');
const paperSheet   = document.getElementById('paperSheet');
const imageInput   = document.getElementById('imageInput');
const soundToggle  = document.getElementById('soundToggle');
const musicToggle  = document.getElementById('musicToggle');
const homepage     = document.getElementById('homepage');
const editor       = document.getElementById('editor');
const journalsGrid = document.getElementById('journalsGrid');
const typingText   = document.getElementById('typingText');

let currentJournalId = null;
let isMuted          = false;
let isMusicMuted     = false;
let currentMusicIndex = 0;

// ── Playlist ─────────────────────────────────
const playlist = [
    { name: "Lofi Beats 1", file: "assets/music2.mp3",  duration: "3:24" },
    { name: "Lofi Beats 2", file: "assets/music4.mp3",  duration: "2:58" },
    { name: "Lofi Beats 3", file: "assets/music5.mp3",  duration: "3:12" },
    { name: "Lofi Beats 4", file: "assets/music3.mp3",  duration: "3:12" },
    { name: "Lofi Beats 5", file: "assets/music1.mp3",  duration: "3:12" },
    { name: "Lofi Beats 6", file: "assets/music6.mp3",  duration: "3:12" }
];

const bgMusics = playlist.map(song => {
    const audio = new Audio(song.file);
    audio.volume = 0.13;
    return audio;
});

let musicStarted = false;

function startMusic() {
    if (!musicStarted && !isMusicMuted) {
        playCurrentMusic();
        musicStarted = true;
    }
}

document.addEventListener('click',   startMusic, { once: false });
document.addEventListener('keydown', startMusic, { once: false });

window.addEventListener('load', () => {
    setTimeout(() => {
        if (!musicStarted) playCurrentMusic();
    }, 600);
    buildPlaylist();
    updateNowPlaying();
});

function playCurrentMusic() {
    if (!isMusicMuted && bgMusics[currentMusicIndex]) {
        bgMusics[currentMusicIndex].play()
            .then(() => { musicStarted = true; })
            .catch(() => {});
    }
}

bgMusics.forEach((music, index) => {
    if (music) {
        music.addEventListener('ended', () => {
            currentMusicIndex = (currentMusicIndex + 1) % bgMusics.length;
            playCurrentMusic();
            updateNowPlaying();
            buildPlaylist();
        });
    }
});

// ── Music toggle / menu ──────────────────────
let menuTimeout;
musicToggle.addEventListener('click', () => {
    const musicMenu    = document.getElementById('musicMenu');
    const playlistPanel = document.getElementById('playlistPanel');
    playlistPanel.classList.remove('active');
    musicMenu.classList.toggle('show');
    clearTimeout(menuTimeout);
    if (musicMenu.classList.contains('show')) {
        menuTimeout = setTimeout(() => musicMenu.classList.remove('show'), 5000);
    }
});

document.getElementById('toggleMute').addEventListener('click', () => {
    isMusicMuted = !isMusicMuted;
    const muteText   = document.getElementById('muteText');
    const muteIconSvg = document.getElementById('muteIconSvg');

    if (isMusicMuted) {
        bgMusics.forEach(m => m && m.pause());
        muteText.textContent = 'Unmute Music';
        musicToggle.style.color = 'var(--syn-text-3)';
        // Show muted icon
        muteIconSvg.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>`;
    } else {
        playCurrentMusic();
        muteText.textContent = 'Mute Music';
        musicToggle.style.color = '';
        muteIconSvg.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
    }
    document.getElementById('musicMenu').classList.remove('show');
});

document.getElementById('openPlaylist').addEventListener('click', () => {
    document.getElementById('musicMenu').classList.remove('show');
    document.getElementById('playlistPanel').classList.toggle('active');
});

document.getElementById('closePlaylist').addEventListener('click', () => {
    document.getElementById('playlistPanel').classList.remove('active');
});

function buildPlaylist() {
    const playlistSongs = document.getElementById('playlistSongs');
    playlistSongs.innerHTML = '';
    playlist.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'song-item' + (index === currentMusicIndex ? ' playing' : '');
        item.innerHTML = `
            <span class="song-icon">${index === currentMusicIndex ? '▶' : '♩'}</span>
            <span class="song-name">${song.name}</span>
            <span class="song-duration">${song.duration}</span>
        `;
        item.addEventListener('click', () => playSong(index));
        playlistSongs.appendChild(item);
    });
}

function playSong(index) {
    if (bgMusics[currentMusicIndex]) {
        bgMusics[currentMusicIndex].pause();
        bgMusics[currentMusicIndex].currentTime = 0;
    }
    currentMusicIndex = index;
    isMusicMuted = false;
    musicToggle.style.color = '';
    playCurrentMusic();
    updateNowPlaying();
    buildPlaylist();
}

function updateNowPlaying() {
    const el = document.getElementById('currentSongName');
    if (el) el.textContent = playlist[currentMusicIndex].name;
}

// ── Typing Animation ─────────────────────────
const typingTexts = [
    "Your thoughts. Your space.",
    "Overthinking? Dump it here.",
    "Too many thoughts. One space.",
    "Brain dump zone.",
    "Your digital diary awaits...",
    "Your diary's cooler cousin.",
    "Built with SYNAPSE."
];

let textIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 120;

function typeWriter() {
    const currentText = typingTexts[textIndex];
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 55;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 95;
    }
    if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 2200; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typingSpeed = 500;
    }
    setTimeout(typeWriter, typingSpeed);
}
typeWriter();

// ── Sound toggle ─────────────────────────────
typeSound.volume = 0.1;
soundToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    typeSound.muted = isMuted;
    soundToggle.style.opacity = isMuted ? '0.4' : '1';
});

journalText.addEventListener('keydown', () => {
    if (!isMuted) {
        typeSound.currentTime = 0;
        typeSound.play().catch(() => {});
    }
});

// ── Image Upload (Memory stickers) ───────────
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const wrapper = document.createElement('div');
        wrapper.className = 'sticker';
        wrapper.style.top  = Math.random() * 180 + 80 + 'px';
        wrapper.style.left = Math.random() * 180 + 60 + 'px';

        const img = document.createElement('img');
        img.src = event.target.result;
        img.style.cssText = 'width:100%;display:block;';

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
    };
    reader.readAsDataURL(file);
});

function resizeSticker(btn, scale) {
    const sticker = btn.closest('.sticker');
    sticker.style.maxWidth = (sticker.offsetWidth * scale) + 'px';
}

function deleteSticker(btn) {
    btn.closest('.sticker').remove();
}

function makeDraggable(el) {
    let pos1=0,pos2=0,pos3=0,pos4=0,isDragging=false;
    el.onmousedown = el.ontouchstart = dragStart;

    function dragStart(e) {
        if (e.target.classList.contains('sticker-btn')) return;
        e.preventDefault();
        isDragging = true;
        const touch = e.touches ? e.touches[0] : e;
        const rect  = paperSheet.getBoundingClientRect();
        pos3 = touch.clientX - rect.left + paperSheet.scrollLeft;
        pos4 = touch.clientY - rect.top  + paperSheet.scrollTop;
        document.onmouseup = document.ontouchend = stopDrag;
        document.onmousemove = document.ontouchmove = drag;
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches ? e.touches[0] : e;
        const rect  = paperSheet.getBoundingClientRect();
        const nx = touch.clientX - rect.left + paperSheet.scrollLeft;
        const ny = touch.clientY - rect.top  + paperSheet.scrollTop;
        pos1 = pos3 - nx; pos2 = pos4 - ny;
        pos3 = nx; pos4 = ny;
        el.style.top  = (el.offsetTop  - pos2) + 'px';
        el.style.left = (el.offsetLeft - pos1) + 'px';
    }

    function stopDrag() {
        isDragging = false;
        document.onmouseup = document.onmousemove =
        document.ontouchend = document.ontouchmove = null;
    }
}

// ── Journal management ───────────────────────
function loadJournals() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('journal_'));
    journalsGrid.innerHTML = `
        <div class="journal-card add-journal-card" onclick="createNewJournal()">
            <div class="add-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </div>
            <p>New Entry</p>
        </div>
    `;

    // Update entry count chip
    const countEl = document.getElementById('entryCount');
    if (countEl) countEl.textContent = keys.length;

    if (keys.length === 0) {
        journalsGrid.innerHTML += `
            <div class="empty-state">
                <h2>No journals yet.</h2>
                <p>Start your first entry — your thoughts deserve a home.</p>
            </div>
        `;
        return;
    }

    // Sort by newest first
    keys.sort((a, b) => {
        const tA = parseInt(a.replace('journal_', '')) || 0;
        const tB = parseInt(b.replace('journal_', '')) || 0;
        return tB - tA;
    });

    keys.forEach(key => {
        try {
            const j = JSON.parse(localStorage.getItem(key));
            const wordCount = j.text.trim() ? j.text.trim().split(/\s+/).length : 0;

            const card = document.createElement('div');
            card.className = 'journal-card';
            card.innerHTML = `
                <div>
                    <div class="date">${j.date.split(',')[0] || j.date}</div>
                    <h3>${j.title}</h3>
                    <div class="preview">${j.text.substring(0, 110)}${j.text.length > 110 ? '...' : ''}</div>
                </div>
                <div class="card-footer">
                    <span class="card-words">${wordCount} words</span>
                    <span class="card-open-hint">Open →</span>
                </div>
            `;
            card.onclick = () => openJournal(key);
            journalsGrid.appendChild(card);
        } catch(e) {
            console.error('Error loading journal:', key, e);
        }
    });
}

function createNewJournal() {
    currentJournalId = 'journal_' + Date.now();
    journalText.value = '';
    document.getElementById('journalTitle').textContent = formatDateTitle(new Date());
    paperSheet.querySelectorAll('.sticker').forEach(s => s.remove());
    homepage.style.display = 'none';
    editor.style.display   = 'block';
    updateNavForEditor(true);
    setTimeout(() => journalText.focus(), 100);
}

function openJournal(id) {
    currentJournalId = id;
    try {
        const j = JSON.parse(localStorage.getItem(id));
        journalText.value = j.text;
        document.getElementById('journalTitle').textContent = j.title;

        paperSheet.querySelectorAll('.sticker').forEach(s => s.remove());
        if (j.images) {
            j.images.forEach(imgData => {
                const wrapper = document.createElement('div');
                wrapper.className = 'sticker';
                wrapper.style.top      = imgData.top;
                wrapper.style.left     = imgData.left;
                wrapper.style.maxWidth = imgData.width;

                const img = document.createElement('img');
                img.src = imgData.src;
                img.style.cssText = 'width:100%;display:block;';

                const controls = document.createElement('div');
                controls.className = 'sticker-controls';
                controls.innerHTML = `
                    <button class="sticker-btn" onclick="resizeSticker(this,0.8)">−</button>
                    <button class="sticker-btn" onclick="resizeSticker(this,1.2)">+</button>
                    <button class="sticker-btn" onclick="deleteSticker(this)">×</button>
                `;
                wrapper.appendChild(img);
                wrapper.appendChild(controls);
                makeDraggable(wrapper);
                paperSheet.appendChild(wrapper);
            });
        }

        homepage.style.display = 'none';
        editor.style.display   = 'block';
        updateNavForEditor(true);
    } catch(e) {
        showToast('❌ Error loading journal. It may be corrupted.', 'error');
        console.error('Load error:', e);
    }
}

function saveJournal() {
    try {
        const images = [];
        paperSheet.querySelectorAll('.sticker').forEach(sticker => {
            const img = sticker.querySelector('img');
            images.push({
                src:   img.src,
                top:   sticker.style.top,
                left:  sticker.style.left,
                width: sticker.style.maxWidth
            });
        });

        const j = {
            title:  formatDateTitle(new Date()),
            date:   new Date().toLocaleString(),
            text:   journalText.value,
            images: images
        };

        const jString = JSON.stringify(j);
        if (jString.length > 4500000) {
            showToast('⚠️ Journal is too large! Try removing some images.', 'error');
            return;
        }

        localStorage.setItem(currentJournalId, jString);
        showToast('✦ Entry saved to SYNAPSE Journal', 'success');
        setTimeout(() => backToHome(), 800);
    } catch(e) {
        if (e.name === 'QuotaExceededError') {
            showToast('⚠️ Storage full! Remove old entries or reduce images.', 'error');
        } else {
            showToast('❌ Error saving: ' + e.message, 'error');
        }
        console.error('Save error:', e);
    }
}

function backToHome() {
    homepage.style.display = 'block';
    editor.style.display   = 'none';
    updateNavForEditor(false);
    loadJournals();
}

// ── Nav breadcrumb update ─────────────────────
function updateNavForEditor(isEditing) {
    const breadcrumb  = document.getElementById('navBreadcrumb');
    const backLink    = document.getElementById('navBackLink');
    if (isEditing) {
        breadcrumb.textContent = 'Writing';
        if (backLink) backLink.style.display = 'block';
    } else {
        breadcrumb.textContent = '';
        if (backLink) backLink.style.display = 'none';
    }
}

// ── Toast notification ────────────────────────
function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.syn-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'syn-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        background: ${type === 'success' ? 'rgba(124,106,247,0.95)' : 'rgba(180,60,60,0.95)'};
        color: white;
        padding: 10px 22px;
        border-radius: 30px;
        font-family: var(--font-ui, 'Space Grotesk', sans-serif);
        font-size: 0.85rem;
        font-weight: 500;
        z-index: 9000;
        opacity: 0;
        transition: all 0.3s ease;
        backdrop-filter: blur(8px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        white-space: nowrap;
        letter-spacing: 0.02em;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ── Date title formatter ──────────────────────
function formatDateTitle(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
}

// ── Init ──────────────────────────────────────
loadJournals();