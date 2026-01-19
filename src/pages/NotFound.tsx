import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Ghost } from "lucide-react";
import FuzzyText from '../components/FuzzyText'
import useDocumentTitle from "../hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Ali's Portfolio | NotFound 404 ");
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

        <h2 className="text-2xl text-white mb-3 font-heading ">
         <span className="font-extrabold">Sorry</span> , Page Not Found 
        </h2>
        <p className="text-lg text-gray-300 mb-6">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        <Link
          to="/"
          className="inline-block text-black  font-heading font-bold  bg-white hover:bg-black  hover:text-white border-white border-2  px-6 py-3 rounded-xl  hover:scale-115 transition duration-300"
        >
         Back To Home 
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
