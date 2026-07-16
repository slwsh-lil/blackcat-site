/* ============================================
   BLACK CAT V4 - Professional Scripts
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
            this.sz=Math.random()*1.2+.3;
            this.vx=(Math.random()-.5)*.2;this.vy=(Math.random()-.5)*.2;
            this.o=Math.random()*.3+.05;
            this.hue=Math.random()>.85?65:Math.random()>.6?160:280;
        }
        update(){
            this.x+=this.vx;this.y+=this.vy;
            this.o+=(Math.random()-.5)*.005;
            this.o=Math.max(.03,Math.min(.4,this.o));
            if(this.x<0||this.x>c.width||this.y<0||this.y>c.height)this.reset();
        }
        draw(){
            x.beginPath();x.arc(this.x,this.y,this.sz,0,Math.PI*2);
            x.fillStyle=`hsla(${this.hue},60%,70%,${this.o})`;x.fill();
        }
    }
    for(let i=0;i<40;i++)p.push(new Dot);
    !function loop(){
        x.clearRect(0,0,c.width,c.height);
        p.forEach(d=>{d.update();d.draw()});
        requestAnimationFrame(loop);
    }();
}();

// ---- Hero 3D Interaction ----
!function(){
    const obj=document.getElementById('heroWidget');
    const img=document.getElementById('heroImg');
    if(!obj||!img)return;
    
    let mx=0,my=0,cx=0,cy=0,scrollPos=0;
    const cfg={parallax:12,float:8,speed:.0012,ease:.06,max:8};
    
    document.addEventListener('mousemove',e=>{
        const r=obj.getBoundingClientRect();
        mx=((e.clientX-r.left-r.width/2)/(r.width/2))*cfg.parallax;
        my=((e.clientY-r.top-r.height/2)/(r.height/2))*cfg.parallax;
        mx=Math.max(-cfg.max,Math.min(cfg.max,mx));
        my=Math.max(-cfg.max,Math.min(cfg.max,my));
    });
    
    document.addEventListener('touchmove',e=>{
        const t=e.touches[0];
        const r=obj.getBoundingClientRect();
        mx=((t.clientX-r.left-r.width/2)/(r.width/2))*cfg.parallax;
        my=((t.clientY-r.top-r.height/2)/(r.height/2))*cfg.parallax;
        mx=Math.max(-cfg.max,Math.min(cfg.max,mx));
        my=Math.max(-cfg.max,Math.min(cfg.max,my));
    },{passive:true});
    
    window.addEventListener('scroll',()=>{scrollPos=window.scrollY});
    
    !function animate(){
        const t=performance.now()*cfg.speed;
        cx+=(mx-cx)*cfg.ease;cy+=(my-cy)*cfg.ease;
        const fy=Math.sin(t)*cfg.float;
        const fx=Math.cos(t*.7)*cfg.float*.5;
        const sr=(scrollPos/100)*.3;
        img.style.transform=`translateX(${fx}px) translateY(${fy}px) rotateX(${-cy+fy*.3}deg) rotateY(${cx+fx*.3+sr}deg)`;
        requestAnimationFrame(animate);
    }();
    
    obj.addEventListener('mouseenter',()=>{
        img.style.transition='filter .5s';
        img.style.filter='drop-shadow(0 40px 80px rgba(0,0,0,.7)) drop-shadow(0 0 60px rgba(204,255,0,.2))';
    });
    obj.addEventListener('mouseleave',()=>{
        img.style.transition='filter .8s';
        img.style.filter='drop-shadow(0 30px 60px rgba(0,0,0,.6)) drop-shadow(0 0 40px rgba(204,255,0,.1))';
    });
}();

// ---- Scroll Animations ----
!function(){
    const obs=new IntersectionObserver(entries=>{
        entries.forEach(e=>{
            if(e.isIntersecting)e.target.classList.add('animate-in');
        });
    },{threshold:.1,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.feature-card,.gallery-item,.fact-card,.contact-card,.quote-block').forEach((el,i)=>{
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
    
    const secs=document.querySelectorAll('section[id]');
    addEventListener('scroll',()=>{
        let cur='';
        secs.forEach(s=>{if(scrollY>=s.offsetTop-100)cur=s.id});
        links.forEach(l=>{
            l.classList.toggle('active',l.getAttribute('href')==='#'+cur);
        });
    });
    
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
document.querySelectorAll('.feature-card,.gallery-frame,.fact-card,.contact-card').forEach(c=>{
    c.addEventListener('mousemove',e=>{
        const r=c.getBoundingClientRect();
        const rx=(e.clientY-r.top-r.height/2)/20;
        const ry=(r.left+r.width/2-e.clientX)/20;
        c.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    c.addEventListener('mouseleave',()=>{c.style.transform=''});
});

// ---- Image Protection ----
!function(){
    document.addEventListener('contextmenu',e=>{if(e.target.tagName==='IMG'){e.preventDefault();return false}});
    document.addEventListener('dragstart',e=>{if(e.target.tagName==='IMG'){e.preventDefault();return false}});
    document.addEventListener('keydown',e=>{
        if(e.ctrlKey&&e.key==='s'){e.preventDefault();return false}
        if(e.ctrlKey&&e.shiftKey&&e.key==='I'){e.preventDefault();return false}
        if(e.key==='F12'){e.preventDefault();return false}
        if(e.ctrlKey&&e.key==='u'){e.preventDefault();return false}
    });
    document.querySelectorAll('img').forEach(img=>{
        img.style.pointerEvents='none';
        img.style.webkitUserDrag='none';
    });
}();

// ---- Hero Entrance Animation ----
!function(){
    const img=document.getElementById('heroImg');
    const text=document.querySelectorAll('.hero-text > *');
    if(!img)return;
    
    img.style.opacity='0';
    img.style.transform='translateY(60px) scale(0.9)';
    
    setTimeout(()=>{
        img.style.transition='opacity 1.2s cubic-bezier(.16,1,.3,1), transform 1.2s cubic-bezier(.16,1,.3,1)';
        img.style.opacity='1';
        img.style.transform='translateY(0) scale(1)';
    },300);
    
    text.forEach((el,i)=>{
        el.style.opacity='0';
        el.style.transform='translateY(30px)';
        setTimeout(()=>{
            el.style.transition='opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)';
            el.style.opacity='1';
            el.style.transform='translateY(0)';
        },200+(i*120));
    });
    
    // Widget particles
    const pc=document.getElementById('widgetParticles');
    if(pc){
        for(let i=0;i<10;i++){
            const d=document.createElement('div');
            d.style.cssText=`position:absolute;width:${Math.random()*3+2}px;height:${Math.random()*3+2}px;background:${['#ccff00','#4fd1c5','#f5f5f1'][i%3]};border-radius:50%;left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:0;animation:particle-float ${5+Math.random()*5}s ease-in-out infinite ${Math.random()*5}s;`;
            pc.appendChild(d);
        }
    }
}();

console.log('%c🐈‍⬛ Black Cat V4 loaded!','color:#ccff00;font-size:16px');
