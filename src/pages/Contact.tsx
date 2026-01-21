import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiInstagram,
  FiLinkedin,
  FiGithub,
  FiFacebook,
} from "react-icons/fi";
import emailjs from "emailjs-com";
import Swal from "sweetalert2";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { Send } from "lucide-react";
import { motion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa";
gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  useDocumentTitle("Ali's Portfolio | Contact ");
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!formRef.current) return;

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

    if (!formRef.current) {
      console.error("Form reference is NULL");
      return;
    }

    emailjs
      .sendForm(
        "service_kn1l5bf", // service ID
        "template_md13q7w", // template ID
        formRef.current, // THE FORM
        "ElJguIdYayF9qn97a" // public key
      )
      .then(
        () => {
          Swal.fire({
            title: "Sent!",
            text: "Your message has been sent successfully. We will contact you soon!",
            icon: "success",
            background: "#ffffff",
            color: "#065f46",
            confirmButtonColor: "#10b981",
            iconColor: "#10b981",
          });

          formRef.current.reset();
          setIsSubmitting(false);
        },
        () => {
          Swal.fire({
            title: "Error!",
            text: "An error occurred while sending your message. Please try again.",
            icon: "error",
            background: "#ffffff",
            color: "#b91c1c",
            confirmButtonColor: "#ef4444",
            iconColor: "#ef4444",
          });

          setIsSubmitting(false);
        }
      );
  };

  return (
    <section className="w-full min-h-screen bg-black text-white flex flex-col items-center py-28 px-4">
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-7xl font-bold font-heading tracking-tight">Contact</h1>
        <div className="mx-auto w-32 h-1  bg-white rounded-full mt-3 shadow-lg"></div>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Have a project in mind or just want to say hi? Let's get in touch!
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="flex items-center space-x-4">
            <FiMail className="w-6 h-6 text-white" />
            <span>alihasan5335@gmail.com</span>
          </div>
          <div className="flex items-center space-x-4">
            <FiPhone className="w-6 h-6 text-white" />
            <span>+20 102 663 5585</span>
          </div>
          <div className="flex items-center space-x-4">
            <FiMapPin className="w-6 h-6 text-white" />
            <span>Mokattam , Cairo - st 9</span>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a
              href="https://www.facebook.com/profile.php?id=100003329446201&mibextid=ZbWKwL"
              target="_blank"
              className="hover:text-blue-500 hover:scale-115 transition-all duration-300"
            >
              <FiFacebook className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/alihasan5335"
              target="_blank"
              className="hover:text-purple-400 hover:scale-115 transition-all duration-300"
            >
              <FiInstagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/ali-hassan-607932198/"
              target="_blank"
              className="hover:text-blue-400 hover:scale-115 transition-all duration-300"
            >
              <FiLinkedin className="w-6 h-6" />
            </a>
            <a
              href="https://wa.me/+201026635585"
              target="_blank"
              className="hover:text-green-400 hover:scale-115 transition-all duration-300"
            >
              <FaWhatsapp className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col space-y-6">
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
          ></textarea>

<button
  type="submit"
  className="group flex font-heading font-bold  justify-center items-center gap-2 text-black bg-white hover:bg-black hover:text-white px-6 py-3 rounded-xl transition-all duration-300 border-white border-2"
>
  {isSubmitting ? (
    <>
      <span>Sending...</span>
<motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full " />
    </>
  ) : (
    <>
      <span>Send Message</span>
      <Send className="w-6 h-6" />
    </>
  )}
</button>

        </form>
      </div>
    </section>
  );
};

export default Contact;
