/* ============================================
   PIXEL STARFIELD BACKGROUND
   3 layers of parallax pixel stars
   ============================================ */
(function(){
    const canvas = document.getElementById('starfield');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let w, h;
    function resize(){ w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
    resize();
    addEventListener('resize', resize);
    
    // Star layers
    const layers = [
        { count: 80, speed: 0.15, size: 1, color: 'rgba(155,89,182,', minO: 0.2, maxO: 0.6 },
        { count: 50, speed: 0.3, size: 1.5, color: 'rgba(0,230,178,', minO: 0.3, maxO: 0.7 },
        { count: 25, speed: 0.5, size: 2, color: 'rgba(196,168,172,', minO: 0.4, maxO: 0.9 },
    ];
    
    class PixelStar {
        constructor(layer) {
            this.layer = layer;
            this.reset(true);
        }
        reset(init) {
            this.x = Math.random() * w;
            this.y = init ? Math.random() * h : h + 10;
            this.twinkleSpeed = 0.02 + Math.random() * 0.04;
            this.twinklePhase = Math.random() * Math.PI * 2;
            this.opacity = this.layer.minO + Math.random() * (this.layer.maxO - this.layer.minO);
        }
        update() {
            this.y += this.layer.speed;
            this.twinklePhase += this.twinkleSpeed;
            if (this.y > h + 10) this.reset(false);
        }
        draw() {
            const twinkle = Math.sin(this.twinklePhase) * 0.3 + 0.7;
            const o = this.opacity * twinkle;
            const s = this.layer.size;
            
            // Pixel star = tiny square
            ctx.fillStyle = this.layer.color + o + ')';
            ctx.fillRect(Math.round(this.x), Math.round(this.y), s, s);
            
            // Cross pattern for brighter stars
            if (this.layer.size >= 2 && twinkle > 0.85) {
                ctx.fillStyle = this.layer.color + (o * 0.3) + ')';
                ctx.fillRect(Math.round(this.x) - 1, Math.round(this.y), s + 2, s);
                ctx.fillRect(Math.round(this.x), Math.round(this.y) - 1, s, s + 2);
            }
        }
    }
    
    let stars = [];
    layers.forEach(l => {
        for (let i = 0; i < l.count; i++) stars.push(new PixelStar(l));
    });
    
    // Shooting star
    let shootingStar = null;
    function spawnShootingStar() {
        if (Math.random() > 0.998) {
            shootingStar = {
                x: Math.random() * w * 0.8,
                y: Math.random() * h * 0.3,
                vx: 3 + Math.random() * 4,
                vy: 1 + Math.random() * 2,
                life: 1,
                decay: 0.015 + Math.random() * 0.01,
                trail: []
            };
        }
    }
    
    function updateShootingStar() {
        if (!shootingStar) return;
        shootingStar.x += shootingStar.vx;
        shootingStar.y += shootingStar.vy;
        shootingStar.life -= shootingStar.decay;
        shootingStar.trail.push({ x: shootingStar.x, y: shootingStar.y, life: shootingStar.life });
        if (shootingStar.trail.length > 12) shootingStar.trail.shift();
        if (shootingStar.life <= 0) shootingStar = null;
    }
    
    function drawShootingStar() {
        if (!shootingStar) return;
        shootingStar.trail.forEach((t, i) => {
            const o = t.life * (i / shootingStar.trail.length);
            ctx.fillStyle = `rgba(255,255,255,${o})`;
            ctx.fillRect(Math.round(t.x), Math.round(t.y), 2, 2);
        });
    }
    
    function loop() {
        ctx.clearRect(0, 0, w, h);
        stars.forEach(s => { s.update(); s.draw(); });
        spawnShootingStar();
        updateShootingStar();
        drawShootingStar();
        requestAnimationFrame(loop);
    }
    loop();
})();
