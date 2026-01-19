// Modified Projects.jsx - Now fetches from Supabase
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CTA from "../components/CTA";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { supabase } from '../lib/supabase'; // Adjust path if needed

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  useDocumentTitle("Ali's Portfolio | Projects");
  const projectsRef = useRef(null);
    const isMobileRef = useRef(false);
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    // ✅ Check if mobile on mount and resize
    useEffect(() => {
      const checkIfMobile = () => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        isMobileRef.current = mobile;
      };
  
      checkIfMobile();
      window.addEventListener("resize", checkIfMobile);
  
      return () => window.removeEventListener("resize", checkIfMobile);
    }, []);
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: true });
      if (error) {
        setError(error.message);
      } else {
        setProjects(data);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!loading) {
      const items = gsap.utils.toArray(".project-item");
      items.forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
          opacity: 0,
          y: 80,
          scale: 0.95,
          duration: 1.2,
          delay: i * 0.15,
          ease: "power3.out",
        });
      });
    }
  }, [loading, projects]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white flex-col gap-4">
     <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    Loading Projects...
    </div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Error: {error}</div>;

  return (
    <>
      <div className="bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-700 rounded-full opacity-20 blur-3xl animate-pulse-slow -z-10"></div>

        <div ref={projectsRef} className="main-container py-28 z-10 relative">
          <h2 className="text-6xl lg:text-[8vw] font-heading font-bold leading-[1] tracking-tight text-center mb-16">
            Projects
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {projects.map(({ id, name, company_name, main_image }) => (
              <Link
                key={id}
                to={`/project/${id}`}
                className="project-item group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
              >
<img
  src={main_image || "../assets/images/placeholder.webp"}
  alt={name}
  onError={(e) => {
    e.currentTarget.src = "../assets/images/placeholder.webp";
  }}
    className="max-w-full max-h-full object-contain
               transition-transform duration-500
               group-hover:scale-105"
/>

                {isMobile ? (
  // Info bar at bottom (mobile)
  <div
    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 md:p-4 opacity-100 transition-opacity duration-300"
  >
    <h3 className="font-bold text-white truncate text-xl">{name}</h3>
    {company_name && (
      <p className="text-gray-300 truncate text-md ">For {company_name}</p>
    )}
  </div>
) : (
  // Gradient overlay (desktop)
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-end text-center p-4 md:p-6">
    <h3 className="font-heading font-bold text-white mb-1 md:mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-2xl md:text-3xl">
      {name}
    </h3>
    {company_name && (
      <p className="text-gray-200 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 text-lg md:text-xl">
        For {company_name}
      </p>
    )}
  </div>
)}

              </Link>
            ))}
          </div>
        </div>
      </div>
      <CTA />
    </>
  );
};

export default Projects;