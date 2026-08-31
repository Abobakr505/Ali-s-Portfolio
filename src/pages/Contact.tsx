import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiInstagram,
  FiLinkedin,
  FiFacebook,
} from "react-icons/fi";
import Swal from "sweetalert2";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { Send } from "lucide-react";
import { motion } from "motion/react";
import { FaWhatsapp } from "react-icons/fa";
gsap.registerPlugin(ScrollTrigger);

// ضع القيم دي في ملف .env في جذر المشروع (Vite):
// VITE_TELEGRAM_BOT_TOKEN=xxxxx
// VITE_TELEGRAM_CHAT_ID=xxxxx
const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

const SUBJECT_OPTIONS = [
  "Project Inquiry",
  "Job Opportunity",
  "Freelance Work",
  "Collaboration",
  "Technical Question",
  "Just Saying Hi",
  "Other",
];

// Shared SweetAlert2 styling to match the site's monochrome theme
const swalBaseConfig = {
  background: "#0a0a0a",
  color: "#ffffff",
  confirmButtonColor: "#ffffff",
  customClass: {
    popup: "swal-portfolio-popup",
    title: "swal-portfolio-title",
    htmlContainer: "swal-portfolio-text",
    confirmButton: "swal-portfolio-btn",
  },
  buttonsStyling: false,
};

