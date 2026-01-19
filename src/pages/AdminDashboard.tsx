// AdminDashboard.jsx - Enhanced with improved select styling, option enhancements (using react-select for better control and animations), toast messages, improved delete confirmation, better select/add styling, drag-and-drop for images, loading during submit, and overall beautiful styling
import React, { useState, useEffect, useRef } from 'react';
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
    gsap.to(formRef.current, { y: -20, duration: 0.5, ease: 'power3.out' });
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white flex-col gap-4">
      <div className="w-12 h-12 border-4 border-white-500 border-t-transparent rounded-full animate-spin"></div>
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden py-8 sm:py-12">
      <ToastContainer />
      <div className="absolute top-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse-slow -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-700 rounded-full opacity-20 blur-3xl animate-pulse-slow -z-10"></div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 z-10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4 sm:gap-8">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-heading">Admin Dashboard</h2>
          <button onClick={handleLogout} className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg font-bold hover:scale-105 transition-transform duration-300 shadow-lg">Logout</button>
        </div>
        {error && <p className="text-red-400 mb-4 text-center sm:text-left">{error}</p>}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-2xl border border-purple-500/20 mb-8 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">{isEditing ? 'Edit Project' : 'Add New Project'}</h3>
          
          <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Project Name" className="w-full mb-4 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm" required />
          
          <input name="company_name" value={formData.company_name} onChange={handleInputChange} placeholder="Client Company Name" className="w-full mb-4 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm" required />
          
          <input name="partner_company" value={formData.partner_company} onChange={handleInputChange} placeholder="Partner Company Name (the company you worked with)" className="w-full mb-4 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm" />
          
          <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Project Location" className="w-full mb-4 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm" />
          
          <input name="project_type" value={formData.project_type} onChange={handleInputChange} placeholder="Project Type" className="w-full mb-4 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm" />
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-purple-200">Main Image {isEditing && '(Leave blank to keep existing)'}</label>
            <Select
              value={typeOptions.find(option => option.value === mainImageType)}
              onChange={(selected) => setMainImageType(selected.value)}
              options={typeOptions}
              styles={customSelectStyles}
              className="mb-2"
            />
            {mainImageType === 'file' ? (
              <div ref={mainImageDropRef} className={`w-full px-4 py-6 bg-black/50 border-2 ${isDragging ? 'border-purple-500' : 'border-purple-500/30'} border-dashed rounded-lg text-white text-center cursor-pointer transition-all shadow-sm hover:border-purple-500/50`}>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'main')} className="hidden" id="mainImageFile" />
                <label htmlFor="mainImageFile" className="cursor-pointer">
                  {mainImageFile ? mainImageFile.name : 'Drag & drop image here or click to upload'}
                </label>
              </div>
            ) : (
              <input value={mainImageUrlInput} onChange={(e) => setMainImageUrlInput(e.target.value)} placeholder="Main Image URL" className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm" />
            )}
            {isEditing && formData.main_image && <img src={formData.main_image} alt="Current main" className="mt-2 w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg shadow-md" />}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-purple-200">Sub Images {isEditing && '(Add new ones; existing will be kept and new added if using file upload, or edit URLs to modify)'}</label>
            <Select
              value={typeOptions.find(option => option.value === subImagesType)}
              onChange={(selected) => setSubImagesType(selected.value)}
              options={typeOptions}
              styles={customSelectStyles}
              className="mb-2"
            />
            {subImagesType === 'file' ? (
              <div ref={subImagesDropRef} className={`w-full px-4 py-6 bg-black/50 border-2 ${isDragging ? 'border-purple-500' : 'border-purple-500/30'} border-dashed rounded-lg text-white text-center cursor-pointer transition-all shadow-sm hover:border-purple-500/50`}>
                <input type="file" accept="image/*" multiple onChange={handleSubImagesChange} className="hidden" id="subImagesFiles" />
                <label htmlFor="subImagesFiles" className="cursor-pointer">
                  {subImageFiles.length > 0 ? `${subImageFiles.length} files selected` : 'Drag & drop images here or click to upload multiple'}
                </label>
              </div>
            ) : (
              <input value={subImagesUrlInput} onChange={(e) => setSubImagesUrlInput(e.target.value)} placeholder="Sub Images URLs (comma separated)" className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm" />
            )}
            {isEditing && formData.sub_images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 overflow-x-auto max-w-full">
                {formData.sub_images.map((img, i) => <img key={i} src={img} alt={`Sub ${i}`} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md" />)}
              </div>
            )}
          </div>
          
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full mb-4 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm" rows={4} />
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-purple-200">Video {isEditing && '(Leave blank to keep existing)'}</label>
            <Select
              value={typeOptions.find(option => option.value === videoType)}
              onChange={(selected) => setVideoType(selected.value)}
              options={typeOptions}
              styles={customSelectStyles}
              className="mb-2"
            />
            {videoType === 'file' ? (
              <div ref={videoDropRef} className={`w-full px-4 py-6 bg-black/50 border-2 ${isDragging ? 'border-purple-500' : 'border-purple-500/30'} border-dashed rounded-lg text-white text-center cursor-pointer transition-all shadow-sm hover:border-purple-500/50`}>
                <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} className="hidden" id="videoFile" />
                <label htmlFor="videoFile" className="cursor-pointer">
                  {videoFile ? videoFile.name : 'Drag & drop video here or click to upload'}
                </label>
              </div>
            ) : (
              <input value={videoUrlInput} onChange={(e) => setVideoUrlInput(e.target.value)} placeholder="Video URL (e.g., YouTube , Viemo embed)" className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm" />
            )}
            {isEditing && formData.video && <video src={formData.video} className="mt-2 w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg shadow-md" controls />}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-purple-200">Features</label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Add feature" className="flex-1 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm" />
              <button type="button" onClick={addFeature} className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:scale-105 transition-transform duration-300 shadow-lg">Add</button>
            </div>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {formData.features.map((f, i) => (
                <li key={i} className="flex justify-between items-center p-2 bg-white/5 rounded-lg shadow-sm border border-purple-500/20">
                  {f}
                  <button type="button" onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-700 transition-colors">Remove</button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-purple-200">Technologies</label>
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <input value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Add technology" className="flex-1 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm" />
              <button type="button" onClick={addTech} className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:scale-105 transition-transform duration-300 shadow-lg">Add</button>
            </div>
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {formData.technologies.map((t, i) => (
                <li key={i} className="flex justify-between items-center p-2 bg-white/5 rounded-lg shadow-sm border border-purple-500/20">
                  {t}
                  <button type="button" onClick={() => removeTech(i)} className="text-red-500 hover:text-red-700 transition-colors">Remove</button>
                </li>
              ))}
            </ul>
          </div>
          
          <input name="behance" value={formData.behance} onChange={handleInputChange} placeholder="Behance URL (optional)" className="w-full mb-4 sm:mb-6 px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all shadow-sm" />
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold hover:scale-105 transition-transform duration-300 shadow-lg flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : null}
              {isSubmitting ? 'Processing...' : (isEditing ? 'Update' : 'Add')}
            </button>
            {isEditing && <button type="button" onClick={resetForm} className="px-6 sm:px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg font-bold hover:scale-105 transition-transform duration-300 shadow-lg">Cancel</button>}
          </div>
        </form>
        <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Existing Projects</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {projects.map((project) => (
            <div key={project.id} className="p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-xl">
              <img
                src={project.main_image || "../assets/images/placeholder.webp"}
                onError={(e) => { e.currentTarget.src = "../assets/images/placeholder.webp"; }}
                alt={project.name}
                className="w-full h-32 sm:h-40 object-cover rounded-lg mb-2 sm:mb-4 shadow-md"
              />
              <h4 className="text-lg sm:text-xl font-bold mb-1 text-purple-100">{project.name}</h4>
              <p className="text-sm text-purple-300 mb-2">{project.company_name}</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button onClick={() => handleEdit(project)} className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:scale-105 transition-transform duration-300 shadow-md">Edit</button>
                <button onClick={() => confirmDelete(project.id)} className="px-3 sm:px-4 py-2 bg-red-600 rounded-lg hover:scale-105 transition-transform duration-300 shadow-md">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
<AnimatePresence>
  {showDeleteModal && (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
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
        <h3 className="text-xl font-bold mb-4 text-white">
          Confirm Deletion
        </h3>

        <p className="text-purple-200 mb-6">
          Are you sure you want to delete this project? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-600 rounded-lg font-bold hover:scale-105 transition-transform duration-300 shadow-md"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 rounded-lg font-bold hover:scale-105 transition-transform duration-300 shadow-md"
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