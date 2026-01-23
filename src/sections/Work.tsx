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
  const entranceAnimationRef = useRef(null);
  const isMobileRef = useRef(false);
  const hasAnimatedRef = useRef(false);
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);

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

  // ✅ Calculate scroll width
  const calculateScrollWidth = useCallback(() => {
    if (!projectsRef.current || !projectsRef.current.parentElement) return;
    
    requestAnimationFrame(() => {
      if (projectsRef.current && projectsRef.current.parentElement) {
        const projectsWidth = projectsRef.current.scrollWidth;
        const containerWidth = projectsRef.current.parentElement.clientWidth;
        const scrollDistance = Math.max(0, projectsWidth - containerWidth);
        setScrollWidth(scrollDistance);
      }
    });
  }, []);

  // ✅ Wait for images to load
  useEffect(() => {
    if (projects.length === 0 || !projectsRef.current) return;

    const images = projectsRef.current.querySelectorAll("img");
    if (images.length === 0) {
      calculateScrollWidth();
      setIsImagesLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = images.length;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
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

    if (loadedCount === totalImages) {
      setIsImagesLoaded(true);
      calculateScrollWidth();
    }

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
        img.removeEventListener("error", handleImageLoad);
      });
    };
  }, [projects, calculateScrollWidth]);

  // ✅ أنيميشن ظهور المشاريع عند الوصول للقسم (Scroll Trigger)
  useGSAP(() => {
    if (!projects.length || !projectsRef.current || hasAnimatedRef.current) return;
    
    const items = projectsRef.current.children;
    
    // إخفاء المشاريع أولاً
    gsap.set(items, {
      opacity: 0,
      scale: 0.85,
      y: 60,
      rotationY: 15,
      filter: "blur(8px)",
      transformPerspective: 1000
    });
    
    // إنشاء ScrollTrigger للكشف عن الظهور
    const scrollTrigger = ScrollTrigger.create({
      trigger: workRef.current,
      start: "top 75%", // يبدأ عند وصول 75% من العنصر للشاشة
      end: "bottom 25%",
      once: true, // يعمل مرة واحدة فقط
      onEnter: () => {
        setIsInView(true);
        hasAnimatedRef.current = true;
        
        // أنيميشن الظهور مع تأثير كروي جميل
        if (entranceAnimationRef.current) {
          entranceAnimationRef.current.kill();
        }
        
        entranceAnimationRef.current = gsap.timeline({
          defaults: {
            ease: "power3.out",
            duration: 0.9
          }
        });
        
        // أنيميشن الدخول المتدرج مع تأثير wave
        entranceAnimationRef.current.to(items, {
          opacity: 1,
          scale: 1,
          y: 0,
          rotationY: 0,
          filter: "blur(0px)",
          stagger: {
            each: 0.12,
            from: "center", // يبدأ من المنتصف ويتجه للخارج
            grid: "auto",
            ease: "power2.inOut"
          }
        }, 0);
        
        // تأثير إضافي للأول والآخر
        if (items.length > 0) {
          entranceAnimationRef.current.to(
            items[0],
            {
              scale: 1.05,
              duration: 0.4,
              yoyo: true,
              repeat: 1,
              ease: "power1.inOut"
            },
            0.3
          );
          
          entranceAnimationRef.current.to(
            items[items.length - 1],
            {
              scale: 1.05,
              duration: 0.4,
              yoyo: true,
              repeat: 1,
              ease: "power1.inOut"
            },
            0.5
          );
        }
        
        // بعد انتهاء أنيميشن الظهور، نحسب scrollWidth للسكرول الأفقي
        entranceAnimationRef.current.add(() => {
          if (!isMobileRef.current) {
            setTimeout(() => {
              calculateScrollWidth();
            }, 300);
          }
        });
      },
      onLeaveBack: () => {
        // إعادة تعيين عند الخروج (اختياري)
        if (!hasAnimatedRef.current) {
          gsap.set(items, {
            opacity: 0,
            scale: 0.85,
            y: 60,
            rotationY: 15,
            filter: "blur(8px)"
          });
        }
      }
    });
    
    return () => {
      if (scrollTrigger) scrollTrigger.kill();
    };
  }, { scope: workRef, dependencies: [projects, calculateScrollWidth] });

  // ✅ أنيميشن السكرول الأفقي (للكمبيوتر فقط) - يعمل بعد ظهور المشاريع
  useEffect(() => {
    if (!isInView || !projects.length || !projectsRef.current || isMobile || scrollWidth <= 0) return;
    
    // تنظيف timeline السابق
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    
    const containerWidth = projectsRef.current.parentElement.clientWidth;
    
    // إنشاء timeline للسكرول الأفقي
    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: workRef.current,
        start: "top top", // يبدأ من أعلى القسم
        end: () => `+=${scrollWidth + containerWidth + 500}`, // مسافة إضافية للراحة
        pin: true,
        scrub: 0.7, // تأثير سلس مع السكرول
        anticipatePin: 1,
        invalidateOnRefresh: true,
        markers: false,
        onRefresh: () => {
          calculateScrollWidth();
        },
        onEnter: () => {
          // إضافة تأثير رفع خفيف عند بداية السكرول
          gsap.to(projectsRef.current.children, {
            y: -10,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out"
          });
        }
      }
    });
    
    // أنيميشن السكرول الأفقي الرئيسي
    timelineRef.current.to(
      projectsRef.current,
      {
        x: -scrollWidth,
        duration: 1,
        ease: "power1.inOut",
        onStart: () => {
          // إضافة تأثير اهتزاز خفيف للعنصر الأول عند البدء
          if (projectsRef.current.children[0]) {
            gsap.to(projectsRef.current.children[0], {
              rotationZ: 1,
              duration: 0.3,
              yoyo: true,
              repeat: 3,
              ease: "power1.inOut"
            });
          }
        }
      }
    );
    
    // تأثير إضافي للأخير عند نهاية السكرول
    timelineRef.current.to(
      projectsRef.current.children[projectsRef.current.children.length - 1],
      {
        scale: 1.03,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut"
      },
      "-=0.3"
    );
    
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isInView, scrollWidth, isMobile, projects.length, calculateScrollWidth]);

  // ✅ أنيميشن الموبايل (يظهر عند الوصول)
  useGSAP(() => {
    if (!isMobile || !projects.length || !projectsRef.current || hasAnimatedRef.current) return;
    
    const items = projectsRef.current.children;
    
    // إخفاء العناصر أولاً
    gsap.set(items, {
      opacity: 0,
      scale: 0.9,
      y: 50,
      filter: "blur(6px)"
    });
    
    // ScrollTrigger للكشف عن الظهور على الموبايل
    const scrollTrigger = ScrollTrigger.create({
      trigger: projectsRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        hasAnimatedRef.current = true;
        
        gsap.to(items, {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: {
            each: 0.15,
            from: "start",
            ease: "power2.out"
          },
          ease: "back.out(1.4)"
        });
      }
    });
    
    return () => {
      if (scrollTrigger) scrollTrigger.kill();
    };
  }, { scope: workRef, dependencies: [isMobile, projects.length] });

  // ✅ Handle window resize
  useEffect(() => {
    let timeoutId;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        calculateScrollWidth();
        ScrollTrigger.refresh();
      }, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [calculateScrollWidth]);

  // ✅ Cleanup
  useEffect(() => {
    return () => {
      if (timelineRef.current) timelineRef.current.kill();
      if (entranceAnimationRef.current) entranceAnimationRef.current.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

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
          className="text-white font-bold bg-black font-heading hover:bg-white hover:text-black px-6 md:px-8 py-2 md:py-3 rounded-full transition-all duration-300 border-2 border-black text-md"
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
          msOverflowStyle: "none"
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
            paddingRight: isMobile ? "2rem" : "50vw"
          }}
        >
          {projects.map(({ id, name, company_name, main_image }, index) => (
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
                  loading={index < 2 ? "eager" : "lazy"}
                  onLoad={() => {
                    if (index === 0) {
                      setTimeout(calculateScrollWidth, 100);
                    }
                  }}
                />
              </div>

              {/* Mobile: Info always visible at bottom */}
              {isMobile ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 opacity-100 transition-opacity duration-300">
                  <h3 className="font-bold text-white truncate text-xl">{name}</h3>
                  {company_name && (
                    <p className="text-gray-300 truncate text-md">For {company_name}</p>
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
      {isInView && !isMobile && scrollWidth > 0 && (
        <div className="main-container mt-6 md:mt-8 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-600 animate-pulse">
            <Mouse className="w-5 h-5" />
            <span>Scroll horizontally to view all projects</span>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="main-container mt-6 md:mt-8 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ChevronsRight className="w-7 h-7 animate-pulse" />
            <span>Swipe horizontally to view all projects</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default Work;