import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2, PlusCircle, Save, Sparkles, User, MapPin, Briefcase,
  GraduationCap, Code, Award,  ChevronRight, ChevronLeft,
  CheckCircle, UserCheck, Star, BookOpen, Globe, Users,
  UploadCloud, X, Loader2 // Added missing icons
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/api';
import Logo from '../components/Logo';
import FormData from 'form-data';

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

const initialFormState = {
  profileName: '', resumeUrl: '',
  firstName: '', lastName: '', pronouns: '',
  gender: 'Prefer not to say', ethnicity: '', race: '', disabilityStatus: 'Prefer not to say', veteranStatus: 'Prefer not to say',
  email: '', phoneCountryCode: '', phone: '',
  street: '', city: '', state: '', country: '', zipCode: '',
  portfolio: '', linkedin: '', github: '', twitter: '', otherSocialLink: '',
  nationality: '', usAuthorized: null, sponsorshipRequired: null, citizenshipStatus: '',
  jobType: 'Remote', preferredLocations: '', currentCTC: '', expectedCTC: '', willingToRelocate: false,
  noticePeriodAvailable: false, noticePeriodDurationInDays: '',
  totalExperienceInYears: '', skills: '', achievements: '',
  experience: [], education: [], projects: [], certifications: [], languages: [], publications: []
};

// --- Helper Functions ---
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    // Normalize to lowercase for flexible parsing
    const ds = dateString.trim().toLowerCase();

    // Try to match formats like "Mar 2025" or "March 2025"
    const monthMap = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11
    };

    const parts = ds.split(/[\s,.-]+/).filter(Boolean);
    let month = null, year = null;

    for (const part of parts) {
      if (!isNaN(part) && part.length === 4) year = parseInt(part);
      else {
        const key = part.slice(0, 3);
        if (monthMap[key] !== undefined) month = monthMap[key];
      }
    }

    if (year && month !== null) {
      // Always first day of that month
      const date = new Date(Date.UTC(year, month, 1));
      return date.toISOString().split('T')[0];
    }

    // fallback to normal parsing
    const parsed = new Date(dateString);
    if (!isNaN(parsed.getTime())) {
      // Always set to first day of that month
      parsed.setUTCDate(1);
      return parsed.toISOString().split('T')[0];
    }

    return '';
  } catch (error) {
    console.warn('Invalid date format:', dateString, error);
    return '';
  }
};


