const $=s=>document.querySelector(s);
let drops=[],rainLevel=1,visualPlaying=true;
const app=$('#app'),canvas=$('#rainCanvas'),ctx=canvas.getContext('2d');
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);makeDrops()}
function makeDrops(){drops=Array.from({length:Math.floor(150+rainLevel*180)},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,l:7+Math.random()*23,s:2+Math.random()*5,a:.15+Math.random()*.45,w:.5+Math.random()*1.2}))}
function rain(){ctx.clearRect(0,0,innerWidth,innerHeight);if(rainLevel>0){for(const d of drops){ctx.strokeStyle=`rgba(220,235,245,${d.a*rainLevel})`;ctx.lineWidth=d.w;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-d.s*.25,d.y+d.l);ctx.stroke();if(visualPlaying){d.y+=d.s*(.65+rainLevel);d.x-=d.s*.08;if(d.y>innerHeight+30){d.y=-30;d.x=Math.random()*innerWidth}}}}requestAnimationFrame(rain)}
function clock(){const n=new Date();$('#clock').textContent=n.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',hour12:true}).replace(' ','');$('#date').textContent=n.toLocaleDateString([],{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
$('#playBtn').onclick=()=>{if(typeof rainyTrainToggleMusic==='function')rainyTrainToggleMusic()};
$('#previousBtn').onclick=()=>{if(typeof rainyTrainPrevious==='function')rainyTrainPrevious()};
$('#nextBtn').onclick=()=>{if(typeof rainyTrainNext==='function')rainyTrainNext()};
$('#shuffleBtn').onclick=e=>{if(typeof rainyTrainShuffle==='function')rainyTrainShuffle();e.currentTarget.classList.add('active');setTimeout(()=>e.currentTarget.classList.remove('active'),450)};
$('#repeatBtn').onclick=()=>{if(typeof rainyTrainRepeat==='function')rainyTrainRepeat()};
$('#musicRange').addEventListener('input',e=>{$('#musicPct').textContent=e.target.value+'%';if(typeof rainyTrainSetMusicVolume==='function')rainyTrainSetMusicVolume(e.target.value)});
$('#nightBtn').onclick=()=>app.classList.toggle('night');
$('#favoriteBtn').onclick=e=>e.currentTarget.textContent=e.currentTarget.textContent==='♡'?'♥':'♡';
$('#fullscreenBtn').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
const quotes=['“Window seat, warm chai, no signal. Perfect.”','“The rain sounds better through a train window.”','“Four hours left. I’m in no hurry at all.”','“Every station looks prettier when it’s raining.”'];let qi=0;
$('#quoteCard').onclick=()=>{$('#quoteText').textContent=quotes[++qi%quotes.length]};
resize();clock();setInterval(clock,1000);rain();
