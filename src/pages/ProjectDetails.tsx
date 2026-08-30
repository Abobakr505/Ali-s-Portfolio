// ProjectDetails.jsx - Updated to handle both embedded (e.g., YouTube) and direct video URLs
import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { supabase } from '../lib/supabase'; // Adjust path if needed
import { MapPin, Sparkles, ZoomIn, ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [projects, setProjects] = useState([]); // For navigation
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mainRef = useRef(null);
  const featuresRef = useRef(null);
  const techRef = useRef(null);
  const buttonsRef = useRef(null);
  const thumbnailsRef = useRef(null);
  const titleRef = useRef(null);
  const companyRef = useRef(null);
  const partnerCompanyRef = useRef(null);
  const locationRef = useRef(null);
  const projectTypeRef = useRef(null);
  const descriptionRef = useRef(null);
  const videoRef = useRef(null);
  const lensRef = useRef(null);
  const imgRef = useRef(null);
  const [mainImage, setMainImage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const isTouchDevice = useRef(false);

const getLensSize = () => {
  return isTouchDevice.current ? 120 : 180;
};

useEffect(() => {
  isTouchDevice.current =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
}, []);

const moveLens = (clientX, clientY) => {
  if (!zoomActive || !lensRef.current || !imgRef.current) return;

  const img = imgRef.current;
  const lens = lensRef.current;

  const rect = img.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const lensSize = getLensSize(); // ✅ هنا
  const zoom = 3;

  let lensX = x - lensSize / 2;
  let lensY = y - lensSize / 2;

  lensX = Math.max(0, Math.min(lensX, rect.width - lensSize));
  lensY = Math.max(0, Math.min(lensY, rect.height - lensSize));

  lens.style.left = `${lensX}px`;
  lens.style.top = `${lensY}px`;

  lens.style.width = `${lensSize}px`;
  lens.style.height = `${lensSize}px`;

  lens.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
  lens.style.backgroundPosition = `-${x * zoom - lensSize / 2}px -${y * zoom - lensSize / 2}px`;
};


const handleMouseMove = (e) => {
  if (isTouchDevice.current) return;
  moveLens(e.clientX, e.clientY);
};
const handleTouchMove = (e) => {
  if (!isTouchDevice.current) return;
  const touch = e.touches[0];
  moveLens(touch.clientX, touch.clientY);
};

const handleTouchStart = (e) => {
  if (!isTouchDevice.current) return;
  setZoomActive(true);
  const touch = e.touches[0];
  moveLens(touch.clientX, touch.clientY);
};

const handleTouchEnd = () => {
  if (!isTouchDevice.current) return;
  // تقدر تخليه يقفل أو لا حسب UX
};


  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
      if (error) {
        setError(error.message);
      } else if (data) {
        setProject(data);
        setMainImage(data.main_image);
      } else {
        setError('Project not found');
      }
      setLoading(false);
    };
    const fetchAllProjects = async () => {
      const { data } = await supabase.from('projects').select('*').order('id', { ascending: true });
      setProjects(data || []);
    };
    fetchProject();
    fetchAllProjects();
  }, [id]);

  useEffect(() => {
    if (!project || loading) return;
    // Title animation with special effect
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: -100, rotationX: 90 },
        { opacity: 1, y: 0, rotationX: 0, duration: 1.5, ease: "power3.out", transformPerspective: 1000 }
      );
    }
    // Company name animation
    if (companyRef.current) {
      gsap.fromTo(companyRef.current,
        { opacity: 0, x: 50, rotationY: 45 },
        { opacity: 1, x: 0, rotationY: 0, duration: 1, delay: 0.3, ease: "power3.out", transformPerspective: 1000 }
      );
    }
    // Partner company animation
    if (partnerCompanyRef.current) {
      gsap.fromTo(partnerCompanyRef.current,
        { opacity: 0, x: -50, rotationY: -45 },
        { opacity: 1, x: 0, rotationY: 0, duration: 1, delay: 0.4, ease: "power3.out", transformPerspective: 1000 }
      );
    }
    // Location animation
    if (locationRef.current) {
      gsap.fromTo(locationRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.5, ease: "power2.out" }
      );
    }
    // Project type animation
    if (projectTypeRef.current) {
      gsap.fromTo(projectTypeRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.6, ease: "power2.out" }
      );
    }
    // Main image animation animation with enhanced effects
    if (mainRef.current && imageLoaded) {
      gsap.fromTo(mainRef.current,
        { opacity: 0, scale: 0.8, rotationY: 15, filter: "blur(10px)" },
        { opacity: 1, scale: 1, rotationY: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out", transformPerspective: 1000 }
      );
    }
    // Description animation
    if (descriptionRef.current) {
      gsap.fromTo(descriptionRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1, delay: 0.5, ease: "power2.out" }
      );
    }
    // Enhanced thumbnails animation
    if (thumbnailsRef.current) {
      gsap.fromTo(thumbnailsRef.current.children,
        { opacity: 0, y: 50, scale: 0.5 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.8, ease: "back.out(1.7)", delay: 0.8 }
      );
    }
    // Video section animation
    if (videoRef.current && project.video) {
      gsap.fromTo(videoRef.current,
        { opacity: 0, y: 80 },
        {
          scrollTrigger: { trigger: videoRef.current, start: "top 85%", toggleActions: "play none none reverse" },
          opacity: 1, y: 0, duration: 1, ease: "power3.out"
        }
      );
    }
    // Enhanced features animation with ScrollTrigger
