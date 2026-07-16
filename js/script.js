/* ============================================
   BLACK CAT V3.2 - Enhanced Animations
   Shopify-inspired + Custom ideas
   ============================================ */

// ---- Pixel Starfield (Enhanced) ----
!function(){
    const c=document.getElementById('starfield');
    if(!c)return;
    const x=c.getContext('2d');
    let w,h;
    function resize(){w=c.width=innerWidth;h=c.height=innerHeight}
    resize();addEventListener('resize',resize);
    
    const layers=[
        {count:100,speed:.12,size:1,color:[155,89,182],minO:.15,maxO:.5},
        {count:60,speed:.25,size:1.5,color:[0,230,178],minO:.2,maxO:.6},
        {count:30,speed:.45,size:2,color:[196,168,172],minO:.3,maxO:.8},
    ];
    
    class Star{
        constructor(l){this.l=l;this.reset(true)}
        reset(init){
            this.x=Math.random()*w;
            this.y=init?Math.random()*h:h+5;
            this.spd=.01+Math.random()*.03;
            this.phase=Math.random()*Math.PI*2;
            this.o=this.l.minO+Math.random()*(this.l.maxO-this.l.minO);
        }
        update(){
            this.y+=this.l.speed;
            this.phase+=this.spd;
            if(this.y>h+5)this.reset(false);
        }
        draw(){
            const tw=Math.sin(this.phase)*.3+.7;
            const o=this.o*tw;
            x.fillStyle=`rgba(${this.l.color[0]},${this.l.color[1]},${this.l.color[2]},${o})`;
            x.fillRect(Math.round(this.x),Math.round(this.y),this.l.size,this.l.size);
            if(this.l.size>=2&&tw>.85){
                x.fillStyle=`rgba(${this.l.color[0]},${this.l.color[1]},${this.l.color[2]},${o*.3})`;
                x.fillRect(Math.round(this.x)-1,Math.round(this.y),this.l.size+2,this.l.size);
                x.fillRect(Math.round(this.x),Math.round(this.y)-1,this.l.size,this.l.size+2);
            }
        }
    }
    
    let stars=[];
    layers.forEach(l=>{for(let i=0;i<l.count;i++)stars.push(new Star(l))});
    
    // Shooting star
    let shoot=null;
    function spawnShoot(){
        if(Math.random()>.997){
            shoot={x:Math.random()*w*.7,y:Math.random()*h*.2,vx:4+Math.random()*5,vy:1+Math.random()*2,life:1,decay:.012+Math.random()*.01,trail:[]};
        }
    }
    function updateShoot(){
        if(!shoot)return;
        shoot.x+=shoot.vx;shoot.y+=shoot.vy;
        shoot.life-=shoot.decay;
        shoot.trail.push({x:shoot.x,y:shoot.y,l:shoot.life});
        if(shoot.trail.length>15)shoot.trail.shift();
        if(shoot.life<=0)shoot=null;
    }
    function drawShoot(){
        if(!shoot)return;
        shoot.trail.forEach((t,i)=>{
            const o=t.l*(i/shoot.trail.length);
            x.fillStyle=`rgba(204,255,0,${o})`;
            x.fillRect(Math.round(t.x),Math.round(t.y),2,2);
        });
    }
    
    !function loop(){
        x.clearRect(0,0,w,h);
        stars.forEach(s=>{s.update();s.draw()});
        spawnShoot();updateShoot();drawShoot();
        requestAnimationFrame(loop);
    }();
}();

