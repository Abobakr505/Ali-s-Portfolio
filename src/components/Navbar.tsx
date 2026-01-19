import React, { useEffect, useRef, useState } from 'react'
import Logo from '../assets/images/logo.webp'
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(useGSAP);

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const navbarRef = useRef(null);

  // GSAP hook
  useGSAP(() => {
    gsap.from(navbarRef.current, {
      opacity: 0,
      y: -100,
      duration: 0.6
    });
  });
  
  return (
    <>
      <nav ref={navbarRef} className='fixed top-0 z-30 w-full mix-blend-difference'>
        <div className='main-container py-6 flex justify-between items-center'>

          {/* Logo */}
          <Link to='/'>
            <img src={Logo} alt="Logo" className='h-17 w-17 ' />
          </Link>

          {/* Menu */}
          <div onClick={() => setMenuOpen(!menuOpen)} className="menubar flex flex-col gap-1.5 cursor-pointer">
            <span
              className={`inline-block w-10 lg:w-12 h-0.5 bg-white transition-all duration-300 origin-center ${
                menuOpen ? "rotate-45 translate-y-[4px]" : ""
              }`}
            ></span>
            {/* Bottom line */}
            <span
              className={`inline-block w-10 lg:w-12 h-0.5 bg-white transition-all duration-300 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-[4px]" : ""
              }`}
            ></span>
          </div>
        </div>
      </nav>

      {/* Fullscreen Menu */}
      <div className={`fixed z-20 inset-0 bg-black text-white flex flex-col items-center justify-center text-3xl gap-8  transition-transform duration-500 ${menuOpen ? "translate-y-0" : "-translate-y-full"}`} onClick={() => setMenuOpen(false)}>
        {/* Menu links */}
        <Link to="/" className='menu-link font-heading'>Home</Link>
        <Link to="/projects" className='menu-link font-heading'>Projects</Link>
        <Link to="/contact" className='menu-link font-heading'>Contact</Link>
      </div>
    </>
  )
}

export default Navbar