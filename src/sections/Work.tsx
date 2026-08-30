import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "../components/SplitText";
import { supabase } from "../lib/supabase";
import { Mouse, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DepthCarousel from "../components/DepthCarousel";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Work = () => {
  const navigate = useNavigate();
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

  // ✅ Items formatted for the mobile DepthCarousel (image + name + company)
  const mobileCarouselItems = useMemo(
    () =>
      projects
        .filter((p) => p.main_image)
        .map(({ id, name, company_name, main_image }) => ({
          id,
          image: main_image,
          alt: name,
          title: name,
          subtitle: company_name ? `For ${company_name}` : undefined,
          to: `/project/${id}`,
        })),
    [projects]
  );

  // ✅ Calculate scroll width (desktop horizontal scroll)
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

  // ✅ Wait for images to load (desktop only — projectsRef is not used on mobile)
  useEffect(() => {
    if (isMobile) {
      setIsImagesLoaded(true);
      return;
    }
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
  }, [projects, calculateScrollWidth, isMobile]);

  // ✅ أنيميشن ظهور المشاريع عند الوصول للقسم (Scroll Trigger) - Desktop
  useGSAP(
    () => {
      if (isMobile) return;
      if (!projects.length || !projectsRef.current || hasAnimatedRef.current) return;

      const items = projectsRef.current.children;

      // إخفاء المشاريع أولاً
      gsap.set(items, {
        opacity: 0,
        scale: 0.85,
        y: 60,
        rotationY: 15,
        filter: "blur(8px)",
        transformPerspective: 1000,
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
              duration: 0.9,
            },
          });

          // أنيميشن الدخول المتدرج مع تأثير wave
          entranceAnimationRef.current.to(
            items,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              rotationY: 0,
              filter: "blur(0px)",
              stagger: {
                each: 0.12,
                from: "center", // يبدأ من المنتصف ويتجه للخارج
                grid: "auto",
                ease: "power2.inOut",
              },
            },
            0
          );

          // تأثير إضافي للأول والآخر
          if (items.length > 0) {
            entranceAnimationRef.current.to(
              items[0],
              {
                scale: 1.05,
                duration: 0.4,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
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
                ease: "power1.inOut",
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
              filter: "blur(8px)",
            });
          }
        },
      });

      return () => {
        if (scrollTrigger) scrollTrigger.kill();
      };
    },
    { scope: workRef, dependencies: [projects, calculateScrollWidth, isMobile] }
  );

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
            ease: "power2.out",
          });
        },
      },
    });

    // أنيميشن السكرول الأفقي الرئيسي
    timelineRef.current.to(projectsRef.current, {
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
            ease: "power1.inOut",
          });
        }
      },
    });

    // تأثير إضافي للأخير عند نهاية السكرول
    timelineRef.current.to(
      projectsRef.current.children[projectsRef.current.children.length - 1],
      {
        scale: 1.03,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      },
      "-=0.3"
    );

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isInView, scrollWidth, isMobile, projects.length, calculateScrollWidth]);

  // ✅ أنيميشن ظهور القسم على الموبايل (بدل أنيميشن العناصر لأن الكاروسيل بيدير نفسه)
  useGSAP(
    () => {
      if (!isMobile || hasAnimatedRef.current) return;

      const target = workRef.current;
      if (!target) return;

      gsap.set(target, { opacity: 0, y: 40 });

      const scrollTrigger = ScrollTrigger.create({
        trigger: target,
        start: "top 85%",
        once: true,
        onEnter: () => {
          hasAnimatedRef.current = true;
          setIsInView(true);
          gsap.to(target, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          });
        },
      });

      return () => {
        if (scrollTrigger) scrollTrigger.kill();
      };
    },
    { scope: workRef, dependencies: [isMobile] }
  );

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
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black flex-col gap-5">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-black/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-black border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <span className="text-gray-600 tracking-wide text-sm uppercase">
          Loading Projects...
        </span>
      </div>
    );
  }

  return (
    <section ref={workRef} className="bg-white text-black py-16 overflow-hidden relative">
      {/* Title */}
      <div className="main-container md:pb-12 flex max-md:flex-col gap-4 md:gap-6 justify-between items-center">
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
      {isMobile ? (
        // ✅ الموبايل: يعرض المشاريع جوه DepthCarousel
        <div className="main-container mt-4">
          {mobileCarouselItems.length > 0 ? (
            <div style={{ height: "500px", position: "relative" }}>
  <DepthCarousel
    items={mobileCarouselItems}
    depth={260}
    spread={110}
    tilt={22}
    tiltDirection="right"
    perspective={1500}
    visibleCards={4}
    falloff={0.2}
    blur={6}
    autoplay={false}
    loop
    cardWidth={500}
    cardHeight={420}
    radius={20}
    tint="#05060a"
    duration={700}
    ease="power3.out"
    autoplayDelay={3200}
    showControls
    showIndicators
    onCardActivate={(_, item) => {
      if (item.to) navigate(item.to);
    }}
  />
</div>
          ) : (
            <p className="text-center text-gray-500">No projects to show.</p>
          )}

          {/* اسم المشروع الحالي تحت الكاروسيل (اختياري) */}
        </div>
      ) : (
        // ✅ الديسكتوب: نفس تصميم السكرول الأفقي الأصلي
        <div
          className="relative w-full overflow-visible"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div
            ref={projectsRef}
            className="flex gap-4 md:gap-8 ms-4 md:ms-[10%] mt-4 md:mt-6 will-change-transform"
            style={{
              width: "max-content",
              paddingRight: "50vw",
            }}
          >
            {projects.map(({ id, name, company_name, main_image }, index) => (
              <Link
                key={id}
                to={`/project/${id}`}
                className="project-item group relative flex-shrink-0 overflow-hidden rounded-3xl
                           cursor-pointer border border-white/10 bg-black/[0.02]
                           shadow-lg hover:shadow-2xl hover:border-black/25
                           transition-all duration-500
                           w-[300px] md:w-[400px] h-[250px] md:h-[300px]"
              >
                <img
                  src={main_image}
                  alt={name}
                  loading={index < 2 ? "eager" : "lazy"}
                  onLoad={() => {
                    if (index === 0) {
                      setTimeout(calculateScrollWidth, 100);
                    }
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

                {/* Desktop: Overlay on hover */}
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
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Scroll Indicator (Desktop only) */}
      {isInView && !isMobile && scrollWidth > 0 && (
        <div className="main-container mt-6 md:mt-8 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-600 animate-pulse">
            <Mouse className="w-5 h-5" />
            <span>Scroll horizontally to view all projects</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default Work;