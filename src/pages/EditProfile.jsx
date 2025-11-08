import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2, Save, User, MapPin, Briefcase,
    GraduationCap, Code, Award,  ChevronRight, ChevronLeft,
    CheckCircle, UserCheck, Star, BookOpen, Globe, Users, Loader2 // Added Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/api';
import Logo from '../components/Logo';

// --- Configuration and Constants ---
const STEPS = [
    { id: 'basic', title: 'Personal Info', icon: User, description: 'Your name, contact, and social links' },
    { id: 'location', title: 'Location & Skills', icon: MapPin, description: 'Address and key competencies' },
    { id: 'professional', title: 'Professional Details', icon: UserCheck, description: 'Experience, CTC, and preferences' },
    { id: 'experience', title: 'Work Experience', icon: Briefcase, description: 'Your detailed work history' },
    { id: 'education', title: 'Education', icon: GraduationCap, description: 'Educational background' },
    { id: 'projects', title: 'Projects', icon: Code, description: 'Portfolio of your work' },
    { id: 'publications', title: 'Publications', icon: BookOpen, description: 'Published articles or papers' },
    { id: 'certifications', title: 'Certifications & Languages', icon: Award, description: 'Licenses and language skills' },
    { id: 'demographics', title: 'Demographics (Optional)', icon: Users, description: 'Optional diversity information' },
    { id: 'achievements', title: 'Achievements', icon: Star, description: 'List your key achievements' },
    { id: 'review', title: 'Review & Submit', icon: CheckCircle, description: 'Final review of your profile' }
];

