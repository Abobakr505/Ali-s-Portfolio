import React, { useEffect, useRef } from "react";
import BlurText from "../components/Blurtext";
import { gsap } from "gsap";


const Services = () => {
    const lineRef = useRef(null);
      const sectionRef = useRef(null);

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
      );}, []);
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };
  return (
    <>
      {/* Title Wrapper */}
      <div className="bg-black text-white">
        <div className='main-container pb-8 lg:pb-12 text-center flex justify-center items-center flex-col' ref={sectionRef} >
          <BlurText
            text="Services in Detail"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className=' text-6xl text-bold text-stroke flex justify-center '
          />
      <div
        ref={lineRef}
        className="h-1 bg-white/80 rounded-full shadow-[0_0_15px_white] mt-8"
        style={{ width: "0px" }}
      ></div>
              </div>
      </div>

      {/* Services List */}
      <div className='relative'>
        <div className="bg-black text-white pt-16 lg:pt-20 pb-[40rem] sticky top-4">
          <div className="main-container grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-start">
              
            {/* Left side */}
            <div className='flex gap-6 lg:gap-8'>
              <span className="text-gray-400 text-lg lg:text-2xl font-heading tracking-wide block mb-4">01</span>
              <h2 className="text-[8vw] md:text-6xl font-heading font-bold leading-[1]">
                  Web Design <br /> & UI/UX
              </h2>
            </div>

            {/* Right side */}
            <div className="flex items-center">
              <p className="text-lg lg:text-xl leading-relaxed">
                  Crafting modern, user-focused websites with clean layouts,
                  thoughtful typography, and smooth interactions. Every design
                  is tailored to deliver both aesthetic appeal and seamless
                  usability.
              </p>
            </div>

          </div>
        </div>
        <div className="bg-[#E9E9F0] text-black pt-16 lg:pt-20 pb-[23rem] sticky top-1/3">
          <div className="main-container grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-start">
              
            {/* Left side */}
            <div className='flex gap-6 lg:gap-8'>
              <span className="text-gray-400 text-lg lg:text-2xl font-heading tracking-wide block mb-4">02</span>
              <h2 className="text-[8vw] md:text-6xl font-heading font-bold leading-[1]">
                  Shopify <br /> Development
              </h2>
            </div>

            {/* Right side */}
            <div className="flex items-center">
              <p className="text-lg lg:text-xl leading-relaxed">
                  From custom themes to advanced features, I design and build Shopify stores that boost sales and reflect your brand. Optimized for performance, easy management, and smooth shopping experiences.
              </p>
            </div>

          </div>
        </div>
        <div className="bg-white text-black py-16 lg:py-20 sticky top-2/3">
          <div className="main-container grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-start">
              
            {/* Left side */}
            <div className='flex gap-6 lg:gap-8'>
              <span className="text-gray-400 text-lg lg:text-2xl font-heading tracking-wide block mb-4">03</span>
              <h2 className="text-[8vw] md:text-6xl font-heading font-bold leading-[1]">
                  Creative <br /> Branding
              </h2>
            </div>

            {/* Right side */}
            <div className="flex items-center">
              <p className="text-lg lg:text-xl leading-relaxed">
                  Building strong brand identities through design, storytelling, and visuals that connect with your audience. From logos to full brand systems, I help create a consistent and memorable presence.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Services