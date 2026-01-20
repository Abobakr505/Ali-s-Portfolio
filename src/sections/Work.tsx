import React, { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "../components/SplitText";
import { supabase } from "../lib/supabase";
import { ChevronsRight, Mouse } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Work = () => {
  const workRef = useRef(null);
  const projectsRef = useRef(null);
  const timelineRef = useRef(null);
  const isMobileRef = useRef(false);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

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

  // ✅ Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, company_name, main_image")
        .order("id", { ascending: true });

      if (!error) {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // ✅ Wait for images to load before calculating scroll width
  useEffect(() => {
    if (projects.length === 0 || !projectsRef.current) return;

    const images = projectsRef.current.querySelectorAll("img");
    let loadedCount = 0;

    if (images.length === 0) {
      calculateScrollWidth();
      return;
    }

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        setIsImagesLoaded(true);
        calculateScrollWidth();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener("load", handleImageLoad);
        img.addEventListener("error", handleImageLoad);
      }
    });

    if (loadedCount === images.length) {
      setIsImagesLoaded(true);
      calculateScrollWidth();
    }

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
        img.removeEventListener("error", handleImageLoad);
      });
    };
  }, [projects]);

  const calculateScrollWidth = useCallback(() => {
    if (!projectsRef.current) return;

    setTimeout(() => {
      if (projectsRef.current) {
        const projectsWidth = projectsRef.current.scrollWidth;
        const containerWidth = projectsRef.current.parentElement.clientWidth;
        const scrollDistance = Math.max(0, projectsWidth - containerWidth);
        setScrollWidth(scrollDistance);
      }
    }, 100);
  }, []);

  // ✅ GSAP Animation for Desktop and Mobile
  useGSAP(() => {
    if (!projects.length || !projectsRef.current) return;

    // Kill existing timeline and ScrollTrigger
    if (timelineRef.current) {
      timelineRef.current.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === workRef.current) {
          trigger.kill();
        }
      });
    }

    const items = projectsRef.current.children;

    if (!isMobileRef.current && scrollWidth > 0) {
      // Desktop animation
      const containerWidth = projectsRef.current.parentElement.clientWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: workRef.current,
          start: "top top",
          end: () => `+=${scrollWidth + containerWidth}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: false,
        },
      });

      // Initial entrance
      tl.fromTo(
        items,
        { x: 300, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: "power3.out",
        }
      );

      // Horizontal scroll (removed delay)
      tl.to(
        projectsRef.current,
        {
          x: -scrollWidth,
          duration: 1,
          ease: "power1.inOut",
        }
      );

      timelineRef.current = tl;
    } else if (isMobileRef.current) {
      // Mobile appearance animation: fade in with scale and stagger
     gsap.fromTo(
  items,
  {
    scale: 0.92,
    opacity: 0,
    y: 40,
    filter: "blur(6px)",
  },
  {
    scale: 1,
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 1,
    stagger: {
      each: 0.12,
      from: "start",
    },
    ease: "power3.out",
    scrollTrigger: {
      trigger: projectsRef.current,
      start: "top 85%",
      once: true,
    },
  }
);

    }

    ScrollTrigger.refresh();

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, { scope: workRef, dependencies: [projects, scrollWidth, isImagesLoaded, isMobile] });

  // ✅ Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isImagesLoaded) {
        calculateScrollWidth();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isImagesLoaded, calculateScrollWidth]);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center bg-white text-black flex-col gap-4">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        Loading Projects...
      </div>
    );
  }

  return (
    <section
      ref={workRef}
      className="bg-white text-black py-16 overflow-hidden relative"
    >
      {/* Title */}
      <div className="main-container pb-6 md:pb-12 flex max-md:flex-col gap-4 md:gap-6 justify-between items-center">
        <div className="max-w-xl text-center md:text-left">
          <SplitText
            text="Featured Projects"
            className="text-5xl text-stroke-black font-heading"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center md:text-left"
            onLetterAnimationComplete={handleAnimationComplete}
          />

          <p className="text-base md:text-lg lg:text-xl mt-3 md:mt-4 px-4 md:px-0">
            A curated selection of my finest projects—crafted to inspire, captivate, and drive real impact.
          </p>
        </div>

        <Link
          to="/projects"
          className="text-white font-bold  bg-black font-heading hover:bg-white hover:text-black px-6 md:px-8 py-2 md:py-3 rounded-full transition-all duration-300 border-2 border-black text-md "
        >
          Explore All
        </Link>
      </div>

      {/* Projects Container */}
      <div
        className={`relative w-full ${
          isMobile
            ? "overflow-x-auto snap-x snap-mandatory mobile-scroll-container"
            : "overflow-visible"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`
          .mobile-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div
          ref={projectsRef}
          className={`flex gap-4 md:gap-8 ${
            isMobile ? "px-4" : "ms-4 md:ms-[10%]"
          } mt-4 md:mt-6 will-change-transform`}
          style={{
            width: "max-content",
            paddingRight: isMobile ? "2rem" : "50vw",
          }}
        >
          {projects.map(({ id, name, company_name, main_image }) => (
            <Link
              key={id}
              to={`/project/${id}`}
              className={`relative flex-shrink-0 rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                isMobile
                  ? "w-[280px] h-[200px] snap-start"
                  : "w-[300px] md:w-[400px] h-[250px] md:h-[300px]"
              }`}
            >
              <div className="w-full h-full flex items-center justify-center bg-gray-100 overflow-hidden">
                <img
                  src={main_image}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Mobile: Info always visible at bottom */}
              {isMobile ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 opacity-100 transition-opacity duration-300">
                  <h3 className="font-bold text-white truncate  text-xl">{name}</h3>
                  {company_name && (
                    <p className="text-gray-300 truncate text-md ">
                      For {company_name}
                    </p>
                  )}
                </div>
              ) : (
                /* Desktop: Overlay on hover */
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

      {/* Scroll / Swipe Indicator */}
      <div className="main-container mt-6 md:mt-8 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {isMobile ? (
            <ChevronsRight className="w-7 h-7 animate-pulse" />
          ) : (
            <Mouse  className="w-5 h-5 animate-pulse" />
          )}

          <span>
            {isMobile ? "Swipe" : "Scroll"} horizontally to view all projects
          </span>
        </div>
      </div>
    </section>
  );
};

export default Work;