// --- Initial State for Array Items ---
const initialExperience = { company: '', role: '', experienceType: 'Job', startDate: '', endDate: '', isCurrent: false, description: '' };
const initialEducation = { school: '', degree: '', fieldOfStudy: '', grade: '' };
const initialProject = { title: '', description: '', technologies: '', githubLink: '', liveDemoLink: '' };
const initialCertification = { name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' };
const initialLanguage = { language: '', proficiency: 'Conversational' };
const initialPublication = { title: '', link: '', description: '' };


// --- ✨ FULLY INCLUDED Reusable Sub-Components ---
const ExperienceFormItem = ({ experience, index, handleChange, handleRemove }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-6 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-600" /> Experience #{index + 1}</h4>
        <button type="button" onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50" aria-label="Remove Experience"><Trash2 className="w-5 h-5" /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Company *</label><input type="text" placeholder="Enter company name" value={experience.company} onChange={(e) => handleChange(index, 'company', e.target.value)} required className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Role/Position *</label><input type="text" placeholder="Enter your role" value={experience.role} onChange={(e) => handleChange(index, 'role', e.target.value)} required className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
        <div className="space-y-3 md:col-span-2"><label className="text-sm font-semibold text-gray-700 block mb-2">Experience Type *</label><select value={experience.experienceType} onChange={(e) => handleChange(index, 'experienceType', e.target.value)} required className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"><option value="Job">Job</option><option value="Internship">Internship</option><option value="Apprenticeship">Apprenticeship</option><option value="Freelance">Freelance</option></select></div>
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Start Date</label><input type="date" value={experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange(index, 'startDate', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">End Date</label><input type="date" value={experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange(index, 'endDate', e.target.value)} disabled={experience.isCurrent} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 disabled:bg-gray-100 disabled:border-gray-200"/></div>
        <div className="col-span-1 md:col-span-2 space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Description</label><textarea placeholder="Describe your responsibilities" value={experience.description} onChange={(e) => handleChange(index, 'description', e.target.value)} rows="3" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"/></div>
      </div>
      <div className="flex justify-between items-center mt-4"><label className="flex items-center text-sm cursor-pointer"><input type="checkbox" checked={experience.isCurrent} onChange={(e) => handleChange(index, 'isCurrent', e.target.checked)} className="w-4 h-4 text-blue-600 rounded"/> <span className="ml-2">Currently work here</span></label></div>
    </motion.div>
);
const EducationFormItem = ({ education, index, handleChange, handleRemove }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-6 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
      <div className="flex items-center justify-between mb-4"><h4 className="text-lg font-bold text-gray-900 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-blue-600" /> Education #{index + 1}</h4><button type="button" onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"><Trash2 className="w-5 h-5" /></button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">School/Institution *</label><input type="text" placeholder="Enter school name" value={education.school} onChange={(e) => handleChange(index, 'school', e.target.value)} required className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Degree/Qualification</label><input type="text" placeholder="e.g., Bachelor's" value={education.degree} onChange={(e) => handleChange(index, 'degree', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Field of Study</label><input type="text" placeholder="e.g., Computer Science" value={education.fieldOfStudy} onChange={(e) => handleChange(index, 'fieldOfStudy', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Grade/GPA</label><input type="text" placeholder="e.g., 3.8 GPA" value={education.grade} onChange={(e) => handleChange(index, 'grade', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
      </div>
    </motion.div>
);
const ProjectFormItem = ({ project, index, handleChange, handleRemove }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-6 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
      <div className="flex items-center justify-between mb-4"><h4 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Code className="w-5 h-5 text-blue-600" /> Project #{index + 1}</h4><button type="button" onClick={() => handleRemove(index)} className="text-red-500 p-2 rounded-full hover:bg-red-50"><Trash2 className="w-5 h-5" /></button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3 md:col-span-2"><label className="text-sm font-semibold text-gray-700 block mb-2">Project Title *</label><input type="text" placeholder="Enter project title" value={project.title} onChange={(e) => handleChange(index, 'title', e.target.value)} required className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
        <div className="space-y-3 md:col-span-2"><label className="text-sm font-semibold text-gray-700 block mb-2">Technologies</label><input type="text" placeholder="Comma separated" value={project.technologies} onChange={(e) => handleChange(index, 'technologies', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">GitHub Link</label><input type="url" placeholder="https://github.com/..." value={project.githubLink} onChange={(e) => handleChange(index, 'githubLink', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Live Demo Link</label><input type="url" placeholder="https://your-project.com" value={project.liveDemoLink} onChange={(e) => handleChange(index, 'liveDemoLink', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
        <div className="col-span-1 md:col-span-2 space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Description</label><textarea placeholder="Describe your project" value={project.description} onChange={(e) => handleChange(index, 'description', e.target.value)} rows="3" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none" /></div>
      </div>
    </motion.div>
);
const CertificationFormItem = ({ certification, index, handleChange, handleRemove }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-6 mb-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
      <div className="flex items-center justify-between mb-4"><h4 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Award className="w-5 h-5 text-blue-600" /> Certification #{index + 1}</h4><button type="button" onClick={() => handleRemove(index)} className="text-red-500 p-2 rounded-full hover:bg-red-50"><Trash2 className="w-5 h-5" /></button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Certification Name *</label><input type="text" placeholder="AWS Certified..." value={certification.name} onChange={(e) => handleChange(index, 'name', e.target.value)} required className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Issuing Organization</label><input type="text" placeholder="Amazon Web Services" value={certification.issuer} onChange={(e) => handleChange(index, 'issuer', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Credential ID</label><input type="text" value={certification.credentialId} onChange={(e) => handleChange(index, 'credentialId', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Credential URL</label><input type="url" value={certification.credentialUrl} onChange={(e) => handleChange(index, 'credentialUrl', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Issue Date</label><input type="date" value={certification.issueDate ? new Date(certification.issueDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange(index, 'issueDate', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Expiry Date</label><input type="date" value={certification.expiryDate ? new Date(certification.expiryDate).toISOString().split('T')[0] : ''} onChange={(e) => handleChange(index, 'expiryDate', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
      </div>
    </motion.div>
);
const LanguageFormItem = ({ item, index, handleChange, handleRemove }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 mb-6 bg-white/80 rounded-2xl shadow-lg border">
      <div className="flex items-center justify-between mb-4"><h4 className="font-bold flex items-center gap-2"><Globe className="w-5 h-5 text-blue-600"/> Language #{index + 1}</h4><button type="button" onClick={() => handleRemove(index)} className="text-red-500 p-2 rounded-full hover:bg-red-50"><Trash2 className="w-5 h-5" /></button></div>
      <div className="grid grid-cols-2 gap-4"><input type="text" placeholder="e.g., English" value={item.language} onChange={e => handleChange(index, 'language', e.target.value)} required className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/><select value={item.proficiency} onChange={e => handleChange(index, 'proficiency', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"><option>Basic</option><option>Conversational</option><option>Fluent</option><option>Native</option></select></div>
    </motion.div>
);
const PublicationFormItem = ({ item, index, handleChange, handleRemove }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 mb-6 bg-white/80 rounded-2xl shadow-lg border">
      <div className="flex items-center justify-between mb-4"><h4 className="font-bold flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600"/> Publication #{index + 1}</h4><button type="button" onClick={() => handleRemove(index)} className="text-red-500 p-2 rounded-full hover:bg-red-50"><Trash2 className="w-5 h-5" /></button></div>
      <div className="space-y-4"><input type="text" placeholder="Publication Title *" value={item.title} onChange={e => handleChange(index, 'title', e.target.value)} required className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/><input type="url" placeholder="Link to publication" value={item.link} onChange={e => handleChange(index, 'link', e.target.value)} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/><textarea placeholder="Brief description..." value={item.description} onChange={e => handleChange(index, 'description', e.target.value)} rows="2" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"/></div>
    </motion.div>
);

const EditProfile = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profiles/getprofile/${profileId}`);
        const profileData = {
        //   ...initialFormState, // Start with a clean slate
          ...response.data, // Overwrite with fetched data
          // Ensure arrays are not null/undefined
          experience: response.data.experience || [],
          education: response.data.education || [],
          projects: response.data.projects || [],
          certifications: response.data.certifications || [],
          languages: response.data.languages || [],
          publications: response.data.publications || [],
          // Convert arrays to comma-separated strings for UI textareas
          skills: Array.isArray(response.data.skills) ? response.data.skills.join(', ') : '',
          achievements: Array.isArray(response.data.achievements) ? response.data.achievements.join(', ') : '',
          preferredLocations: Array.isArray(response.data.preferredLocations) ? response.data.preferredLocations.join(', ') : '',
        };
        setFormData(profileData);
      } catch (err) {
        toast.error("Failed to load profile data.");
        console.error(err);
      }
    };
    fetchProfile();
  }, [profileId]);

  const nextStep = () => setCurrentStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
  const goToStep = (stepIndex) => setCurrentStep(stepIndex);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }, []);

  const handleRadioChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value === 'yes' }));
  }, []);

  const handleArrayChange = useCallback((section, index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev[section]];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, [section]: newItems };
    });
  }, []);

  const handleAddItem = useCallback((section, initialItem) => {
    setFormData(prev => ({ ...prev, [section]: [...(prev[section] || []), initialItem] }));
  }, []);

  const handleRemoveItem = useCallback((section, index) => {
    setFormData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
  }, []);

  const prepareDataForSubmission = (data) => {
    const processCommaString = (str) => typeof str === 'string' ? str.split(',').map(s => s.trim()).filter(Boolean) : [];
    return {
      ...data,
      skills: processCommaString(data.skills),
      achievements: processCommaString(data.achievements),
      preferredLocations: processCommaString(data.preferredLocations),
      projects: data.projects.map(p => ({
        ...p,
        technologies: processCommaString(p.technologies),
      })),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = prepareDataForSubmission(formData);
      const response = await api.put(`/profiles/updateprofile/${profileId}`, payload);
      toast.success(response.data.message || 'Profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <span className="ml-4 text-xl text-gray-700">Loading Profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-white/50 p-6 hidden md:block">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                <Logo />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ProskAI
              </h1>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Update Profile</h2>
            <p className="text-gray-600 text-sm">Modify your professional profile</p>
          </motion.div>
          <div className="space-y-4">
            {STEPS.map((step, index) => {
              const isActive = currentStep === index;
              const Icon = step.icon;
              return (
                <motion.div key={step.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} onClick={() => goToStep(index)} className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'bg-white/50 border border-gray-200 text-gray-600 hover:bg-white/80'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}><Icon className="w-5 h-5" /></div>
                    <div className="flex-1"><h3 className="font-semibold text-sm">{step.title}</h3></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex items-center justify-between">
                <div><h3 className="text-3xl font-bold text-gray-900 mb-2">{STEPS[currentStep].title}</h3><p className="text-gray-600">{STEPS[currentStep].description}</p></div>
                <div className="text-sm text-gray-500">Step {currentStep + 1} of {STEPS.length}</div>
              </div>
            </motion.div>
            <motion.div key={currentStep} initial={{ opacity: 0.5, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8">
              <form onSubmit={handleSubmit} noValidate>
                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <motion.div key="basic" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Profile Name *</label><input type="text" name="profileName" value={formData.profileName} onChange={handleInputChange} required className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Resume URL</label><input type="url" name="resumeUrl" value={formData.resumeUrl} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">First Name *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Last Name *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Email *</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Pronouns</label><input type="text" name="pronouns" value={formData.pronouns} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
                        <div className="md:col-span-2 grid grid-cols-3 gap-4">
                          <div className="col-span-1 space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Country Code</label><input type="text" name="phoneCountryCode" value={formData.phoneCountryCode} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
                          <div className="col-span-2 space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Phone Number</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
                        </div>
                      </div>
                      <div className="space-y-4 pt-4 border-t"><h4 className="font-semibold">Social & Portfolio Links</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} placeholder="Portfolio URL" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /><input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="LinkedIn URL" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /><input type="url" name="github" value={formData.github} onChange={handleInputChange} placeholder="GitHub URL" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /><input type="url" name="twitter" value={formData.twitter} onChange={handleInputChange} placeholder="Twitter URL" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /><div className="md:col-span-2 space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Other Link</label><input type="url" name="otherSocialLink" value={formData.otherSocialLink} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div></div></div>
                    </motion.div>
                  )}
                  {currentStep === 1 && (<motion.div key="location" className="space-y-6"> <div className="space-y-4"><h4 className="font-semibold">Present Address</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="text" name="street" value={formData.street} onChange={handleInputChange} placeholder="Street Address" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /><input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /><input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /><input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="Country" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /><input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="ZIP Code" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div></div><div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Skills</label><textarea name="skills" rows="3" value={formData.skills} onChange={handleInputChange} placeholder="Comma separated" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"/></div></motion.div>)}
                  {currentStep === 2 && (
                    <motion.div key="professional" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Total Experience (Years)</label><input type="number" name="totalExperienceInYears" value={formData.totalExperienceInYears} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Job Type Preference</label><select name="jobType" value={formData.jobType} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"><option>Remote</option><option>Onsite</option><option>Hybrid</option></select></div>
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Current CTC</label><input type="text" name="currentCTC" value={formData.currentCTC} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Expected CTC</label><input type="text" name="expectedCTC" value={formData.expectedCTC} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
                        <div className="md:col-span-2 space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Preferred Locations</label><input type="text" name="preferredLocations" value={formData.preferredLocations} onChange={handleInputChange} placeholder="Comma separated" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div>
                      </div>
                      <div className="pt-4 border-t space-y-3"><label className="flex items-center text-sm font-semibold text-gray-700 cursor-pointer"><input type="checkbox" name="willingToRelocate" checked={formData.willingToRelocate} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded mr-2" /> Willing to relocate?</label></div>
                      <div className="pt-4 border-t space-y-3"><label className="flex items-center text-sm font-semibold text-gray-700 cursor-pointer"><input type="checkbox" name="noticePeriodAvailable" checked={formData.noticePeriodAvailable} onChange={handleInputChange} className="w-4 h-4 text-blue-600 rounded mr-2" /> Serving notice period?</label>{formData.noticePeriodAvailable && (<motion.input initial={{opacity:0}} animate={{opacity:1}} type="number" name="noticePeriodDurationInDays" value={formData.noticePeriodDurationInDays} onChange={handleInputChange} placeholder="Duration (days)" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/>)}</div>
                      <div className="pt-4 border-t"><h4 className="text-lg font-semibold text-gray-700 mb-4">Work Authorization</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Nationality</label><input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div><div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Citizenship Status</label><input type="text" name="citizenshipStatus" value={formData.citizenshipStatus} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"/></div><div className="space-y-3"><p className="text-sm font-semibold text-gray-700">Authorized to work in USA?</p><div className="flex gap-4"><label className="flex items-center cursor-pointer"><input type="radio" name="usAuthorized" value="yes" checked={formData.usAuthorized === true} onChange={() => handleRadioChange('usAuthorized', 'yes')} className="w-4 h-4 text-blue-600 mr-2" /> Yes</label><label className="flex items-center cursor-pointer"><input type="radio" name="usAuthorized" value="no" checked={formData.usAuthorized === false} onChange={() => handleRadioChange('usAuthorized', 'no')} className="w-4 h-4 text-blue-600 mr-2" /> No</label></div></div><div className="space-y-3"><p className="text-sm font-semibold text-gray-700">Need visa sponsorship?</p><div className="flex gap-4"><label className="flex items-center cursor-pointer"><input type="radio" name="sponsorshipRequired" value="yes" checked={formData.sponsorshipRequired === true} onChange={() => handleRadioChange('sponsorshipRequired', 'yes')} className="w-4 h-4 text-blue-600 mr-2" /> Yes</label><label className="flex items-center cursor-pointer"><input type="radio" name="sponsorshipRequired" value="no" checked={formData.sponsorshipRequired === false} onChange={() => handleRadioChange('sponsorshipRequired', 'no')} className="w-4 h-4 text-blue-600 mr-2" /> No</label></div></div></div></div>
                    </motion.div>
                  )}
                  {currentStep === 3 && (<motion.div key="experience">{formData.experience.map((item, i) => (<ExperienceFormItem key={i} experience={item} index={i} handleChange={(...a) => handleArrayChange('experience', ...a)} handleRemove={() => handleRemoveItem('experience', i)}/>))}<button type="button" onClick={() => handleAddItem('experience', initialExperience)}>Add Experience</button></motion.div>)}
                  {currentStep === 4 && (<motion.div key="education">{formData.education.map((item, i) => (<EducationFormItem key={i} education={item} index={i} handleChange={(...a) => handleArrayChange('education', ...a)} handleRemove={() => handleRemoveItem('education', i)}/>))}<button type="button" onClick={() => handleAddItem('education', initialEducation)}>Add Education</button></motion.div>)}
                  {currentStep === 5 && (<motion.div key="projects">{formData.projects.map((item, i) => (<ProjectFormItem key={i} project={item} index={i} handleChange={(...a) => handleArrayChange('projects', ...a)} handleRemove={() => handleRemoveItem('projects', i)}/>))}<button type="button" onClick={() => handleAddItem('projects', initialProject)}>Add Project</button></motion.div>)}
                  {currentStep === 6 && (<motion.div key="publications">{formData.publications.map((item, i) => <PublicationFormItem key={i} item={item} index={i} handleChange={(...a) => handleArrayChange('publications', ...a)} handleRemove={() => handleRemoveItem('publications', i)} />)}<button type="button" onClick={() => handleAddItem('publications', initialPublication)}>Add Publication</button></motion.div>)}
                  {currentStep === 7 && (<motion.div key="certifications">{formData.certifications.map((item, i) => <CertificationFormItem key={i} certification={item} index={i} handleChange={(...a) => handleArrayChange('certifications', ...a)} handleRemove={() => handleRemoveItem('certifications', i)} />)}<button type="button" onClick={() => handleAddItem('certifications', initialCertification)}>Add Certification</button><h3 className="font-bold mt-8 border-t pt-4">Languages</h3>{formData.languages.map((item, i) => <LanguageFormItem key={i} item={item} index={i} handleChange={(...a) => handleArrayChange('languages', ...a)} handleRemove={() => handleRemoveItem('languages', i)} />)}<button type="button" onClick={() => handleAddItem('languages', initialLanguage)}>Add Language</button></motion.div>)}
                  {currentStep === 8 && (
                    <motion.div key="demographics" className="space-y-6">
                      <p className="text-sm bg-gray-50 p-4 rounded-lg">This information is optional and used for diversity reporting purposes.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Gender</label><select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"><option>Prefer not to say</option><option>Male</option><option>Female</option><option>Non-binary</option><option>Other</option></select></div>
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Veteran Status</label><select name="veteranStatus" value={formData.veteranStatus} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"><option>Prefer not to say</option><option>Yes</option><option>No</option></select></div>
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Disability Status</label><select name="disabilityStatus" value={formData.disabilityStatus} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"><option>Prefer not to say</option><option>Yes</option><option>No</option></select></div>
                        <div className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Ethnicity</label><input type="text" name="ethnicity" value={formData.ethnicity} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
                        <div className="md:col-span-2 space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Race</label><input type="text" name="race" value={formData.race} onChange={handleInputChange} className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" /></div>
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 9 && (<motion.div key="achievements" className="space-y-3"><label className="text-sm font-semibold text-gray-700 block mb-2">Achievements</label><textarea name="achievements" rows="5" value={formData.achievements} onChange={handleInputChange} placeholder="Comma separated" className="w-full p-4 bg-white/70 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none" /></motion.div>)}
                  {currentStep === 10 && (
                    <motion.div key="review" className="space-y-6 text-center">
                      <h3>Review Your Profile</h3><p>Please review all information before submitting.</p>
                      <div className="p-4 bg-blue-50 rounded-xl"><h4>Profile Name</h4><p>{formData.profileName || 'N/A'}</p></div>
                      <div className="p-4 bg-green-50 rounded-xl"><h4>Full Name</h4><p>{`${formData.firstName} ${formData.lastName}` || 'N/A'}</p></div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <motion.button type="button" onClick={prevStep} disabled={currentStep === 0} whileHover={{ scale: currentStep > 0 ? 1.02 : 1 }} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold disabled:opacity-50"><ChevronLeft /> Previous</motion.button>
                  {currentStep < STEPS.length - 1 ? (
                    <motion.button type="button" onClick={nextStep} whileHover={{ scale: 1.02 }} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">Next <ChevronRight /></motion.button>
                  ) : (
                    <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: !isSubmitting ? 1.02 : 1 }} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl disabled:opacity-50">
                      {isSubmitting ? <><Loader2 className="animate-spin"/> Updating...</> : <><Save /> Update Profile</>}
                    </motion.button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;