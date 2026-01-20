import React, { useRef } from 'react'
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from "gsap/SplitText";
import TiltedCard from '../components/TiltedCard';
import heroImage from '../assets/images/home.webp';
import { Link } from 'react-router-dom';
import StarBorder from '../components/StarBorder';

gsap.registerPlugin(useGSAP,ScrollTrigger,SplitText);

const Hero = () => {

  const heroRef = useRef(null);

  useGSAP(() => {

    // pin hero section
    ScrollTrigger.create({
      trigger: heroRef.current,        
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      scrub: 1
    });

    // Animate h1
    SplitText.create("h1", {
      type: "lines, words",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        gsap.from(self.words, {
          y: 100,
          opacity: 0,
          delay: 0.2,
          stagger: 0.1,
        });
      }
    });

    // Animate h2
    SplitText.create("h2", {
      type: "lines, words",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        gsap.from(self.words, {
          y: 100,
          opacity: 0,
          stagger: 0.15,
          delay: 0.4,
        });
      }
    });

    // Animate button
    gsap.from(".gradient-btn", {
      opacity: 0,
      y: 40,
      duration: 0.5,
      ease: "power2.out",
      delay: 1.3, 
    });
gsap.to(".hero-image", {
  y: -80,
  scale: 1.1,
  ease: "back.out(1.7)",
  scrollTrigger: {
    trigger: heroRef.current,
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});

gsap.fromTo(".hero-image",
  {
    opacity: 0,
    scale: 1.2,
    rotate: -2,
    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)"
  },
  {
    opacity: 1,
    scale: 1,
    rotate: 0,
    duration: 1.5,
    ease: "power3.out",
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    delay: 0.5
  }
);

// glow overlay fade in
gsap.to(".hero-image-wrapper::after", {
  opacity: 1,
  duration: 1.5,
  delay: 0.7
});

gsap.to(".hero-glow", {
  x: -100,
  y: 50,
  ease: "back.out(1.7)",
  scrollTrigger: {
    trigger: heroRef.current,
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});


    // Animate star shape
    gsap.from(".star svg", {
      scale: 0,
      rotate: 180,
      opacity: 0,
      transformOrigin: "center center",
      duration: 1.3,
      ease: "back.out(1.7)",
      onComplete: () => {
        // Start continuous rotation after the initial animation
        gsap.to(".star svg", {
          rotate: "+=360", // rotate infinitely
          transformOrigin: "center",
          duration: 20,    // adjust speed
          ease: "linear",
          repeat: -1,
        });
      },
    });

  }, { scope: heroRef });

  return (
    <>
      <div ref={heroRef} className='relative overflow-hidden z-0'>
<div className='h-screen flex flex-col md:flex-row justify-between items-center'>
        
        {/* Text container */}
        <div className="main-container h-screen flex flex-col lg:justify-center items-start lg:py-12 max-lg:pt-40">
          <h1 className="text-3xl lg:text-[3.2vw]  font-heading font-semibold">Ali Hasan</h1>
          <h2 className="text-5xl lg:text-[7vw] font-heading font-bold leading-[1] tracking-tight mt-3 mb-6">Architect &  <br/>  <span className='text-stroke'> CG Artist </span></h2>
          <Link to="/contact" className="button-85  font-heading  gradient-btn text-lg lg:text-xl font-semibold ">

            Let's Work

          </Link>
        </div>
{/* Image container */}
<div className="hero-image-wrapper relative w-full md:w-1/2 h-[60vh] md:h-screen">
  <div className="hero-glow" />
  <div
    className="hero-image absolute inset-0"
    style={{ backgroundImage: `url(${heroImage})` }}
  />
</div>


        </div>
        {/* shape */}
        <div className="star absolute -z-1 top-80 lg:top-32 right-[-35%] lg:right-[-12%] opacity-80">
          <svg className='h-[48vh] lg:h-[80vh]' width="100%" height="100%" viewBox="0 0 653 631" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M290.361 1.55611L333.686 284.91L333.88 286.179L334.595 285.114L496.712 43.7172L530.894 66.1542L354.53 298.39L353.719 299.458L355.031 299.182L644.761 238.164L651.694 276.116L359.086 321.398L357.759 321.603L358.897 322.315L605.849 476.828L581.885 510.336L344.939 341.783L343.894 341.039L344.16 342.294L403.733 622.683L363.139 630.092L319.819 346.737L319.626 345.469L318.911 346.534L156.783 587.928L122.522 565.048L298.964 333.261L299.777 332.192L298.463 332.469L8.73045 393.474L1.564 354.212L294.405 310.247L295.74 310.046L294.596 309.329L47.5646 154.375L71.6092 121.305L308.567 289.864L309.612 290.609L309.345 289.353L249.767 8.96559L290.361 1.55611Z" stroke="url(#paint0_linear_1074_2)"/>
            <defs>
            <linearGradient id="paint0_linear_1074_2" x1="4.77595" y1="374.593" x2="648.724" y2="257.056" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF4D6D"/>
            <stop offset="0.25" stopColor="#BD3EB2"/>
            <stop offset="0.5" stopColor="#7B2FF7"/>
            <stop offset="0.75" stopColor="#2F86F7"/>
            <stop offset="1" stopColor="#2FF7ED"/>
            </linearGradient>
            </defs>
          </svg>
        </div>
        
      </div>
    </>
  )
}

export default Hero