const Contact = () => {
  useDocumentTitle("Ali's Portfolio | Contact ");
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  // Inject SweetAlert2 monochrome theme overrides once on mount
  useEffect(() => {
    const styleId = "swal-portfolio-theme";
    if (document.getElementById(styleId)) return;

    const styleEl = document.createElement("style");
    styleEl.id = styleId;
    styleEl.textContent = `
      .swal-portfolio-popup {
        border: 1px solid rgba(255,255,255,0.12) !important;
        border-radius: 1.5rem !important;
        box-shadow: 0 20px 60px rgba(0,0,0,0.6) !important;
      }
      .swal-portfolio-title {
        font-weight: 800 !important;
        letter-spacing: -0.01em;
      }
      .swal-portfolio-text {
        color: rgba(255,255,255,0.7) !important;
        font-size: 0.95rem !important;
      }
      .swal-portfolio-btn {
        background: #ffffff !important;
        color: #000000 !important;
        font-weight: 700 !important;
        padding: 0.7rem 2rem !important;
        border-radius: 0.75rem !important;
        border: 2px solid #ffffff !important;
        transition: all 0.3s ease !important;
      }
      .swal-portfolio-btn:hover {
        background: #000000 !important;
        color: #ffffff !important;
      }
      .swal2-icon.swal2-warning,
      .swal2-icon.swal2-error,
      .swal2-icon.swal2-success {
        border-color: rgba(255,255,255,0.3) !important;
      }
      .swal2-icon.swal2-success [class^='swal2-success-line'] {
        background-color: #ffffff !important;
      }
      .swal2-icon.swal2-success .swal2-success-ring {
        border-color: rgba(255,255,255,0.3) !important;
      }
      .swal2-icon.swal2-error [class^='swal2-x-mark-line'] {
        background-color: #ffffff !important;
      }
      .swal2-icon.swal2-warning {
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(styleEl);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) {
      console.error("Form reference is NULL");
      return;
    }

    const formData = new FormData(formRef.current);
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const subject = (formData.get("subject") as string)?.trim() || "No subject";
    const message = (formData.get("message") as string)?.trim();

    if (!name || !email || !message) {
      Swal.fire({
        ...swalBaseConfig,
        title: "Missing Fields",
        html: `<p>Please fill in all required fields before sending your message.</p>`,
        icon: "warning",
        iconColor: "#ffffff",
        confirmButtonText: "Got it",
      });
      return;
    }

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error("Telegram BOT_TOKEN or CHAT_ID is missing from env variables");
      Swal.fire({
        ...swalBaseConfig,
        title: "Something Went Wrong",
        html: `<p>The server isn't configured correctly. Please try again later.</p>`,
        icon: "error",
        iconColor: "#ffffff",
        confirmButtonText: "Okay",
      });
      return;
    }

    setIsSubmitting(true);

    // رسالة احترافية منسقة (Markdown) تروح للتليجرام
    const telegramMessage = `
📩 *New Contact Form Submission*

👤 *Name:* ${name}
📧 *Email:* ${email}
📞 *Phone:* ${formData.get("phone") as string || "Not provided"}
📝 *Subject:* ${subject}

💬 *Message:*
${message}

—
🕒 Sent: ${new Date().toLocaleString("en-GB", { timeZone: "Africa/Cairo" })}
🌐 Source: Portfolio Website
    `.trim();

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: telegramMessage,
            parse_mode: "Markdown",
          }),
        }
      );

      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.description || "Telegram API error");
      }

      await Swal.fire({
        ...swalBaseConfig,
        title: "Message Sent",
        html: `<p>Thanks for reaching out, <strong>${name.split(" ")[0]}</strong>. I'll get back to you soon.</p>`,
        icon: "success",
        iconColor: "#ffffff",
        confirmButtonText: "Great",
      });

      formRef.current.reset();
    } catch (error: any) {
      console.error("Telegram ERROR:", error);

      Swal.fire({
        ...swalBaseConfig,
        title: "Message Failed",
        html: `<p>${error?.message || "We couldn't send your message. Please try again."}</p>`,
        icon: "error",
        iconColor: "#ffffff",
        confirmButtonText: "Try Again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full bg-white/[0.04] backdrop-blur-md border p-4 rounded-2xl text-white placeholder-gray-500 outline-none transition-all duration-300 ${
      focusedField === field
        ? "border-white/60 bg-white/[0.07] shadow-[0_0_0_4px_rgba(255,255,255,0.06)]"
        : "border-white/10 hover:border-white/25"
    }`;

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex flex-col items-center py-28 px-4 overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative text-center mb-16">
        <span className="inline-block text-xs tracking-[0.3em] text-gray-500 uppercase mb-3">
          Get In Touch
        </span>
        <h1 className="text-6xl md:text-7xl font-bold font-heading tracking-tight">
          Contact
        </h1>
        <div className="mx-auto w-24 h-[3px] bg-gradient-to-r from-transparent via-white to-transparent rounded-full mt-4" />
        <p className="text-gray-400 mt-5 max-w-2xl mx-auto text-lg">
          Have a project in mind or just want to say hi? Let's get in touch!
        </p>
      </div>

      <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10">
        {/* Contact Info */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-4 bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-md">
          <h2 className="text-xl font-heading font-bold mb-2">Let's talk</h2>
          <p className="text-gray-400 text-sm mb-4">
            Feel free to reach out through any of these channels.
          </p>

          <a
            href="mailto:alihasan5335@gmail.com"
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 shrink-0">
              <FiMail className="w-5 h-5 text-white" />
            </span>
            <span className="text-gray-300 group-hover:text-white transition-colors break-all">
              alihasan5335@gmail.com
            </span>
          </a>

          <a
            href="tel:+201026635585"
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-300 shrink-0">
              <FiPhone className="w-5 h-5 text-white" />
            </span>
            <span className="text-gray-300 group-hover:text-white transition-colors">
              +20 102 663 5585
            </span>
          </a>

          <div className="flex items-center gap-4 p-3 rounded-xl">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 shrink-0">
              <FiMapPin className="w-5 h-5 text-white" />
            </span>
            <span className="text-gray-300">El-Monib , Cairo </span>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-3 mt-6 pt-6 border-t border-white/10">
            <a
              href="https://www.facebook.com/profile.php?id=100003329446201&mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
            >
              <FiFacebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/alihasan5335"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
            >
              <FiInstagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/ali-hassan-607932198/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
            >
              <FiLinkedin className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/+201026635585"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="md:col-span-3 flex flex-col space-y-5 bg-white/[0.03] border border-white/10 rounded-3xl p-8 backdrop-blur-md"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className=" block text-xs text-gray-500 mb-2 tracking-wide uppercase">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                className={`lang-fonts ${inputClass("name")}`}
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-2 tracking-wide uppercase">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className={inputClass("email")}
                required
              />
            </div>
          </div>
<label className=" block text-xs text-gray-500 mb-2 tracking-wide uppercase">
                Phone Number 
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone Number"
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                className={`lang-fonts ${inputClass("phone")}`}
                required
              />

          <div>
            <label className="block text-xs text-gray-500 mb-2 tracking-wide uppercase">
              Subject
            </label>
            <div className="relative">
              <select
                name="subject"
                defaultValue=""
                onFocus={() => setFocusedField("subject")}
                onBlur={() => setFocusedField(null)}
                className={`${inputClass("subject")} appearance-none cursor-pointer pr-10`}
                required
              >
                <option value="" disabled className="bg-black text-gray-500">
                  Select a subject...
                </option>
                {SUBJECT_OPTIONS.map((option) => (
                  <option key={option} value={option} className="bg-black text-white">
                    {option}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2 tracking-wide uppercase">
              Message
            </label>
            <textarea
              name="message"
              placeholder="Tell me about your project or just say hello..."
              rows={5}
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
              className={`lang-fonts ${inputClass("message")} resize-none`}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex font-heading font-bold justify-center items-center gap-2 text-black bg-white hover:bg-black hover:text-white px-6 py-4 rounded-2xl transition-all duration-300 border-2 border-white disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <>
                <span>Sending...</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full "
                />
              </>
            ) : (
              <>
                <span>Send Message</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;