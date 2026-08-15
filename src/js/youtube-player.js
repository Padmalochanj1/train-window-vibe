/* Rainy Train — YouTube controller
   Plays the "Rainy_Train" playlist (20 videos, by Padmalochan Jena) end-to-end.
   This is a real PL... playlist, so listType:'playlist' + list is fully
   supported by the IFrame API — Next/Previous within the queue just work,
   no Mix-radio fallback tricks needed.
   Audio-only: the iframe is loaded and plays normally, but is visually
   hidden (see .yt-audio-only in main.css) — the site only ever shows an
   equalizer/"Now Playing" card, never the video itself.
*/
const RAINY_TRAIN_YOUTUBE = {
  playlistId: 'PLEPwt-q_S7Ck',
  playlistUrl: 'https://www.youtube.com/playlist?list=PLEPwt-q_S7Ck'
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
    playerVars: {
      listType: 'playlist',
      list: RAINY_TRAIN_YOUTUBE.playlistId,
      autoplay: 0,
      controls: 0,
      playsinline: 1,
      rel: 0,
      iv_load_policy: 3,
      fs: 0
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
  updateRainyTrainNowPlayingTitle();
}

function onRainyTrainYTStateChange(event) {
  if (!window.YT) return;
  if (event.data === YT.PlayerState.PLAYING) {
    rainyTrainMusicPlaying = true;
    setRainyTrainYTStatus('Playing ambient music');
    syncRainyTrainPlayButton(true);
    setRainyTrainRadioCardPlaying(true);
    updateRainyTrainNowPlayingTitle();
  } else if (event.data === YT.PlayerState.PAUSED) {
    rainyTrainMusicPlaying = false;
    setRainyTrainYTStatus('Paused');
    syncRainyTrainPlayButton(false);
    setRainyTrainRadioCardPlaying(false);
  } else if (event.data === YT.PlayerState.ENDED) {
    rainyTrainMusicPlaying = false;
    setRainyTrainYTStatus('Track ended — loading next…');
    syncRainyTrainPlayButton(false);
    setRainyTrainRadioCardPlaying(false);
  }
}

function updateRainyTrainNowPlayingTitle() {
  if (!rainyTrainYTReady || !rainyTrainYT) return;
  const el = document.getElementById('youtubeTitle');
  if (!el) return;
  const data = typeof rainyTrainYT.getVideoData === 'function' ? rainyTrainYT.getVideoData() : null;
  if (data && data.title) el.textContent = data.title;
}

function setRainyTrainRadioCardPlaying(isPlaying) {
  const card = document.getElementById('radioCard');
  if (card) card.classList.toggle('is-playing', isPlaying);
}

function onRainyTrainYTError(event) {
  console.warn('Rainy Train YouTube error:', event.data);
  setRainyTrainYTStatus(`Track unavailable — skipping (error ${event.data})`);
  if (rainyTrainYTReady) rainyTrainYT.nextVideo();
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

function rainyTrainSetMusicVolume(value) {
  rainyTrainMusicVolume = Number(value);
  applyRainyTrainMusicVolume();
}

function rainyTrainSetMasterVolume(value) {
  rainyTrainMasterVolume = Number(value);
  applyRainyTrainMusicVolume();
}
