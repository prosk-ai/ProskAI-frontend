import React, { useLayoutEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  PlayCircle,
  Chrome,
  FileText,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  Award,
  CircleArrowRight,
  Send,
  Rocket,
  Wand2,
  Star,
  Code,
  Briefcase,
  GraduationCap,
  Megaphone,
  Database,
  PenTool,
  Check,
} from "lucide-react";

// ASSETS - Make sure these paths are correct
import extensionVideo from "../assets/videos/extension.mp4";
import trackerVideo from "../assets/videos/applicationTracker.mp4";
import resumeVideo from "../assets/videos/resumeOptimizer.mp4";
import coverletterVideo from "../assets/videos/coverletterGenerator.mp4";
import heroBrowserMockup from "../assets/images/browser-mockup.png";
import Logo from "./Logo";

import harvardLogo from "../assets/images/svgs/Harvard_University_shield.svg.png";
import mitLogo from "../assets/images/svgs/MIT_logo.svg.png";
import stanfordLogo from "../assets/images/svgs/Stanford_Cardinal_logo.svg.png";
import cmuLogo from "../assets/images/svgs/Carnegie_Mellon_University_seal.svg.png";
import nyuLogo from "../assets/images/svgs/Nyu_short_color.svg.png";
import indianaLogo from "../assets/images/svgs/Indiana_University_logotype.svg.png";
import illinoisLogo from "../assets/images/svgs/University_of_Illinois_seal.svg.png";
import uwLogo from "../assets/images/svgs/Seal_of_the_University_of_Wisconsin.svg.png";
import tamuLogo from "../assets/images/svgs/Texas_A&M_University_logo.svg.png";
import asuLogo from "../assets/images/svgs/Arizona_State_University_seal.svg.png";
import berkeleyLogo from "../assets/images/svgs/Seal_of_University_of_California,_Berkeley.svg.png";
import michiganLogo from "../assets/images/svgs/University_of_Michigan_logo.svg.png";
import utAustinLogo from "../assets/images/svgs/University_of_Texas_at_Austin_seal.svg.png";
import ucsdLogo from "../assets/images/svgs/Seal_of_the_University_of_California,_San_Diego.svg.png";
import yaleLogo from "../assets/images/svgs/Yale_University_logo.svg.png";
import uscLogo from "../assets/images/svgs/University_of_Southern_California_seal.svg.png";
import cornellLogo from "../assets/images/svgs/cornell.png";
import upennLogo from "../assets/images/svgs/UPenn_shield_with_banner.svg.png";
import northwesternLogo from "../assets/images/svgs/Northwestern_University_seal.svg.png";
import purdueLogo from "../assets/images/svgs/Purdue_University_Northwest.svg.png";

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "One-Click Application",
    description:
      "Our intelligent Chrome extension effortlessly autofills your details across any job portal, liberating you from endless form filling.",
    icon: Chrome,
    video: extensionVideo,
    color: "gradient-to-br from-blue-500 to-cyan-500",
  },
  {
    title: "Unified Application Dashboard",
    description:
      "Gain complete clarity over your job hunt. Our intuitive dashboard tracks every application's status from submission to hire.",
    icon: TrendingUp,
    video: trackerVideo,
    color: "gradient-to-br from-purple-500 to-pink-500",
  },
  {
    title: "AI-Powered Resume Optimization",
    description:
      "Bypass ATS filters with confidence. Our AI tailors your resume to each job description, highlighting keywords that hiring managers seek.",
    icon: FileText,
    video: resumeVideo,
    color: "gradient-to-br from-green-500 to-emerald-500",
  },
  {
    title: "Instant Smart Cover Letters",
    description:
      "Generate compelling, personalized cover letters in seconds. Our AI crafts narratives that resonate with recruiters for every unique role.",
    icon: Wand2,
    video: coverletterVideo,
    color: "gradient-to-br from-yellow-500 to-orange-500",
  },
];

