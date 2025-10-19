import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  FileText,
  Briefcase,
  User,
  Plus,
  TrendingUp,
  Calendar,
  Award,
  Settings,
  Sun, Moon,
  Bell,
  Search,
  Edit,
  Trash2,
  Github,
  Linkedin,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Zap,
  Brain,
  PenTool,
  PieChart,
  DollarSign,
  Globe,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'; // ✨ NEW: Import toast
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/api'; // Make sure this path is correct for your API utility
import Logo from '../components/Logo';


const mockData = {
  stats: {
    totalApplications: 47,
    interviews: 12,
    offers: 3,
    successRate: 25.5
  },
  recentApplications: [
    {
      id: 1,
      company: 'Google',
      position: 'Senior Software Engineer',
      status: 'Interview',
      appliedDate: '2024-01-15',
      salary: '$180k',
      location: 'Mountain View, CA',
      source: 'LinkedIn',
      nextAction: 'Technical Interview - Jan 25'
    },

  ],
  profiles: [],

  analytics: {
    applicationsByMonth: [
      { month: 'Oct', count: 8 },
      { month: 'Nov', count: 12 },
      { month: 'Dec', count: 15 },
      { month: 'Jan', count: 12 }
    ],
    statusDistribution: [
      { status: 'Applied', count: 20, color: 'bg-blue-500' },
      { status: 'Interview', count: 12, color: 'bg-yellow-500' },
      { status: 'Offer', count: 3, color: 'bg-green-500' },
      { status: 'Rejected', count: 12, color: 'bg-red-500' }
    ]
  }
};

const ThemeToggle = ({ theme, setTheme }) => {
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  return (
    <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
      {theme === 'light' ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-yellow-400" />}
    </button>
  );
};
const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex items-center gap-1 text-sm">
        {trend === 'up' ? (
          <ArrowUpRight className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-500" />
        )}
        <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
          {change}%
        </span>
      </div>
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </motion.div>
);

