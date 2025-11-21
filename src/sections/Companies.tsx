import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const companies = [
  { id: 1, name: "Adobe", logo: "" },
  { id: 2, name: "Netflix", logo: "https://img.freepik.com/free-vector/travel-booking-app-with-airplane-reservation_23-2148626981.jpg" },
  { id: 3, name: "Google", logo: "https://img.freepik.com/free-vector/travel-booking-app-with-airplane-reservation_23-2148626981.jpg" },
  { id: 4, name: "Microsoft", logo: "https://img.freepik.com/free-vector/travel-booking-app-with-airplane-reservation_23-2148626981.jpg" },
  { id: 5, name: "Amazon", logo: "https://img.freepik.com/free-vector/travel-booking-app-with-airplane-reservation_23-2148626981.jpg" },
  { id: 6, name: "Meta", logo: "https://img.freepik.com/free-vector/travel-booking-app-with-airplane-reservation_23-2148626981.jpg" },
];

const CompaniesSlider = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;

    let ctx = gsap.context(() => {
      gsap.to(".company-slide", {
        xPercent: -100 * companies.length,
        ease: "none",
        duration: 20,
        repeat: -1,
      });
    }, slider);

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full bg-white text-black py-24 flex flex-col items-center">
      <h2 className="text-4xl lg:text-[4vw] font-heading font-bold tracking-tight">
        Companies I Worked With
      </h2>

      {/* خط */}
      <div className="w-32 h-1 bg-black rounded-full my-6 shadow-lg"></div>

      {/* السلايدر */}
      <div
        ref={sliderRef}
        className="overflow-hidden w-full max-w-6xl py-10 relative"
      >
        <div className="flex gap-16 whitespace-nowrap company-slider">
          {companies.concat(companies).map(({ id, name, logo }, i) => (
            <div
              key={id + "-dup-" + i}
              className="company-slide flex items-center justify-center min-w-[150px] opacity-80 hover:opacity-100 transition duration-300 hover:scale-110"
            >
              <img
                src={logo}
                alt={name}
                className="w-28 h-auto object-contain grayscale hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompaniesSlider;
