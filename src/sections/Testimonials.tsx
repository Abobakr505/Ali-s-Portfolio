import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaStar } from "react-icons/fa6";
gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Golden View Compny",
    role: "Real Estate Company",
    feedback:
      "The CGI of Together Project highlights contemporary architecture with strong visual appeal.",
  },
  {
    name: "EBNY Compny",
    role: "Real Estate Company",
    feedback:
      "The CGI of EBNY Project highlights contemporary architecture with strong visual",
  },
  {
    name: "SAMCO Compny",
    role: "Real Estate Company",
    feedback:
      "The CGI of JAZURA Project presents a clean, modern design with market impact.",
  },
  {
    name: "GUIRA Compny",
    role: "Real Estate Company",
    feedback:
      "The CGI of KAIA Project reflects modern architecture and commercial attractiveness.",
  },
];


const Testimonials = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [index, setIndex] = useState(0);

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // GSAP animations
  useEffect(() => {
  const cards = cardsRef.current;

  cards.forEach((card, i) => {
    const diff = i - index;

    if (diff === 0) {
      // الكارت الأساسي
      gsap.to(card, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        zIndex: 10,
        duration: 1,
        ease: "power3.out",
      });
    } else if (diff === -1 || diff === testimonials.length - 1) {
      // الكارت الشمال (الكارت اللي قبله)
      gsap.to(card, {
        x: "-180px",
        y: 40,
        scale: 0.8,
        opacity: 0.35,
        filter: "blur(20px)",
        zIndex: 5,
        duration: 1,
        ease: "power3.out",
      });
    } else if (diff === 1 || diff === -(testimonials.length - 1)) {
      // الكارت اليمين (الكارت اللي بعده)
      gsap.to(card, {
        x: "180px",
        y: 40,
        scale: 0.8,
        opacity: 0.35,
        filter: "blur(20px)",
        zIndex: 5,
        duration: 1,
        ease: "power3.out",
      });
    } else {
      // باقي الكروت: تبقى بعيدة جدًا
      gsap.to(card, {
        x: 0,
        y: 120,
        scale: 0.6,
        opacity: 0,
        filter: "blur(30px)",
        zIndex: 1,
        duration: 1,
        ease: "power3.out",
      });
    }
  });
}, [index]);


  // GSAP scroll fade-in of the whole section
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      }
    );
  }, []);

  return (
    <section
      ref={containerRef}
      className="w-full bg-black text-white py-16 px-6 flex flex-col items-center"
    >
      <h2 className="text-center font-heading text-5xl md:text-6xl font-bold mb-10 tracking-tight">
        What Clients Say
      </h2>

      {/* Slider wrapper */}
      <div className="relative w-full max-w-3xl h-[340px] flex items-center justify-center overflow-hidden">
        {testimonials.map((t, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className={`absolute w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-10 shadow-2xl transition-all`}
          >
            <div className="flex text-yellow-400 mb-4 gap-2 ">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="w-5 h-5 animate-pulse " />
              ))}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              “{t.feedback}”
            </p>

            <h3 className="text-2xl font-bold">{t.name}</h3>
            <p className="text-gray-400 text-sm">{t.role}</p>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="flex gap-3 mt-10">
        {testimonials.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              i === index ? "bg-white scale-125" : "bg-white/40"
            }`}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
