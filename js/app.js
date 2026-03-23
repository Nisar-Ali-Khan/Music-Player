// Sample music database
const songsData = [
    {
        id: 1,
        title: "Blinding Lights",
        artist: "The Weeknd",
        category: "pop",
        duration: "3:20",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        coverArt: "https://via.placeholder.com/300/667eea/ffffff?text=Blinding+Lights"
    },
    {
        id: 2,
        title: "Bohemian Rhapsody",
        artist: "Queen",
        category: "rock",
        duration: "5:55",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        coverArt: "https://via.placeholder.com/300/764ba2/ffffff?text=Bohemian+Rhapsody"
    },
    {
        id: 3,
        title: "Take Five",
        artist: "Dave Brubeck",
        category: "jazz",
        duration: "5:24",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        coverArt: "https://via.placeholder.com/300/3498db/ffffff?text=Take+Five"
    },
    {
        id: 4,
        title: "Strobe",
        artist: "Deadmau5",
        category: "electronic",
        duration: "10:34",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        coverArt: "https://via.placeholder.com/300/e74c3c/ffffff?text=Strobe"
    },
    {
        id: 5,
        title: "Canon in D",
        artist: "Johann Pachelbel",
        category: "classical",
        duration: "4:45",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        coverArt: "https://via.placeholder.com/300/f39c12/ffffff?text=Canon+in+D"
    },
    {
        id: 6,
        title: "Shape of You",
        artist: "Ed Sheeran",
        category: "pop",
        duration: "3:53",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        coverArt: "https://via.placeholder.com/300/1abc9c/ffffff?text=Shape+of+You"
    },
    {
        id: 7,
        title: "Sweet Child O' Mine",
        artist: "Guns N' Roses",
        category: "rock",
        duration: "5:56",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        coverArt: "https://via.placeholder.com/300/9b59b6/ffffff?text=Sweet+Child"
    },
    {
        id: 8,
        title: "So What",
        artist: "Miles Davis",
        category: "jazz",
        duration: "9:22",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        coverArt: "https://via.placeholder.com/300/e67e22/ffffff?text=So+What"
    }
];

// DOM Elements
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.getElementById('volumeIcon');
const progressBar = document.getElementById('progress');
const progressContainer = document.querySelector('.progress-bar');
const currentTimeSpan = document.getElementById('currentTime');
const durationSpan = document.getElementById('duration');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const albumArt = document.getElementById('albumArt');
const playlistElement = document.getElementById('playlist');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.category-btn');

// Player state
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeated = false;
let currentCategory = 'all';
let currentSearchTerm = '';

// Filtered songs
let filteredSongs = [...songsData];

// Initialize player
function init() {
    renderPlaylist();
    loadSong(currentSongIndex);
    
    // Event listeners
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrev);
    nextBtn.addEventListener('click', playNext);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleSongEnd);
    progressContainer.addEventListener('click', seek);
    volumeSlider.addEventListener('input', changeVolume);
    searchInput.addEventListener('input', handleSearch);
    
    // Category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            filterSongs();
        });
    });
    
    // Set initial volume
    audio.volume = volumeSlider.value / 100;
}

// Load song
function loadSong(index) {
    const song = filteredSongs[index];
    if (!song) return;
    
    audio.src = song.audioUrl;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumArt.src = song.coverArt;
    
    // Update active playlist item
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Reset progress
    progressBar.style.width = '0%';
    currentTimeSpan.textContent = '0:00';
    
    // Set duration when loaded
    audio.addEventListener('loadedmetadata', () => {
        durationSpan.textContent = formatTime(audio.duration);
    });
    
    // Auto-play if was playing
    if (isPlaying) {
        audio.play();
    }
}

// Toggle play/pause
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

// Play next song
function playNext() {
    if (isShuffled) {
        currentSongIndex = Math.floor(Math.random() * filteredSongs.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % filteredSongs.length;
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        audio.play();
    }
}

// Play previous song
function playPrev() {
    if (isShuffled) {
        currentSongIndex = Math.floor(Math.random() * filteredSongs.length);
    } else {
        currentSongIndex = (currentSongIndex - 1 + filteredSongs.length) % filteredSongs.length;
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        audio.play();
    }
}

// Handle song end
function handleSongEnd() {
    if (isRepeated) {
        audio.currentTime = 0;
        audio.play();
    } else {
        playNext();
    }
}

// Toggle shuffle
function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.style.color = isShuffled ? '#667eea' : '#666';
}

// Toggle repeat
function toggleRepeat() {
    isRepeated = !isRepeated;
    repeatBtn.style.color = isRepeated ? '#667eea' : '#666';
}

// Update progress bar
function updateProgress() {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeSpan.textContent = formatTime(audio.currentTime);
    }
}

// Seek to position
function seek(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Change volume
function changeVolume() {
    const volume = volumeSlider.value / 100;
    audio.volume = volume;
    
    if (volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Format time (seconds to mm:ss)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Render playlist
function renderPlaylist() {
    playlistElement.innerHTML = '';
    
    filteredSongs.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        li.innerHTML = `
            <div class="playlist-item-info">
                <div class="playlist-item-title">${escapeHtml(song.title)}</div>
                <div class="playlist-item-artist">${escapeHtml(song.artist)}</div>
            </div>
            <div class="playlist-item-duration">${song.duration}</div>
        `;
        
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            if (isPlaying) {
                audio.play();
            } else {
                togglePlay();
            }
        });
        
        playlistElement.appendChild(li);
    });
}

// Filter songs by category and search
function filterSongs() {
    let filtered = [...songsData];
    
    // Filter by category
    if (currentCategory !== 'all') {
        filtered = filtered.filter(song => song.category === currentCategory);
    }
    
    // Filter by search term
    if (currentSearchTerm) {
        filtered = filtered.filter(song => 
            song.title.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
            song.artist.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );
    }
    
    filteredSongs = filtered;
    currentSongIndex = 0;
    renderPlaylist();
    
    if (filteredSongs.length > 0) {
        loadSong(0);
    } else {
        songTitle.textContent = 'No songs found';
        artistName.textContent = '';
        audio.src = '';
    }
}

// Handle search
function handleSearch() {
    currentSearchTerm = searchInput.value;
    filterSongs();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize the app
init();