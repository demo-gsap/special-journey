gsap.registerPlugin(ScrollTrigger);

(function () {
    const isAnimationOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    const scrub = true;
  
    if(isAnimationOk) {
      setupAnimations();
    }
  
    function setupAnimations() {
      gsap.from(".keyhole", {
        "clip-path": "polygon(0% 0%, 0% 100%, 25% 100%, 25% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 100%, 100% 100%, 100% 0%)",
        scrollTrigger: {
          trigger: ".section--primary",
          start: "top top",
          end: "bottom bottom",
          scrub: scrub,
          markers: false
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
    }
  }());
  