if (featuresRef.current) {
  gsap.fromTo(
    featuresRef.current.children,
    { opacity: 0, x: -80, rotationY: 45 },
    {
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top 85%",
        once: true, // 👈 هنا المهم
      },
      opacity: 1,
      x: 0,
      rotationY: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
      transformPerspective: 1000,
    }
  );
}

    // Enhanced technologies animation
if (techRef.current) {
  gsap.fromTo(
    techRef.current.children,
    { opacity: 0, scale: 0, rotation: 180 },
    {
      scrollTrigger: {
        trigger: techRef.current,
        start: "top 85%",
        once: true, // 👈 هنا أيضًا
      },
      opacity: 1,
      scale: 1,
      rotation: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "back.out(1.7)",
    }
  );
}

    // Enhanced buttons animation
    if (buttonsRef.current) {
      gsap.fromTo(buttonsRef.current.children,
        { opacity: 0, y: 40, scale: 0.8 },
        {
          scrollTrigger: { trigger: buttonsRef.current, start: "top 90%", toggleActions: "play none none reverse" },
          opacity: 1, y: 0, scale: 1, stagger: 0.2, duration: 0.8, ease: "elastic.out(1, 0.5)"
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
  }, [project, imageLoaded, loading]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleThumbnailClick = (img) => {
    setMainImage(img);
    gsap.to(mainRef.current, { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.inOut" });
  };

  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };
  const isVimeoUrl = (url) => {
  return url && url.includes("vimeo.com");
};


  const getYouTubeEmbedUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };
const getVimeoEmbedUrl = (url) => {
  const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : url;
};

  useDocumentTitle(project ? `Ali's Portfolio | ${project.name}` : "Ali's Portfolio");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white flex-col gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/15"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <span className="text-gray-400 text-sm tracking-wide uppercase">Loading Project...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-purple-900 text-white relative overflow-hidden">
        <div className="particles-container absolute inset-0"></div>
        <div className="text-center z-10 px-6">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/15 flex items-center justify-center">
            <span className="text-red-400 text-2xl">!</span>
          </div>
          <h2 className="text-4xl font-bold mb-2 font-heading">Project Not Found</h2>
          <p className="text-gray-400 mb-8">The project you're looking for doesn't exist or was removed.</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 transition-transform duration-300 inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = projects.findIndex(p => p.id === project.id);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="particles-container absolute inset-0"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-400 rounded-full opacity-10 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-700 rounded-full opacity-10 blur-3xl -z-10"></div>

      <div className="relative z-10 px-4 py-28 max-w-6xl mx-auto">

        {/* Back link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h2 ref={titleRef} className="text-5xl md:text-7xl font-heading font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent leading-tight">
            {project.name}
          </h2>
          {project.company_name && (
            <p ref={companyRef} className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              For {project.company_name}
            </p>
          )}
        </div>

        {/* Main Image */}
        <div
          ref={mainRef}
          className="relative mb-6 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 touch-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => !isTouchDevice.current && setZoomActive(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <img
            ref={imgRef}
            src={mainImage || "../assets/images/placeholder.webp"}
            alt={project.name}
            onLoad={handleImageLoad}
            onError={(e) => (e.currentTarget.src = "../assets/images/placeholder.webp")}
            className="w-full h-auto object-cover"
          />

          <button
            onClick={() => setZoomActive(!zoomActive)}
            className={`
              absolute top-4 right-4 z-20
              p-3 rounded-full backdrop-blur-md border border-white/10
              transition-all duration-300
              ${
                zoomActive
                  ? "bg-purple-600 scale-110 shadow-lg shadow-purple-500/60"
                  : "bg-black/60 hover:bg-purple-600"
              }
            `}
          >
            <ZoomIn className="text-white text-lg" />
          </button>

          {zoomActive && (
            <div
              ref={lensRef}
              className="absolute z-30 pointer-events-none rounded-full border-2 border-white shadow-2xl"
              style={{
                backgroundImage: `url(${mainImage})`,
                backgroundRepeat: "no-repeat",
              }}
            />
          )}
        </div>

        {/* Thumbnails */}
        {project.sub_images && project.sub_images.length > 0 && (
          <div ref={thumbnailsRef} className="flex gap-4 overflow-x-auto mb-12 py-2 scrollbar-hide">
            {[project.main_image, ...project.sub_images].map((img, i) => (
              <div
                key={i}
                className="flex-shrink-0 relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => handleThumbnailClick(img)}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${i}`}
                  className={`w-20 h-20 md:w-28 md:h-28 object-cover rounded-xl shadow-lg border-2 transition-all duration-300 ${
                    mainImage === img ? "border-purple-500" : "border-transparent group-hover:border-purple-500/60"
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Info cards row */}
        {(project.location || project.project_type || project.partner_company) && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {project.partner_company && (
              <div ref={partnerCompanyRef} className="p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/20">
                <span className="block text-xs uppercase tracking-widest text-purple-300/80 mb-1">Collaboration</span>
                <p className="text-lg font-semibold text-white">{project.partner_company}</p>
              </div>
            )}
            {project.location && (
              <div ref={locationRef} className="p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/20">
                <span className="block text-xs uppercase tracking-widest text-purple-300/80 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </span>
                <p className="text-lg font-semibold text-white">{project.location}</p>
              </div>
            )}
            {project.project_type && (
              <div ref={projectTypeRef} className="p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-500/20">
                <span className="block text-xs uppercase tracking-widest text-purple-300/80 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Type
                </span>
                <p className="text-lg font-semibold text-white">{project.project_type}</p>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {project.description && (
          <section className="mb-16">
            <h3 className="text-sm uppercase tracking-widest text-purple-300/80 mb-3 font-heading font-bold">
              Description
            </h3>
            <p ref={descriptionRef} className="text-xl md:text-2xl leading-relaxed text-gray-200 max-w-4xl">
              {project.description}
            </p>
          </section>
        )}

        {/* Video Section (if project has video) */}
        {project.video && (
          <section ref={videoRef} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Project Video
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20">
              {isYouTubeUrl(project.video) ? (
              <div className="relative w-full h-0 pb-[56.25%]">
                <iframe
                  src={getYouTubeEmbedUrl(project.video)}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={`${project.name} video`}
                />
              </div>
            ) : isVimeoUrl(project.video) ? (
              <div className="relative w-full h-0 pb-[56.25%]">
                <iframe
                  src={getVimeoEmbedUrl(project.video)}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={`${project.name} video`}
                />
              </div>
            ) : (
              <video
                src={project.video}
                className="w-full aspect-video"
                controls
                title={`${project.name} video`}
              />
            )}

              <div className="p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm">
                <p className="text-center text-gray-300 text-sm">Watch the project demonstration video</p>
              </div>
            </div>
          </section>
        )}

        {/* Features */}
        {project.features?.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Key Features
            </h2>
            <ul ref={featuresRef} className="grid md:grid-cols-2 gap-4">
              {project.features.map((f, i) => (
                <li
                  key={i}
                  className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-purple-500/20 hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300 group"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-150 transition-transform duration-300 shrink-0"></span>
                    <span className="text-gray-200">{f}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Technologies */}
        {project.technologies?.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Technologies
            </h2>
            <div ref={techRef} className="flex flex-wrap gap-3">
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
        )}

        {/* Live Demo & behance Links */}
        {project.behance && (
          <div ref={buttonsRef} className="flex flex-wrap gap-6 mb-16">
            <a
              href={project.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 font-bold rounded-xl hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 font-heading font-bold flex items-center gap-2">
                View on Behance <ExternalLink className="w-4 h-4" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>
        )}

        {/* Project Navigation */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4 pt-8 border-t border-purple-500/20">
          {projects.length > 0 && (
            <button
              onClick={() => {
                const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
                const prevProject = projects[prevIndex];
                if (prevProject) navigate(`/project/${prevProject.id}`);
              }}
              className="px-5 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-purple-500/30 hover:bg-purple-900/50 hover:border-purple-500/50 transition-all duration-300 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
          )}

          <div className="w-full md:w-auto order-3 md:order-none text-center text-sm text-gray-400">
            Project {currentIndex + 1} of {projects.length}
          </div>

          {projects.length > 0 && (
            <button
              onClick={() => {
                const nextIndex = (currentIndex + 1) % projects.length;
                const nextProject = projects[nextIndex];
                if (nextProject) navigate(`/project/${nextProject.id}`);
              }}
              className="px-5 py-3 bg-white/5 backdrop-blur-sm rounded-xl border border-purple-500/30 hover:bg-purple-900/50 hover:border-purple-500/50 transition-all duration-300 flex items-center gap-2"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;