import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Ghost } from "lucide-react";
import FuzzyText from '../components/FuzzyText'
import useDocumentTitle from "../hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Ali's Portfolio - NotFound 404 ");
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className=" p-10 max-w-md text-center animate-fade-in">
<div className="flex justify-center items-center  mb-6">      
  <FuzzyText 
    baseIntensity={0.2} 
    hoverIntensity={0.3} 
    enableHover={0.5}
    fontSize={100}
  >
    404
  </FuzzyText>
</div>

        <p className="text-lg text-white mb-6">
         Sorry , Page Not Found 404
        </p>
        <a
          href="/"
          className="inline-block bg-white text-black px-6 py-3 rounded-xl  hover:scale-115 transition duration-300"
        >
         Back To Home 
        </a>
      </div>
    </div>
  );
};

export default NotFound;