// --- Reusable Sub-Components ---
const ExperienceFormItem = ({ experience, index, handleChange, handleRemove }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 mb-6 bg-white/80 rounded-2xl shadow-lg border">
    <div className="flex items-center justify-between mb-4"><h4 className="font-bold text-gray-900 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-600" /> Experience #{index + 1}</h4><button type="button" onClick={() => handleRemove(index)} className="text-red-500 p-2 rounded-full hover:bg-red-50"><Trash2 className="w-5 h-5" /></button></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Company *</label><input type="text" value={experience.company} onChange={(e) => handleChange(index, 'company', e.target.value)} required className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Role/Position *</label><input type="text" value={experience.role} onChange={(e) => handleChange(index, 'role', e.target.value)} required className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="space-y-2 md:col-span-2"><label className="text-sm font-semibold text-gray-700">Experience Type *</label><select value={experience.experienceType} onChange={(e) => handleChange(index, 'experienceType', e.target.value)} required className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"><option>Job</option><option>Internship</option><option>Apprenticeship</option><option>Freelance</option></select></div>
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Start Date</label><input type="date" value={formatDateForInput(experience.startDate)} onChange={(e) => handleChange(index, 'startDate', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">End Date</label><input type="date" value={formatDateForInput(experience.endDate)} onChange={(e) => handleChange(index, 'endDate', e.target.value)} disabled={experience.isCurrent} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" /></div>
      <div className="col-span-2 space-y-2"><label className="text-sm font-semibold text-gray-700">Description</label><textarea value={experience.description} onChange={(e) => handleChange(index, 'description', e.target.value)} rows="3" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none" /></div>
    </div>
    <div className="mt-4"><label className="flex items-center cursor-pointer"><input type="checkbox" checked={experience.isCurrent} onChange={(e) => handleChange(index, 'isCurrent', e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /> <span className="ml-2 text-gray-700">Currently work here</span></label></div>
  </motion.div>
);
const EducationFormItem = ({ education, index, handleChange, handleRemove }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 mb-6 bg-white/80 rounded-2xl shadow-lg border">
    <div className="flex items-center justify-between mb-4"><h4 className="font-bold text-gray-900 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-blue-600" /> Education #{index + 1}</h4><button type="button" onClick={() => handleRemove(index)} className="text-red-500 p-2 rounded-full hover:bg-red-50"><Trash2 className="w-5 h-5" /></button></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">School/Institution *</label><input type="text" value={education.school} onChange={(e) => handleChange(index, 'school', e.target.value)} required className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Degree/Qualification</label><input type="text" value={education.degree} onChange={(e) => handleChange(index, 'degree', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Field of Study</label><input type="text" value={education.fieldOfStudy} onChange={(e) => handleChange(index, 'fieldOfStudy', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Grade/GPA</label><input type="text" value={education.grade} onChange={(e) => handleChange(index, 'grade', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
    </div>
  </motion.div>
);
const ProjectFormItem = ({ project, index, handleChange, handleRemove }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 mb-6 bg-white/80 rounded-2xl shadow-lg border">
    <div className="flex items-center justify-between mb-4"><h4 className="font-bold text-gray-900 flex items-center gap-2"><Code className="w-5 h-5 text-blue-600" /> Project #{index + 1}</h4><button type="button" onClick={() => handleRemove(index)} className="text-red-500 p-2 rounded-full hover:bg-red-50"><Trash2 className="w-5 h-5" /></button></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 space-y-2"><label className="text-sm font-semibold text-gray-700">Project Title *</label><input type="text" value={project.title} onChange={(e) => handleChange(index, 'title', e.target.value)} required className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="md:col-span-2 space-y-2"><label className="text-sm font-semibold text-gray-700">Technologies</label><input type="text" value={project.technologies} onChange={(e) => handleChange(index, 'technologies', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">GitHub Link</label><input type="url" value={project.githubLink} onChange={(e) => handleChange(index, 'githubLink', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Live Demo Link</label><input type="url" value={project.liveDemoLink} onChange={(e) => handleChange(index, 'liveDemoLink', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="md:col-span-2 space-y-2"><label className="text-sm font-semibold text-gray-700">Description</label><textarea value={project.description} onChange={(e) => handleChange(index, 'description', e.target.value)} rows="3" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none" /></div>
    </div>
  </motion.div>
);
const CertificationFormItem = ({ certification, index, handleChange, handleRemove }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 mb-6 bg-white/80 rounded-2xl shadow-lg border">
    <div className="flex items-center justify-between mb-4"><h4 className="font-bold text-gray-900 flex items-center gap-2"><Award className="w-5 h-5 text-blue-600" /> Certification #{index + 1}</h4><button type="button" onClick={() => handleRemove(index)} className="text-red-500 p-2 rounded-full hover:bg-red-50"><Trash2 className="w-5 h-5" /></button></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Certification Name *</label><input type="text" value={certification.name} onChange={(e) => handleChange(index, 'name', e.target.value)} required className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Issuing Organization</label><input type="text" value={certification.issuer} onChange={(e) => handleChange(index, 'issuer', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Credential ID</label><input type="text" value={certification.credentialId} onChange={(e) => handleChange(index, 'credentialId', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Credential URL</label><input type="url" value={certification.credentialUrl} onChange={(e) => handleChange(index, 'credentialUrl', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Issue Date</label><input type="date" value={formatDateForInput(certification.issueDate)} onChange={(e) => handleChange(index, 'issueDate', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
      <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Expiry Date</label><input type="date" value={formatDateForInput(certification.expiryDate)} onChange={(e) => handleChange(index, 'expiryDate', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
    </div>
  </motion.div>
);
const LanguageFormItem = ({ item, index, handleChange, handleRemove }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 mb-6 bg-white/80 rounded-2xl shadow-lg border">
    <div className="flex items-center justify-between mb-4"><h4 className="font-bold text-gray-900 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-600" /> Language #{index + 1}</h4><button type="button" onClick={() => handleRemove(index)} className="text-red-500 p-2 rounded-full hover:bg-red-50"><Trash2 className="w-5 h-5" /></button></div>
    <div className="grid grid-cols-2 gap-4">
      <input type="text" value={item.language} onChange={e => handleChange(index, 'language', e.target.value)} required placeholder="Language" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
      <select value={item.proficiency} onChange={e => handleChange(index, 'proficiency', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
        <option>Basic</option>
        <option>Conversational</option>
        <option>Fluent</option>
        <option>Native</option>
      </select>
    </div>
  </motion.div>
);
const PublicationFormItem = ({ item, index, handleChange, handleRemove }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 mb-6 bg-white/80 rounded-2xl shadow-lg border">
    <div className="flex items-center justify-between mb-4"><h4 className="font-bold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> Publication #{index + 1}</h4><button type="button" onClick={() => handleRemove(index)} className="text-red-500 p-2 rounded-full hover:bg-red-50"><Trash2 className="w-5 h-5" /></button></div>
    <div className="space-y-4">
      <input type="text" placeholder="Title *" value={item.title} onChange={e => handleChange(index, 'title', e.target.value)} required className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
      <input type="url" placeholder="Link" value={item.link} onChange={e => handleChange(index, 'link', e.target.value)} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
      <textarea placeholder="Description..." value={item.description} onChange={e => handleChange(index, 'description', e.target.value)} rows="2" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none" />
    </div>
  </motion.div>
);

const translateData = (data) => {
  const translated = {};

  // --- Basic Personal Info ---
  if (data.name) {
    const nameParts = data.name.split(' ');
    translated.firstName = nameParts[0] || '';
    translated.lastName = nameParts.slice(1).join(' ') || '';
  }
  if (data.email) translated.email = data.email;
  if (data.phone) translated.phone = data.phone;
  if (data.address) translated.street = data.address;
  if (data.city) translated.city = data.city;
  if (data.state) translated.state = data.state;
  if (data.country) translated.country = data.country;
  if (data.zip_code) translated.zipCode = data.zip_code;

  // --- Professional Info ---
  if (data.total_experience) translated.totalExperienceInYears = data.total_experience;
  if (data.current_ctc) translated.currentCTC = data.current_ctc;
  if (data.expected_ctc) translated.expectedCTC = data.expected_ctc;
  if (data.preferred_locations && Array.isArray(data.preferred_locations)) {
    translated.preferredLocations = data.preferred_locations.join(', ');
  }

  // --- Link Parsing ---
  if (data.links && Array.isArray(data.links)) {
    for (const link of data.links) {
      if (link.includes('linkedin.com')) translated.linkedin = link;
      else if (link.includes('github.com')) translated.github = link;
      else if (link.includes('twitter.com') || link.includes('x.com')) translated.twitter = link;
      else if (!translated.portfolio) translated.portfolio = link; // Use first other link as portfolio
    }
  }

  // --- Skills and Achievements ---
  if (data.skills && Array.isArray(data.skills)) {
    translated.skills = data.skills.join(', ');
  }
  if (data.achievements && Array.isArray(data.achievements)) {
    translated.achievements = data.achievements.join(', ');
  }

  // --- Education ---
  if (data.education && Array.isArray(data.education)) {
    translated.education = data.education.map(edu => ({
      ...initialEducation,
      school: edu.institution || edu.school || '',
      degree: edu.degree || edu.qualification || '',
      fieldOfStudy: edu.field_of_study || edu.major || '',
      grade: edu.grade || edu.gpa || '',
      startDate: formatDateForInput(edu.start_date) || '',
      endDate: formatDateForInput(edu.end_date || edu.graduation_date) || '',
    })
    );

  }

  // --- Experience ---
  if (data.experience && Array.isArray(data.experience)) {
    translated.experience = data.experience.map(exp => ({
      ...initialExperience,
      company: exp.company || exp.employer || '',
      // Enhanced role mapping to include more common parser output keys
      role: exp.role || exp.position || exp.title || exp.job_title || exp.position_title || '',
      experienceType: exp.type || 'Job',
      startDate: formatDateForInput(exp.start_date) || '',
      endDate: formatDateForInput(exp.end_date) || '',
      // Enhanced description mapping to include more common parser output keys and handle bullet points
      description: exp.description || exp.summary || exp.details || exp.responsibilities || (Array.isArray(exp.bullet_points) ? exp.bullet_points.join('\n') : '') || '',
      isCurrent: exp.is_current || exp.current || false,
    }));
  }

  // --- Projects ---
  if (data.projects && Array.isArray(data.projects)) {
    translated.projects = data.projects.map(proj => ({
      ...initialProject,
      title: proj.title || proj.name || '',
      description: proj.description || proj.summary || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || ''),
      githubLink: proj.github_url || proj.github || '',
      liveDemoLink: proj.demo_url || proj.live_url || proj.url || '',
    }));
  }

  // --- Certifications ---
  if (data.certifications && Array.isArray(data.certifications)) {
    translated.certifications = data.certifications.map(cert => ({
      ...initialCertification,
      name: cert.name || cert.title || '',
      issuer: cert.issuer || cert.organization || cert.issuing_organization || '',
      issueDate: formatDateForInput(cert.issue_date || cert.date_issued) || '',
      expiryDate: formatDateForInput(cert.expiry_date || cert.expiration_date) || '',
      credentialId: cert.credential_id || cert.id || '',
      credentialUrl: cert.credential_url || cert.url || '',
    }));
  }

  // --- Languages ---
  if (data.languages && Array.isArray(data.languages)) {
    translated.languages = data.languages.map(lang => ({
      ...initialLanguage,
      language: lang.language || lang.name || '',
      proficiency: lang.proficiency || lang.level || 'Conversational',
    }));
  }

  // --- Publications ---
  if (data.publications && Array.isArray(data.publications)) {
    translated.publications = data.publications.map(pub => ({
      ...initialPublication,
      title: pub.title || pub.name || '',
      link: pub.link || pub.url || '',
      description: pub.description || pub.summary || '',
    }));
  }

  return translated;
};

const CreateProfile = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [resumeFile, setResumeFile] = useState(null); // For parsing
  const [manualResumeFile, setManualResumeFile] = useState(null); // For manual upload
  const [isParsing, setIsParsing] = useState(false); // For the parser

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      setResumeFile(file); // Save the file for parsing
      // Don't automatically parse - wait for user to click "Parse and Fill"
    } else {
      toast.error("Please select a valid PDF or DOCX file.");
    }
  };
  const handleRemoveFile = () => {
    setResumeFile(null);
    // Only clear resumeUrl if it was the same file from parsing
    setFormData(prev => ({
      ...prev,
      resumeUrl: prev.resumeUrl === resumeFile?.name ? '' : prev.resumeUrl
    }));
  };

  const handleRemoveManualFile = () => {
    setManualResumeFile(null);
    setFormData(prev => ({
      ...prev,
      resumeUrl: prev.resumeUrl === manualResumeFile?.name ? '' : prev.resumeUrl
    }));
  };
  const handleArrayChange = useCallback((section, index, field, value) => {
    setFormData(prev => {
      const newItems = [...prev[section]];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, [section]: newItems };
    });
  }, []);
  const handleAddItem = useCallback((section, initialItem) => {
    setFormData(prev => ({ ...prev, [section]: [...prev[section], initialItem] }));
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
      projects: data.projects.map(p => ({ ...p, technologies: processCommaString(p.technologies) })),
    };
  };

  const parseAndFillForm = async () => {
    if (!resumeFile) {
      toast.error("Please select a resume file first.");
      return;
    }

    setIsParsing(true);
    const parseFormData = new FormData();
    parseFormData.append('resume', resumeFile);

    try {
      // This calls your Node.js endpoint
      const response = await api.post('/profiles/parse-resume', parseFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { parsedData } = response.data;
      if (!parsedData) throw new Error("Parser returned no data.");

      // Translate the Python schema to our frontend schema
      const translatedData = translateData(parsedData);
      

      // Update the form state with all the new data
      setFormData(prev => ({
        ...prev,
        ...translatedData,
        // Ensure arrays are initialized
        experience: translatedData.experience || [],
        education: translatedData.education || [],
        projects: translatedData.projects || [], // Ensure projects are initialized
        certifications: translatedData.certifications || [], // Ensure certifications are initialized
        languages: translatedData.languages || [], // Ensure languages are initialized
        publications: translatedData.publications || [], // Ensure publications are initialized
        // Automatically attach the parsed resume to the profile
        resumeUrl: resumeFile.name,
      }));

      toast.success("Resume parsed, form filled, and attached to profile!");

    } catch (error) {
      console.error("Resume parsing failed:", error);
      toast.error(error.response?.data?.message || "Failed to parse resume.");
    } finally {
      setIsParsing(false);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let finalResumeUrl = formData.resumeUrl;

    if (resumeFile || manualResumeFile) {
      setIsUploading(true);
      const resumeFormData = new FormData();

      // Use the appropriate file - prioritize parsing file, then manual file
      const fileToUpload = resumeFile || manualResumeFile;
      resumeFormData.append('resume', fileToUpload);

      try {
        const uploadRes = await api.post('/profiles/upload-resume', resumeFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        finalResumeUrl = uploadRes.data.resumeUrl;
        toast.success('Resume uploaded successfully!');
      } catch (error) {
        console.error('Resume upload error:', error);
        toast.error('Resume upload failed. Please try again.');
        setIsSubmitting(false);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    try {
      const finalPayload = prepareDataForSubmission({ ...formData, resumeUrl: finalResumeUrl });
      const response = await api.post('/profiles/createprofile', finalPayload);
      toast.success(response.data.message || 'Profile created successfully!');
      setFormData(initialFormState);
      setResumeFile(null);
      setManualResumeFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create profile.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Render Logic
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Sidebar */}
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">Create Your Profile</h2>
            <p className="text-gray-600 text-sm">Build your professional profile step by step</p>
          </motion.div>
          <div className="space-y-4">
            {STEPS.map((step, index) => {
              const isActive = currentStep === index;
              const Icon = step.icon;
              return (
                <motion.div key={step.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} onClick={() => goToStep(index)} className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'bg-white/50 border border-gray-200 text-gray-600 hover:bg-white/80'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{step.title}</h3>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
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

                  {/* --- STEP 0: Personal Info --- */}
                  {currentStep === 0 && (
                    <motion.div key="basic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2 p-4 bg-blue-50/50 rounded-xl border border-blue-200/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <label className="text-sm font-semibold text-gray-700">Option 1: Upload Resume for AI Parsing (PDF/DOCX)</label>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">Let AI automatically fill your form by parsing your resume</p>

                          {isParsing && (
                            <div className="flex items-center justify-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                              <span className="ml-2 text-sm text-blue-800">AI is reading your resume...</span>
                            </div>
                          )}

                          {!isParsing && resumeFile && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                <span className="text-sm text-green-800 truncate">{resumeFile.name}</span>
                                <button type="button" onClick={handleRemoveFile} className="p-1 text-red-500 hover:bg-red-100 rounded-full">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              <motion.button
                                type="button"
                                onClick={parseAndFillForm}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                              >
                                <Sparkles className="w-5 h-5" />
                                Parse and Fill Form
                              </motion.button>
                            </div>
                          )}

                          {!isParsing && !resumeFile && (
                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-400">
                              <span className="flex items-center space-x-2">
                                <UploadCloud className="w-6 h-6 text-gray-600" />
                                <span className="font-medium text-gray-600">Click to upload resume</span>
                              </span>
                              <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                            </label>
                          )}
                        </div>
                      </div>

                      {/* OR Divider - Full Width */}
                      <div className="flex items-center my-6 w-full">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <div className="px-6 py-2 bg-white rounded-full border border-gray-300 shadow-sm mx-4">
                          <span className="text-sm font-medium text-gray-500">OR</span>
                        </div>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Role Name *</label><input type="text" name="profileName" value={formData.profileName} onChange={handleInputChange} required className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                        <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">First Name *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                        <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Last Name *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                        <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Email *</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                        <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Pronouns</label><input type="text" name="pronouns" value={formData.pronouns} onChange={handleInputChange} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                        <div className="md:col-span-2 grid grid-cols-3 gap-4">
                          <div className="col-span-1 space-y-2"><label className="text-sm font-semibold text-gray-700">Country Code</label><input type="text" name="phoneCountryCode" value={formData.phoneCountryCode} onChange={handleInputChange} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                          <div className="col-span-2 space-y-2"><label className="text-sm font-semibold text-gray-700">Phone Number</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                        </div>
                        <div className="space-y-2 md:col-span-2 p-4 bg-green-50/50 rounded-xl border border-green-200/50">
                          <div className="flex items-center gap-2 mb-2">
                            <UploadCloud className="w-5 h-5 text-green-600" />
                            <label className="text-sm font-semibold text-gray-700">Option 2: Manually Attach Resume to Profile</label>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            {resumeFile && formData.resumeUrl === resumeFile.name
                              ? "✅ Same resume from parsing is attached to profile"
                              : "Upload a resume to attach to your final profile"}
                          </p>
                          {formData.resumeUrl ? (
                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="truncate text-green-800 font-medium">{formData.resumeUrl}</span>
                                {resumeFile && formData.resumeUrl === resumeFile.name && (
                                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">From parsing</span>
                                )}
                              </div>
                              <button type="button" onClick={handleRemoveManualFile} className="p-1 text-red-500 hover:bg-red-100 rounded-full">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center w-full h-24 px-4 border-2 border-dashed rounded-md cursor-pointer hover:border-blue-400 transition-colors">
                              <span className="flex items-center space-x-2">
                                <UploadCloud className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-gray-600">Upload resume to attach</span>
                              </span>
                              <input type="file" name="profileResume" accept=".pdf,.doc,.docx" onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  // Store the file for upload and update the display
                                  setManualResumeFile(file);
                                  setFormData(prev => ({ ...prev, resumeUrl: file.name }));
                                }
                              }} className="hidden" />
                            </label>
                          )}
                        </div>
                      </div>
                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-semibold text-gray-900">Social Links</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} placeholder="Portfolio URL" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                          <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="LinkedIn URL" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                          <input type="url" name="github" value={formData.github} onChange={handleInputChange} placeholder="GitHub URL" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                          <input type="url" name="twitter" value={formData.twitter} onChange={handleInputChange} placeholder="Twitter URL" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Other Link</label>
                            <input type="url" name="otherSocialLink" value={formData.otherSocialLink} onChange={handleInputChange} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 1 && (
                    <motion.div key="location" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Present Address</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" name="street" value={formData.street} onChange={handleInputChange} placeholder="Street Address" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                          <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                          <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                          <input type="text" name="country" value={formData.country} onChange={handleInputChange} placeholder="Country" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                          <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="ZIP Code" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Skills</label>
                        <textarea name="skills" rows="3" value={formData.skills} onChange={handleInputChange} placeholder="e.g., React, Node.js, Python (comma separated)" className="w-full p-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none" />
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 2 && (
                    <motion.div key="professional" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Total Experience (in years)</label><input type="number" name="totalExperienceInYears" value={formData.totalExperienceInYears} onChange={handleInputChange} placeholder="e.g., 5" className="w-full p-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                        <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Job Type Preference</label><select name="jobType" value={formData.jobType} onChange={handleInputChange} className="w-full p-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"><option>Remote</option><option>Onsite</option><option>Hybrid</option></select></div>
                        <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Current CTC</label><input type="text" name="currentCTC" value={formData.currentCTC} onChange={handleInputChange} placeholder="e.g., $ 15K" className="w-full p-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                        <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Expected CTC</label><input type="text" name="expectedCTC" value={formData.expectedCTC} onChange={handleInputChange} placeholder="e.g., $ 20K" className="w-full p-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                        <div className="md:col-span-2 space-y-2"><label className="text-sm font-semibold text-gray-700">Preferred Locations</label><input type="text" name="preferredLocations" value={formData.preferredLocations} onChange={handleInputChange} placeholder="e.g., New York , california LA" className="w-full p-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                      </div>
                      <div className="space-y-4 pt-4 border-t border-gray-200"><h4 className="text-lg font-semibold text-gray-900">Relocation</h4><div className="flex flex-col md:flex-row gap-6"><label className="flex items-center cursor-pointer"><input type="checkbox" name="willingToRelocate" checked={formData.willingToRelocate} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /> <span className="ml-2 text-gray-700">Willing to relocate?</span></label></div></div>
                      <div className="space-y-4 pt-4 border-t border-gray-200"><h4 className="text-lg font-semibold text-gray-900">Notice Period</h4><div className="flex items-center gap-4 flex-wrap"><label className="flex items-center cursor-pointer"><input type="checkbox" name="noticePeriodAvailable" checked={formData.noticePeriodAvailable} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" /> <span className="ml-2 text-gray-700">Serving notice period?</span></label>{formData.noticePeriodAvailable && (<motion.input initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: '12rem' }} type="number" name="noticePeriodDurationInDays" value={formData.noticePeriodDurationInDays} onChange={handleInputChange} placeholder="Duration in days" className="p-4 w-48 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />)}</div></div>
                      <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900">Work Authorization</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Nationality</label><input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} placeholder="e.g., American" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                          <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Citizenship Status</label><input type="text" name="citizenshipStatus" value={formData.citizenshipStatus} onChange={handleInputChange} placeholder="e.g., Citizen, Visa Holder" className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                          <div className="space-y-2"><p className="text-sm font-semibold text-gray-700">Authorized to work in the USA?</p><div className="flex gap-4 items-center pt-2"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="usAuthorized" value="yes" checked={formData.usAuthorized === true} onChange={() => handleRadioChange('usAuthorized', 'yes')} /> Yes</label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="usAuthorized" value="no" checked={formData.usAuthorized === false} onChange={() => handleRadioChange('usAuthorized', 'no')} /> No</label></div></div>
                          <div className="space-y-2"><p className="text-sm font-semibold text-gray-700">Need visa sponsorship?</p><div className="flex gap-4 items-center pt-2"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sponsorshipRequired" value="yes" checked={formData.sponsorshipRequired === true} onChange={() => handleRadioChange('sponsorshipRequired', 'yes')} /> Yes</label><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="sponsorshipRequired" value="no" checked={formData.sponsorshipRequired === false} onChange={() => handleRadioChange('sponsorshipRequired', 'no')} /> No</label></div></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 3 && (<motion.div key="experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{formData.experience.map((item, i) => (<ExperienceFormItem key={i} experience={item} index={i} handleChange={(...args) => handleArrayChange('experience', ...args)} handleRemove={() => handleRemoveItem('experience', i)} />))}<motion.button type="button" onClick={() => handleAddItem('experience', initialExperience)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full p-4 border-2 border-dashed border-blue-300 rounded-2xl text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"><PlusCircle className="w-5 h-5" /> Add Experience</motion.button></motion.div>)}
                  {currentStep === 4 && (<motion.div key="education" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{formData.education.map((item, i) => (<EducationFormItem key={i} education={item} index={i} handleChange={(...args) => handleArrayChange('education', ...args)} handleRemove={() => handleRemoveItem('education', i)} />))}<motion.button type="button" onClick={() => handleAddItem('education', initialEducation)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full p-4 border-2 border-dashed border-blue-300 rounded-2xl text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"><PlusCircle className="w-5 h-5" /> Add Education</motion.button></motion.div>)}
                  {currentStep === 5 && (<motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{formData.projects.map((item, i) => (<ProjectFormItem key={i} project={item} index={i} handleChange={(...args) => handleArrayChange('projects', ...args)} handleRemove={() => handleRemoveItem('projects', i)} />))}<motion.button type="button" onClick={() => handleAddItem('projects', initialProject)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full p-4 border-2 border-dashed border-blue-300 rounded-2xl text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"><PlusCircle className="w-5 h-5" /> Add Project</motion.button></motion.div>)}
                  {currentStep === 6 && (<motion.div key="publications">{formData.publications.map((item, i) => <PublicationFormItem key={i} item={item} index={i} handleChange={(...args) => handleArrayChange('publications', ...args)} handleRemove={() => handleRemoveItem('publications', i)} />)}<motion.button type="button" onClick={() => handleAddItem('publications', initialPublication)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full p-4 border-2 border-dashed border-blue-300 rounded-2xl text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"><PlusCircle className="w-5 h-5" /> Add Publication</motion.button></motion.div>)}
                  {currentStep === 7 && (<motion.div key="certifications">{formData.certifications.map((item, i) => <CertificationFormItem key={i} certification={item} index={i} handleChange={(...args) => handleArrayChange('certifications', ...args)} handleRemove={() => handleRemoveItem('certifications', i)} />)}<motion.button type="button" onClick={() => handleAddItem('certifications', initialCertification)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full p-4 border-2 border-dashed border-blue-300 rounded-2xl text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"><PlusCircle className="w-5 h-5" /> Add Certification</motion.button><h3 className="text-xl font-bold mt-10 mb-4 border-t pt-6">Languages</h3>{formData.languages.map((item, i) => <LanguageFormItem key={i} item={item} index={i} handleChange={(...args) => handleArrayChange('languages', ...args)} handleRemove={() => handleRemoveItem('languages', i)} />)}<motion.button type="button" onClick={() => handleAddItem('languages', initialLanguage)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full p-4 border-2 border-dashed border-blue-300 rounded-2xl text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"><PlusCircle className="w-5 h-5" /> Add Language</motion.button></motion.div>)}
                  {currentStep === 8 && (
                    <motion.div key="demographics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                      <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">This information is optional and used for diversity reporting purposes only.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Gender</label><select name="gender" value={formData.gender} onChange={handleInputChange} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"><option>Prefer not to say</option><option>Male</option><option>Female</option><option>Non-binary</option><option>Other</option></select></div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Veteran Status</label>
                          <select name="veteranStatus" value={formData.veteranStatus} onChange={handleInputChange} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                            <option value="">Select an option</option> {/* Added a default empty option for better UX */}
                            <option value="Protected Veteran">I identify as one or more of the classifications of protected veteran listed above</option>
                            <option value="Not Protected Veteran">I am not a protected veteran</option>
                            <option value="Decline to self-identify">I decline to self-identify for protected veteran status</option>
                          </select>
                        </div>
                        <div className="space-y-2"><label className="text-sm font-semibold text-gray-700">Disability Status</label><select name="disabilityStatus" value={formData.disabilityStatus} onChange={handleInputChange} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"><option value="Yes">Yes, I have a disability, or have had one in the past</option><option value="No">No, I do not have a disability and have not had one in the past</option><option value="Prefer not to say">I do not want to answer</option></select></div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Ethnicity</label>
                          <select name="ethnicity" value={formData.ethnicity} onChange={handleInputChange} className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Ethnicity</option>
                            <option value="Hispanic or Latino">Hispanic or Latino</option>
                            <option value="White (Not Hispanic or Latino)">White (Not Hispanic or Latino)</option>
                            <option value="Black or African American (Not Hispanic or Latino)">Black or African American (Not Hispanic or Latino)</option>
                            <option value="Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)">Native Hawaiian or Other Pacific Islander (Not Hispanic or Latino)</option>
                            <option value="Asian (Not Hispanic or Latino)">Asian (Not Hispanic or Latino)</option>
                            <option value="American Indian or Alaska Native (Not Hispanic or Latino)">American Indian or Alaska Native (Not Hispanic or Latino)</option>
                            <option value="Two or More Races (Not Hispanic or Latino)">Two or More Races (Not Hispanic or Latino)</option>
                            <option value="Decline to self-identify">Decline to self-identify</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-2"><label className="text-sm font-semibold text-gray-700">Race</label><input type="text" name="race" value={formData.race} onChange={handleInputChange} placeholder="e.g., White, Black, Asian..." className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" /></div>
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 9 && (
                    <motion.div key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Achievements</label>
                        <textarea name="achievements" rows="5" value={formData.achievements} onChange={handleInputChange} placeholder="List key achievements, separated by commas..." className="p-4 w-full bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none" />
                      </div>
                    </motion.div>
                  )}
                  {currentStep === 10 && (
                    <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                      <div className="text-center"><h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Profile</h3><p className="text-gray-600">Please review all information before submitting.</p></div>
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200"><h4 className="font-semibold text-blue-900 mb-2">Profile Name</h4><p className="text-blue-700">{formData.profileName || 'Not specified'}</p></div>
                      <div className="p-4 bg-green-50 rounded-xl border border-green-200"><h4 className="font-semibold text-green-900 mb-2">Full Name</h4><p className="text-green-700">{`${formData.firstName} ${formData.lastName}` || 'Not specified'}</p></div>
                      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200"><h4 className="font-semibold text-purple-900 mb-2">Experience Entries</h4><p className="text-purple-700">{formData.experience.length} experience(s) added</p></div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <motion.button type="button" onClick={prevStep} disabled={currentStep === 0} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-5 h-5" /> Previous
                  </motion.button>
                  {currentStep < STEPS.length - 1 ? (
                    <motion.button type="button" onClick={nextStep} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium flex items-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                      Next <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  ) : (
                    <motion.button type="submit" disabled={isSubmitting || isParsing} className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium flex items-center gap-2 hover:from-green-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isParsing ? <><Loader2 className="animate-spin w-5 h-5" /> Parsing...</> :
                        isSubmitting ? <><Loader2 className="animate-spin w-5 h-5" /> {isUploading ? 'Uploading...' : 'Saving...'}</> :
                          <><Save className="w-5 h-5" /> Create Profile</>}
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

export default CreateProfile;