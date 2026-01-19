import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Img1 from '../assets/images/compny-1.webp';
import Img2 from '../assets/images/compny-2.webp';
import Folder from '../components/Folder';
import { ArrowUpFromDot } from 'lucide-react';

const companies = [
  { id: 1, name: "LODESTAR", logo: Img1 },
  { id: 2, name: "OBAK", logo: Img2 },
];

const Companies = () => {
    const iconRef = useRef(null);

  useEffect(() => {
    gsap.to(iconRef.current, {
      y: 10,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });
  }, []);
  return (
    <section className="w-full bg-white text-black pt-16 pb-8 flex flex-col items-center">
      <h2 className="text-4xl lg:text-[4vw] px-4 text-center font-heading font-bold tracking-tight">
        Companies I Worked With
      </h2>

      <div className="w-32 h-1 bg-black rounded-full my-6 shadow-lg"></div>

      <div
        className="overflow-hidden w-full max-w-6xl py-10 relative "
      >
        <div className="flex gap-16 whitespace-nowrap items-center justify-center">
        <div className="mt-42 flex flex-col gap-3 justify-center items-center">
          <Folder size={2} color="#000000" className="custom-folder mb-12" items={companies}/>
                <ArrowUpFromDot ref={iconRef} className="w-10 h-10 mb-2" />
          <h2 className=" font-bold font-heading ">Click Here </h2>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Companies;
