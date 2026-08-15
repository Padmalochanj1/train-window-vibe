/* Rainy Train — YouTube controller
   Source video from the URL supplied by the site owner.
   Note: the supplied RD... URL is a YouTube Mix (dynamic radio), not a fixed PL... playlist.
   The IFrame API therefore starts the exact supplied video; the full Mix remains available via "Open on YouTube".
*/
const RAINY_TRAIN_YOUTUBE = {
  videoId: 'BtlnpBb4O8E',
  mixUrl: 'https://www.youtube.com/watch?v=BtlnpBb4O8E&list=RDCLAK5uy_lycab9oGCf-Wrf032tl6Lxn2W68QjdXls'
};

let rainyTrainYT = null;
let rainyTrainYTReady = false;
let rainyTrainMusicPlaying = false;
let rainyTrainMusicVolume = 40;
let rainyTrainMasterVolume = 60;

function onYouTubeIframeAPIReady() {
  rainyTrainYT = new YT.Player('youtube-player', {
    width: '100%',
    height: '100%',
    videoId: RAINY_TRAIN_YOUTUBE.videoId,
    playerVars: {
      autoplay: 0,
      controls: 1,
      playsinline: 1,
      rel: 0,
      iv_load_policy: 3,
      fs: 1
    },
    events: {
      onReady: onRainyTrainYTReady,
      onStateChange: onRainyTrainYTStateChange,
      onError: onRainyTrainYTError,
      onAutoplayBlocked: onRainyTrainYTAutoplayBlocked
    }
  });
}

function onRainyTrainYTReady(event) {
  rainyTrainYTReady = true;
  applyRainyTrainMusicVolume();
  setRainyTrainYTStatus('Ready — press play to begin the journey');
}

function onRainyTrainYTStateChange(event) {
  if (!window.YT) return;
  if (event.data === YT.PlayerState.PLAYING) {
    rainyTrainMusicPlaying = true;
    setRainyTrainYTStatus('Playing ambient music');
    syncRainyTrainPlayButton(true);
  } else if (event.data === YT.PlayerState.PAUSED) {
    rainyTrainMusicPlaying = false;
    setRainyTrainYTStatus('Paused');
    syncRainyTrainPlayButton(false);
  } else if (event.data === YT.PlayerState.ENDED) {
    rainyTrainMusicPlaying = false;
    setRainyTrainYTStatus('Track ended — use Open on YouTube for the full Mix');
    syncRainyTrainPlayButton(false);
  }
}

function onRainyTrainYTError(event) {
  setRainyTrainYTStatus(`YouTube playback unavailable (error ${event.data})`);
  console.warn('Rainy Train YouTube error:', event.data);
}

function onRainyTrainYTAutoplayBlocked() {
  setRainyTrainYTStatus('Browser blocked autoplay — press Play');
}

function setRainyTrainYTStatus(text) {
  const el = document.getElementById('youtubeStatus');
  if (el) el.textContent = text;
}

function syncRainyTrainPlayButton(isPlaying) {
  const btn = document.getElementById('playBtn');
  if (btn) btn.textContent = isPlaying ? 'Ⅱ' : '▶';
}

function applyRainyTrainMusicVolume() {
  if (!rainyTrainYTReady || !rainyTrainYT) return;
  const effective = Math.round((rainyTrainMusicVolume * rainyTrainMasterVolume) / 100);
  rainyTrainYT.setVolume(effective);
}

function rainyTrainPlayMusic() {
  if (!rainyTrainYTReady) {
    setRainyTrainYTStatus('Loading YouTube…');
    return;
  }
  rainyTrainYT.playVideo();
}

function rainyTrainPauseMusic() {
  if (!rainyTrainYTReady) return;
  rainyTrainYT.pauseVideo();
}

function rainyTrainToggleMusic() {
  if (!rainyTrainYTReady) return;
  const state = rainyTrainYT.getPlayerState();
  if (state === YT.PlayerState.PLAYING) rainyTrainPauseMusic();
  else rainyTrainPlayMusic();
}

function rainyTrainNext() {
  if (!rainyTrainYTReady) return;
  rainyTrainYT.nextVideo();
}

function rainyTrainPrevious() {
  if (!rainyTrainYTReady) return;
  rainyTrainYT.previousVideo();
}

function rainyTrainSetMusicVolume(value) {
  rainyTrainMusicVolume = Number(value);
  applyRainyTrainMusicVolume();
}

function rainyTrainSetMasterVolume(value) {
  rainyTrainMasterVolume = Number(value);
  applyRainyTrainMusicVolume();
}
