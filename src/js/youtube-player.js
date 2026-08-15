/* Rainy Train — YouTube audio layers
   Main layer: user-controlled music playlist.
   Background layer: fixed train sound at 20% maximum, looping, no visible controls.
*/
const RAINY_TRAIN_YOUTUBE = {
  musicPlaylistId: 'PLeatb7hupNV_AWUl_7ttbsKeCQh8tF5N4',
  musicPlaylistUrl: 'https://music.youtube.com/playlist?list=PLeatb7hupNV_AWUl_7ttbsKeCQh8tF5N4',
  trainVideoId: 'ImOSLdLSA5Q',
  trainVolume: 20
};

let musicYT = null;
let trainYT = null;
let musicReady = false;
let trainReady = false;
let musicPlaying = false;
let musicVolume = 40;
let musicPendingPlay = false;
let trainPendingPlay = false;
let trainStarted = false;
window.rainyTrainRepeatEnabled = true;
let consecutiveMusicErrors = 0;

function onYouTubeIframeAPIReady() {
  musicYT = new YT.Player('youtube-player', {
    width: '1', height: '1',
    playerVars: {
      listType: 'playlist', list: RAINY_TRAIN_YOUTUBE.musicPlaylistId,
      autoplay: 0, controls: 0, playsinline: 1, rel: 0,
      iv_load_policy: 3, fs: 0, loop: 1
    },
    events: {
      onReady: onMusicReady,
      onStateChange: onMusicStateChange,
      onError: onMusicError,
      onAutoplayBlocked: () => setMusicStatus('Browser blocked autoplay — press Play')
    }
  });

  trainYT = new YT.Player('train-player', {
    width: '1', height: '1',
    videoId: RAINY_TRAIN_YOUTUBE.trainVideoId,
    playerVars: {
      autoplay: 0, controls: 0, playsinline: 1, rel: 0,
      iv_load_policy: 3, fs: 0, loop: 1,
      playlist: RAINY_TRAIN_YOUTUBE.trainVideoId
    },
    events: {
      onReady: onTrainReady,
      onError: onTrainError,
      onAutoplayBlocked: () => { trainPendingPlay = true; }
    }
  });
}

function onMusicReady() {
  musicReady = true;
  applyMusicVolume();
  updateNowPlayingTitle();
  setMusicLoop(true);
  const repeatBtn = document.getElementById('repeatBtn');
  if (repeatBtn) repeatBtn.classList.add('active');
  if (musicPendingPlay) {
    musicPendingPlay = false;
    startMusicAndTrain();
  } else {
    setMusicStatus('Ready — press play to begin the journey');
  }
}

function onTrainReady() {
  trainReady = true;
  trainYT.setVolume(RAINY_TRAIN_YOUTUBE.trainVolume);
  // Do not start until the first user interaction that starts music.
  if (trainPendingPlay) startTrainSound();
}

function startTrainSound() {
  if (!trainReady || !trainYT) {
    trainPendingPlay = true;
    return;
  }
  trainPendingPlay = false;
  trainYT.setVolume(RAINY_TRAIN_YOUTUBE.trainVolume);
  trainYT.playVideo();
  trainStarted = true;
}

function startMusicAndTrain() {
  if (!musicReady || !musicYT) {
    musicPendingPlay = true;
    setMusicStatus('Loading YouTube…');
    return;
  }
  startTrainSound();
  musicYT.playVideo();
}

function onMusicStateChange(event) {
  if (!window.YT) return;
  if (event.data === YT.PlayerState.PLAYING) {
    musicPlaying = true;
    consecutiveMusicErrors = 0;
    setMusicStatus('Playing ambient music');
    syncPlayButton(true);
    setPlayingAnimation(true);
    updateNowPlayingTitle();
    // Keep the train layer running whenever music is playing.
    startTrainSound();
  } else if (event.data === YT.PlayerState.PAUSED) {
    musicPlaying = false;
    setMusicStatus('Paused');
    syncPlayButton(false);
    setPlayingAnimation(false);
  } else if (event.data === YT.PlayerState.ENDED) {
    musicPlaying = false;
    setMusicStatus('Track ended');
    syncPlayButton(false);
    setPlayingAnimation(false);
  }
}

function onMusicError(event) {
  console.warn('Rainy Train music error:', event.data);
  consecutiveMusicErrors++;
  if (consecutiveMusicErrors >= 8) {
    setMusicStatus('This playlist may be blocked from embedding. Try another playlist.');
    return;
  }
  setMusicStatus(`Track unavailable — skipping (error ${event.data})`);
  if (musicReady) musicYT.nextVideo();
}

function onTrainError(event) {
  console.warn('Rainy Train train-sound error:', event.data);
  trainStarted = false;
  // Retry quietly; the train layer has no visible controls by design.
  setTimeout(() => {
    if (musicPlaying) startTrainSound();
  }, 1500);
}

function setMusicStatus(text) {
  const el = document.getElementById('youtubeStatus');
  if (el) el.textContent = text;
}

function syncPlayButton(isPlaying) {
  const btn = document.getElementById('playBtn');
  if (btn) btn.textContent = isPlaying ? 'Ⅱ' : '▶';
}

function setPlayingAnimation(isPlaying) {
  const el = document.querySelector('.now-playing');
  if (el) el.classList.toggle('playing', isPlaying);
}

function updateNowPlayingTitle() {
  if (!musicReady || !musicYT) return;
  const el = document.getElementById('youtubeTitle');
  if (!el) return;
  const data = typeof musicYT.getVideoData === 'function' ? musicYT.getVideoData() : null;
  if (data && data.title) el.textContent = data.title;
}

function applyMusicVolume() {
  if (musicReady && musicYT) musicYT.setVolume(musicVolume);
}

function setMusicLoop(enabled) {
  if (musicReady && musicYT && typeof musicYT.setLoop === 'function') musicYT.setLoop(Boolean(enabled));
}

function rainyTrainToggleMusic() {
  if (!musicReady) {
    musicPendingPlay = !musicPendingPlay;
    if (musicPendingPlay) setMusicStatus('Loading YouTube…');
    return;
  }
  const state = musicYT.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    musicYT.pauseVideo();
  } else {
    startMusicAndTrain();
  }
}

function rainyTrainNext() {
  if (musicReady) musicYT.nextVideo();
}

function rainyTrainPrevious() {
  if (musicReady) musicYT.previousVideo();
}

function rainyTrainShuffle() {
  if (musicReady) musicYT.setShuffle(true);
}

function rainyTrainRepeat() {
  if (!musicReady) return;
  const enabled = !window.rainyTrainRepeatEnabled;
  window.rainyTrainRepeatEnabled = enabled;
  setMusicLoop(enabled);
  const btn = document.getElementById('repeatBtn');
  if (btn) btn.classList.toggle('active', enabled);
}

function rainyTrainSetMusicVolume(value) {
  musicVolume = Number(value);
  applyMusicVolume();
}
