import React, { useRef } from 'react';
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from "gsap/SplitText";
import BlurText from "../components/Blurtext";
import Stack from '../components/PixelTransition';
import AboutImg from '../assets/images/about.webp';
import { FiDownload } from 'react-icons/fi';
import PixelTransition from '../components/PixelTransition';
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const About = () => {

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  const aboutRef = useRef(null);

  useGSAP(() => {
    // Text fade effect with nested splitting to prevent word breaking
    const split = new SplitText(".about-text", {
      type: "lines, words, chars",
      tag: "span",
      linesClass: "overflow-hidden",
      wordsClass: "inline-block whitespace-nowrap"
    });

    gsap.set(split.chars, { opacity: 0.25 }); // initial opacity
    gsap.to(split.chars, {
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
        trigger: aboutRef.current,
        start: "top 70%",
        end: "center center",
        scrub: 1
      },
    });
  }, { scope: aboutRef });

  return (
    <div ref={aboutRef} className='h-auto mt-12 mb-12 bg-white rounded-tl-[60px] rounded-tr-[60px] relative z-10'>
      
      {/* Title */}
      <div className="text-center pt-8  ">
        <BlurText
          text="About Me"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className='text-5xl sm:text-6xl font-heading md:text-7xl  font-bold text-stroke-black flex justify-center items-center'
        />
        <div className="mx-auto w-20 h-1 bg-black rounded-full mt-4"></div>
      </div>

      {/* Image Stack */}
      <div className='flex justify-center items-center py-8'>
<PixelTransition
  firstContent={
    <img
      src={AboutImg}
      alt="default pixel transition content, a Me!"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  }
  secondContent={
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#111"
      }}
    >
      <p className='font-heading' style={{ fontWeight: 900, fontSize: "3rem", color: "#ffffff" }}>CG Artist !</p>
    </div>
  }
  gridSize={8}
  pixelColor='#ffffff'
  once={false}
  animationStepDuration={0.4}
  className="custom-pixel-card"
  pixelColor="#ffffff"
/>
      </div>

      <div className='about-text main-container pb-8 pt-4 h-full flex justify-center items-center font-heading text-black text-2xl md:text-3xl xl:text-[40px] 2xl:text-5xl leading-[1.25] text-left'>I am a CG Artist with over 1.5 years of hands-on experience in 3D modeling, animation, and visual storytelling.
I specialize in creating high-quality 3D visuals, realistic renders, and dynamic animations that transform ideas into compelling visuals.
I have strong experience in architectural and product visualization, with a sharp eye for detail, lighting, and composition.
I confidently use industry-standard 3D and animation tools to deliver polished, professional results that meet creative and technical goals.
</div> 

<div className="flex justify-center mt-2 pb-12">
  <a
    href="/path/to/your-cv.pdf"
    download
    className="
      relative px-8 py-4 bg-black text-white
      font-heading text-xl font-bold rounded-full
      overflow-hidden group
      shadow-lg hover:shadow-xl
      transition-all duration-300
      inline-flex items-center gap-1
      hover:bg-white hover:text-black
      border-2 border-black
    "
  >
    {/* Text */}
    <span
      className="
        transition-transform duration-300 
        translate-x-2
        group-hover:-translate-x-2 
      "
    >
      Download CV
    </span>

    {/* Icon */}
    <FiDownload
      className="
        w-6 h-6
        opacity-0 translate-x-3
        group-hover:opacity-100 group-hover:translate-x-0
        transition-all duration-300
      "
    />

  </a>
</div>


    </div>
  );
};

export default About;