/* ============================================
   BLACK CAT V3 - Professional Scripts
   Oneko Cat + Particles + Scroll + Hero 3D Interaction
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

// ---- Hero 3D Interaction ----
!function(){
    const obj = document.getElementById('hero3dObj');
    const img = document.getElementById('hero3dImg');
    if(!obj || !img) return;
    
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let scrollY = 0;
    let animationId = null;
    
    // Configuration
    const config = {
        parallaxStrength: 15,      // Mouse parallax amount (px)
        scrollRotation: 0.5,       // Rotation per 100px scroll (deg)
        floatAmplitude: 8,         // Floating animation (px)
        floatSpeed: 0.0015,        // Floating speed
        easing: 0.08,              // Smooth follow easing
        maxTilt: 8,                // Max tilt (deg)
    };
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        const rect = obj.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Normalized mouse position (-1 to 1)
        mouseX = ((e.clientX - centerX) / (rect.width / 2)) * config.parallaxStrength;
        mouseY = ((e.clientY - centerY) / (rect.height / 2)) * config.parallaxStrength;
        
        // Clamp
        mouseX = Math.max(-config.maxTilt, Math.min(config.maxTilt, mouseX));
        mouseY = Math.max(-config.maxTilt, Math.min(config.maxTilt, mouseY));
    });
    
    // Touch support
    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const rect = obj.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        mouseX = ((touch.clientX - centerX) / (rect.width / 2)) * config.parallaxStrength;
        mouseY = ((touch.clientY - centerY) / (rect.height / 2)) * config.parallaxStrength;
        
        mouseX = Math.max(-config.maxTilt, Math.min(config.maxTilt, mouseX));
        mouseY = Math.max(-config.maxTilt, Math.min(config.maxTilt, mouseY));
    }, { passive: true });
    
    // Track scroll for rotation
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });
    
    // Animation loop
    function animate() {
        const time = performance.now() * config.floatSpeed;
        
        // Smooth follow mouse (easing)
        currentX += (mouseX - currentX) * config.easing;
        currentY += (mouseY - currentY) * config.easing;
        
        // Floating animation
        const floatY = Math.sin(time) * config.floatAmplitude;
        const floatX = Math.cos(time * 0.7) * config.floatAmplitude * 0.5;
        
        // Scroll-based rotation
        const scrollRot = (scrollY / 100) * config.scrollRotation;
        
        // Combine all transforms
        const rotateX = -currentY + floatY * 0.3;
        const rotateY = currentX + floatX * 0.3 + scrollRot;
        const translateY = floatY;
        const translateX = floatX;
        
        // Apply transform
        img.style.transform = `
            translateX(${translateX}px)
            translateY(${translateY}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;
        
        animationId = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Hover glow effect
    obj.addEventListener('mouseenter', () => {
        img.style.transition = 'filter 0.5s ease';
        img.style.filter = 'drop-shadow(0 40px 80px rgba(0,0,0,.6)) drop-shadow(0 0 60px rgba(155,89,182,.4))';
    });
    
    obj.addEventListener('mouseleave', () => {
        img.style.transition = 'filter 0.8s ease';
        img.style.filter = 'drop-shadow(0 30px 60px rgba(0,0,0,.5)) drop-shadow(0 0 40px rgba(155,89,182,.2))';
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) cancelAnimationFrame(animationId);
    });
}();

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

console.log('%c🐈‍⬛ Black Cat V3 loaded!','color:#9b59b6;font-size:16px');

// ---- Image Protection (anti-download) ----
!function(){
    // Disable right-click on images
    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable drag on images
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable save image via keyboard
    document.addEventListener('keydown', function(e) {
        // Ctrl+S (save)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I (dev tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            return false;
        }
        // F12 (dev tools)
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        // Ctrl+U (view source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable image loading in new tab
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    }, false);
    
    // Add protection overlay to all images
    document.querySelectorAll('img').forEach(function(img) {
        img.style.pointerEvents = 'none';
        img.style.webkitUserDrag = 'none';
    });
    
    console.log('Image protection enabled');
}();

// ---- Enhanced Hero Animations ----
!function(){
    const hero3dObj = document.getElementById('hero3dObj');
    const hero3dImg = document.getElementById('hero3dImg');
    if (!hero3dObj || !hero3dImg) return;
    
    // Entrance animation
    hero3dImg.style.opacity = '0';
    hero3dImg.style.transform = 'translateY(60px) scale(0.9)';
    
    setTimeout(function() {
        hero3dImg.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        hero3dImg.style.opacity = '1';
        hero3dImg.style.transform = 'translateY(0) scale(1)';
    }, 300);
    
    // Text entrance animation
    const textElements = document.querySelectorAll('.hero3d-text > *');
    textElements.forEach(function(el, i) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(function() {
            el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 200 + (i * 150));
    });
    
    // Floating particles around hero object
    const particleContainer = document.createElement('div');
    particleContainer.className = 'hero3d-particles';
    particleContainer.style.cssText = 'position:absolute;inset:-20%;pointer-events:none;overflow:hidden;';
    hero3dObj.appendChild(particleContainer);
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position:absolute;
            width:${Math.random() * 4 + 2}px;
            height:${Math.random() * 4 + 2}px;
            background:${['#9b59b6','#00e6b2','#c4a8ac','#7c9397'][Math.floor(Math.random()*4)]};
            border-radius:50%;
            left:${Math.random() * 100}%;
            top:${Math.random() * 100}%;
            opacity:0;
            animation:particle-float ${5 + Math.random() * 5}s ease-in-out infinite ${Math.random() * 5}s;
        `;
        particleContainer.appendChild(particle);
    }
}();
