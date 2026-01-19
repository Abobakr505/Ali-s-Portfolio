import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpaceAwesome } from "@fortawesome/free-brands-svg-icons"; 
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const ScrollUp: React.FC = () => {
  const scrollUpRef = useRef<HTMLButtonElement | null>(null);
  const circleRef = useRef<SVGCircleElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const btn = scrollUpRef.current;
    const circle = circleRef.current;
    if (!btn || !circle) return;

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      const offset = circumference * (1 - progress);
      circle.style.strokeDashoffset = `${offset}`;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();

    // ظهور واختفاء الزر
    ScrollTrigger.create({
      start: 300,
      onEnter: () => {
        gsap.to(btn, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          pointerEvents: "auto",
          duration: 0.6,
          ease: "power3.out",
        });
      },
      onLeaveBack: () => {
        gsap.to(btn, {
          autoAlpha: 0,
          scale: 0.8,
          y: 20,
          pointerEvents: "none",
          duration: 0.4,
          ease: "power2.in",
        });
      },
    });

    // float motion خفيف
    gsap.to(btn, {
      y: -6,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Scroll up عند الضغط
    const handleClick = () => {
      gsap.to(window, {
        scrollTo: { y: 0 },
        duration: 1.2,
        ease: "expo.inOut",
      });
    };
    btn.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      btn.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <button
      ref={scrollUpRef}
      className="
        fixed bottom-8 right-8 w-13 h-13 rounded-full
        bg-black/80 text-white text-xl
        flex items-center justify-center
        backdrop-blur-md
        opacity-0 scale-80
        pointer-events-none
        z-10
        hover:bg-black/90 hover:scale-105
        cursor-pointer
      "
    >
      {/* السهم */}
      <FontAwesomeIcon icon={faSpaceAwesome} />
      {/* الدائرة التقدمية */}
      <svg
        className="absolute w-13 h-13 -z-10"
        viewBox="0 0 100 100"
      >
        <circle
          ref={circleRef}
          cx="50"
          cy="50"
          r="45"
          stroke="white"
          strokeWidth="4"
          fill="transparent"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
    </button>
  );
};

export default ScrollUp;