const testimonials = [
  {
    name: "Noah Evans",
    role: "Software Engineer",
    text: "ProskAI is a game-changer! It slashed my application time by 90% and I started getting interviews almost immediately.",
    avatar: "NE",
  },
  {
    name: "Olivia Chen",
    role: "Product Manager",
    text: "The resume optimizer is brilliant. It helped me craft a targeted resume that got past ATS and landed me my dream job!",
    avatar: "OC",
  },
  {
    name: "Liam Rodriguez",
    role: "Data Scientist",
    text: "Finally, a tool that truly streamlines the job search. Tracking everything in one place is invaluable.",
    avatar: "LR",
  },
  {
    name: "Emma Wilson",
    role: "Marketing Specialist",
    text: "The cover letter generator saves so much time, and the quality is surprisingly good. Highly recommend!",
    avatar: "EW",
  },
  {
    name: "Ethan Carter",
    role: "UX Designer",
    text: "I used to dread applying, but ProskAI made it effortless. The Chrome extension is pure magic.",
    avatar: "EC",
  },
  {
    name: "Sophia Taylor",
    role: "Project Manager",
    text: "From tracking to tailoring, ProskAI has it all. My job search went from overwhelming to organized.",
    avatar: "ST",
  },
];

const trustedRoles = [
  { title: "Managers", icon: Briefcase },
  { title: "Graduates", icon: GraduationCap },
  { title: "Marketers", icon: Megaphone },
  { title: "Analysts", icon: Database },
  { title: "Designers", icon: PenTool },
];

const universityLogos = [
  { src: harvardLogo, alt: "Harvard University" },
  { src: mitLogo, alt: "MIT" },
  { src: stanfordLogo, alt: "Stanford University" },
  { src: cmuLogo, alt: "Carnegie Mellon University" },
  { src: nyuLogo, alt: "NYU" },
  { src: indianaLogo, alt: "Indiana University" },
  { src: illinoisLogo, alt: "University of Illinois Urbana-Champaign" },
  { src: uwLogo, alt: "University of Washington" },
  { src: tamuLogo, alt: "Texas A&M University" },
  { src: asuLogo, alt: "Arizona State University" },
  { src: berkeleyLogo, alt: "UC Berkeley" },
  { src: michiganLogo, alt: "University of Michigan" },
  { src: utAustinLogo, alt: "University of Texas at Austin" },
  { src: ucsdLogo, alt: "UC San Diego" },
  { src: yaleLogo, alt: "Yale University" },
  { src: uscLogo, alt: "USC" },
  { src: cornellLogo, alt: "Cornell University" },
  { src: upennLogo, alt: "University of Pennsylvania" },
  { src: northwesternLogo, alt: "Northwestern University" },
  { src: purdueLogo, alt: "Purdue University" },
];

