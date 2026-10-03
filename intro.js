(function(){
'use strict';
var root=document.documentElement,intro=document.getElementById('intro'),mq=matchMedia('(max-width:767px)'),done=false,timers=[];
if(!intro||!mq.matches){if(intro)intro.remove();return;}
function load(path,tag){return new Promise(function(r){var e=document.createElement(tag);e.onload=r;e.onerror=r;e[tag==='link'?'href':'src']=path;if(tag==='link')e.rel='stylesheet';document.head.appendChild(e);});}
load('mobile.css','link');
load('mobile.js','script');
try{sessionStorage.setItem('lune-intro-seen','1');}catch(e){}
var skip=intro.querySelector('.intro__skip');if(skip)skip.remove();
var petals=intro.querySelector('#introPetals');
var P=[[-8,5,86,1,5.8,0,13,28,-18,38,92,.72],[72,-8,66,2,6.6,-.8,-10,-22,20,-42,-96,.66],[34,-12,54,3,5.2,-1.5,16,34,-8,56,120,.52],[88,16,72,1,7.1,-2.2,-15,-31,28,-24,-84,.62],[12,29,58,2,6.2,-3.1,11,24,-35,28,84,.55],[57,24,44,3,5.7,-4.1,-12,-25,12,-48,-108,.58],[-4,52,78,1,7.5,-5,20,39,-24,44,110,.5],[78,48,52,2,5.9,-5.7,-18,-35,18,-54,-116,.64],[26,62,64,3,6.9,-6.2,12,27,-16,36,96,.48],[64,72,46,1,6.1,-7,-10,-21,22,-40,-90,.56]];
P.forEach(function(p){var i=new Image();i.className='intro__petal';i.alt='';i.src='assets/intro/petal-'+p[3]+'.webp';i.style.cssText='--x:'+p[0]+'%;--y:'+p[1]+'%;--w:'+p[2]+'px;--dur:'+p[4]+'s;--delay:'+p[5]+'s;--mx:'+p[6]+'vw;--ex:'+p[7]+'vw;--r0:'+p[8]+'deg;--rm:'+p[9]+'deg;--r1:'+p[10]+'deg;--o:'+p[11]+';';petals&&petals.appendChild(i);});
function wait(ms){return new Promise(function(r){timers.push(setTimeout(r,ms));});}
function scene(n){intro.dataset.scene=n;intro.classList.add('s'+n);intro.querySelectorAll('.intro__scene').forEach(function(s,i){s.classList.toggle('is-active',i===n-1);});}
function finish(){if(done)return;done=true;timers.forEach(clearTimeout);root.classList.remove('intro-lock');intro.classList.add('is-out');setTimeout(function(){intro.remove();},760);}
var cta=intro.querySelector('.intro__3d-btn');if(cta)cta.addEventListener('click',function(e){e.preventDefault();finish();});
window.addEventListener('keydown',function(e){if(e.key==='Escape')finish();});
async function run(){await new Promise(function(r){requestAnimationFrame(function(){requestAnimationFrame(r);});});scene(1);await wait(1150);if(done)return;scene(2);await wait(1650);if(done)return;scene(3);await wait(1750);if(done)return;scene(4);await wait(1850);if(done)return;scene(5);}
run();
setTimeout(finish,11000);
})();
