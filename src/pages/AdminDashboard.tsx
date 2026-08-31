// AdminDashboard.jsx - Enhanced with improved select styling, option enhancements (using react-select for better control and animations), toast messages, improved delete confirmation, better select/add styling, drag-and-drop for images, loading during submit, and overall beautiful styling
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '../lib/supabase'; // Adjust path if needed
gsap.registerPlugin(ScrollTrigger);
import { AnimatePresence, motion } from "framer-motion";
// For toast notifications (install react-toastify if not already: npm install react-toastify)
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDocumentTitle from "../hooks/useDocumentTitle";
import { ChevronDown, Search, X } from 'lucide-react';

// For enhanced select with animations (install react-select: npm install react-select)
import Select from 'react-select';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    company_name: '',
    partner_company: '',
    location: '',
    project_type: '',
    main_image: '',
    sub_images: [],
    description: '',
    video: '',
    features: [],
    technologies: [],
    behance: '',
  });
  const [mainImageType, setMainImageType] = useState('file');
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImageUrlInput, setMainImageUrlInput] = useState('');
  const [subImagesType, setSubImagesType] = useState('file');
  const [subImageFiles, setSubImageFiles] = useState([]);
  const [subImagesUrlInput, setSubImagesUrlInput] = useState('');
  const [videoType, setVideoType] = useState('file');
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // For drag-and-drop highlight
  const [isSubmitting, setIsSubmitting] = useState(false); // For submit loading
  const [projectSearch, setProjectSearch] = useState('');
  const [openSections, setOpenSections] = useState({
    basic: true,
    description: true,
    media: true,
    features: true,
    links: true,
  });
  const navigate = useNavigate();
  const formRef = useRef(null);
  const mainImageDropRef = useRef(null);
  const subImagesDropRef = useRef(null);
  const videoDropRef = useRef(null);
      useDocumentTitle("Ali's Portfolio | Dashboard ");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Setup drag-and-drop for main image
    const mainDropArea = mainImageDropRef.current;
    if (mainDropArea && mainImageType === 'file') {
      mainDropArea.addEventListener('dragover', handleDragOver);
      mainDropArea.addEventListener('dragleave', handleDragLeave);
      mainDropArea.addEventListener('drop', (e) => handleDrop(e, 'main'));
      return () => {
        mainDropArea.removeEventListener('dragover', handleDragOver);
        mainDropArea.removeEventListener('dragleave', handleDragLeave);
        mainDropArea.removeEventListener('drop', (e) => handleDrop(e, 'main'));
      };
    }
  }, [mainImageType]);

  useEffect(() => {
    // Setup drag-and-drop for sub images
    const subDropArea = subImagesDropRef.current;
    if (subDropArea && subImagesType === 'file') {
      subDropArea.addEventListener('dragover', handleDragOver);
      subDropArea.addEventListener('dragleave', handleDragLeave);
      subDropArea.addEventListener('drop', (e) => handleDrop(e, 'sub'));
      return () => {
        subDropArea.removeEventListener('dragover', handleDragOver);
        subDropArea.removeEventListener('dragleave', handleDragLeave);
        subDropArea.removeEventListener('drop', (e) => handleDrop(e, 'sub'));
      };
    }
  }, [subImagesType]);

  useEffect(() => {
    // Setup drag-and-drop for video
    const videoDropArea = videoDropRef.current;
    if (videoDropArea && videoType === 'file') {
      videoDropArea.addEventListener('dragover', handleDragOver);
      videoDropArea.addEventListener('dragleave', handleDragLeave);
      videoDropArea.addEventListener('drop', (e) => handleDrop(e, 'video'));
      return () => {
        videoDropArea.removeEventListener('dragover', handleDragOver);
        videoDropArea.removeEventListener('dragleave', handleDragLeave);
        videoDropArea.removeEventListener('drop', (e) => handleDrop(e, 'video'));
      };
    }
  }, [videoType]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (type === 'main' && files.length > 0) {
      setMainImageFile(files[0]);
    } else if (type === 'sub') {
      setSubImageFiles((prev) => [...prev, ...files]);
    } else if (type === 'video' && files.length > 0) {
      setVideoFile(files[0]);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setProjects(data);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'main') {
      setMainImageFile(file);
    } else if (type === 'video') {
      setVideoFile(file);
    }
  };

  const handleSubImagesChange = (e) => {
    setSubImageFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeSubImageFile = (index) => {
    setSubImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, featureInput.trim()] }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addTech = () => {
    if (techInput.trim()) {
      setFormData((prev) => ({ ...prev, technologies: [...prev.technologies, techInput.trim()] }));
      setTechInput('');
    }
  };

  const removeTech = (index) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const uploadFile = async (file, bucket = 'project-images') => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      });
    if (error) {
      console.error('Upload error:', error);
      throw error;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const uploadSubImages = async (files) => {
    const urls = [];
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      let mainImageUrl = formData.main_image;
      if (mainImageType === 'file' && mainImageFile) {
        mainImageUrl = await uploadFile(mainImageFile);
      } else if (mainImageType === 'url' && mainImageUrlInput) {
        mainImageUrl = mainImageUrlInput;
      }

      let subImagesUrls = isEditing ? [...formData.sub_images] : [];
      if (subImagesType === 'file' && subImageFiles.length > 0) {
        const newUrls = await uploadSubImages(subImageFiles);
        subImagesUrls = [...subImagesUrls, ...newUrls];
      } else if (subImagesType === 'url' && subImagesUrlInput) {
        subImagesUrls = subImagesUrlInput.split(',').map((item) => item.trim()).filter(Boolean);
      }

      let videoUrl = formData.video;
      if (videoType === 'file' && videoFile) {
        videoUrl = await uploadFile(videoFile, 'project-videos');
      } else if (videoType === 'url' && videoUrlInput) {
        videoUrl = videoUrlInput;
      }

      const projectData = {
        ...formData,
        main_image: mainImageUrl,
        sub_images: subImagesUrls,
        video: videoUrl,
      };

      let result;
      if (isEditing) {
        result = await supabase.from('projects').update(projectData).eq('id', formData.id);
      } else {
        const { id, ...insertData } = projectData;
        result = await supabase.from('projects').insert(insertData);
      }
      if (result.error) throw result.error;

      fetchProjects();
      resetForm();
      toast.success(isEditing ? 'Project updated successfully!' : 'Project added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (err) {
      setError(err.message || 'An error occurred during upload/submit.');
      toast.error('Error: ' + (err.message || 'An error occurred.'), {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      ...project,
      company_name: project.company_name || '',
      partner_company: project.partner_company || '',
      location: project.location || '',
      project_type: project.project_type || '',
      sub_images: project.sub_images || [],
      features: project.features || [],
      technologies: project.technologies || [],
    });
    setMainImageType(project.main_image ? 'url' : 'file');
    setMainImageUrlInput(project.main_image || '');
    setSubImagesType(project.sub_images.length > 0 ? 'url' : 'file');
    setSubImagesUrlInput(project.sub_images.join(', ') || '');
    setVideoType(project.video ? 'url' : 'file');
    setVideoUrlInput(project.video || '');
    setMainImageFile(null);
    setSubImageFiles([]);
    setVideoFile(null);
    setIsEditing(true);
    setOpenSections({ basic: true, description: true, media: true, features: true, links: true });
    gsap.to(formRef.current, { y: -20, duration: 0.5, ease: 'power3.out' });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const confirmDelete = (id) => {
    setDeleteProjectId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    if (deleteProjectId) {
      const { error } = await supabase.from('projects').delete().eq('id', deleteProjectId);
      if (error) {
        setError(error.message);
        toast.error('Error deleting project: ' + error.message, { theme: "dark" });
      } else {
        fetchProjects();
        toast.success('Project deleted successfully!', { theme: "dark" });
      }
      setDeleteProjectId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      company_name: '',
      partner_company: '',
      location: '',
      project_type: '',
      main_image: '',
      sub_images: [],
      description: '',
      video: '',
      features: [],
      technologies: [],
      behance: '',
    });
    setMainImageType('file');
    setMainImageFile(null);
    setMainImageUrlInput('');
    setSubImagesType('file');
    setSubImageFiles([]);
    setSubImagesUrlInput('');
    setVideoType('file');
    setVideoFile(null);
    setVideoUrlInput('');
    setFeatureInput('');
    setTechInput('');
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      });
    }
  }, []);

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      border: '1px solid rgba(168, 85, 247, 0.5)',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      color: 'white',
      '&:hover': {
        borderColor: 'rgba(168, 85, 247, 0.8)',
        boxShadow: '0 6px 8px rgba(168, 85, 247, 0.2)',
      },
      transition: 'all 0.3s ease',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 20px rgba(168, 85, 247, 0.2)',
      animation: 'fadeIn 0.3s ease-out',
      zIndex: 20,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'rgba(168, 85, 247, 0.6)' : 'transparent',
      color: 'white',
      padding: '10px 20px',
      '&:hover': {
        backgroundColor: 'rgba(168, 85, 247, 0.4)',
      },
      transition: 'background-color 0.2s ease',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.6)',
    }),
  };
  
  const typeOptions = [
    { value: 'file', label: 'Upload File / Drag & Drop' },
    { value: 'url', label: 'Enter URL' },
  ];

  const inputClass = "w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm";

  // Basic completeness check to guide the user (required fields only)
  const isBasicInfoComplete = formData.name.trim() && formData.company_name.trim();

  const filteredProjects = useMemo(() => {
    if (!projectSearch.trim()) return projects;
    const q = projectSearch.trim().toLowerCase();
    return projects.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.company_name?.toLowerCase().includes(q) ||
        p.project_type?.toLowerCase().includes(q)
    );
  }, [projects, projectSearch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white flex-col gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/15"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-400 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <span className="text-gray-400 text-sm tracking-wide uppercase">Loading...</span>
      </div>
    );
  }

  // Reusable collapsible section header
  const SectionHeader = ({ id, title, badge }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between text-left group"
    >
      <span className="flex items-center gap-2">
        <h4 className="text-sm font-semibold tracking-widest uppercase text-purple-300/80">
          {title}
        </h4>
        {badge}
      </span>
      <ChevronDown
        className={`w-4 h-4 text-purple-300/60 transition-transform duration-300 group-hover:text-purple-200 ${
          openSections[id] ? 'rotate-180' : ''
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden py-8 sm:py-12">
      <ToastContainer />
      <div className="absolute top-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-700 rounded-full opacity-20 blur-3xl animate-pulse-slow -z-10"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 z-10 relative">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <span className="text-xs tracking-[0.3em] text-purple-300/70 uppercase">Admin</span>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-heading leading-tight">
              Dashboard
            </h2>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform duration-300 shadow-lg"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* ===== FORM ===== */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white/[0.03] backdrop-blur-md rounded-3xl shadow-2xl border border-purple-500/20 mb-12 overflow-hidden"
        >
          <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-2 flex items-center justify-between flex-wrap gap-2 sticky top-0 bg-black/60 backdrop-blur-md z-10">
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
              {isEditing ? 'Edit Project' : 'Add New Project'}
            </h3>
            {isEditing && (
              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200">
                Editing #{formData.id}
              </span>
            )}
          </div>

          <div className="px-5 sm:px-8 pb-8 space-y-6">

            {/* Section: Basic Info */}
            <section className="pt-6 border-t border-white/5 first:border-t-0 first:pt-0">
              <SectionHeader
                id="basic"
                title="Basic Info"
                badge={
                  !isBasicInfoComplete && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 normal-case tracking-normal">
                      required fields missing
                    </span>
                  )
                }
              />
              <AnimatePresence initial={false}>
                {openSections.basic && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Project Name" className={inputClass} required />
                      </div>
                      <div>
                        <input name="company_name" value={formData.company_name} onChange={handleInputChange} placeholder="Client Company Name" className={inputClass} required />
                      </div>
                      <input name="partner_company" value={formData.partner_company} onChange={handleInputChange} placeholder="Partner Company Name (the company you worked with)" className={inputClass} />
                      <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Project Location" className={inputClass} />
                      <input name="project_type" value={formData.project_type} onChange={handleInputChange} placeholder="Project Type" className={`${inputClass} sm:col-span-2`} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section: Description */}
            <section className="pt-6 border-t border-white/5">
              <SectionHeader id="description" title="Description" />
              <AnimatePresence initial={false}>
                {openSections.description && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the project..." className={`${inputClass} mt-4`} rows={4} />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section: Media */}
            <section className="pt-6 border-t border-white/5">
              <SectionHeader id="media" title="Media" />
              <AnimatePresence initial={false}>
                {openSections.media && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-6 mt-4">
                      {/* Main Image */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-purple-500/10">
                        <label className="block text-sm font-medium mb-2 text-purple-200">
                          Main Image {isEditing && <span className="text-gray-500 font-normal">(leave blank to keep existing)</span>}
                        </label>
                        <Select
                          value={typeOptions.find(option => option.value === mainImageType)}
                          onChange={(selected) => setMainImageType(selected.value)}
                          options={typeOptions}
                          styles={customSelectStyles}
                          className="mb-3"
                        />
                        {mainImageType === 'file' ? (
                          <div ref={mainImageDropRef} className={`w-full px-4 py-6 bg-black/50 border-2 ${isDragging ? 'border-purple-500' : 'border-purple-500/30'} border-dashed rounded-xl text-white text-center cursor-pointer transition-all shadow-sm hover:border-purple-500/50`}>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'main')} className="hidden" id="mainImageFile" />
                            <label htmlFor="mainImageFile" className="cursor-pointer block text-sm text-gray-300">
                              {mainImageFile ? mainImageFile.name : 'Drag & drop image here or click to upload'}
                            </label>
                          </div>
                        ) : (
                          <input value={mainImageUrlInput} onChange={(e) => setMainImageUrlInput(e.target.value)} placeholder="Main Image URL" className={inputClass} />
                        )}
                        {/* Preview: newly selected file takes priority over the existing saved image */}
                        {mainImageFile ? (
                          <img src={URL.createObjectURL(mainImageFile)} alt="New main preview" className="mt-3 w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl shadow-md border border-purple-500/40" />
                        ) : (
                          isEditing && formData.main_image && (
                            <img src={formData.main_image} alt="Current main" className="mt-3 w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl shadow-md border border-white/10" />
                          )
                        )}
                      </div>

                      {/* Sub Images */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-purple-500/10">
                        <label className="block text-sm font-medium mb-2 text-purple-200">
                          Sub Images {isEditing && <span className="text-gray-500 font-normal">(new files are added; URLs mode overwrites the list)</span>}
                        </label>
                        <Select
                          value={typeOptions.find(option => option.value === subImagesType)}
                          onChange={(selected) => setSubImagesType(selected.value)}
                          options={typeOptions}
                          styles={customSelectStyles}
                          className="mb-3"
                        />
                        {subImagesType === 'file' ? (
                          <div ref={subImagesDropRef} className={`w-full px-4 py-6 bg-black/50 border-2 ${isDragging ? 'border-purple-500' : 'border-purple-500/30'} border-dashed rounded-xl text-white text-center cursor-pointer transition-all shadow-sm hover:border-purple-500/50`}>
                            <input type="file" accept="image/*" multiple onChange={handleSubImagesChange} className="hidden" id="subImagesFiles" />
                            <label htmlFor="subImagesFiles" className="cursor-pointer block text-sm text-gray-300">
                              {subImageFiles.length > 0 ? `${subImageFiles.length} file(s) selected` : 'Drag & drop images here or click to upload multiple'}
                            </label>
                          </div>
                        ) : (
                          <input value={subImagesUrlInput} onChange={(e) => setSubImagesUrlInput(e.target.value)} placeholder="Sub Images URLs (comma separated)" className={inputClass} />
                        )}

                        {/* Newly selected files preview, removable individually */}
                        {subImageFiles.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {subImageFiles.map((file, i) => (
                              <div key={i} className="relative group">
                                <img src={URL.createObjectURL(file)} alt={`New sub ${i}`} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md border border-purple-500/40" />
                                <button
                                  type="button"
                                  onClick={() => removeSubImageFile(i)}
                                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {isEditing && formData.sub_images.length > 0 && (
                          <div className="mt-3">
                            <span className="block text-xs text-gray-500 mb-2">Existing sub images:</span>
                            <div className="flex flex-wrap gap-2">
                              {formData.sub_images.map((img, i) => (
                                <img key={i} src={img} alt={`Sub ${i}`} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md border border-white/10" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Video */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-purple-500/10">
                        <label className="block text-sm font-medium mb-2 text-purple-200">
                          Video {isEditing && <span className="text-gray-500 font-normal">(leave blank to keep existing)</span>}
                        </label>
                        <Select
                          value={typeOptions.find(option => option.value === videoType)}
                          onChange={(selected) => setVideoType(selected.value)}
                          options={typeOptions}
                          styles={customSelectStyles}
                          className="mb-3"
                        />
                        {videoType === 'file' ? (
                          <div ref={videoDropRef} className={`w-full px-4 py-6 bg-black/50 border-2 ${isDragging ? 'border-purple-500' : 'border-purple-500/30'} border-dashed rounded-xl text-white text-center cursor-pointer transition-all shadow-sm hover:border-purple-500/50`}>
                            <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} className="hidden" id="videoFile" />
                            <label htmlFor="videoFile" className="cursor-pointer block text-sm text-gray-300">
                              {videoFile ? videoFile.name : 'Drag & drop video here or click to upload'}
                            </label>
                          </div>
                        ) : (
                          <input value={videoUrlInput} onChange={(e) => setVideoUrlInput(e.target.value)} placeholder="Video URL (e.g., YouTube, Vimeo embed)" className={inputClass} />
                        )}
                        {isEditing && formData.video && !videoFile && (
                          <video src={formData.video} className="mt-3 w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl shadow-md border border-white/10" controls />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section: Features & Technologies */}
            <section className="pt-6 border-t border-white/5">
              <SectionHeader
                id="features"
                title="Features & Technologies"
                badge={
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 normal-case tracking-normal">
                    {formData.features.length} / {formData.technologies.length}
                  </span>
                }
              />
              <AnimatePresence initial={false}>
                {openSections.features && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="grid sm:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-purple-200">Features</label>
                        <div className="flex gap-2 mb-3">
                          <input
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                            placeholder="Add feature, then press Enter"
                            className={`flex-1 ${inputClass}`}
                          />
                          <button type="button" onClick={addFeature} className="px-4 py-3 bg-purple-600 rounded-lg font-bold hover:scale-105 active:scale-95 transition-transform duration-300 shadow-lg shrink-0">
                            Add
                          </button>
                        </div>
                        <ul className="space-y-2 max-h-40 overflow-y-auto pr-1">
                          {formData.features.length === 0 && (
                            <li className="text-sm text-gray-500 italic px-1">No features added yet.</li>
                          )}
                          {formData.features.map((f, i) => (
                            <li key={i} className="flex justify-between items-center gap-3 p-2.5 bg-white/5 rounded-lg shadow-sm border border-purple-500/20">
                              <span className="text-sm truncate">{f}</span>
                              <button type="button" onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-300 text-sm shrink-0 transition-colors">
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-purple-200">Technologies</label>
                        <div className="flex gap-2 mb-3">
                          <input
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                            placeholder="Add technology, then press Enter"
                            className={`flex-1 ${inputClass}`}
                          />
                          <button type="button" onClick={addTech} className="px-4 py-3 bg-purple-600 rounded-lg font-bold hover:scale-105 active:scale-95 transition-transform duration-300 shadow-lg shrink-0">
                            Add
                          </button>
                        </div>
                        {/* Tag chips instead of a list, for quicker scanning */}
                        <div className="flex flex-wrap gap-2">
                          {formData.technologies.length === 0 && (
                            <span className="text-sm text-gray-500 italic px-1">No technologies added yet.</span>
                          )}
                          {formData.technologies.map((t, i) => (
                            <span key={i} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white/5 rounded-full border border-purple-500/20 text-sm">
                              {t}
                              <button type="button" onClick={() => removeTech(i)} className="text-red-400 hover:text-red-300 transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Section: Links */}
            <section className="pt-6 border-t border-white/5">
              <SectionHeader id="links" title="Links" />
              <AnimatePresence initial={false}>
                {openSections.links && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <input name="behance" value={formData.behance} onChange={handleInputChange} placeholder="Behance URL (optional)" className={`${inputClass} mt-4`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          {/* Sticky Actions bar */}
          <div className="px-5 sm:px-8 py-5 border-t border-white/10 bg-black/40 backdrop-blur-md sticky bottom-0 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-xs text-gray-500 order-2 sm:order-1">
              {isEditing ? 'Editing an existing project.' : 'Fill required fields marked above, then submit.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto order-1 sm:order-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-purple-600 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform duration-300 shadow-lg flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                )}
                {isSubmitting ? 'Processing...' : (isEditing ? 'Update Project' : 'Add Project')}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform duration-300 shadow-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>

        {/* ===== EXISTING PROJECTS ===== */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Existing Projects
            </h3>
            <span className="text-sm text-gray-500">{filteredProjects.length} of {projects.length}</span>
          </div>

          {/* Search / filter */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-8 py-2.5 bg-black/50 border border-purple-500/30 rounded-lg text-white text-sm placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
            />
            {projectSearch && (
              <button
                type="button"
                onClick={() => setProjectSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 text-gray-500 border border-dashed border-white/10 rounded-2xl">
            No projects yet — add your first one above.
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 text-gray-500 border border-dashed border-white/10 rounded-2xl">
            No projects match "{projectSearch}".
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="group p-4 bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="overflow-hidden rounded-xl mb-4">
                  <img
                    src={project.main_image || "../assets/images/placeholder.webp"}
                    onError={(e) => { e.currentTarget.src = "../assets/images/placeholder.webp"; }}
                    alt={project.name}
                    className="w-full h-36 sm:h-40 object-cover shadow-md transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h4 className="text-lg sm:text-xl font-bold mb-1 text-purple-100 truncate">{project.name}</h4>
                <p className="text-sm text-purple-300 mb-4 truncate">{project.company_name}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(project)} className="flex-1 px-3 sm:px-4 py-2 bg-purple-600 rounded-lg text-sm font-semibold hover:scale-105 active:scale-95 transition-transform duration-300 shadow-md">
                    Edit
                  </button>
                  <button onClick={() => confirmDelete(project.id)} className="flex-1 px-3 sm:px-4 py-2 bg-red-600/90 rounded-lg text-sm font-semibold hover:scale-105 active:scale-95 transition-transform duration-300 shadow-md">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-purple-500/30 max-w-sm w-full"
              initial={{ scale: 0.8, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mb-4">
                <span className="text-red-400 text-xl font-bold">!</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Confirm Deletion</h3>
              <p className="text-purple-200/80 mb-6 text-sm leading-relaxed">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded-lg font-bold hover:scale-105 active:scale-95 transition-transform duration-300 shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 rounded-lg font-bold hover:scale-105 active:scale-95 transition-transform duration-300 shadow-md"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;