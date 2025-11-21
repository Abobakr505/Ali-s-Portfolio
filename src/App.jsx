import React from 'react'
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Footer from './components/Footer'
import Contact from './pages/Contact';
import ProjectDetails from './pages/ProjectDetails';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* صفحة جميع المشاريع */}
        <Route path="/projects" element={<Projects />} />

        {/* صفحة تفاصيل المشروع */}
 <Route path="/project/:id" element={<ProjectDetails />} />
         {/* صفحة تواصل معنا */}
        <Route path="/contact" element={<Contact />} />

        {/* Not Found لازم تكون آخر Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App