// ---- Particles (Enhanced) ----
!function(){
    const c=document.getElementById('particles');
    if(!c)return;
    const x=c.getContext('2d');
    let p=[];
    function resize(){c.width=innerWidth;c.height=innerHeight}
    resize();addEventListener('resize',resize);
    
    class Dot{
        constructor(){this.reset()}
        reset(){
            this.x=Math.random()*c.width;
            this.y=Math.random()*c.height;
            this.sz=Math.random()*1.2+.3;
            this.vx=(Math.random()-.5)*.2;
            this.vy=(Math.random()-.5)*.2;
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
            x.beginPath();
            x.arc(this.x,this.y,this.sz,0,Math.PI*2);
            x.fillStyle=`hsla(${this.hue},50%,65%,${this.o})`;
            x.fill();
        }
    }
    
    for(let i=0;i<45;i++)p.push(new Dot);
    
    !function loop(){
        x.clearRect(0,0,c.width,c.height);
        p.forEach(d=>{d.update();d.draw()});
        // Connect nearby particles
        for(let i=0;i<p.length;i++){
            for(let j=i+1;j<p.length;j++){
                const dx=p[i].x-p[j].x;
                const dy=p[i].y-p[j].y;
                const dist=Math.sqrt(dx*dx+dy*dy);
                if(dist<120){
                    x.beginPath();
                    x.moveTo(p[i].x,p[i].y);
                    x.lineTo(p[j].x,p[j].y);
                    x.strokeStyle=`rgba(155,89,182,${.06*(1-dist/120)})`;
                    x.lineWidth=.4;
                    x.stroke();
                }
            }
        }
        requestAnimationFrame(loop);
    }();
}();

// ---- Oneko handled by oneko.js ----