const ApplicationCard = ({ application }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
          {application.company.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{application.company}</h3>
          <p className="text-gray-600 text-sm">{application.position}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${application.status === 'Offer' ? 'bg-green-100 text-green-700' :
          application.status === 'Interview' ? 'bg-yellow-100 text-yellow-700' :
            application.status === 'Applied' ? 'bg-blue-100 text-blue-700' :
              'bg-red-100 text-red-700'
          }`}>
          {application.status}
        </span>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <DollarSign className="w-4 h-4" />
        <span>{application.salary}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <MapPin className="w-4 h-4" />
        <span>{application.location}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
        <span>{application.appliedDate}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Globe className="w-4 h-4" />
        <span>{application.source}</span>
      </div>
    </div>

    <div className="p-3 bg-blue-50 rounded-lg">
      <p className="text-sm text-blue-700">
        <strong>Next Action:</strong> {application.nextAction}
      </p>
    </div>
  </motion.div>
);

const ProfileCard = ({ profile, onDelete }) => {

  const {
    profileName,
    updatedAt,
    firstName,
    lastName,
    totalExperienceInYears,
    experience,
    projects,
    skills,
    github,
    linkedin,
    _id // The unique ID for the delete function
  } = profile;

  const lastUpdated = new Date(updatedAt).toLocaleDateString("en-IN", {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 flex flex-col"
    >
      {/* --- Header --- */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{profileName}</h3>
          {/* Use flattened fields */}
          <p className="text-sm text-gray-600 capitalize">
            {`${firstName} ${lastName}`}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-500">Last Updated</p>
          <p className="text-xs font-medium text-gray-700">{lastUpdated}</p>
        </div>
      </div>

      {/* --- Key Stats --- */}
      <div className="grid grid-cols-3 gap-4 text-center my-4 py-4 border-y border-gray-200">
        <div>
          {/* Use flattened fields */}
          <p className="text-2xl font-bold text-blue-600">{totalExperienceInYears || 0}</p>
          <p className="text-xs text-gray-600">Years Exp.</p>
        </div>
        <div>
          {/* These arrays are still at the root, so this is correct */}
          <p className="text-2xl font-bold text-purple-600">{experience.length}</p>
          <p className="text-xs text-gray-600">Roles</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-600">{projects.length}</p>
          <p className="text-xs text-gray-600">Projects</p>
        </div>
      </div>

      {/* --- Top Skills --- */}
      <div className="mb-6 flex-grow">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Skills</h4>
        <div className="flex flex-wrap gap-2">
          {/* Use flattened skills array */}
          {skills && skills.slice(0, 4).map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {skill}
            </span>
          ))}
          {skills && skills.length > 4 && (
            <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-full">
              +{skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* --- Actions & Socials --- */}
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          {/* Use flattened social links */}
          {github && (
            <a href={github} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-gray-900 transition-colors"><Github className="w-5 h-5" /></a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-blue-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/edit-profile/${_id}`} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
            <Edit className="w-5 h-5" />
          </Link>
          <button onClick={() => onDelete(_id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userInitials, setUserInitials] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);


  useEffect(() => {
    const userDataString = localStorage.getItem('user');

    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const name = userData.name; // Get the name from the object

      if (name) {
        const nameParts = name.split(' ');
        const initials = (nameParts[0] ? nameParts[0][0] : '') + (nameParts.length > 1 ? nameParts[1][0] : '');
        setUserInitials(initials.toUpperCase());
      }
    }
  }, []); // The empty array [] ensures this runs only once

  useEffect(() => {
    const fetchUserProfiles = async () => {
      // Prevent refetch if loading
      if (isLoading) return;

      setIsLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.id) throw new Error("User not found. Please log in again.");
        const response = await api.get(`/profiles/getprofiles/${user.id}`);
        setProfiles(response.data);
      } catch (err) {
        console.error("Failed to fetch profiles:", err);
        // ✨ Use toast for fetch error feedback
        toast.error(err.message || "Could not load your profiles.");
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'profiles') {
      fetchUserProfiles();
    }
  }, [activeTab]); // Dependency array simplified for clarity


  // ✨ UPDATED: handleDeleteProfile with toast notifications
  const handleDeleteProfile = async (profileId) => {
    if (!window.confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
      return;
    }

    const originalProfiles = [...profiles];
    // Optimistically update UI
    setProfiles(prevProfiles => prevProfiles.filter(p => p._id !== profileId));

    try {
      await api.delete(`/profiles/deleteprofile/${profileId}`);
      // Show success toast
      toast.success('Profile deleted successfully!');
    } catch (err) {
      console.error("Failed to delete profile:", err);
      // Show error toast
      toast.error(err.response?.data?.message || "Could not delete profile.");
      // Revert UI on failure
      setProfiles(originalProfiles);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10  rounded-xl flex items-center justify-center">
                <Logo />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ProskAI Dashboard
                </h1>
                <p className="text-sm text-gray-600">Welcome back! Here's your job search overview.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications, companies..."
                  className="pl-10 pr-4 py-2 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-64"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              {userInitials && (
                <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center font-bold text-white">
                  {userInitials}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          transition={{ duration: 0.3 }}
          className="w-80 bg-white/80 backdrop-blur-sm border-r border-white/50 min-h-screen"
        >
          <div className="p-6">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'applications', label: 'Applications', icon: Briefcase },
                { id: 'profiles', label: 'Profiles', icon: User },
                { id: 'resume', label: 'Resume Optimizer', icon: FileText },
                { id: 'coverletter', label: 'Cover Letters', icon: PenTool },
                { id: 'analytics', label: 'Analytics', icon: PieChart },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-white/50'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8">

          {activeTab === 'profiles' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Profile Management</h2>
                  <p className="text-gray-600">Manage your professional profiles and resumes</p>
                </div>
                <Link to="/createprofile" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
                  <Plus className="w-5 h-5" />
                  Create New Profile
                </Link>
              </div>

              {isLoading && <p className="text-center text-gray-600 py-10">Loading your profiles...</p>}
              {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>}

              {!isLoading && !error && profiles.length > 0 && (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profiles.map((profile) => (
                    <ProfileCard key={profile._id} profile={profile} onDelete={handleDeleteProfile} />
                  ))}
                </motion.div>
              )}

              {!isLoading && !error && profiles.length === 0 && (
                <div className="text-center py-16 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300">
                  <User className="w-16 h-16 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-xl font-bold text-gray-800">No Profiles Yet</h3>
                  <p className="mt-2 text-gray-600">Click "Create New Profile" to get started.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'resume' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Resume Optimizer</h2>
                <p className="text-gray-600 text-lg">AI-powered resume enhancement coming soon...</p>
              </div>
            </motion.div>
          )}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Applications"
                  value={mockData.stats.totalApplications}
                  change="+12"
                  icon={Briefcase}
                  color="bg-gradient-to-r from-blue-500 to-blue-600"
                  trend="up"
                />
                <StatCard
                  title="Interviews"
                  value={mockData.stats.interviews}
                  change="+8"
                  icon={Calendar}
                  color="bg-gradient-to-r from-yellow-500 to-yellow-600"
                  trend="up"
                />
                <StatCard
                  title="Offers"
                  value={mockData.stats.offers}
                  change="+2"
                  icon={Award}
                  color="bg-gradient-to-r from-green-500 to-green-600"
                  trend="up"
                />
                <StatCard
                  title="Success Rate"
                  value={`${mockData.stats.successRate}%`}
                  change="+5.2"
                  icon={TrendingUp}
                  color="bg-gradient-to-r from-purple-500 to-purple-600"
                  trend="up"
                />
              </div>

              {/* Recent Applications */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    New Application
                  </button>
                </div>

                <div className="space-y-4">
                  {mockData.recentApplications.map((application) => (
                    <ApplicationCard key={application.id} application={application} />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Resume Optimizer</h3>
                      <p className="text-gray-600 text-sm">AI-powered resume enhancement</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Optimize your resume for specific job descriptions using our AI technology.
                  </p>
                  <button className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300">
                    Optimize Now
                  </button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <PenTool className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Cover Letter Builder</h3>
                      <p className="text-gray-600 text-sm">Generate tailored cover letters</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Create personalized cover letters that match job requirements.
                  </p>
                  <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                    Create Letter
                  </button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">AI Assistant</h3>
                      <p className="text-gray-600 text-sm">Get personalized job search advice</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Get AI-powered insights and recommendations for your job search.
                  </p>
                  <button className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300">
                    Ask AI
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'coverletter' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Cover Letter Builder</h2>
                <p className="text-gray-600 text-lg">AI-powered cover letter generation coming soon...</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
