gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, Draggable, Flip);

(function () {
  const sections = document.querySelectorAll(".section");
  const nextButton = document.getElementById("nextSection");
  const prevButton = document.getElementById("prevSection");

  let currentSectionIndex = 0;

  // Função para navegar para uma seção específica
  function navigateToSection(index) {
    if (index < 0 || index >= sections.length) return;

    const targetSection = sections[index];
    gsap.to(window, {
      scrollTo: { y: targetSection, autoKill: false },
      duration: 1,
      ease: "bounce.out",
    });

    currentSectionIndex = index;
  }

  // Evento para avançar para a próxima seção
  nextButton.addEventListener("click", () => {
    navigateToSection(currentSectionIndex + 1);
  });

  // Evento para voltar para a seção anterior
  prevButton.addEventListener("click", () => {
    navigateToSection(currentSectionIndex - 1);
  });

  // Configuração adicional para arrastar o box
  const box = document.getElementById("animatedBox");
  Draggable.create(box, {
    type: "x,y",
    bounds: window,
    inertia: true,
  });

  // Animação ao dar dois cliques na caixa
  box.addEventListener("dblclick", () => {
    gsap.to(box, {
      duration: 2,
      ease: "power1.inOut",
      motionPath: {
        path: "#motionPath",
        align: "#motionPath",
        alignOrigin: [0.5, 0.5],
        autoRotate: true,
      },
    });
  });
})();

(function () {
  const box = document.getElementById("animatedBox");

  // Animação usando MotionPathPlugin ao dar dois cliques
  function animateBox() {
    gsap.to(box, {
      duration: 2, // Duração da animação
      ease: "power1.inOut", // Tipo de easing
      motionPath: {
        path: "#motionPath", // Caminho SVG
        align: "#motionPath", // Alinha o elemento ao caminho
        alignOrigin: [0.5, 0.5], // Centraliza o elemento no caminho
        autoRotate: true // Faz o elemento girar ao longo do caminho
      }
    });
  }

  // Adiciona o evento de duplo clique à caixa
  box.addEventListener("dblclick", animateBox);

  // Configuração adicional para arrastar o box
  Draggable.create(box, {
    type: "x,y",
    bounds: window,
    inertia: true
  });
})();

// Animação ao clicar no botão com vai e volta
const button = document.getElementById("animateBtn");
const box = document.getElementById("animatedBox");
let isGoing = true;

// Função para lidar com a animação do botão
function toggleAnimation() {
  const x = parseFloat(document.getElementById("textH").value);
  const rotation = parseFloat(document.getElementById("rotation").value);
  const duration = parseFloat(document.getElementById("duration").value);
  const ease = document.getElementById("easeSelect").value;

  if (isGoing) {
    gsap.to(box, { x, rotation, duration, ease, overwrite: "auto" });
    button.textContent = "Recuar";
  } else {
    gsap.to(box, { x: 0, rotation: 0, duration, ease, overwrite: "auto" });
    button.textContent = "Avançar";
  }
  isGoing = !isGoing;
}

// Adiciona o evento de clique ao botão
button.addEventListener("click", toggleAnimation);

(function () {
  const isAnimationOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  const scrub = true;

  if (isAnimationOk) {
    setupAnimations();
  }

  function setupAnimations() {
    gsap.from(".keyhole", {
      "clip-path": "polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)",
      scrollTrigger: {
        trigger: ".section--primary",
        start: "top top",
        end: "bottom bottom",
        scrub: scrub
      }
    });

    gsap.to(".arrow", {
      opacity: 0,
      scrollTrigger: {
        trigger: ".section--primary",
        start: "top top",
        end: "+=200",
        scrub: scrub
      }
    });

    Draggable.create(box, {
      type: "x,y",
      bounds: window,
      inertia: true,
      onPress() {
        gsap.to(box, {
          backgroundColor: "#ff9800",
          duration: 0.2,
          rotation: 15,
          ease: "power2.out"
        });
      },
      onRelease() {
        const rect = box.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        let newColor = "#4caf50";

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        if (x < vw / 2 && y < vh / 2) {
          newColor = "#2196f3";
        } else if (x >= vw / 2 && y < vh / 2) {
          newColor = "#e91e63";
        } else if (x < vw / 2 && y >= vh / 2) {
          newColor = "#9c27b0";
        } else {
          newColor = "#ff5722";
        }

        // Volta a rotação e aplica nova cor com um "estalo" animado
        gsap.to(box, {
          backgroundColor: newColor,
          rotation: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)"
        });
      }
    });

    let scale = 1;
    box.addEventListener('wheel', (e) => {
      e.preventDefault();

      // Ajuste de escala com limite mínimo e máximo
      if (e.deltaY < 0) {
        scale += 0.1; // Zoom in
      } else {
        scale -= 0.1; // Zoom out
      }

      scale = Math.max(0.5, Math.min(2, scale)); // Limita entre 0.5x e 2x

      // Usa GSAP para aplicar a escala
      gsap.to(box, { scale: scale, duration: 0.2, ease: "power2.out" });
    });
  }
})();

function flipBox(element) {
  const state = Flip.getState(element);

  const containerA = document.getElementById("boxA");
  const containerB = document.getElementById("boxB");

  const isInA = containerA.contains(element);

    // Move o elemento para o outro container ANTES de animar
    if (containerA.contains(element)) {
      containerB.appendChild(element);
    } else {
      containerA.appendChild(element);
    }

  Flip.from(state, {
    duration: 0.6,
    ease: "elastic.out(1, 0.9)",
    onComplete: () => {
      // Atualiza o texto após a animação
      element.innerText = isInA ? "Caixa 2" : "Caixa 1";
    }
  });
}