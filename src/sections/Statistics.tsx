import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { FiUsers, FiBriefcase, FiCheckCircle, FiAward } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: "Clients", value: 120, icon: FiUsers },
  { label: "Projects", value: 85, icon: FiBriefcase },
  { label: "Completed", value: 150, icon: FiCheckCircle },
  { label: "Awards", value: 12, icon: FiAward },
];

const Statistics = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const counters = gsap.utils.toArray(".stat-number");

    counters.forEach((counter: any) => {
      const finalValue = counter.getAttribute("data-value");

      gsap.fromTo(
        counter,
        { innerText: 0 },
        {
          innerText: finalValue,
          duration: 2,
          ease: "power1.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-black text-white py-12 px-6 flex justify-center"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl w-full text-center">
        {stats.map(({ label, value, icon: Icon }, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center group"
          >
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4 shadow-lg group-hover:shadow-[0_0_25px_white] transition-all">
              <Icon className="text-white w-10 h-10" />
            </div>

            {/* Number */}
            <div
              className="stat-number text-4xl font-bold text-white drop-shadow-lg"
              data-value={value}
            >
              0
            </div>

            {/* Label */}
            <p className="text-gray-300 mt-2 text-lg tracking-wider">{label}</p>

            {/* Line Glow */}
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent mt-3 opacity-60"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statistics;
