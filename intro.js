(function(){
  'use strict';

  var root=document.documentElement;
  var intro=document.getElementById('intro');
  var mq=window.matchMedia('(max-width:767px)');
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var done=false;
  var timers=[];

  var seen=false;
  try{seen=sessionStorage.getItem('lune-intro-seen')==='1'}catch(e){}

  if(!intro || !mq.matches || reduced || seen){
    if(intro) intro.remove();
    root.classList.remove('intro-on','intro-lock');
    return;
  }

  var style=document.createElement('style');
  style.textContent=`
    @media (max-width:767px){
      html.intro-lock,html.intro-lock body{overflow:hidden!important;height:100%!important}

      #intro{
        position:fixed;
        inset:0;
        z-index:9999;
        overflow:hidden;
        isolation:isolate;
        background:#f7eee8;
        opacity:1;
        visibility:visible;
        transform:translateZ(0);
        transition:opacity 1.25s cubic-bezier(.16,1,.3,1),visibility 0s linear 1.25s;
      }

      #intro .intro__scenes,
      #intro .intro__scene{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        overflow:hidden;
      }

      #intro .intro__scene{
        z-index:1;
        opacity:0;
        visibility:hidden;
        transform:scale(1.035) translate3d(0,18px,0);
        will-change:opacity,transform,clip-path;
        transition:
          opacity 1.25s cubic-bezier(.16,1,.3,1),
          transform 2.2s cubic-bezier(.16,1,.3,1),
          clip-path 1.8s cubic-bezier(.16,1,.3,1),
          visibility 0s linear 1.25s;
      }

      #intro .intro__scene img{
        width:100%;
        height:100%;
        display:block;
        object-fit:cover;
        object-position:center;
        transform:scale(1.02);
        will-change:transform;
      }

      /* Scene 1: quiet, almost-white opening. */
      #intro .intro__scene[data-scene="1"]{
        opacity:1;
        visibility:visible;
        transform:scale(1) translate3d(0,0,0);
        z-index:2;
        clip-path:inset(0 0 0 0);
      }

      /* Scene 2 is revealed like a flower opening, not like a slider. */
      #intro .intro__scene[data-scene="2"]{
        clip-path:circle(0% at 50% 52%);
      }
      #intro.s2 .intro__scene[data-scene="1"]{
        opacity:.18;
        transform:scale(1.035);
      }
      #intro.s2 .intro__scene[data-scene="2"]{
        opacity:1;
        visibility:visible;
        z-index:3;
        clip-path:circle(145% at 50% 52%);
        transform:scale(1) translate3d(0,0,0);
        transition-delay:.08s;
      }
      #intro.s2 .intro__scene[data-scene="2"] img{
        animation:introCameraDrift 5.8s cubic-bezier(.16,1,.3,1) both;
      }

      /* Scene 3 is uncovered by a soft foreground-petal wipe. */
      #intro .intro__scene[data-scene="3"]{
        clip-path:ellipse(0% 0% at 92% 72%);
      }
      #intro.s3 .intro__scene[data-scene="2"]{
        opacity:.14;
        transform:scale(1.025);
      }
      #intro.s3 .intro__scene[data-scene="3"]{
        opacity:1;
        visibility:visible;
        z-index:4;
        clip-path:ellipse(125% 125% at 92% 72%);
        transform:scale(1) translate3d(0,0,0);
        transition-duration:1.65s,2.1s,1.65s;
      }
      #intro.s3 .intro__scene[data-scene="3"] img{
        animation:introFinalDrift 4.8s cubic-bezier(.16,1,.3,1) both;
      }

      #intro .intro__vignette{
        position:absolute;
        inset:0;
        z-index:7;
        pointer-events:none;
        background:
          radial-gradient(circle at 50% 45%,rgba(255,255,255,.08),transparent 48%),
          linear-gradient(180deg,rgba(30,17,14,.02),rgba(30,17,14,.02) 55%,rgba(30,17,14,.12));
        opacity:.7;
        transition:opacity 1.2s ease;
      }

      #intro .intro__petals{
        position:absolute;
        inset:0;
        z-index:8;
        pointer-events:none;
        overflow:hidden;
        perspective:900px;
      }

      #intro .intro__petal{
        position:absolute;
        left:var(--x);
        top:var(--y);
        width:var(--w);
        height:auto;
        opacity:0;
        transform:translate3d(0,0,0) rotate(var(--r0)) scale(.84);
        transform-origin:center;
        will-change:transform,opacity,filter;
        filter:blur(var(--blur)) drop-shadow(0 10px 18px rgba(80,35,28,.12));
      }

      #intro.s2 .intro__petal{
        animation:introPetal var(--dur) cubic-bezier(.16,1,.3,1) var(--delay) both;
      }
      #intro.s3 .intro__petal{
        animation:introPetalFinal var(--dur) cubic-bezier(.16,1,.3,1) var(--delay) both;
      }

      @keyframes introPetal{
        0%{opacity:0;transform:translate3d(0,-9vh,0) rotate(var(--r0)) scale(.82)}
        10%{opacity:var(--o)}
        52%{opacity:var(--o);transform:translate3d(var(--mx),42vh,0) rotate(var(--rm)) scale(1)}
        100%{opacity:0;transform:translate3d(var(--ex),112vh,0) rotate(var(--r1)) scale(.92)}
      }

      @keyframes introPetalFinal{
        0%{opacity:0;transform:translate3d(0,-8vh,0) rotate(var(--r0)) scale(.86)}
        12%{opacity:calc(var(--o) * .72)}
        58%{opacity:calc(var(--o) * .72);transform:translate3d(calc(var(--mx) * -0.45),48vh,0) rotate(calc(var(--rm) * .7)) scale(1.04)}
        100%{opacity:0;transform:translate3d(calc(var(--ex) * -0.7),114vh,0) rotate(var(--r1)) scale(.94)}
      }

      @keyframes introCameraDrift{
        from{transform:scale(1.02) translate3d(0,0,0)}
        to{transform:scale(1.075) translate3d(-1.2%,1%,0)}
      }
      @keyframes introFinalDrift{
        from{transform:scale(1.02) translate3d(0,0,0)}
        to{transform:scale(1.055) translate3d(-.8%,.5%,0)}
      }

      #intro.is-out{
        opacity:0;
        visibility:hidden;
        pointer-events:none;
      }

      #intro .intro__skip,
      #intro .intro__progress,
      #intro .intro__loading-label{
        display:none!important;
      }

      @media (prefers-reduced-motion:reduce){
        #intro{display:none!important}
      }
    }
  `;
  document.head.appendChild(style);

  function wait(ms){
    return new Promise(function(resolve){
      timers.push(setTimeout(resolve,ms));
    });
  }

  function scene(n){
    intro.dataset.scene=String(n);
    intro.className='intro s'+n;
    intro.querySelectorAll('.intro__scene').forEach(function(s,i){
      s.classList.toggle('is-active',i===n-1);
    });
  }

  function finish(){
    if(done)return;
    done=true;
    timers.forEach(clearTimeout);
    try{sessionStorage.setItem('lune-intro-seen','1')}catch(e){}
    root.classList.remove('intro-lock','intro-on');
    intro.classList.add('is-out');
    timers.push(setTimeout(function(){
      if(intro.parentNode)intro.remove();
      if(style.parentNode)style.remove();
    },1300));
  }

  var petals=intro.querySelector('#introPetals');
  var P=[
    [-8,5,86,1,5.8,0,13,28,-18,38,92,.72,'2px'],
    [72,-8,66,2,6.6,.2,-10,-22,20,-42,-96,.66,'1px'],
    [34,-12,54,3,5.2,.45,16,34,-8,56,120,.52,'0px'],
    [88,16,72,1,7.1,.9,-15,-31,28,-24,-84,.62,'3px'],
    [12,29,58,2,6.2,1.1,11,24,-35,28,84,.55,'1px'],
    [57,24,44,3,5.7,1.5,-12,-25,12,-48,-108,.58,'0px'],
    [-4,52,78,1,7.5,1.9,20,39,-24,44,110,.5,'3px'],
    [78,48,52,2,5.9,2.2,-18,-35,18,-54,-116,.64,'2px'],
    [26,62,64,3,6.9,2.6,12,27,-16,36,96,.48,'1px'],
    [64,72,46,1,6.1,3,-10,-21,22,-40,-90,.56,'0px']
  ];

  P.forEach(function(p){
    var i=new Image();
    i.className='intro__petal';
    i.alt='';
    i.decoding='async';
    i.src='assets/intro/petal-'+p[3]+'.webp';
    i.style.cssText='--x:'+p[0]+'%;--y:'+p[1]+'%;--w:'+p[2]+'px;--dur:'+p[4]+'s;--delay:'+p[5]+'s;--mx:'+p[6]+'vw;--ex:'+p[7]+'vw;--r0:'+p[8]+'deg;--rm:'+p[9]+'deg;--r1:'+p[10]+'deg;--o:'+p[11]+';--blur:'+p[12]+';';
    i.onerror=function(){i.remove()};
    if(petals)petals.appendChild(i);
  });

  window.addEventListener('keydown',function(e){
    if(e.key==='Escape')finish();
  });

  async function run(){
    await new Promise(function(resolve){
      requestAnimationFrame(function(){requestAnimationFrame(resolve)});
    });
    scene(1);
    await wait(1550);
    if(done)return;
    scene(2);
    await wait(3100);
    if(done)return;
    scene(3);
    await wait(3900);
    if(done)return;
    finish();
  }

  run();
})();
