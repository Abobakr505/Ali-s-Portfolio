import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SplitText from "../components/SplitText";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: "Photoshop", value: 90 },
  { name: "Illustrator", value: 85 },
  { name: "3ds Max", value: 90 },
  { name: "Blender", value: 95 },
  { name: "Revit", value: 90 },
  { name: "Premiere Pro", value: 85 },
  { name: "Autocad", value: 99 },
  { name: "Lumion", value: 89 },
  { name: "MS OFFICE", value: 98 },
  { name: "3D Modeling", value: 95 },
  { name: "3D Animation", value: 90 },
  { name: "After Effects", value: 85 },
];

const Skills = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    // رسم الخط
    gsap.fromTo(
      lineRef.current,
      { width: 0 },
      {
        width: "120px",
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // أنيميشن الدوائر
    const circles = gsap.utils.toArray(".skill-circle");

    circles.forEach((circle, index) => {
      const progress = circle.getAttribute("data-progress");
      const circleIndicator = circle.querySelector(".indicator");

      gsap.fromTo(
        circleIndicator,
        { strokeDashoffset: 380 },
        {
          strokeDashoffset: 380 - (380 * progress) / 100,
          duration: 2,
          delay: index * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-black text-white pb-28 pt-6 px-6 flex flex-col items-center"
    >
      {/* Title */}
      <SplitText
        text="Skills"
        className="text-6xl lg:text-[6vw] font-heading font-bold tracking-tight mb-6 text-center"
        delay={100}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
      />

      {/* 🔥 الخط الجديد */}
      <div
        ref={lineRef}
        className="h-1 bg-white/80 rounded-full shadow-[0_0_15px_white] mb-14"
        style={{ width: "0px" }}
      ></div>

      {/* Skills grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
        {skills.map(({ name, value }, idx) => (
          <div key={idx} className="flex flex-col items-center">
            {/* Circle */}
            <div
              className="relative w-32 h-32 skill-circle "
              data-progress={value}
            >
              <svg className="w-full h-full rounded-full">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="#222"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  className="indicator"
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="#fff"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="380"
                  strokeDashoffset="380"
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 8px #fff)"  }}
                />
              </svg>

              {/* Number */}
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                {value}%
              </span>
            </div>

            <p className="uppercase mt-4 text-lg font-semibold tracking-wide">
              {name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
