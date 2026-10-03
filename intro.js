(function(){
  'use strict';
  var root=document.documentElement;
  var intro=document.getElementById('intro');
  var mq=window.matchMedia('(max-width:767px)');
  var done=false, timers=[];

  if(!intro || !mq.matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    if(intro) intro.remove();
    root.classList.remove('intro-on','intro-lock');
    return;
  }

  /* Intro styles are self-contained so the animation cannot disappear when CSS is changed. */
  var style=document.createElement('style');
  style.textContent=`
    @media (max-width:767px){
      html.intro-lock,html.intro-lock body{overflow:hidden!important;height:100%!important}
      #intro{position:fixed;inset:0;z-index:9999;background:#f7eee8;overflow:hidden;opacity:1;visibility:visible}
      #intro .intro__scenes,#intro .intro__scene{position:absolute;inset:0;width:100%;height:100%;overflow:hidden}
      #intro .intro__scene{opacity:0;visibility:hidden;transform:scale(1.045);transition:opacity .95s cubic-bezier(.22,.61,.36,1),transform 1.25s cubic-bezier(.22,.61,.36,1),visibility 0s linear .95s}
      #intro .intro__scene.is-active{opacity:1;visibility:visible;transform:scale(1);transition-delay:0s;z-index:2}
      #intro .intro__scene img{width:100%;height:100%;display:block;object-fit:cover;object-position:center}
      #intro .intro__scene--final img{object-position:center}
      #intro .intro__vignette{position:absolute;inset:0;z-index:4;pointer-events:none;background:linear-gradient(180deg,rgba(30,17,14,.12),rgba(30,17,14,.03) 45%,rgba(30,17,14,.28))}
      #intro .intro__petals{position:absolute;inset:0;z-index:5;pointer-events:none;overflow:hidden}
      #intro .intro__petal{position:absolute;left:var(--x);top:var(--y);width:var(--w);opacity:0;transform:translate3d(0,0,0) rotate(var(--r0));animation:introPetal var(--dur) cubic-bezier(.22,.61,.36,1) var(--delay) infinite;filter:drop-shadow(0 5px 8px rgba(80,35,28,.12))}
      @keyframes introPetal{0%{opacity:0;transform:translate3d(0,-8vh,0) rotate(var(--r0)) scale(.88)}12%{opacity:var(--o)}55%{opacity:var(--o);transform:translate3d(var(--mx),42vh,0) rotate(var(--rm)) scale(1)}100%{opacity:0;transform:translate3d(var(--ex),112vh,0) rotate(var(--r1)) scale(.9)}}
      #intro .intro__button-wrap{position:absolute;left:24px;right:24px;bottom:28px;z-index:7;display:flex;justify-content:center;opacity:0;transform:translateY(18px);animation:introCta .8s cubic-bezier(.22,.61,.36,1) 6.4s forwards}
      @keyframes introCta{to{opacity:1;transform:none}}
      #intro .intro__3d-btn{display:inline-flex;align-items:center;gap:12px;padding:5px 8px 5px 18px;border-radius:999px;background:linear-gradient(180deg,#dba398,#bd786d);color:#fff;border:1px solid rgba(255,255,255,.4);box-shadow:0 14px 32px rgba(61,30,26,.22),inset 0 1px 0 rgba(255,255,255,.5);font:500 14px Inter,system-ui,sans-serif}
      #intro .intro__3d-btn b{width:40px;height:40px;border-radius:50%;background:#fff;color:#8e5a52;display:grid;place-items:center;font-size:18px;font-weight:400}
      #intro.is-out{opacity:0;visibility:hidden;transition:opacity .7s cubic-bezier(.22,.61,.36,1),visibility 0s linear .7s}
      #intro.s2 .intro__scene.is-active{transform:scale(1.015)}
      #intro.s3 .intro__scene.is-active{transform:scale(1)}
      #intro.s4 .intro__scene.is-active{transform:scale(1.018)}
      #intro.s5 .intro__scene.is-active{transform:scale(1)}
    }
  `;
  document.head.appendChild(style);

  function load(path,tag){
    return new Promise(function(resolve){
      var e=document.createElement(tag);
      e.onload=resolve;e.onerror=resolve;
      e[tag==='link'?'href':'src']=path;
      if(tag==='link') e.rel='stylesheet';
      document.head.appendChild(e);
    });
  }

  /* Keep mobile-only UI isolated. */
  Promise.all([load('mobile.css','link'),load('mobile.js','script')]);

  var petals=intro.querySelector('#introPetals');
  var P=[
    [-8,5,86,1,5.8,0,13,28,-18,38,92,.72],[72,-8,66,2,6.6,-.8,-10,-22,20,-42,-96,.66],
    [34,-12,54,3,5.2,-1.5,16,34,-8,56,120,.52],[88,16,72,1,7.1,-2.2,-15,-31,28,-24,-84,.62],
    [12,29,58,2,6.2,-3.1,11,24,-35,28,84,.55],[57,24,44,3,5.7,-4.1,-12,-25,12,-48,-108,.58],
    [-4,52,78,1,7.5,-5,20,39,-24,44,110,.5],[78,48,52,2,5.9,-5.7,-18,-35,18,-54,-116,.64],
    [26,62,64,3,6.9,-6.2,12,27,-16,36,96,.48],[64,72,46,1,6.1,-7,-10,-21,22,-40,-90,.56]
  ];
  P.forEach(function(p){
    var i=new Image();i.className='intro__petal';i.alt='';i.decoding='async';
    i.src='assets/intro/petal-'+p[3]+'.webp';
    i.style.cssText='--x:'+p[0]+'%;--y:'+p[1]+'%;--w:'+p[2]+'px;--dur:'+p[4]+'s;--delay:'+p[5]+'s;--mx:'+p[6]+'vw;--ex:'+p[7]+'vw;--r0:'+p[8]+'deg;--rm:'+p[9]+'deg;--r1:'+p[10]+'deg;--o:'+p[11]+';';
    i.onerror=function(){i.remove()};
    if(petals)petals.appendChild(i);
  });

  function wait(ms){return new Promise(function(resolve){timers.push(setTimeout(resolve,ms));});}
  function scene(n){
    intro.dataset.scene=String(n);
    intro.classList.add('s'+n);
    intro.querySelectorAll('.intro__scene').forEach(function(s,i){s.classList.toggle('is-active',i===n-1)});
  }
  function finish(){
    if(done)return;done=true;timers.forEach(clearTimeout);
    root.classList.remove('intro-lock','intro-on');
    intro.classList.add('is-out');
    timers.push(setTimeout(function(){if(intro.parentNode)intro.remove();if(style.parentNode)style.remove()},720));
  }

  var cta=intro.querySelector('.intro__3d-btn');
  if(cta)cta.addEventListener('click',function(e){e.preventDefault();finish()});
  window.addEventListener('keydown',function(e){if(e.key==='Escape')finish()});

  async function run(){
    await new Promise(function(resolve){requestAnimationFrame(function(){requestAnimationFrame(resolve)})});
    scene(1);await wait(1150);if(done)return;
    scene(2);await wait(1600);if(done)return;
    scene(3);await wait(1700);if(done)return;
    scene(4);await wait(1750);if(done)return;
    scene(5);await wait(2500);if(done)return;
    finish();
  }
  run();
})();
