const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const app=$('#app'), canvas=$('#rainCanvas'), ctx=canvas.getContext('2d');
let drops=[], rainLevel=1, speed=78, playing=true, journeySeconds=5078;
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);makeDrops()}
function makeDrops(){const count=Math.floor(120+rainLevel*260);drops=Array.from({length:count},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,l:7+Math.random()*23,s:2+Math.random()*5,a:.15+Math.random()*.45,w:.5+Math.random()*1.2}))}
function rain(){ctx.clearRect(0,0,innerWidth,innerHeight);if(rainLevel>0){ctx.lineCap='round';for(const d of drops){ctx.strokeStyle=`rgba(220,235,245,${d.a*rainLevel})`;ctx.lineWidth=d.w;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-d.s*.25,d.y+d.l);ctx.stroke();d.y+=d.s*(.65+rainLevel);d.x-=d.s*.08;if(d.y>innerHeight+30){d.y=-30;d.x=Math.random()*innerWidth}}}requestAnimationFrame(rain)}
function clock(){const now=new Date();$('#clock').textContent=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',hour12:true}).replace(' ','');$('#date').textContent=now.toLocaleDateString([], {weekday:'long',day:'numeric',month:'long',year:'numeric'});}
function journeyClock(){if(playing)journeySeconds++;const h=String(Math.floor(journeySeconds/3600)).padStart(2,'0'),m=String(Math.floor(journeySeconds%3600/60)).padStart(2,'0'),s=String(journeySeconds%60).padStart(2,'0');$('#journeyTime').textContent=`${h}:${m}:${s}`;speed=Math.round(62+Math.sin(Date.now()/6000)*16+Math.random()*2);$('#speedValue').textContent=speed}
function bindRange(id,out,dock){const el=$(id), label=$(out), d=$(dock);el.addEventListener('input',()=>{label.textContent=el.value+'%';if(d)d.textContent=el.value+'%';if(id==='#rainRange'){rainLevel=el.value/100;makeDrops()}})}
bindRange('#rainRange','#rainPct','#dockRain');bindRange('#trainRange','#trainPct','#dockTrain');bindRange('#hornRange','#hornPct','#dockHorn');
bindRange('#musicRange','#musicPct','#dockMusic');
bindRange('#volumeRange','#volumePct','#dockVolume');

$('#musicRange').addEventListener('input', e => {
  if (typeof rainyTrainSetMusicVolume === 'function') rainyTrainSetMusicVolume(e.target.value);
});
$('#volumeRange').addEventListener('input', e => {
  if (typeof rainyTrainSetMasterVolume === 'function') rainyTrainSetMasterVolume(e.target.value);
});

$('#playBtn').onclick=()=>{
  if (typeof rainyTrainToggleMusic === 'function') rainyTrainToggleMusic();
  playing=!playing;
  app.classList.toggle('paused',!playing);
};
$('#nextBtn').onclick=()=>{ if(typeof rainyTrainNext==='function') rainyTrainNext(); };
$('#nightBtn').onclick=()=>app.classList.toggle('night');
$('#favoriteBtn').onclick=e=>e.currentTarget.textContent=e.currentTarget.textContent==='♡'?'♥':'♡';
$('#fullscreenBtn').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
$('#menuBtn').onclick=()=>document.body.classList.toggle('menu-open');

const rainyTrainQuotes=[
  '"Window seat, warm chai, no signal. Perfect."',
  '"I always miss my stop on this route. Never mind."',
  '"Someone left a book on the seat. I\'m keeping it."',
  '"The rain sounds better through a train window."',
  '"Four hours left. I\'m in no hurry at all."',
  '"This is the only place I actually switch my phone off."',
  '"Every station looks prettier when it\'s raining."',
  '"I take this train just for the ride, not the destination."'
];
let rainyTrainQuoteIndex=0;
function showNextRainyTrainQuote(){
  const el=$('#quoteText');
  if(!el)return;
  rainyTrainQuoteIndex=(rainyTrainQuoteIndex+1)%rainyTrainQuotes.length;
  el.style.opacity=0;
  setTimeout(()=>{el.textContent=rainyTrainQuotes[rainyTrainQuoteIndex];el.style.opacity=1},200);
}
const quoteCardEl=$('#quoteCard');
if(quoteCardEl)quoteCardEl.onclick=showNextRainyTrainQuote;

$$('.nav-item').forEach(btn=>btn.onclick=()=>{document.getElementById(btn.dataset.target).scrollIntoView({behavior:'smooth'});$$('.nav-item').forEach(x=>x.classList.remove('active'));btn.classList.add('active');document.body.classList.remove('menu-open')});
$$('[data-scroll]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.scroll).scrollIntoView({behavior:'smooth'}));
$$('.journey-card').forEach(card=>card.onclick=()=>{$$('.journey-card').forEach(c=>c.classList.remove('active'));card.classList.add('active');const name=card.dataset.journey;const data={monsoon:['Silent Valley','12 km to go'],midnight:['Moonbridge','28 km to go'],morning:['Misty Fields','8 km to go'],mountain:['Pine Tunnel','19 km to go']}[name];$('#nextStation').textContent=data[0];$('#distance').textContent=data[1]});
let lastScroll=0;addEventListener('scroll',()=>{app.classList.add('scrolling');clearTimeout(lastScroll);lastScroll=setTimeout(()=>app.classList.remove('scrolling'),250)});addEventListener('resize',resize);resize();clock();setInterval(clock,1000);setInterval(journeyClock,1000);rain();
