/**
 * ARCHITECTURAL COMPONENT 1: ADVANCED CANVAS RAIN DROPS ENGINE
 */
class RainEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.drops = [];
        this.staticDrops = [];
        this.maxDrops = 60;        
        this.maxStaticDrops = 120; 
        
        this.initDimensions();
        this.generateStaticEnvironment();
        this.bindEvents();
    }

    initDimensions() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.initDimensions();
            this.generateStaticEnvironment();
        });
    }

    generateStaticEnvironment() {
        this.staticDrops = [];
        for (let i = 0; i < this.maxStaticDrops; i++) {
            this.staticDrops.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                r: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.4 + 0.1
            });
        }
    }

    createDynamicDrop() {
        if (this.drops.length < this.maxDrops) {
            this.drops.push({
                x: Math.random() * this.width,
                y: Math.random() * -100,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 5 + 4,
                weight: Math.random() * 2 + 1,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }

    updateAndRender() {
        // Subtle clean layout frame blend to create beautiful natural fluid trails
        this.ctx.fillStyle = 'rgba(7, 7, 9, 0.15)'; 
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Render Static Glass Droplets
        this.staticDrops.forEach(sd => {
            this.ctx.beginPath();
            this.ctx.arc(sd.x, sd.y, sd.r, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(156, 182, 255, ${sd.alpha})`;
            this.ctx.fill();
        });

        // Compute Physics Vector updates on dynamic elements
        this.createDynamicDrop();
        
        for (let i = this.drops.length - 1; i >= 0; i--) {
            let d = this.drops[i];
            d.y += d.speed;
            d.x += Math.random() * 0.4 - 0.2; // Sideways glass jitter friction simulation

            // Draw droplet structural vectors
            this.ctx.beginPath();
            this.ctx.moveTo(d.x, d.y);
            this.ctx.lineTo(d.x, d.y + d.length);
            this.ctx.strokeStyle = `rgba(174, 207, 255, ${d.opacity})`;
            this.ctx.lineWidth = d.weight;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            // Evict expired components out of vector array loop limits
            if (d.y > this.height) {
                this.drops.splice(i, 1);
            }
        }
        
        requestAnimationFrame(() => this.updateAndRender());
    }
}

/**
 * ARCHITECTURAL COMPONENT 2: YOUTUBE API LOFI MEDIA ENGINE WRAPPER
 */
// 1. Instantiating curations structure maps
const VIBE_PLAYLIST = [
    { id: 'W05YVw7484M', title: 'Chaiyya Chaiyya (Slowed + Lofi)', artist: 'A.R. Rahman' },
    { id: '99mq93w_Vp8', title: 'Kahi Door Jab Din Dhal Jaye', artist: 'Mukesh' },
    { id: 'T94PHkuydcw', title: 'Rimjhim Gire Sawaan (Acoustic)', artist: 'Kishore Kumar' }
];

let currentTrackIndex = 0;
let ytPlayerEngine = null;
let appStatePlaying = false;
let progressTrackingInterval = null;

const ambientRainElement = document.getElementById('ambient-rain');
const mainActionButton = document.getElementById('btn-toggle');

// Async load third party framework modules securely 
let tag = document.createElement('script');
tag.src = "https://youtube.com";
document.head.appendChild(tag);

function onYouTubeIframeAPIReady() {
    ytPlayerEngine = new YT.Player('hidden-youtube-player', {
        height: '1',
        width: '1',
        videoId: VIBE_PLAYLIST[currentTrackIndex].id,
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'disablekb': 1,
            'rel': 0
        },
        events: {
            'onReady': onPlayerEngineReady,
            'onStateChange': onPlayerEngineStateChange
        }
    });
}

function onPlayerEngineReady(event) {
    // UI Ready, unlock user event hooks safely
    mainActionButton.addEventListener('click', handlePlaybackToggle);
    document.getElementById('btn-next').addEventListener('click', () => switchTrack(1));
    document.getElementById('btn-prev').addEventListener('click', () => switchTrack(-1));
}

function handlePlaybackToggle() {
    if (!appStatePlaying) {
        ytPlayerEngine.playVideo();
        ambientRainElement.volume = 0.45; // Mix safe sound parameters
        ambientRainElement.play();
        mainActionButton.innerText = "LEAVE TRAIN";
        appStatePlaying = true;
    } else {
        ytPlayerEngine.pauseVideo();
        ambientRainElement.pause();
        mainActionButton.innerText = "ENTER TRAIN";
        appStatePlaying = false;
    }
}

function switchTrack(direction) {
    currentTrackIndex = (currentTrackIndex + direction + VIBE_PLAYLIST.length) % VIBE_PLAYLIST.length;
    ytPlayerEngine.loadVideoById(VIBE_PLAYLIST[currentTrackIndex].id);
    if (!appStatePlaying) handlePlaybackToggle();
    syncTrackMetadataUI();
}

function syncTrackMetadataUI() {
    const currentTrack = VIBE_PLAYLIST[currentTrackIndex];
    document.getElementById('track-title').innerText = currentTrack.title;
    document.getElementById('track-artist').innerText = currentTrack.artist;
}

function onPlayerEngineStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        syncTrackMetadataUI();
        startProgressTracking();
    } else {
        stopProgressTracking();
    }
    
    // Smooth infinite playback playlist routing loop mapping
    if (event.data === YT.PlayerState.ENDED) {
        switchTrack(1);
    }
}

function startProgressTracking() {
    progressTrackingInterval = setInterval(() => {
        if(ytPlayerEngine && ytPlayerEngine.getDuration) {
            const currentTime = ytPlayerEngine.getCurrentTime();
            const totalDuration = ytPlayerEngine.getDuration();
            const percentage = (currentTime / totalDuration) * 100;
            document.getElementById('progress-bar').style.width = `${percentage}%`;
        }
    }, 500);
}

function stopProgressTracking() {
    clearInterval(progressTrackingInterval);
}

// Global live metrics simulation 
setInterval(() => {
    const deltaCount = Math.floor(Math.random() * 10) - 5;
    const currentCount = parseInt(document.getElementById('live-count').innerText) + deltaCount;
    document.getElementById('live-count').innerText = Math.max(50, Math.min(250, currentCount));
}, 4000);

// Initialize graphics initialization layers
const rainSystem = new RainEngine('rain-glass-engine');
rainSystem.updateAndRender();
