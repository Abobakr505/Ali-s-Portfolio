import React from 'react'
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Footer from './components/Footer'
import Contact from './pages/Contact';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App