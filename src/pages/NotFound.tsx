import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import FuzzyText from '../components/FuzzyText'
import useDocumentTitle from "../hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Ali's Portfolio | Page Not Found");
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden">
      {/* Decorative background glow (white only) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative p-10 max-w-lg w-full text-center animate-fade-in backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
        <div className="flex justify-center items-center mb-4">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.3}
            enableHover={0.5}
            fontSize={100}
          >
            404
          </FuzzyText>
        </div>

        <h2 className="text-2xl md:text-3xl text-white mb-3 font-heading">
          <span className="font-extrabold">Sorry</span> , Page Not Found
        </h2>

        <p className="text-base md:text-lg text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-2 text-black font-heading font-bold bg-white hover:bg-black hover:text-white border-2 border-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Home size={18} className="transition-transform group-hover:-translate-y-0.5" />
            Back To Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center justify-center gap-2 text-white font-heading font-bold bg-transparent hover:bg-white hover:text-black border-2 border-white/30 hover:border-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-500 font-mono">
          Requested path: {location.pathname}
        </p>
      </div>
    </div>
  );
};

export default NotFound;