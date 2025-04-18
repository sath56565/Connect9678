"use client";

import { SignIn } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, Menu, X, MessageSquare, Video,
  User, Shield, Hash, Headphones, Github,
  Twitter, Facebook, Instagram, Youtube, Volume2, Moon, Sun, Bell
} from "lucide-react";
import Image from 'next/image';

export default function Page() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Particle effect initialization
  useEffect(() => {
    if (!mounted) return;
    
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer) return;
    
    let particleInterval: NodeJS.Timeout;
    
    const createParticle = () => {
      if (!particlesContainer) return;
      
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = Math.random() * window.innerHeight + 'px';
      particle.style.animationDelay = Math.random() * 5 + 's';
      
      particlesContainer.appendChild(particle);
      
      setTimeout(() => {
        if (particle && particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 8000);
    };

    // Start creating particles
    particleInterval = setInterval(createParticle, 200);
    
    // Cleanup function
    return () => {
      if (particleInterval) {
        clearInterval(particleInterval);
      }
      
      // Clean up any existing particles
      if (particlesContainer) {
        while (particlesContainer.firstChild) {
          particlesContainer.removeChild(particlesContainer.firstChild);
        }
      }
    };
  }, [mounted]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show-element');
          }
        });
      },
      { threshold: 0.1 }
    );

    const hiddenElements = document.querySelectorAll('.hidden-element');
    hiddenElements.forEach((el) => observer.observe(el));

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-connect" />,
      title: "Text Chat",
      description: "Send messages, share files, and stay connected with friends and communities."
    },
    {
      icon: <Video className="w-6 h-6 text-connect-purple" />,
      title: "Video Calls",
      description: "Crystal clear video calls with screen sharing for presentations and gaming."
    },
    {
      icon: <Headphones className="w-6 h-6 text-connect" />,
      title: "Voice Channels",
      description: "High-quality voice chat for gaming, studying, or just hanging out."
    },
    {
      icon: <Hash className="w-6 h-6 text-connect-purple" />,
      title: "Organized Channels",
      description: "Create dedicated channels for every topic with our unique sub-channel system."
    },
    {
      icon: <User className="w-6 h-6 text-connect" />,
      title: "Communities",
      description: "Join communities based on your interests, hobbies, or professional needs."
    },
    {
      icon: <Shield className="w-6 h-6 text-connect-purple" />,
      title: "Secure Platform",
      description: "End-to-end encryption and robust moderation tools for a safe environment."
    }
  ];

  return (signIn ? <SignIn /> :
    <div className={`h-screen w-screen ${isDarkMode ? 'dark' : ''}`}>
      <div id="particles-js" className="fixed inset-0 pointer-events-none"></div>
      <div className="min-h-screen bg-background dark:bg-gray-900 transition-colors duration-200">
        {/* Navbar */}
        <header className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-3 shadow-lg" : "bg-transparent py-5"
        }`}>
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-between">
              {/* Logo */}
              <a href="#" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300 opacity-50"></div>
                  <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300">
                    <span className="text-white font-bold text-xl">C</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Connect</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Community Platform</span>
                </div>
              </a>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                <a href="#features" className="nav-link px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">Features</a>
                <a href="#sub-channels" className="nav-link px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">Sub-Channels</a>
                <a href="#group-chat" className="nav-link px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">Group Chat</a>
                <a href="#video-calls" className="nav-link px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">Video Calls</a>
                <a href="#support" className="nav-link px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">Support</a>
              </div>

              {/* Desktop CTA Buttons */}
              <div className="hidden md:flex items-center gap-3">
                <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <button 
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                <button onClick={()=>setSignIn(true)} 
                  className="px-5 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                  Log in
                </button>
                <button onClick={()=>setSignIn(true)}
                  className="px-5 py-2 text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </nav>

            {/* Mobile Navigation */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen 
                ? "max-h-[400px] opacity-100 mt-4" 
                : "max-h-0 opacity-0 pointer-events-none"
            }`}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-4">
                <div className="space-y-3">
                  <a href="#features" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Features</a>
                  <a href="#sub-channels" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Sub-Channels</a>
                  <a href="#group-chat" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Group Chat</a>
                  <a href="#video-calls" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Video Calls</a>
                  <a href="#support" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Support</a>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <button onClick={()=>setSignIn(true)}
                    className="w-full px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center">
                    Log in
                  </button>
                  <button onClick={()=>setSignIn(true)}
                    className="w-full px-4 py-2 text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:shadow-lg dark:hover:shadow-blue-900/30 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen bg-white dark:bg-gray-900 pt-24 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
          
          {/* Floating elements */}
          <div className="absolute top-40 right-20 animate-float-slow">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl"></div>
          </div>
          <div className="absolute bottom-40 left-20 animate-float-slow delay-500">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-white/10 shadow-xl"></div>
          </div>
          
          <div className="container mx-auto px-4 py-20 flex flex-col items-center relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-block mb-6 py-2 px-4 bg-blue-50 border border-blue-100 rounded-full animate-fade-in">
                <p className="text-sm md:text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  The next generation communication platform
                </p>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent animate-fade-in-up">
                Where Conversations <br/>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Flourish
                </span> in Organized Spaces
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                Connect brings people together through voice, video, and text. Create communities, find your tribe, and make your conversations more organized than ever before.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up delay-300">
                <button onClick={()=>setSignIn(true)} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-xl flex items-center justify-center group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-full text-lg font-medium border-2 border-gray-200 transition-all duration-200 transform hover:scale-105 hover:shadow-xl flex items-center justify-center">
                  Watch Demo
                  <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
                  </svg>
                </button>
              </div>

              {/* Platform Preview */}
              <div className="relative max-w-5xl mx-auto animate-fade-in-up delay-400">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl transform rotate-1 scale-105 opacity-10 blur-2xl"></div>
                <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-2 shadow-2xl">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-700">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <Image 
                      src="https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=2662"
                      alt="Connect platform interface preview"
                      width={500}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up delay-500">
              <div className="flex items-center justify-center gap-6 px-8 py-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <Image 
                        src={`https://i.pravatar.cc/100?img=${i+10}`} 
                        alt="User avatar" 
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">Join millions</p>
                  <p className="text-sm text-gray-500">of active users</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 px-8 py-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">4.9/5 rating</p>
                  <p className="text-sm text-gray-500">from 10k+ reviews</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 px-8 py-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">Enterprise Ready</p>
                  <p className="text-sm text-gray-500">ISO 27001 certified</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 hidden-element">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Everything You Need to <span className="text-blue-600 dark:text-blue-400">Connect</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A complete communication platform designed for groups of all sizes, from small teams to global communities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hidden-element"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 shadow-md flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=2662')] opacity-10 mix-blend-overlay"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Start Organizing Your Conversations Today
              </h2>
              
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
                Join millions of users who trust Connect for their communities, teams, and friend groups.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button onClick={()=>setSignIn(true)} className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-50 rounded-full text-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-xl flex items-center justify-center group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button className="px-8 py-4 bg-transparent hover:bg-white/10 text-white border-2 border-white/20 rounded-full text-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-xl flex items-center justify-center">
                  Contact Sales
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>

              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-white mb-2">10M+</h3>
                  <p className="text-white/80">Active Users</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-white mb-2">150+</h3>
                  <p className="text-white/80">Countries</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-white mb-2">99.9%</h3>
                  <p className="text-white/80">Uptime</p>
                </div>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-white mb-2">24/7</h3>
                  <p className="text-white/80">Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Channels Feature Section */}
        <section className="py-24 bg-[#F8F9FE] dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute -left-40 top-20 w-96 h-96 bg-blue-400/5 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -right-40 bottom-20 w-96 h-96 bg-connect-purple/5 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              {/* Left Content */}
              <div className="flex-1 max-w-xl">
                <div className="inline-block mb-6 py-1.5 px-4 bg-blue-300 dark:bg-blue-900 rounded-full">
                  <p className="text-sm font-medium text-connect dark:text-blue-300">Unique Feature</p>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
                  Organize with <span className="bg-blue-500 from-connect to-connect-purple dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Sub-Channels</span>
                </h2>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                  Connect&apos;s revolutionary sub-channel system helps you organize conversations by topic, making it easy to find what you&apos;re looking for.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center shrink-0">
                      <Hash className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Create unlimited sub-channels</h3>
                      <p className="text-gray-600 dark:text-gray-300">Create as many sub-channels as you need within any channel</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 dark:bg-indigo-700 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 4L4 9L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 20V13C20 11.9391 19.5786 10.9217 18.8284 10.1716C18.0783 9.42143 17.0609 9 16 9H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Clean navigation</h3>
                      <p className="text-gray-600 dark:text-gray-300">Collapsible hierarchy for better organization</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Custom permissions</h3>
                      <p className="text-gray-600 dark:text-gray-300">Set specific permissions for each sub-channel</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Content - Channel Structure Visualization */}
              <div className="flex-1 w-full max-w-xl">
                <div className="bg-[#1E1F22] dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
                  <div className="text-[15px] font-mono">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5 text-gray-300 dark:text-gray-400">
                        <Hash className="w-5 h-5 opacity-60" /> 
                        <span className="font-medium">Server</span>
                      </div>

                      <div className="ml-3 border-l-2 border-gray-700 dark:border-gray-600 space-y-3 pl-4">
                        <div>
                          <div className="flex items-center gap-2.5 text-white">
                            <Hash className="w-5 h-5" /> 
                            <span className="font-medium">Channel-1</span>
                          </div>

                          <div className="ml-3 border-l-2 border-gray-700 dark:border-gray-600 space-y-3 pl-4 mt-3">
                            <div>
                              <div className="flex items-center gap-2.5 text-gray-300 dark:text-gray-400">
                                <Hash className="w-5 h-5" /> 
                                <span>Sub-Channel-1</span>
                              </div>
                              <div className="ml-3 border-l-2 border-gray-700 dark:border-gray-600 pl-4 mt-2">
                                <div className="flex items-center gap-2.5 text-gray-400 dark:text-gray-500">
                                  <MessageSquare className="w-4 h-4" /> 
                                  <span className="opacity-60">Group-Chat</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center gap-2.5 text-gray-300 dark:text-gray-400">
                                <Hash className="w-5 h-5" /> 
                                <span>Sub-Channel-2</span>
                              </div>
                              <div className="ml-3 border-l-2 border-gray-700 dark:border-gray-600 pl-4 mt-2">
                                <div className="flex items-center gap-2.5 text-gray-400 dark:text-gray-500">
                                  <MessageSquare className="w-4 h-4" /> 
                                  <span className="opacity-60">Group-Chat</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2.5 text-white">
                            <Hash className="w-5 h-5" /> 
                            <span className="font-medium">Channel-2</span>
                          </div>

                          <div className="ml-3 border-l-2 border-gray-700 dark:border-gray-600 space-y-3 pl-4 mt-3">
                            <div>
                              <div className="flex items-center gap-2.5 text-gray-300 dark:text-gray-400">
                                <Hash className="w-5 h-5" /> 
                                <span>Sub-Channel-1</span>
                              </div>
                              <div className="ml-3 border-l-2 border-gray-700 dark:border-gray-600 pl-4 mt-2">
                                <div className="flex items-center gap-2.5 text-gray-400 dark:text-gray-500">
                                  <MessageSquare className="w-4 h-4" /> 
                                  <span className="opacity-60">Group-Chat</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Group Chat Feature Section */}
        <section id="group-chat" className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute -right-40 top-20 w-96 h-96 bg-blue-400/5 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
              {/* Left Content */}
              <div className="flex-1 max-w-xl">
                <div className="inline-block mb-6 py-1.5 px-4 bg-blue-300 dark:bg-blue-900 rounded-full">
                  <p className="text-sm font-medium text-connect dark:text-blue-300">Community Feature</p>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
                  Advanced <span className="bg-blue-500 dark:bg-blue-400 bg-clip-text text-transparent">Group Chat</span>
                </h2>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                  Connect&apos;s unique chat takes community conversation to the next level with rich features designed for meaningful interactions.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Rich text formatting</h3>
                      <p className="text-gray-600 dark:text-gray-300">Express yourself with code blocks, embeds, and markdown</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 dark:bg-indigo-700 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 10h18M3 14h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Thread organization</h3>
                      <p className="text-gray-600 dark:text-gray-300">Keep conversations organized with thread replies</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Powerful search</h3>
                      <p className="text-gray-600 dark:text-gray-300">Find any message or media instantly</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Content - Image for Group Chat */}
              <div className="flex-1 w-full max-w-xl">
                <div className="rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-900/50">
                  <Image 
                    src="https://www.chanty.com/blog/wp-content/uploads/2024/04/Chanty-video-call-1024x675.jpg"
                    alt="Advanced group chat interface showing rich text formatting and threads"
                    width={500}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Voice Channels Feature Section */}
        <section id="voice-channels" className="py-24 bg-[#F8F9FE] dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute -left-40 top-20 w-96 h-96 bg-blue-400/5 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              {/* Left Content */}
              <div className="flex-1 max-w-xl">
                <div className="inline-block mb-6 py-1.5 px-4 bg-blue-300 dark:bg-blue-900 rounded-full">
                  <p className="text-sm font-medium text-connect dark:text-blue-300">Voice Feature</p>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
                  Crystal Clear <span className="bg-blue-500 dark:bg-blue-400 bg-clip-text text-transparent">Voice Channels</span>
                </h2>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                  Connect offers high-quality voice communication designed for gaming, studying, or just hanging out with friends.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center shrink-0">
                      <Volume2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">High-quality audio</h3>
                      <p className="text-gray-600 dark:text-gray-300">Low latency, high-definition audio quality</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 dark:bg-indigo-700 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M19 12h2M3 12h2M12 19v2M12 3v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Noise suppression</h3>
                      <p className="text-gray-600 dark:text-gray-300">Advanced noise cancellation for crystal clear voice</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center shrink-0">
                      <Headphones className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Voice activity</h3>
                      <p className="text-gray-600 dark:text-gray-300">Smart voice detection and push-to-talk options</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Content - Image for Voice Channels */}
              <div className="flex-1 w-full max-w-xl">
                <div className="rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 p-12">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-48 h-48 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
                    <Image 
                      src="https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&auto=format&fit=crop&q=60"
                      alt="Professional microphone representing high-quality voice channels"
                      width={500}
                      height={300}
                      className="relative z-10 w-full h-auto max-w-md mx-auto drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Calls Feature Section */}
        <section id="video-calls" className="py-24 bg-[#F8F9FE] dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute -right-40 bottom-20 w-96 h-96 bg-blue-400/5 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
              {/* Left Content */}
              <div className="flex-1 max-w-xl">
                <div className="inline-block mb-6 py-1.5 px-4 bg-blue-300 dark:bg-blue-900 rounded-full">
                  <p className="text-sm font-medium text-connect dark:text-blue-300">Video Feature</p>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900 dark:text-white">
                  Face-to-Face <span className="bg-blue-500 dark:bg-blue-400 bg-clip-text text-transparent">Video Calls</span>
                </h2>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                  Connect&apos;s video calls bring you closer to your friends, family, and team members with high-quality video and screen sharing.
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center shrink-0">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">HD video quality</h3>
                      <p className="text-gray-600 dark:text-gray-300">Adaptive quality for all connections</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 dark:bg-indigo-700 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 3H4a2 2 0 00-2 2v5m0 4v5a2 2 0 002 2h5m4 0h5a2 2 0 002-2v-5m0-4V5a2 2 0 00-2-2h-5" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Screen sharing</h3>
                      <p className="text-gray-600 dark:text-gray-300">Share your screen with annotation tools</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Background effects</h3>
                      <p className="text-gray-600 dark:text-gray-300">Blur or use virtual backgrounds</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Content - Image for Video Calls */}
              <div className="flex-1 w-full max-w-xl">
                <div className="rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-900/50">
                  <Image 
                    src="https://www.colourmylearning.com/wp-content/uploads/2020/03/group-video-calls-SQ.jpg"
                    alt="Video conference interface showing multiple participants in a grid layout"
                    width={500}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-200 dark:bg-gray-800 pt-16 pb-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
              <div className="lg:col-span-2">
                <a href="#" className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-blue-400 dark:bg-blue-600 rounded-full bg-gradient-to-br from-connect to-connect-purple dark:from-blue-500 dark:to-purple-500 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Connect</span>
                </a>
                <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-sm">
                  The modern communication platform designed to bring people together through organized conversations.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-connect dark:hover:text-blue-400 transition-colors">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-connect dark:hover:text-blue-400 transition-colors">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-connect dark:hover:text-blue-400 transition-colors">
                    <Instagram size={20} />
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-connect dark:hover:text-blue-400 transition-colors">
                    <Youtube size={20} />
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-connect dark:hover:text-blue-400 transition-colors">
                    <Github size={20} />
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400">Download</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400">Nitro</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400">Status</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400">App Directory</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400">About</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400">Jobs</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400">Brand</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400">News</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400">Help Center</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400">Community</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400">Safety</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400">Support</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
                  &copy; {new Date().getFullYear()} Connect, Inc. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400 text-sm">Terms</a>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400 text-sm">Privacy</a>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400 text-sm">Cookies</a>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400 text-sm">Guidelines</a>
                  <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-connect dark:hover:text-blue-400 text-sm">Acknowledgements</a>
                </div>
              </div>
            </div>
          </div>
        </footer>

        <style jsx>{`
          .text-gradient {
            background: linear-gradient(to right, #06B6D4, #8B5CF6);
            -webkit-background-clip: text;
            color: transparent;
          }
          .feature-card {
            background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.3));
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease-in-out;
            border-radius: 1rem;
            padding: 1.5rem;
            height: 100%;
          }
          .feature-card:hover {
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
            transform: translateY(-5px);
          }
          .nav-link {
            position: relative;
            white-space: nowrap;
          }
          
          .nav-link::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            width: 0;
            height: 2px;
            background: linear-gradient(to right, #2563eb, #4f46e5);
            transition: all 0.3s ease;
            transform: translateX(-50%);
            opacity: 0;
          }
          
          .nav-link:hover::after {
            width: 100%;
            opacity: 1;
          }
          .hidden-element {
            opacity: 0;
            filter: blur(1px);
            transform: translateY(20px);
            transition: all 0.7s ease;
          }
          .show-element {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
          @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fade-in-up {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-float-slow {
            animation: float-slow 6s ease-in-out infinite;
          }
          .animate-fade-in {
            animation: fade-in 1s ease-out forwards;
          }
          .animate-fade-in-up {
            opacity: 0;
            animation: fade-in-up 1s ease-out forwards;
          }
          .delay-200 {
            animation-delay: 200ms;
          }
          .delay-300 {
            animation-delay: 300ms;
          }
          .delay-400 {
            animation-delay: 400ms;
          }
          .delay-500 {
            animation-delay: 500ms;
          }
          .delay-1000 {
            animation-delay: 1000ms;
          }

          /* Dark mode styles */
          .dark {
            color-scheme: dark;
          }
          
          .dark .nav-link {
            color: rgba(255, 255, 255, 0.7);
          }
          
          .dark .nav-link:hover {
            color: rgba(255, 255, 255, 0.9);
          }

          .dark .particle {
            background: rgba(255, 255, 255, 0.1);
          }

          /* Add dark mode transitions */
          * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
          }
        `}</style>
      </div>
    </div>
  );
}






