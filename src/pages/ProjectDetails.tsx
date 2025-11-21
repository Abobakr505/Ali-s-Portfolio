import React, { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import projects from "../components/projectsData";
import CTA from "../components/CTA";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === Number(id));
  const detailsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLUListElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;

    // Hero animation
    gsap.from(heroRef.current, {
      opacity: 0,
      y: -100,
      duration: 1.5,
      ease: "power3.out",
    });

    gsap.from(".hero-image", {
      opacity: 0,
      scale: 0.8,
      duration: 1.8,
      ease: "power3.out",
      delay: 0.3,
    });

    gsap.from(".hero-title", {
      opacity: 0,
      x: -50,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.5,
    });

    gsap.from(".hero-desc", {
      opacity: 0,
      x: 50,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.7,
    });

    // Animate sections on scroll
    const sections = gsap.utils.toArray(".detail-section");
    sections.forEach((section, i) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 80,
        duration: 1.5,
        ease: "power3.out",
        delay: i * 0.3,
      });
    });

    // Animate features list items individually
    if (featuresRef.current) {
      const featureItems = gsap.utils.toArray(featuresRef.current.children);
      featureItems.forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
          },
          opacity: 0,
          x: -50,
          duration: 1,
          ease: "power3.out",
          delay: i * 0.15,
        });
      });
    }

    // Animate technologies tags with stagger
    if (techRef.current) {
      const techTags = gsap.utils.toArray(techRef.current.children);
      gsap.from(techTags, {
        scrollTrigger: {
          trigger: techRef.current,
          start: "top 85%",
        },
        opacity: 0,
        scale: 0.5,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.7)",
      });
    }

    // Animate explore buttons with hover effects (using GSAP for hover)
    if (exploreRef.current) {
      const buttons = gsap.utils.toArray(exploreRef.current.querySelectorAll("a"));
      buttons.forEach((btn) => {
        gsap.from(btn, {
          scrollTrigger: {
            trigger: btn,
            start: "top 90%",
          },
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
        });

        // Hover animation
        btn.addEventListener("mouseenter", () => {
          gsap.to(btn, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });
        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }

    // Background elements animation
    gsap.to(".bg-gradient-1", {
      x: 50,
      y: 50,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(".bg-gradient-2", {
      x: -50,
      y: -50,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

  }, [project]);

  if (!project) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <h2 className="text-4xl font-bold">Project Not Found</h2>
      </div>
    );
  }

  return (
    <>
      <div className="bg-black text-white relative overflow-hidden">
        <div className="bg-gradient-1 absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-400 rounded-full opacity-25 blur-3xl animate-pulse-slow -z-10"></div>
        <div className="bg-gradient-2 absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-700 rounded-full opacity-25 blur-3xl animate-pulse-slow -z-10"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-15 blur-2xl animate-float -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-bl from-green-400 to-teal-500 rounded-full opacity-15 blur-2xl animate-float delay-2000 -z-10"></div>

        <div ref={detailsRef} className="main-container py-32 z-10 relative max-w-7xl mx-auto px-4 lg:px-8">
          <div ref={heroRef} className="relative mb-20 overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={project.image}
              alt={project.name}
              className="hero-image w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8 lg:p-12">
              <h2 className="hero-title text-5xl lg:text-8xl font-heading font-bold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                {project.name}
              </h2>
              <p className="hero-desc text-xl lg:text-2xl mt-4 max-w-3xl leading-relaxed">{project.description}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              <section className="detail-section mb-16">
                <h3 className="text-4xl lg:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">Key Features</h3>
                <ul ref={featuresRef} className="space-y-6">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-lg leading-relaxed">
                      <span className="text-purple-400 mr-4 text-2xl">•</span>
                      <p>{feature}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="detail-section mb-16">
                <h3 className="text-4xl lg:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-red-300">Project Overview</h3>
                <p className="text-lg lg:text-xl leading-relaxed">{project.description}</p>
              </section>

              {/* Added a new section for better content depth */}
              <section className="detail-section mb-16">
                <h3 className="text-4xl lg:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-300">Challenges & Solutions</h3>
                <p className="text-lg lg:text-xl leading-relaxed">
                  This project presented unique challenges such as [add project-specific challenges if available in data]. We overcame them by implementing innovative solutions like [solutions].
                </p>
              </section>
            </div>

            <div className="lg:col-span-1">
              <section className="detail-section mb-16 sticky top-32 bg-black/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-purple-500/30">
                <h3 className="text-4xl lg:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300">Technologies Used</h3>
                <div ref={techRef} className="flex flex-wrap gap-4">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-5 py-3 bg-purple-900/60 rounded-full text-sm lg:text-base font-medium border border-purple-400 hover:bg-purple-800/80 hover:border-purple-300 transition-all duration-300 shadow-md hover:shadow-purple-500/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              <section ref={exploreRef} className="detail-section sticky top-[calc(32rem+16rem)] bg-black/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-blue-500/30">
                <h3 className="text-4xl lg:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-300">Explore More</h3>
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    className="block mb-4 px-6 py-4 text-black  bg-white rounded-lg text-center font-bold text-lg hover:bg-black  hover:text-white transition-all duration-300 border-white border-2 "
                  >
                    Live Demo
                  </a>
                )}
                <a
                  href={project.githubLink}
                  className="block px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg text-center font-bold text-lg hover:from-gray-900 hover:to-gray-700 transition-all duration-300 "
                >
                  GitHub Repository
                </a>
              </section>
            </div>
          </div>
        </div>
      </div>
      <CTA />
    </>
  );
};

export default ProjectDetails;