import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import projects from "../components/projectsData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === Number(id));

  const mainRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLUListElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const [mainImage, setMainImage] = useState(project?.mainImage);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!project) return;

    // Title animation with special effect
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, 
        { 
          opacity: 0, 
          y: -100,
          rotationX: 90
        },
        { 
          opacity: 1, 
          y: 0, 
          rotationX: 0,
          duration: 1.5, 
          ease: "power3.out",
          transformPerspective: 1000
        }
      );
    }

    // Main image animation with enhanced effects
    if (mainRef.current && imageLoaded) {
      gsap.fromTo(mainRef.current, 
        { 
          opacity: 0, 
          scale: 0.8,
          rotationY: 15,
          filter: "blur(10px)"
        }, 
        { 
          opacity: 1, 
          scale: 1,
          rotationY: 0,
          filter: "blur(0px)",
          duration: 1.2, 
          ease: "power3.out",
          transformPerspective: 1000
        }
      );
    }

    // Description animation
    if (descriptionRef.current) {
      gsap.fromTo(descriptionRef.current,
        { opacity: 0, x: -50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 1, 
          delay: 0.5,
          ease: "power2.out"
        }
      );
    }

    // Enhanced thumbnails animation
    if (thumbnailsRef.current) {
      gsap.fromTo(thumbnailsRef.current.children, 
        {
          opacity: 0,
          y: 50,
          scale: 0.5
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.8
        }
      );
    }

    // Enhanced features animation with ScrollTrigger
    if (featuresRef.current) {
      gsap.fromTo(featuresRef.current.children, 
        {
          opacity: 0,
          x: -80,
          rotationY: 45
        },
        {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 85%",
            end: "bottom 60%",
            toggleActions: "play none none reverse"
          },
          opacity: 1,
          x: 0,
          rotationY: 0,
          stagger: 0.2,
          duration: 0.8,
          ease: "power3.out",
          transformPerspective: 1000
        }
      );
    }

    // Enhanced technologies animation
    if (techRef.current) {
      gsap.fromTo(techRef.current.children, 
        {
          opacity: 0,
          scale: 0,
          rotation: 180
        },
        {
          scrollTrigger: {
            trigger: techRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          opacity: 1,
          scale: 1,
          rotation: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "back.out(1.7)"
        }
      );
    }

    // Enhanced buttons animation
    if (buttonsRef.current) {
      gsap.fromTo(buttonsRef.current.children, 
        {
          opacity: 0,
          y: 40,
          scale: 0.8
        },
        {
          scrollTrigger: {
            trigger: buttonsRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          },
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)"
        }
      );
    }

    // Floating particles background effect
    const particles = [];
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-purple-500 rounded-full opacity-20';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      document.querySelector('.particles-container')?.appendChild(particle);
      
      gsap.to(particle, {
        y: `+=${Math.random() * 100 - 50}`,
        x: `+=${Math.random() * 100 - 50}`,
        duration: Math.random() * 3 + 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      particles.push(particle);
    }

    return () => {
      particles.forEach(particle => particle.remove());
    };
  }, [project, imageLoaded]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleThumbnailClick = (img: string) => {
    setMainImage(img);
    // Add click animation feedback
    gsap.to(mainRef.current, {
      scale: 1.05,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  };



  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-purple-900 text-white relative overflow-hidden">
        <div className="particles-container absolute inset-0"></div>
        <div className="text-center z-10">
          <h2 className="text-4xl font-bold mb-4">Project Not Found</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:scale-105 transition-transform duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="particles-container absolute inset-0"></div>
      


      <div className="relative z-10 px-4 py-28 max-w-6xl mx-auto">
        {/* Project Name */}
        <h2 ref={titleRef} className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {project.name}
        </h2>

        {/* Main Image */}
        <div ref={mainRef} className="mb-6 rounded-2xl overflow-hidden shadow-2xl cursor-pointer border border-purple-500/20 group">
          <img 
            src={mainImage} 
            alt={project.name} 
            className="w-full h-64 md:h-96 object-cover transition-all duration-500 group-hover:scale-105"
            onLoad={handleImageLoad}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Thumbnails */}
        {project.subImages && project.subImages.length > 0 && (
          <div ref={thumbnailsRef} className="flex gap-4 overflow-x-auto mb-12 py-4 scrollbar-hide">
            {project.subImages.map((img, i) => (
              <div 
                key={i}
                className="flex-shrink-0 relative group cursor-pointer transform transition-all duration-300 hover:scale-110"
                onClick={() => handleThumbnailClick(img)}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${i}`}
                  className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-xl shadow-lg border-2 border-transparent group-hover:border-purple-500 transition-all duration-300"
                />
                <div className={`absolute inset-0 rounded-xl bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  mainImage === img ? 'opacity-100 border-2 border-purple-500' : ''
                }`}></div>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <p ref={descriptionRef} className="text-xl mb-12 leading-relaxed text-gray-200 max-w-4xl">
          {project.description}
        </p>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Key Features
          </h2>
          <ul ref={featuresRef} className="grid md:grid-cols-2 gap-4">
            {project.features.map((f, i) => (
              <li 
                key={i} 
                className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-purple-500/20 hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300 group"
              >
                <span className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Technologies */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Technologies
          </h2>
          <div ref={techRef} className="flex flex-wrap gap-4">
            {project.technologies.map((tech, i) => (
              <span 
                key={i} 
                className="px-6 py-3 bg-white text-black rounded-full font-medium hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Live Demo & GitHub Links */}
        <div ref={buttonsRef} className="flex flex-wrap gap-6 mb-16">
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-gradient-to-r from-white to-gray-300 text-black font-bold rounded-xl hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                🌐 Live Demo
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          )}
          
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 font-bold rounded-xl hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                💻 GitHub
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          )}
        </div>

        {/* Project Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-purple-500/20">
          <Link 
            to="/projects"
            className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-purple-500/30 hover:bg-purple-900/50 transition-all duration-300"
          >
            ← Back to Projects
          </Link>
          
          <div className="text-sm text-gray-400">
            Project {projects.findIndex(p => p.id === project.id) + 1} of {projects.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;