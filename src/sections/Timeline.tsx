import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FiTool,
  FiPenTool,
  FiCode,
  FiCheckCircle,
  FiPocket,
} from "react-icons/fi";
import SplitText from "../components/SplitText";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  { step: "Idea Generation", desc: "Brainstorm and collect ideas.", icon: FiTool },
  { step: "Planning", desc: "Define roadmap and milestones.", icon: FiTool },
  { step: "Design", desc: "Create mockups and visual designs.", icon: FiPenTool },
  { step: "Development", desc: "Code your project using best practices.", icon: FiCode },
  { step: "Testing", desc: "Ensure everything works perfectly.", icon: FiCheckCircle },
  { step: "Launch", desc: "Deploy your project to production.", icon: FiPocket },
];

const TimelineSection = () => {
  const timelineRef = useRef(null);
  const lineHorizontalRef = useRef(null);
  const lineVerticalRef = useRef(null);
    const sectionRef = useRef(null);


  useEffect(() => {
    // رسم الخط
    gsap.fromTo(
      lineHorizontalRef.current,
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

    // رسم الخط العمودي
    gsap.fromTo(
      lineVerticalRef.current,
      { scaleY: 0, transformOrigin: "top" },
      {
        scaleY: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: true,
        },
      }
    );
  }, []);

  useEffect(() => {
    const cards = gsap.utils.toArray(".timeline-card");

    cards.forEach((card: any) => {
      const circle = card.querySelector(".timeline-circle");

      // ظهور الكارت
      gsap.fromTo(
        card,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
          },
        }
      );

      // ظهور الدائرة
      gsap.fromTo(
        circle,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
          },
        }
      );

      // توهج الدائرة
      gsap.to(circle, {
        boxShadow: "0 0 25px rgba(255,255,255,0.6)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    });
  }, []);

  return (
    <section
      ref={timelineRef}
      className="w-full min-h-screen bg-black text-white flex flex-col items-center py-20 px-4"
    >
      {/* العنوان */}
      <div className="text-center mb-16flex justify-center items-center flex-col" ref={sectionRef}>
        <SplitText
          text="Journey"
          className="text-6xl md:text-7xl font-extrabold tracking-tight"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
        />

<div
  ref={lineHorizontalRef}
  className="mx-auto h-1 bg-white/80 rounded-full shadow-[0_0_15px_white] mt-8 mb-8"
  style={{ width: 0 }}
></div>

      </div>

      {/* المحتوى */}
      <div className="relative max-w-4xl w-full">

        {/* الخط العمودي */}
        <div
          ref={lineVerticalRef}
          className="absolute left-1/2 top-0 transform -translate-x-1/2 w-2 h-full rounded-full"
          style={{
            background: "linear-gradient(to bottom, #fff, #bbbbbb)",
            boxShadow: "0 0 20px #ffffff60",
            transformOrigin: "top",
          }}
        ></div>

        {/* الكروت */}
        {timelineData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`timeline-card flex flex-col md:flex-row items-center mb-16 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* الكارت */}
              <div className="w-full md:w-1/2 px-4">
                <div className="relative group bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {item.step}
                  </h3>
                  <p className="text-gray-300">{item.desc}</p>

                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 bg-gradient-to-tr from-white/20 via-white/10 to-white/0 animate-pulse"></div>
                </div>
              </div>

              {/* الدائرة + الأيقونة */}
              <div className="timeline-circle w-14 h-14 rounded-full bg-white mx-6 flex items-center justify-center relative">
                <Icon className="w-7 h-7 text-black" />
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
              </div>

              <div className="w-1/2" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TimelineSection;
