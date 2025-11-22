import React, { useRef } from 'react';
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from "gsap/SplitText";
import BlurText from "../components/Blurtext";
import Stack from '../components/Stack';
import Img1 from '../../public/assets/images/home.webp';
import Img2 from '../../public/assets/images/card-2.webp';
import Img3 from '../../public/assets/images/card-3.webp';
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const About = () => {
  const images = [
    { id: 1, img: Img1 },
    { id: 2, img: Img2 },
    { id: 3, img: Img3 },
  ];

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  const aboutRef = useRef(null);

  useGSAP(() => {
    // Text fade effect
    SplitText.create(".about-text", {
      type: "lines, chars",
      onSplit(self) {
        gsap.set(self.chars, { opacity: 0.25 }); // initial opacity
        gsap.to(self.chars, {
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: aboutRef.current,
            start: "top 70%",
            end: "center center",
            scrub: 1
          },
        });
      },
    });
  }, { scope: aboutRef });

  return (
    <div ref={aboutRef} className='h-auto mt-12 mb-12 bg-white rounded-tl-[60px] rounded-tr-[60px] relative z-10'>
      
      {/* Title */}
      <div className="text-center py-8 lg:py-12 ">
        <BlurText
          text="About Me"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className='text-5xl sm:text-6xl md:text-7xl font-bold text-stroke-black flex justify-center items-center'
        />
        <div className="mx-auto w-20 h-1 bg-black rounded-full mt-4"></div>
      </div>

      {/* Image Stack */}
      <div className='flex justify-center items-center py-8'>
        <Stack
          randomRotation={true}
          sensitivity={180}
          sendToBackOnClick={false}
          cardDimensions={{ width:320, height: 320 }} // تكبير البطاقة قليلاً
          cardsData={images}
        />
      </div>

<div className='about-text main-container pb-8  pt-4 h-full flex justify-center items-center font-heading text-black text-2xl md:text-3xl xl:text-[40px] 2xl:text-5xl leading-[1.25]'>A Site Engineer with over 6 years of experience in site supervision, technical office work, and interior finishing.
Skilled in managing construction projects from planning to execution while ensuring quality and efficiency.
Extensive experience in residential, administrative, and commercial finishing, with a strong background in
engineering consultancy and project coordination. Proficient in utilizing various engineering and design
software to achieve high-quality results.</div> 

    </div>
  );
};

export default About;
