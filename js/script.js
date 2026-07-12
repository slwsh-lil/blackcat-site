/* ============================================
   BLACK CAT V2 - Professional Scripts
   Oneko Cat + Particles + Scroll
   ============================================ */

// ---- Particles ----
!function(){
    const c=document.getElementById('particles');if(!c)return;
    const x=c.getContext('2d');let p=[];
    function resize(){c.width=innerWidth;c.height=innerHeight}
    resize();addEventListener('resize',resize);
    class Dot{
        constructor(){this.reset()}
        reset(){
            this.x=Math.random()*c.width;this.y=Math.random()*c.height;
            this.sz=Math.random()*1.5+.4;
            this.vx=(Math.random()-.5)*.25;this.vy=(Math.random()-.5)*.25;
            this.o=Math.random()*.4+.08;
            this.hue=Math.random()>.7?280:Math.random()>.5?160:330;
        }
        update(){
            this.x+=this.vx;this.y+=this.vy;
            this.o+=(Math.random()-.5)*.008;
            this.o=Math.max(.04,Math.min(.5,this.o));
            if(this.x<0||this.x>c.width||this.y<0||this.y>c.height)this.reset();
        }
        draw(){
            x.beginPath();x.arc(this.x,this.y,this.sz,0,Math.PI*2);
            x.fillStyle=`hsla(${this.hue},45%,65%,${this.o})`;x.fill();
        }
    }
    for(let i=0;i<50;i++)p.push(new Dot);
    !function loop(){
        x.clearRect(0,0,c.width,c.height);
        p.forEach(d=>{d.update();d.draw()});
        for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){
            const dx=p[i].x-p[j].x,dy=p[i].y-p[j].y,d=Math.sqrt(dx*dx+dy*dy);
            if(d<100){x.beginPath();x.moveTo(p[i].x,p[i].y);x.lineTo(p[j].x,p[j].y);
            x.strokeStyle=`rgba(155,89,182,${.08*(1-d/100)})`;x.lineWidth=.4;x.stroke()}
        }
        requestAnimationFrame(loop);
    }();
}();

// ---- Oneko handled by oneko.js ----

// ---- Scroll Animations ----
!function(){
    const obs=new IntersectionObserver(entries=>{
        entries.forEach(e=>{
            if(e.isIntersecting)e.target.classList.add('animate-in');
        });
    },{threshold:.1,rootMargin:'0px 0px -40px 0px'});

    document.querySelectorAll('.card,.gal-item,.fact,.contact-card').forEach((el,i)=>{
        el.setAttribute('data-d',String(i%7));
        obs.observe(el);
    });
}();

// ---- Navigation ----
!function(){
    const nav=document.getElementById('nav');
    const toggle=document.getElementById('navToggle');
    const menu=document.getElementById('mobileMenu');
    const links=document.querySelectorAll('.nav-link');

    addEventListener('scroll',()=>{
        nav.classList.toggle('scrolled',scrollY>40);
    });

    // Active link
    const secs=document.querySelectorAll('section[id]');
    addEventListener('scroll',()=>{
        let cur='';
        secs.forEach(s=>{if(scrollY>=s.offsetTop-80)cur=s.id});
        links.forEach(l=>{
            l.classList.toggle('active',l.getAttribute('href')==='#'+cur);
        });
    });

    // Mobile
    if(toggle){
        toggle.addEventListener('click',()=>{
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
    }
    document.querySelectorAll('.mobile-link').forEach(l=>{
        l.addEventListener('click',()=>{menu.classList.remove('active');toggle.classList.remove('active')});
    });
}();

// ---- Smooth Scroll ----
document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
        e.preventDefault();
        const t=document.querySelector(this.getAttribute('href'));
        if(t)t.scrollIntoView({behavior:'smooth',block:'start'});
    });
});

// ---- Card Tilt ----
document.querySelectorAll('.card,.gal-frame').forEach(c=>{
    c.addEventListener('mousemove',e=>{
        const r=c.getBoundingClientRect();
        const rx=(e.clientY-r.top-r.height/2)/15;
        const ry=(r.left+r.width/2-e.clientX)/15;
        c.style.transform=`perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    c.addEventListener('mouseleave',()=>{
        c.style.transform='';
    });
});

console.log('%c🐈‍⬛ Black Cat V2 loaded!','color:#9b59b6;font-size:16px');
