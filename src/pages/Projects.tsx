// Modified Projects.jsx - Now fetches from Supabase
import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CTA from "../components/CTA";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { supabase } from '../lib/supabase'; // Adjust path if needed
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  useDocumentTitle("Ali's Portfolio | Projects");
  const projectsRef = useRef(null);
  const isMobileRef = useRef(false);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white flex-col gap-5">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <span className="text-gray-400 tracking-wide text-sm uppercase">
          Loading Projects...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-3 px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
          <span className="text-red-400 text-2xl">!</span>
        </div>
        <p className="text-gray-300 font-medium">Something went wrong</p>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-black text-white relative overflow-hidden">
        {/* Ambient background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-700 rounded-full opacity-20 blur-3xl animate-pulse-slow -z-10"></div>

        <div ref={projectsRef} className="main-container py-28 z-10 relative">
          <div className="text-center mb-16">
            <span className="inline-block text-xs tracking-[0.3em] text-gray-500 uppercase mb-3">
              Portfolio
            </span>
            <h2 className="text-6xl lg:text-[8vw] font-heading font-bold leading-[1] tracking-tight">
              Projects
            </h2>
            <div className="mx-auto w-24 h-[3px] bg-gradient-to-r from-transparent via-white to-transparent rounded-full mt-5" />
            <p className="text-gray-400 mt-5 max-w-xl mx-auto text-lg">
              A selection of things I've designed, built, and shipped.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-2">
              <p className="text-lg">No projects to show yet.</p>
              <p className="text-sm">Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {projects.map(({ id, name, company_name, main_image }) => (
                <Link
                  key={id}
                  to={`/project/${id}`}
                  className="project-item group relative overflow-hidden rounded-3xl
                             cursor-pointer border border-white/10 bg-white/[0.02]
                             shadow-lg hover:shadow-2xl hover:border-white/25
                             transition-all duration-500
                             aspect-[4/3]"
                >
                  <img
                    src={main_image || "/assets/images/placeholder.webp"}
                    alt={name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/assets/images/placeholder.webp";
                    }}
                    className="absolute inset-0 w-full h-full object-cover
                               transition-transform duration-700 ease-out
                               group-hover:scale-110"
                  />

                  {/* subtle base gradient always present for legibility + polish */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Arrow badge */}
                  <div
                    className="absolute top-4 right-4 w-10 h-10 rounded-full
                               bg-white/10 backdrop-blur-md border border-white/20
                               flex items-center justify-center
                               opacity-0 group-hover:opacity-100
                               translate-y-2 group-hover:translate-y-0
                               transition-all duration-500"
                  >
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>

{isMobile ? (
  <>
    {/* Gradient overlay ثابت عشان النص يبان كويس فوق الصورة */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

    <div className="absolute bottom-0 left-0 right-0 p-5">
      <span className="block w-8 h-[2px] bg-white/80 mb-2 rounded-full" />
      <h3 className="font-heading font-bold text-white text-xl leading-snug drop-shadow-sm">
        {name}
      </h3>
      {company_name && (
        <p className="text-gray-300 text-sm mt-1.5 flex items-center gap-1">
          For {company_name}
        </p>
      )}
    </div>

    {/* Badge السهم يظهر ثابت بشكل خفيف على الموبايل بدل ما يعتمد على hover */}
    <div
      className="absolute top-4 right-4 w-9 h-9 rounded-full
                 bg-white/10 backdrop-blur-md border border-white/20
                 flex items-center justify-center active:scale-90
                 transition-transform duration-300"
    >
      <ArrowUpRight className="w-4 h-4 text-white" />
    </div>
  </>
) : (
                    <div
                      className="absolute inset-0 flex flex-col items-start justify-end
                                 text-left p-6
                                 bg-gradient-to-t from-black/90 via-black/40 to-transparent
                                 opacity-0 group-hover:opacity-100
                                 transition-opacity duration-500"
                    >
                      <span
                        className="w-8 h-[2px] bg-white mb-3 origin-left scale-x-0
                                   group-hover:scale-x-100 transition-transform duration-500 delay-100"
                      />
                      <h3
                        className="font-heading font-bold text-white mb-1
                                   transform translate-y-4 group-hover:translate-y-0
                                   transition-transform duration-500
                                   text-2xl md:text-3xl"
                      >
                        {name}
                      </h3>
                      {company_name && (
                        <p
                          className="text-gray-300
                                     transform translate-y-4 group-hover:translate-y-0
                                     transition-transform duration-500 delay-100
                                     text-base md:text-lg"
                        >
                          For {company_name}
                        </p>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <CTA />
    </>
  );
};

export default Projects;