import React, { useRef } from 'react'
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(useGSAP,ScrollTrigger);

const CTA = () => {

  const ctaRef = useRef(null);

  useGSAP(() => {
    gsap.from(ctaRef.current, {
        backgroundColor: "#fff",
        scrollTrigger: {
        trigger: ctaRef.current,
        start: "center bottom",     
        end: "60% bottom", 
        scrub: true,
      },
    });
  });

  return (
    <>
      <div ref={ctaRef} className="transition-colors duration-300 mix-blend-difference">
        <div className="main-container py-20 lg:py-28 h-full flex flex-col gap-8 justify-center items-center">
          <h4 className='max-w-6xl text-2xl md:text-3xl xl:text-[40px] 2xl:text-5xl text-center leading-[1.25] mix-blend-difference'>Open to full-time opportunities, freelance projects, and creative collaborations. Let’s get acquainted.</h4>
                  <Link
          to="/contact"
          className="text-black font-heading font-bold  bg-white hover:bg-black  hover:text-white px-8 py-3 rounded-xl transition-all duration-300 border-white border-2"
        >
         Call to Action 
        </Link>
        </div>
      </div>
    </>
  )
}

export default CTA