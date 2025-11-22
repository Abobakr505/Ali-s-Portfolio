import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import GradientButton from "../components/GradientButton";
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiLinkedin, FiGithub , FiFacebook } from "react-icons/fi";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";
import useDocumentTitle from "../hooks/useDocumentTitle";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  useDocumentTitle("Ali's Portfolio - Contact ");
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await emailjs.sendForm(
        'service_1bdsc8t',       // Replace with your EmailJS service ID
        'template_zvn7klm',      // Replace with your EmailJS template ID
        formRef.current!,
        'k9Ti1ib4trNRh4VAQ'      // Replace with your EmailJS public key
      );

if (result.status === 200) {
  Swal.fire({
    title: 'Sent!',
    text: 'Your message has been sent successfully. We will contact you soon!',
    icon: 'success',
    confirmButtonText: 'OK',
    background: '#ffffff', // خلفية شفافة
    color: '#065f46', // لون النص (emerald-700)
    confirmButtonColor: '#10b981', // Tailwind emerald-500
    iconColor: '#10b981',
  });

  formRef.current!.reset(); // Reset form
} 

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while sending your message. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#ffffff', // خلفية شفافة
        color: '#b91c1c', // لون النص الأحمر
        confirmButtonColor: '#ef4444', // Tailwind red-500
        iconColor: '#ef4444',
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-black text-white flex flex-col items-center py-28 px-4">
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
            <span>+20 102 663 5585</span>
          </div>
          <div className="flex items-center space-x-4">
            <FiMapPin className="w-6 h-6 text-white" />
            <span>Cairo, Egypt</span>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">            
            <a href="https://www.facebook.com/profile.php?id=100003329446201&mibextid=ZbWKwL" className="hover:text-blue-500 transition"><FiFacebook className="w-6 h-6" /></a>
            <a href="https://www.instagram.com/alihasan5335?igshid=YTQwZjQ0NmI0OA%3D%3D" className="hover:text-purple-400 transition"><FiInstagram className="w-6 h-6" /></a>
            <a href="https://www.linkedin.com/in/ali-hassan-607932198/" className="hover:text-blue-400 transition"><FiLinkedin className="w-6 h-6" /></a>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="bg-white/5 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="bg-white/5 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={6}
            className="bg-white/5 backdrop-blur-md border border-white/20 p-4 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
            required
          />
        <button
          type="submit"
          className="text-black  bg-white hover:bg-black  hover:text-white px-6 py-3 rounded-xl transition-all duration-300 border-white border-2"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