// ---- Hero 3D Interaction (Enhanced) ----
!function(){
    const obj=document.getElementById('hero3dObject');
    const img=document.getElementById('hero3dImg');
    if(!obj||!img)return;
    
    let mx=0,my=0,cx=0,cy=0,scrollPos=0;
    const cfg={parallax:14,float:10,speed:.001,ease:.065,maxTilt:10};
    
    document.addEventListener('mousemove',e=>{
        const r=obj.getBoundingClientRect();
        const centerX=r.left+r.width/2;
        const centerY=r.top+r.height/2;
        mx=((e.clientX-centerX)/(r.width/2))*cfg.parallax;
        my=((e.clientY-centerY)/(r.height/2))*cfg.parallax;
        mx=Math.max(-cfg.maxTilt,Math.min(cfg.maxTilt,mx));
        my=Math.max(-cfg.maxTilt,Math.min(cfg.maxTilt,my));
    });
    
    document.addEventListener('touchmove',e=>{
        const t=e.touches[0];
        const r=obj.getBoundingClientRect();
        const centerX=r.left+r.width/2;
        const centerY=r.top+r.height/2;
        mx=((t.clientX-centerX)/(r.width/2))*cfg.parallax;
        my=((t.clientY-centerY)/(r.height/2))*cfg.parallax;
        mx=Math.max(-cfg.maxTilt,Math.min(cfg.maxTilt,mx));
        my=Math.max(-cfg.maxTilt,Math.min(cfg.maxTilt,my));
    },{passive:true});
    
    window.addEventListener('scroll',()=>{scrollPos=window.scrollY});
    
    !function animate(){
        const t=performance.now()*cfg.speed;
        cx+=(mx-cx)*cfg.ease;
        cy+=(my-cy)*cfg.ease;
        
        const floatY=Math.sin(t)*cfg.float;
        const floatX=Math.cos(t*.7)*cfg.float*.5;
        const scrollRot=(scrollPos/100)*.4;
        
        const rotateX=-cy+floatY*.3;
        const rotateY=cx+floatX*.3+scrollRot;
        const translateY=floatY;
        const translateX=floatX;
        
        img.style.transform=`translateX(${translateX}px) translateY(${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        requestAnimationFrame(animate);
    }();
    
    // Hover glow
    obj.addEventListener('mouseenter',()=>{
        img.style.transition='filter .5s cubic-bezier(.4,0,.2,1)';
        img.style.filter='drop-shadow(0 40px 80px rgba(0,0,0,.6)) drop-shadow(0 0 60px rgba(155,89,182,.4))';
    });
    obj.addEventListener('mouseleave',()=>{
        img.style.transition='filter .8s cubic-bezier(.4,0,.2,1)';
        img.style.filter='drop-shadow(0 30px 60px rgba(0,0,0,.5)) drop-shadow(0 0 40px rgba(155,89,182,.2))';
    });
}();

// ---- Scroll Reveal (Shopify-style) ----
!function(){
    const observer=new IntersectionObserver(entries=>{
        entries.forEach(e=>{
            if(e.isIntersecting){
                e.target.classList.add('revealed');
                e.target.style.opacity='1';
                e.target.style.transform='translateY(0)';
            }
        });
    },{threshold:.15,rootMargin:'0px 0px -60px 0px'});
    
    document.querySelectorAll('.card,.gal-item,.fact,.contact-card').forEach((el,i)=>{
        el.style.opacity='0';
        el.style.transform='translateY(40px)';
        el.style.transition=`opacity .7s cubic-bezier(.4,0,.2,1) ${i*.08}s, transform .7s cubic-bezier(.4,0,.2,1) ${i*.08}s`;
        observer.observe(el);
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

// ---- Card Tilt (Shopify-style hover) ----
document.querySelectorAll('.card,.gal-frame').forEach(c=>{
    c.addEventListener('mousemove',e=>{
        const r=c.getBoundingClientRect();
        const rx=(e.clientY-r.top-r.height/2)/15;
        const ry=(r.left+r.width/2-e.clientX)/15;
        c.style.transform=`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px) scale(1.02)`;
        c.style.transition='transform .1s ease';
    });
    c.addEventListener('mouseleave',()=>{
        c.style.transform='';
        c.style.transition='transform .4s cubic-bezier(.4,0,.2,1)';
    });
});

// ---- Button Pop Effect ----
document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('mousedown',()=>{btn.style.transform='scale(.95)'});
    btn.addEventListener('mouseup',()=>{btn.style.transform='scale(1)'});
    btn.addEventListener('mouseleave',()=>{btn.style.transform='scale(1)'});
});

// ---- Image Protection ----
!function(){
    document.addEventListener('contextmenu',e=>{
        if(e.target.tagName==='IMG'){e.preventDefault();return false}
    });
    document.addEventListener('dragstart',e=>{
        if(e.target.tagName==='IMG'){e.preventDefault();return false}
    });
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
    const img=document.getElementById('hero3dImg');
    const textElements=document.querySelectorAll('.hero3d-text > *');
    if(!img)return;
    
    // Image entrance
    img.style.opacity='0';
    img.style.transform='translateY(80px) scale(.85)';
    
    setTimeout(()=>{
        img.style.transition='opacity 1.4s cubic-bezier(.16,1,.3,1), transform 1.4s cubic-bezier(.16,1,.3,1)';
        img.style.opacity='1';
        img.style.transform='translateY(0) scale(1)';
    },400);
    
    // Text entrance (staggered)
    textElements.forEach((el,i)=>{
        el.style.opacity='0';
        el.style.transform='translateY(40px)';
        setTimeout(()=>{
            el.style.transition='opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)';
            el.style.opacity='1';
            el.style.transform='translateY(0)';
        },250+(i*150));
    });
    
    // Widget floating particles
    const pc=document.getElementById('hero3dParticles');
    if(pc){
        for(let i=0;i<14;i++){
            const d=document.createElement('div');
            const size=Math.random()*4+2;
            const colors=['#9b59b6','#00e6b2','#c4a8ac','#b07cc6'];
            d.style.cssText=`
                position:absolute;
                width:${size}px;height:${size}px;
                background:${colors[i%4]};
                border-radius:50%;
                left:${Math.random()*100}%;top:${Math.random()*100}%;
                opacity:0;
                animation:particle-drift ${6+Math.random()*6}s ease-in-out infinite ${Math.random()*5}s;
                filter:blur(${Math.random()>0.7?'1px':'0px'});
            `;
            pc.appendChild(d);
        }
    }
    
    // SVG line border around hero (Shopify-style)
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 600 600');
    svg.setAttribute('class','hero-svg-border');
    svg.innerHTML=`
        <rect x="10" y="10" width="580" height="580" rx="20" ry="20"
              fill="none" stroke="rgba(155,89,182,0.3)" stroke-width="1"
              stroke-dasharray="2400" stroke-dashoffset="2400"
              style="animation:svg-draw 3s ease forwards .8s"/>
        <circle cx="300" cy="300" r="200" fill="none" stroke="rgba(0,230,178,0.15)" stroke-width=".5"
                stroke-dasharray="1260" stroke-dashoffset="1260"
                style="animation:svg-draw 2.5s ease forwards 1.2s"/>
    `;
    const widgetContainer=obj.querySelector('.hero3d-glow');
    if(widgetContainer)widgetContainer.appendChild(svg);
}();

console.log('%c🐈‍⬛ Black Cat V3.2 Enhanced loaded!','color:#9b59b6;font-size:16px');
