import React from 'react'
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Footer from './components/Footer'
import Contact from './pages/Contact';
import ProjectDetails from './pages/ProjectDetails';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { useLocation } from 'react-router-dom';
import RequireAdmin from './components/RequireAdmin';

const App = () => {
    const location = useLocation();

  // الصفحات التي نريد إخفاء الـ Navbar و Footer و زر واتساب فيها
  const hideLayoutPaths = ['/login', '/admin'];

  // تحقق مما إذا كان المسار الحالي ضمن الصفحات المخفية
  const hideLayout = hideLayoutPaths.includes(location.pathname);
  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />        {/* صفحة جميع المشاريع */}
        <Route path="/projects" element={<Projects />} />

        {/* صفحة تفاصيل المشروع */}
 <Route path="/project/:id" element={<ProjectDetails />} />
         {/* صفحة تواصل معنا */}
        <Route path="/contact" element={<Contact />} />

        {/* Not Found لازم تكون آخر Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  )
}

export default App
