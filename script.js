// wait for DOM
document.addEventListener('DOMContentLoaded', ()=>{

  /* ---------- NAV TOGGLE for mobile ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navEl = document.getElementById('site-nav');
  navToggle.addEventListener('click', ()=> navEl.classList.toggle('open'));

  // close nav on link click
  document.querySelectorAll('#site-nav a').forEach(a=>{
    a.addEventListener('click', ()=> navEl.classList.remove('open'));
  });

  /* ---------- TYPING EFFECT (simple) ---------- */
  const lines = [
    "We Design, Build & Innovate",
    "Crafting Digital Success Stories",
    "Turning Ideas Into Reality"
  ];
  let li = 0, ci = 0;
  const typed = document.getElementById('typed-line') || document.querySelector('.hero-title span');
  const cursor = document.querySelector('.cursor');
  const typingSpeed = 80, erasingSpeed=40, pause=1400;

  function type() {
    const line = lines[li];
    if(ci < line.length){
      typed.textContent = line.slice(0, ci+1);
      ci++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, pause);
    }
  }
  function erase(){
    if(ci>0){
      typed.textContent = typed.textContent.slice(0, ci-1);
      ci--;
      setTimeout(erase, erasingSpeed);
    } else {
      li = (li+1)%lines.length;
      setTimeout(type, 350);
    }
  }
  setTimeout(type, 600);

  // blinking cursor
  setInterval(()=> { if(cursor) cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0' }, 500);

  /* ---------- GSAP entrance animations ---------- */
  gsap.registerPlugin(ScrollTrigger);

  // fade in sections
  gsap.utils.toArray('.section').forEach(sec=>{
    gsap.from(sec.querySelectorAll('.overlay-glass, .card, .service-card, .card img, .testimonials-wrap, .list'), {
      scrollTrigger: { trigger: sec, start: 'top 80%' },
      y: 40, opacity: 0, stagger: 0.12, duration: 0.85, ease: 'power3.out'
    });
  });

  // stagger service cards
  gsap.from('.service-card', {
    scrollTrigger:{trigger:'#services', start:'top 70%'},
    y: 30, opacity:0, stagger:0.12, duration:0.8, ease:'power3.out'
  });

  /* ---------- Canvas particles & blobs (mouse reactive) ---------- */
  const canvas = document.getElementById('scene-canvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;
  const particles = [];
  const blobs = [];

  // handle resize
  window.addEventListener('resize', ()=>{ W = canvas.width = innerWidth; H = canvas.height = innerHeight; });

  // mouse
  const mouse = { x: W/2, y: H/2 };
  window.addEventListener('mousemove', (e)=> { mouse.x = e.clientX; mouse.y = e.clientY; });

  // create small particles
  for(let i=0;i<90;i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*1.8+0.6,
      vx: (Math.random()-0.5)*0.3,
      vy: (Math.random()-0.5)*0.3,
      hue: 200 + Math.random()*60
    });
  }
  // create blobs
  for(let i=0;i<6;i++){
    blobs.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: 60 + Math.random()*120,
      vx: (Math.random()-0.5)*0.6,
      vy: (Math.random()-0.5)*0.6,
      hue: 190 + Math.random()*120,
      alpha: 0.07 + Math.random()*0.08
    });
  }

  function draw(){
    ctx.clearRect(0,0,W,H);

    // blobs (soft)
    blobs.forEach(b=>{
      // react to mouse slightly
      const dx = (mouse.x - b.x)*0.0006;
      const dy = (mouse.y - b.y)*0.0006;
      b.x += b.vx + dx*20;
      b.y += b.vy + dy*20;
      if(b.x - b.r > W) b.x = -b.r;
      if(b.x + b.r < 0) b.x = W + b.r;
      if(b.y - b.r > H) b.y = -b.r;
      if(b.y + b.r < 0) b.y = H + b.r;

      const g = ctx.createRadialGradient(b.x, b.y, b.r*0.1, b.x, b.y, b.r*1.1);
      g.addColorStop(0, `hsla(${b.hue},70%,60%,${b.alpha})`);
      g.addColorStop(0.4, `hsla(${b.hue},60%,50%,${b.alpha*0.5})`);
      g.addColorStop(1, `rgba(10,12,22,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
      ctx.fill();
    });

    // particles
    particles.forEach(p=>{
      p.x += p.vx + (mouse.x - p.x)*0.0005;
      p.y += p.vy + (mouse.y - p.y)*0.0005;
      if(p.x > W+10) p.x = -10;
      if(p.x < -10) p.x = W+10;
      if(p.y > H+10) p.y = -10;
      if(p.y < -10) p.y = H+10;

      ctx.fillStyle = `hsla(${p.hue},60%,70%,0.9)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    });

    // subtle connecting lines between close particles
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if(d < 120){
          ctx.strokeStyle = `rgba(120,180,245,${1 - d/140})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();

  /* ---------- small performance tweak: pause canvas when tab hidden ---------- */
  document.addEventListener('visibilitychange', function(){
    if(document.hidden){
      // reduce animation by stopping particles velocities
    }
  });

}); // DOMContentLoaded end
