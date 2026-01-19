// ProjectDetails.jsx - Updated to handle both embedded (e.g., YouTube) and direct video URLs
import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { supabase } from '../lib/supabase'; // Adjust path if needed
import { MapPin , Sparkles, ZoomIn  } from 'lucide-react';
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
  const zoom = 2;

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white flex-col gap-4">
      <div className="w-12 h-12 border-4 border-white-500 border-t-transparent rounded-full animate-spin"></div>
      Loading Project...
    </div>
  );

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-purple-900 text-white relative overflow-hidden">
        <div className="particles-container absolute inset-0"></div>
        <div className="text-center z-10">
          <h2 className="text-4xl font-bold mb-4">Project Not Found</h2>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:scale-105 transition-transform duration-300">
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
        <h2 ref={titleRef} className="text-6xl md:text-7xl font-heading font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
          {project.name}
        </h2>
        {/* Client Company Name */}
        {project.company_name && (
          <p ref={companyRef} className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            For {project.company_name}
          </p>
        )}

        {/* Main Image */}
<div
  ref={mainRef}
  className="relative mb-6 rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20 touch-none"
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
    p-3 rounded-full
    transition-all duration-300
    ${
      zoomActive
        ? "bg-purple-600 scale-110 shadow-lg shadow-purple-500/60"
        : "bg-black/70 hover:bg-purple-600"
    }
  `}
>
  <ZoomIn  className="text-white text-lg"/>
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
          <div ref={thumbnailsRef} className="flex gap-4 overflow-x-auto mb-12 py-4 scrollbar-hide">
            {[project.main_image, ...project.sub_images].map((img, i) => (
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
                <div className={`absolute inset-0 rounded-xl bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${mainImage === img ? 'opacity-100 border-2 border-purple-500' : ''}`}></div>
              </div>
            ))}
          </div>
        )}
        {/* Video Section (if project has video) */}
        {project.video && (
          <section ref={videoRef} className="mb-16">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
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
                <p className="text-center text-gray-300">Watch the project demonstration video</p>
              </div>
            </div>
          </section>
        )}

        {/* Description */}
        <p ref={descriptionRef} className="text-2xl mb-4 leading-relaxed text-gray-200 max-w-4xl">
         <span className=" bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent font-heading font-bold"> Description: <br/> </span> {project.description}
        </p>
                {/* Partner Company Name */}
        {project.partner_company && (
          <p ref={partnerCompanyRef} className="text-2xl md:text-3xl font-semibold mb-4 text-white">
            <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent font-heading">In collaboration with</span> {project.partner_company}
          </p>
        )}
        {/* Project Location */}
        {project.location && (
          <p ref={locationRef} className="text-xl md:text-2xl mb-2 text-gray-200 flex items-center gap-2">
            <MapPin className="text-purple-400"/> Location: {project.location}
          </p>
        )}
        {/* Project Type */}
        {project.project_type && (
          <p ref={projectTypeRef} className="text-xl md:text-2xl mb-8 text-gray-200 flex items-center gap-2">
            <Sparkles  className="text-purple-400"/> Type: {project.project_type}
          </p>
        )}
        
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
        {/* Live Demo & behance Links */}
        <div ref={buttonsRef} className="flex flex-wrap gap-6 mb-16">
          {project.behance && (
            <a
              href={project.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 font-bold rounded-xl hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10  font-heading font-bold flex items-center gap-2">
                View in Behance 🌄
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