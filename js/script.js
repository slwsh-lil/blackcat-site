/* ============================================
   🐈‍⬛ BLACK CAT - Interactive Scripts
   - Particle Background
   - Oneko Cat (follows mouse)
   - Scroll Animations
   - Navigation
   ============================================ */

// ---- Particle Background ----
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() > 0.7 ? 280 : (Math.random() > 0.5 ? 160 : 330);
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += (Math.random() - 0.5) * 0.01;
            this.opacity = Math.max(0.05, Math.min(0.6, this.opacity));
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 50%, 70%, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(155, 89, 182, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

// ---- Oneko Cat (Follows Mouse) ----
(function initOneko() {
    const oneko = document.getElementById('oneko');
    if (!oneko) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let onekoX = mouseX;
    let onekoY = mouseY;
    let frame = 0;
    let frameTimer = 0;
    let lastDirection = 'down';
    let isMoving = false;

    // Sprite sheet config
    const FRAME_W = 64;  // Each frame width in sprite sheet
    const FRAME_H = 64;  // Each frame height in sprite sheet
    const COLS = 4;       // 4 columns

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Touch support
    document.addEventListener('touchmove', (e) => {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    });

    function updateOneko() {
        const dx = mouseX - onekoX;
        const dy = mouseY - onekoY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        isMoving = dist > 40;

        if (isMoving) {
            // Smooth follow with easing
            const speed = Math.min(dist * 0.08, 8);
            onekoX += dx * 0.06;
            onekoY += dy * 0.06;

            // Determine direction
            if (Math.abs(dx) > Math.abs(dy)) {
                lastDirection = dx > 0 ? 'right' : 'left';
            } else {
                lastDirection = dy > 0 ? 'down' : 'up';
            }

            // Animate sprite
            frameTimer++;
            if (frameTimer > 6) {
                frame = (frame + 1) % 4;
                frameTimer = 0;
            }
        } else {
            // Idle animation
            frameTimer++;
            if (frameTimer > 20) {
                frame = frame === 0 ? 1 : 0;
                frameTimer = 0;
            }
        }

        // Update sprite position
        let spriteCol = frame;
        let spriteRow = 0;

        if (isMoving) {
            spriteRow = 1; // walk row
            spriteCol = frame;
        } else {
            spriteRow = 0; // idle row
            spriteCol = frame % 2;
        }

        const bgX = -(spriteCol * FRAME_W);
        const bgY = -(spriteRow * FRAME_H);

        oneko.style.left = `${onekoX - 16}px`;
        oneko.style.top = `${onekoY - 16}px`;
        oneko.style.backgroundPosition = `${bgX}px ${bgY}px`;

        // Flip based on direction
        if (lastDirection === 'left') {
            oneko.style.transform = 'scaleX(-1)';
        } else {
            oneko.style.transform = 'scaleX(1)';
        }

        requestAnimationFrame(updateOneko);
    }
    updateOneko();
})();

// ---- Scroll Animations ----
(function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe cards
    document.querySelectorAll('.reason-card, .gallery-item, .magic-card, .contact-card').forEach(el => {
        observer.observe(el);
    });
})();

// ---- Navigation ----
(function initNav() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Active link tracking
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
})();

// ---- Smooth Scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- Card Tilt Effect ----
document.querySelectorAll('.reason-card, .gallery-frame').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ---- Easter Egg: Konami Code ----
(function initEasterEgg() {
    const code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A
    let position = 0;

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === code[position]) {
            position++;
            if (position === code.length) {
                document.body.style.transition = 'filter 2s';
                document.body.style.filter = 'hue-rotate(180deg)';
                setTimeout(() => {
                    document.body.style.filter = '';
                }, 3000);
                position = 0;
            }
        } else {
            position = 0;
        }
    });
})();

console.log('🐈‍⬛ Black Cat Site loaded! Made with 🖤 and magic ✨');
