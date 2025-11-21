import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Img1 from '../../public/assets/images/compny-1.jpg';
import Img2 from '../../public/assets/images/compny-2.jpg';
import Folder from '../components/Folder';

const companies = [
  { id: 1, name: "LODESTAR", logo: Img1 },
  { id: 2, name: "OBAK", logo: Img2 },
  { id: 3, name: "LODESTAR", logo: Img1 },

];

const Companies = () => {
  return (
    <section className="w-full bg-white text-black py-24 flex flex-col items-center">
      <h2 className="text-4xl lg:text-[4vw] text-center font-heading font-bold tracking-tight">
        Companies I Worked With
      </h2>

      <div className="w-32 h-1 bg-black rounded-full my-6 shadow-lg"></div>

      <div
        className="overflow-hidden w-full max-w-6xl py-10 relative "
      >
        <div className="flex gap-16 whitespace-nowrap items-center justify-center">
        <div className="mt-42">
          <Folder size={2} color="#000000" className="custom-folder" items={companies}/>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Companies;
