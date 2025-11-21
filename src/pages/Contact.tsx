import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import GradientButton from "../components/GradientButton";
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiLinkedin, FiGithub } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate form on scroll
    gsap.from(formRef.current, {
      scrollTrigger: {
        trigger: formRef.current,
        start: "top 80%",
      },
      opacity: 0,
      y: 80,
      duration: 1.2,
      ease: "power3.out",
    });
  }, []);

  return (
    <section className="w-full min-h-screen bg-black text-white flex flex-col items-center py-20 px-4">
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">Contact</h1>
        <div className="mx-auto w-32 h-1 bg-white rounded-full mt-4 shadow-lg"></div>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Have a project in mind or just want to say hi? Let's get in touch!
        </p>
      </div>

      <div
        ref={formRef}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="flex items-center space-x-4">
            <FiMail className="w-6 h-6 text-white" />
            <span>hello@yourdomain.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <FiPhone className="w-6 h-6 text-white" />
            <span>+20 123 456 7890</span>
          </div>
          <div className="flex items-center space-x-4">
            <FiMapPin className="w-6 h-6 text-white" />
            <span>Cairo, Egypt</span>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="hover:text-cyan-400 transition"><FiInstagram className="w-6 h-6" /></a>
            <a href="#" className="hover:text-blue-400 transition"><FiLinkedin className="w-6 h-6" /></a>
            <a href="#" className="hover:text-gray-400 transition"><FiGithub className="w-6 h-6" /></a>
          </div>
        </div>

        {/* Contact Form */}
        <form className="flex flex-col space-y-6">
          <input
            type="text"
            placeholder="Your Name"
            className="bg-white/5 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="bg-white/5 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <textarea
            placeholder="Your Message"
            rows={6}
            className="bg-white/5 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
          />
          <GradientButton text="Send Message" link="#" className=" self-start" />
        </form>
      </div>
    </section>
  );
};

export default Contact;
