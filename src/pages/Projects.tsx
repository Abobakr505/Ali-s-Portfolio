import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import projects from "../components/projectsData";
import CTA from "../components/CTA";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

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
            {projects.map(({ id, name, image }) => (
<Link
      key={id}
      to={`/project/${id}`}
  className="project-item group relative overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
>
                <div className="overflow-hidden rounded-3xl relative">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl flex items-end justify-start p-6">
                    <h3 className="text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                      {name}
                    </h3>
                  </div>

                  <div className="absolute inset-0 rounded-3xl pointer-events-none bg-white/5 shadow-[0_0_50px_10px_white] opacity-0 group-hover:opacity-40 transition-all duration-500"></div>
                </div>
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
