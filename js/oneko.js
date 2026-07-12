// oneko.js - Custom Black Cat Version
// Based on https://github.com/adryd325/oneko.js
// Modified: Black cat that changes color on scroll

(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const nekoEl = document.createElement("div");
  let persistPosition = true;

  let nekoPosX = 32;
  let nekoPosY = 32;
  let mousePosX = 0;
  let mousePosY = 0;
  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const nekoSpeed = 10;

  // Sprite map - same as original oneko.js
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
    scratchWallN: [[0, 0], [0, -1]],
    scratchWallS: [[-7, -1], [-6, -2]],
    scratchWallE: [[-2, -2], [-2, -3]],
    scratchWallW: [[-4, 0], [-4, -1]],
    tired: [[-3, -2]],
    sleeping: [[-2, 0], [-2, -1]],
    N: [[-1, -2], [-1, -3]],
    NE: [[0, -2], [0, -3]],
    E: [[-3, 0], [-3, -1]],
    SE: [[-5, -1], [-5, -2]],
    S: [[-6, -3], [-7, -2]],
    SW: [[-5, -3], [-6, -1]],
    W: [[-4, -2], [-4, -3]],
    NW: [[-1, 0], [-1, -1]],
  };

  // ===== COLOR SYSTEM =====
  // Scroll-based color transitions
  // Black (start) → Purple → Cyan → Rose → Gold → back to Black
  const colorStops = [
    { pct: 0,   hue: 0,   sat: 0,   light: 10 },  // Pure black
    { pct: 15,  hue: 270, sat: 60,  light: 25 },  // Deep purple
    { pct: 30,  hue: 280, sat: 70,  light: 35 },  // Bright purple
    { pct: 45,  hue: 170, sat: 80,  light: 30 },  // Cyan/teal
    { pct: 60,  hue: 340, sat: 70,  light: 35 },  // Rose pink
    { pct: 75,  hue: 45,  sat: 80,  light: 40 },  // Gold
    { pct: 90,  hue: 120, sat: 60,  light: 30 },  // Emerald green
    { pct: 100, hue: 0,   sat: 0,   light: 10 },  // Back to black
  ];

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function getColorFromScroll() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return { hue: 0, sat: 0, light: 10 };
    const scrollPct = Math.min(100, (window.scrollY / scrollHeight) * 100);

    // Find the two color stops we're between
    let lower = colorStops[0];
    let upper = colorStops[colorStops.length - 1];
    
    for (let i = 0; i < colorStops.length - 1; i++) {
      if (scrollPct >= colorStops[i].pct && scrollPct <= colorStops[i + 1].pct) {
        lower = colorStops[i];
        upper = colorStops[i + 1];
        break;
      }
    }

    const range = upper.pct - lower.pct;
    const t = range === 0 ? 0 : (scrollPct - lower.pct) / range;

    return {
      hue: Math.round(lerp(lower.hue, upper.hue, t)),
      sat: Math.round(lerp(lower.sat, upper.sat, t)),
      light: Math.round(lerp(lower.light, upper.light, t)),
    };
  }

  function updateCatColor() {
    const { hue, sat, light } = getColorFromScroll();
    // Use CSS filter to recolor the black cat
    // hue-rotate shifts the color, saturate adds intensity, brightness adjusts lightness
    const filter = `hue-rotate(${hue}deg) saturate(${sat}%) brightness(${light * 3}%)`;
    nekoEl.style.filter = filter;
    
    // Add glow effect based on color
    const glowColor = `hsla(${hue}, ${sat}%, ${light + 20}%, 0.5)`;
    nekoEl.style.filter += ` drop-shadow(0 2px 6px ${glowColor})`;
  }

  // Listen for scroll
  let scrollTicking = false;
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateCatColor();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  function init() {
    let nekoFile = "./images/oneko.png";
    const curScript = document.currentScript;
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat;
    }
    if (curScript && curScript.dataset.persistPosition) {
      if (curScript.dataset.persistPosition === "") {
        persistPosition = true;
      } else {
        persistPosition = JSON.parse(curScript.dataset.persistPosition.toLowerCase());
      }
    }

    if (persistPosition) {
      let storedNeko = JSON.parse(window.localStorage.getItem("oneko"));
      if (storedNeko !== null) {
        nekoPosX = storedNeko.nekoPosX;
        nekoPosY = storedNeko.nekoPosY;
        mousePosX = storedNeko.mousePosX;
        mousePosY = storedNeko.mousePosY;
        frameCount = storedNeko.frameCount;
        idleTime = storedNeko.idleTime;
        idleAnimation = storedNeko.idleAnimation;
        idleAnimationFrame = storedNeko.idleAnimationFrame;
        nekoEl.style.backgroundPosition = storedNeko.bgPos;
      }
    }

    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "none";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = 2147483647;
    nekoEl.style.backgroundImage = `url(${nekoFile})`;
    nekoEl.style.transition = "filter 0.3s ease";

    document.body.appendChild(nekoEl);

    // Set initial color
    updateCatColor();

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    if (persistPosition) {
      window.addEventListener("beforeunload", function () {
        window.localStorage.setItem("oneko", JSON.stringify({
          nekoPosX, nekoPosY, mousePosX, mousePosY,
          frameCount, idleTime, idleAnimation, idleAnimationFrame,
          bgPos: nekoEl.style.backgroundPosition,
        }));
      });
    }

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    if (!nekoEl.isConnected) return;
    if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp;
      frame();
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < 32) avalibleIdleAnimations.push("scratchWallW");
      if (nekoPosY < 32) avalibleIdleAnimations.push("scratchWallN");
      if (nekoPosX > window.innerWidth - 32) avalibleIdleAnimations.push("scratchWallE");
      if (nekoPosY > window.innerHeight - 32) avalibleIdleAnimations.push("scratchWallS");
      idleAnimation = avalibleIdleAnimations[Math.floor(Math.random() * avalibleIdleAnimations.length)];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) { setSprite("tired", 0); break; }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) resetIdleAnimation();
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) resetIdleAnimation();
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction = "";
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;
    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  init();
})();