export default function Home() {
  const main = useRef();
  const headerRef = useRef(null);
  const featureSectionRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRefs = useRef([]);
  const featureTextRefs = useRef([]);
  const horizontalSectionRef = useRef(null);
  const horizontalContainerRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const heroImageY = useTransform(scrollYProgress, [0, 0.3], ["0%", "20%"]);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // --- Header Morphing ---
      gsap.to(headerRef.current, {
        backgroundColor: "rgba(13, 17, 23, 0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
        ease: "power1.out",
        scrollTrigger: {
          trigger: main.current,
          start: "top -100",
          end: "top -200",
          scrub: true,
        },
      });

      // --- GSAP Pinned Features Section Animation ---
      const videos = videoRefs.current;
      const featureTexts = featureTextRefs.current;

      ScrollTrigger.create({
        trigger: featureSectionRef.current,
        start: "top top",
        end: () =>
          `+=${featureSectionRef.current.offsetHeight - window.innerHeight}`,
        pin: videoContainerRef.current,
        anticipatePin: 1,
      });

      featureTexts.forEach((textEl, i) => {
        gsap.set(videos[i], { opacity: i === 0 ? 1 : 0 });

        ScrollTrigger.create({
          trigger: textEl,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              videos.forEach((video, index) => {
                gsap.to(video, {
                  opacity: index === i ? 1 : 0,
                  duration: 0.5,
                  ease: "power2.inOut",
                });
              });
            }
          },
        });
      });

      // --- FINAL Horizontal Scroll Logic ---
      const horizontalContainer = horizontalContainerRef.current;
      gsap.to(horizontalContainer, {
        x: () => -(horizontalContainer.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: horizontalSectionRef.current,
          start: "top top",
          end: () => `+=${horizontalContainer.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, main);
    return () => ctx.revert();
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const marqueeVariants = {
    animate: {
      x: ["0%", "-100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 25,
          ease: "linear",
        },
      },
    },
  };

  const pricingPlans = [
    {
      name: "Freemium",
      price: "$0",
      frequency: "/ forever",
      description: "For casual job seekers getting started.",
      features: [
        "5 AI-assisted applications per month",
        "Basic application tracking",
        "1 AI Resume scan per week",
        "2 AI Cover letter generations per week",
      ],
      cta: "Start for Free",
      isFeatured: false,
    },
    {
      name: "Prosk Pro",
      price: "$29",
      frequency: "/ month",
      description: "For serious job seekers who want an unfair advantage.",
      features: [
        "Unlimited AI-assisted applications",
        "Advanced application tracking & analytics",
        "Unlimited AI resume scans & optimizations",
        "Unlimited AI cover letter generation",
        "Priority support",
      ],
      cta: "Upgrade to Pro",
      isFeatured: true,
    },
    {
      name: "Prosk Ultra",
      price: "$49",
      frequency: "/ month",
      description: "For serious job seekers who want an unfair advantage.",
      features: [
        "Unlimited AI-assisted applications",
        "Advanced application tracking & analytics",
        "Unlimited AI resume scans & optimizations",
        "Unlimited AI cover letter generation",
        "Priority support",
      ],
      cta: "Upgrade to Pro",
      isFeatured: false,
    },
  ];

  return (
    <div
      ref={main}
      className="min-h-screen flex flex-col text-gray-200 bg-[#0D1117] overflow-x-hidden"
    >
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <header
        ref={headerRef}
        className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center justify-between px-6 py-4 w-[95%] max-w-5xl bg-gray-900/10 backdrop-blur-sm rounded-full z-50 border border-white/5 transition-all duration-300 ease-in-out"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <Logo />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden md:block">
            ProskAI
          </h1>
        </motion.div>
        <nav className="hidden md:flex space-x-8 text-gray-300 font-medium">
          {["Features", "How It Works", "Testimonials", "Pricing"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, "")}`}
                className="hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            )
          )}
        </nav>
        <motion.a
          href="/Dashboard"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 20px rgba(78, 99, 255, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full font-semibold transition-all duration-300 hover:from-blue-700 hover:to-purple-800 text-sm shadow-md"
        >
          Get Started
        </motion.a>
      </header>

      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 md:px-10 py-32 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-2xl max-h-2xl bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-2xl max-h-2xl rounded-full mix-blend-screen animate-hero-orb-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(78, 99, 255, 0.4) 0%, rgba(135, 50, 255, 0.3) 50%, transparent 100%)",
          }}
        ></motion.div>

        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">
              Your AI-Powered Career Copilot
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight max-w-4xl"
          >
            Land Your Dream Job <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              10x Faster
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl"
          >
            Automate applications, optimize your resume, and track every
            opportunity with one intelligent platform. Stop the grind, start
            interviewing.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0 0 25px rgba(78, 99, 255, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-blue-500/20 flex items-center gap-3"
            >
              Try ProskAI Free <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0 0 25px rgba(255, 255, 255, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              className="border border-white/20 text-white px-8 py-4 rounded-full font-semibold bg-white/5 backdrop-blur-sm flex items-center gap-3"
            >
              Watch Demo <PlayCircle className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "anticipate" }}
          style={{ y: heroImageY }}
          className="relative z-0 mt-20 w-full max-w-5xl"
        >
          <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-[#0D1117] to-transparent"></div>
          <img
            src={heroBrowserMockup}
            alt="ProskAI Dashboard Mockup"
            className="w-full h-auto drop-shadow-2xl"
          />
        </motion.div>
      </section>

      <section className="py-20 px-4 md:px-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gray-400 text-lg mb-12 font-medium"
        >
          Built for ambitious talent in every field.
        </motion.p>

        {/* 👇 THIS IS THE LINE THAT CHANGED (removed justify-center) 👇 */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center opacity-70">
          {trustedRoles.map((role, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="flex flex-col items-center gap-3 text-gray-400"
            >
              <role.icon className="w-10 h-10" />
              <span className="font-semibold">{role.title}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-gray-400 text-lg mb-12 font-medium px-4"
        >
          Used by students and graduates from the world's leading universities.
        </motion.p>

        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
          <motion.div
            className="flex whitespace-nowrap"
            variants={{
              animate: {
                x: [0, "-100%"],
                transition: {
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 25, // Adjust duration to control speed
                    ease: "linear",
                  },
                },
              },
            }}
            animate="animate"
          >
            {/* We duplicate the array to create a seamless loop */}
            {[...universityLogos, ...universityLogos].map((logo, i) => (
              <div
                key={i}
                className="flex-shrink-0  flex items-center justify-center"
                style={{ width: "200px" }}
              >
                {/* 👇 THIS IS THE ONLY LINE THAT CHANGED 👇 */}
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-20 w-auto transition-transform duration-300 hover:scale-110"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-900/20 border-y border-white/10 my-20 overflow-hidden">
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            variants={marqueeVariants}
            animate="animate"
          >
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex items-center gap-12 px-6">
                <span className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  AI-Powered Efficiency
                </span>
                <CircleArrowRight className="text-white/50 w-10 h-10 md:w-16 md:h-16 flex-shrink-0" />
                <span className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Smart Application Tracking
                </span>
                <CircleArrowRight className="text-white/50 w-10 h-10 md:w-16 md:h-16 flex-shrink-0" />
                <span className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Resume & Cover Letter AI
                </span>
                <CircleArrowRight className="text-white/50 w-10 h-10 md:w-16 md:h-16 flex-shrink-0" />
                <span className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                  Land Your Dream Job
                </span>
                <CircleArrowRight className="text-white/50 w-10 h-10 md:w-16 md:h-16 flex-shrink-0" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        ref={featureSectionRef}
        id="features"
        className="relative py-32 flex flex-col lg:flex-row justify-between items-start gap-16 max-w-7xl mx-auto px-4 md:px-10"
      >
        <div
          ref={videoContainerRef}
          className="lg:w-1/2 h-screen w-full flex items-center justify-center"
        >
          <div className="relative w-full max-w-2xl h-[400px] lg:h-[500px] bg-gray-900/50 rounded-2xl border border-white/10 shadow-2xl overflow-hidden group transform lg:-translate-y-16">
            {features.map((feature, i) => (
              <React.Fragment key={feature.title}>
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={feature.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                />
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col pt-16">
          {features.map((feature, i) => (
            <div
              key={i}
              ref={(el) => (featureTextRefs.current[i] = el)}
              className="min-h-[90vh] flex flex-col justify-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 p-6 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ▼▼▼ WRAPPER DIV STARTS HERE TO FIX OVERLAP ▼▼▼ */}
      <div>
        <section
          ref={horizontalSectionRef}
          id="howitworks"
          className="py-32 bg-gray-900/10 relative z-10 overflow-hidden"
        >
          <div className="text-center mb-20 px-4">
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold mb-6 text-white"
            >
              Your Path to Success in 3 Simple Steps
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-400 text-xl max-w-2xl mx-auto"
            >
              Revolutionize your job search. Easy setup, powerful results.
            </motion.p>
          </div>

          <div className="relative w-full h-[600px] flex items-center">
            <div
              ref={horizontalContainerRef}
              className="flex flex-nowrap h-full"
            >
              {[
                {
                  title: "1. Install & Integrate",
                  desc: "Seamlessly add our Chrome extension, sign up, and connect your profiles. Get ready in minutes.",
                  icon: Code,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  title: "2. One-Click Apply",
                  desc: "Browse any job board, and let ProskAI intelligently autofill forms and track your applications instantly.",
                  icon: Send,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  title: "3. Optimize & Dominate",
                  desc: "Leverage AI to refine your resume and cover letter, gaining a critical edge in every application.",
                  icon: Rocket,
                  color: "from-green-500 to-emerald-500",
                },
                {
                  title: "4. Track & Conquer",
                  desc: "Monitor all your applications, interviews, and offers in one centralized, intuitive dashboard.",
                  icon: Award,
                  color: "from-yellow-500 to-orange-500",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="horizontal-panel w-[70vw] flex-shrink-0 flex items-center justify-center px-4 md:px-10"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ amount: 0.8, once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="p-10 text-center bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300"
                  >
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-8`}
                    >
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="text-3xl font-bold mb-4 text-white">
                      {step.title}
                    </h4>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {step.desc}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="testimonials"
          className="py-32 px-4 md:px-10 overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h3 className="text-5xl font-bold mb-6 text-white">
              Our Users Say It Best
            </h3>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Real stories from professionals who landed their dream jobs with
              ProskAI.
            </p>
          </motion.div>
          {/* This is the new parent div for the bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                // This conditional logic creates the bento grid structure
                className={`p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl ${i === 0 || i === 3
                    ? "md:col-span-4"
                    : i === 1 || i === 2
                      ? "md:col-span-2"
                      : "md:col-span-3"
                  }`}
                initial={{ opacity: 0, y: 50, rotateY: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  rotateY: 0,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              >
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-300 italic text-lg mb-6 text-center">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-blue-400 font-medium text-sm">
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      {/* ▲▲▲ WRAPPER DIV ENDS HERE ▲▲▲ */}

      {/* ✨ NEW: PRICING SECTION JSX */}
      <section id="pricing" className="py-32 px-4 md:px-10">
        <div className="text-center mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-6 text-white"
          >
            Simple, Transparent Pricing
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto"
          >
            Start for free and upgrade when you're ready to supercharge your job
            search.
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-start">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className={`p-8 rounded-3xl border transition-all duration-300 h-full flex flex-col ${plan.isFeatured
                  ? "bg-white/10 backdrop-blur-xl border-purple-500 shadow-2xl shadow-purple-500/10"
                  : "bg-white/5 backdrop-blur-md border-white/10"
                }`}
            >
              {plan.isFeatured && (
                <div className="text-center mb-4">
                  <span className="px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <h4 className="text-3xl font-bold text-white text-center">
                {plan.name}
              </h4>
              <p className="text-center text-gray-400 mt-2 mb-6">
                {plan.description}
              </p>
              <div className="text-center my-4">
                <span className="text-5xl font-extrabold text-white">
                  {plan.price}
                </span>
                <span className="text-gray-400 text-lg">{plan.frequency}</span>
              </div>
              <ul className="space-y-4 my-8 text-gray-300 flex-grow">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-4 rounded-full font-bold text-lg mt-auto transition-all duration-300 ${plan.isFeatured
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-white/10 text-white hover:bg-white/20"
                  }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 px-4 md:px-10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center p-12 md:p-16 bg-gradient-to-br from-blue-700/40 via-purple-700/40 to-pink-700/40 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10"
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Ready to Revolutionize Your Job Hunt?
            </h3>
            <p className="text-gray-200 text-xl mb-10 max-w-xl mx-auto">
              Join thousands of job seekers who are getting ahead with ProskAI.
              Sign up for free, no credit card required.
            </p>
            <motion.button
              whileHover={{
                scale: 1.05,
                y: -2,
                boxShadow: "0 0 30px rgba(255, 255, 255, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-900 px-12 py-5 rounded-full font-extrabold text-xl shadow-lg hover:bg-gray-200 transition-all duration-300"
            >
              Start Winning Today
            </motion.button>
          </motion.div>
        </div>
      </section>

      <footer className="relative bg-gray-900/50 border-t border-white/10 py-20 px-4 md:px-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-white">ProskAI</h4>
            </div>
            <p className="text-gray-400 max-w-md">
              Apply smarter, not harder. Your AI co-pilot for the perfect career
              move.
            </p>
          </div>
          <div>
            <h5 className="text-lg font-bold text-white mb-4">Product</h5>
            <ul className="space-y-3 text-gray-400">
              {["Features", "Pricing", "Chrome Extension"].map((item) => (
                <li key={item}>
                  {/* The href is now dynamic and valid */}
                  <a
                    href={`#${item.toLowerCase().replace(/\s/g, "")}`}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-bold text-white mb-4">Support</h5>
            <ul className="space-y-3 text-gray-400">
              {["Help Center", "FAQ", "Contact Us"].map((item) => (
                <li key={item}>
                  {/* For external links, use a real path like "/contact" */}
                  <a
                    href={`/${item.toLowerCase().replace(/\s/g, "-")}`}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 mt-12 text-center text-gray-500">
          <p>© {new Date().getFullYear()} ProskAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
