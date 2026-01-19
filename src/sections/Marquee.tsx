import React from 'react'
import star from '../assets/images/star.svg'

const Marquee = () => {
  return (
    <>
      <div className="overflow-hidden bg-white text-black  ">

        {/* Row 1 */}
        <div className="whitespace-nowrap animate-marquee text-6xl lg:text-[7vw] font-heading font-semibold leading-[1] tracking-tight">
          <span className="flex gap-4 lg:gap-8 mx-8">
            CREATE <img src={star} alt="" className="marquee-star1 w-[7vw]" /> 
            DESIGN <img src={star} alt="" className="marquee-star1 w-[7vw]" /> 
            INSPIRE <img src={star} alt="" className="marquee-star1 w-[7vw]" /> 
            CREATE <img src={star} alt="" className="marquee-star1 w-[7vw]" /> 
            DESIGN <img src={star} alt="" className="marquee-star1 w-[7vw]" /> 
            INSPIRE <img src={star} alt="" className="marquee-star1 w-[7vw]" /> 
          </span>
        </div>

        {/* Row 2 (rever se) */}
        <div className="whitespace-nowrap animate-marquee-reverse text-6xl lg:text-[7vw] font-heading font-semibold leading-[1] tracking-tight">
          <span className="flex gap-4 lg:gap-8 mx-8">
            CREATE <img src={star} alt="" className="marquee-star2 w-[7vw]" /> 
            DESIGN <img src={star} alt="" className="marquee-star2 w-[7vw]" /> 
            INSPIRE <img src={star} alt="" className="marquee-star2 w-[7vw]" />
            CREATE <img src={star} alt="" className="marquee-star2 w-[7vw]" /> 
            DESIGN <img src={star} alt="" className="marquee-star2 w-[7vw]" /> 
            INSPIRE <img src={star} alt="" className="marquee-star2 w-[7vw]" /> 
          </span>
        </div>
        
      </div>
    </>
  )
}

export default Marquee