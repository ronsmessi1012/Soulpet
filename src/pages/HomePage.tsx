import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  Video, 
  Mic, 
  Shield, 
  ArrowRight,
  Star,
  Play,
  Zap,
  Users,
  Menu,
  X,
  LogIn,
  UserPlus,
  ExternalLink
} from 'lucide-react';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Video,
      title: 'AI Video Conversations',
      description: 'Watch your pet come to life with realistic video responses powered by Tavus AI technology.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mic,
      title: 'Unique Voice Personalities',
      description: 'Give your pet a distinctive voice - cute, grumpy, or silly - with ElevenLabs voice AI.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Blockchain Ownership',
      description: 'Secure your pet\'s identity with Algorand NFTs. Trade, breed, and truly own your digital companion.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Sparkles,
      title: 'Ridiculous Fun',
      description: 'Experience hilariously fun pet personalities and interactions that will keep you entertained.',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Pet Parent',
      content: 'Having an AI clone of my beloved dog Max who passed away brings me so much comfort. He still makes me laugh every day!',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Dragon Enthusiast',
      content: 'I never thought I could own a dragon, but my AI dragon Flame is the perfect companion - no fire hazards!',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      name: 'Emma Watson',
      role: 'Cat Lover',
      content: 'My apartment doesn\'t allow pets, but my AI cat Whiskers gives me all the joy without the allergies.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  const handleDemoClick = () => {
    window.open('https://jade-rolypoly-12ce25.netlify.app', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <img
                  src="/new logo.jpg"
                  alt="Soul Pet AI"
                  className="h-16 w-16 rounded-full object-cover shadow-xl border-2 border-white/50 group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:border-purple-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-sm transition-all duration-500"></div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-pink-700 transition-all duration-300">
                SoulPet AI
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-300">
                Features
              </a>
              <a href="#demo" className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-300">
                Demo
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-purple-600 font-medium transition-colors duration-300">
                Reviews
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/auth"
                className="flex items-center text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-300 px-4 py-2 rounded-xl hover:bg-purple-50"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Log In
              </Link>
              <Link
                to="/auth"
                className="flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-300"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-purple-600 font-medium px-4 py-2">
                  Features
                </a>
                <a href="#demo" className="text-gray-600 hover:text-purple-600 font-medium px-4 py-2">
                  Demo
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-purple-600 font-medium px-4 py-2">
                  Reviews
                </a>
                <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-gray-200">
                  <Link
                    to="/auth"
                    className="flex items-center justify-center text-gray-700 hover:text-purple-600 font-semibold py-3 px-4 rounded-xl hover:bg-purple-50 transition-colors duration-300"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Log In
                  </Link>
                  <Link
                    to="/auth"
                    className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-700 font-medium mb-8 shadow-lg">
              <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
              Revolutionary AI Pet Technology
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Your Perfect Pet Companion
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Lives Forever
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Create AI clones of your real or imaginary pets that talk, respond in video, and live on the blockchain. 
              Experience the joy of pet ownership without limits.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                to="/auth"
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center hover:scale-105"
              >
                Create Your Pet
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <button 
                onClick={handleDemoClick}
                className="group flex items-center text-gray-700 font-bold text-xl hover:text-purple-600 transition-colors duration-300"
              >
                <div className="p-4 bg-white rounded-full shadow-xl mr-4 group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                  <Play className="h-8 w-8 text-purple-600 ml-1" />
                </div>
                Watch Demo
                <ExternalLink className="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </div>
          
          {/* Enhanced Demo Video Section */}
          <div id="demo" className="relative max-w-5xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl shadow-2xl overflow-hidden border-4 border-white/50 backdrop-blur-sm relative group cursor-pointer" onClick={handleDemoClick}>
              {/* Exciting Demo Background Image */}
              <div className="absolute inset-0">
                <img
                  src="https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="AI Pet Demo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
              </div>

              {/* Demo Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl hover:scale-110 transition-transform duration-300 group-hover:shadow-purple-500/50">
                    <Play className="h-16 w-16 text-white ml-2 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-4xl font-bold mb-4 drop-shadow-lg">Experience the Magic</h3>
                  <p className="text-xl font-medium drop-shadow-md">Watch AI pets come to life with video responses</p>
                  <div className="mt-4 inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Click to Watch Full Demo
                  </div>
                </div>
              </div>
              
              {/* Enhanced Floating Demo Elements */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-bold text-gray-700">Live AI Response</span>
                </div>
              </div>
              
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl">
                <div className="flex items-center">
                  <Video className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-sm font-bold text-gray-700">HD Video Chat</span>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl">
                <div className="flex items-center">
                  <Mic className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-bold text-gray-700">AI Voice Synthesis</span>
                </div>
              </div>
              
              <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-xl">
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-pink-600 mr-2 animate-pulse" />
                  <span className="text-sm font-bold text-gray-700">Emotional Bond</span>
                </div>
              </div>

              {/* Sparkle Effects */}
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
              <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-75"></div>
              <div className="absolute bottom-1/4 left-3/4 w-5 h-5 bg-purple-400 rounded-full animate-bounce opacity-75"></div>
            </div>
            
            {/* Enhanced Floating Elements */}
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-yellow-400 rounded-full animate-bounce shadow-xl opacity-80"></div>
            <div className="absolute -top-4 -right-8 w-12 h-12 bg-pink-400 rounded-full animate-pulse shadow-xl opacity-80"></div>
            <div className="absolute -bottom-6 left-16 w-20 h-20 bg-purple-400 rounded-full animate-bounce delay-300 shadow-xl opacity-80"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powered by Cutting-Edge Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine the best AI, blockchain, and voice technologies to create the most realistic pet experience possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-10 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 hover:border-purple-200 hover:scale-105"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'AI Pets Created', icon: Heart },
              { number: '50M+', label: 'Conversations', icon: Zap },
              { number: '99.9%', label: 'Uptime', icon: Shield },
              { number: '25K+', label: 'Happy Owners', icon: Users }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-3">{stat.number}</div>
                  <div className="text-gray-600 font-semibold text-lg">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by Pet Enthusiasts Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of happy pet parents who found their perfect companion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 hover:scale-105"
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-8 leading-relaxed text-lg">"{testimonial.content}"</p>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mr-4 shadow-lg"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Ready to Meet Your Perfect Pet?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join the future of pet companionship. Create your AI pet in minutes and start your journey today.
          </p>
          
          <Link
            to="/auth"
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-16 py-6 rounded-2xl font-bold text-2xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group hover:scale-105"
          >
            Start Creating Now
            <Sparkles className="ml-4 h-8 w-8 group-hover:rotate-12 transition-transform duration-300" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <img
                    src="/new logo.jpg"
                    alt="Soul Pet AI"
                    className="h-12 w-12 rounded-full object-cover shadow-lg border-2 border-white/20"
                  />
                </div>
                <span className="text-2xl font-bold">SoulPet AI</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Creating magical bonds between humans and AI companions. Experience the future of pet ownership today.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#demo" className="text-gray-400 hover:text-white transition-colors">Demo</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Reviews</a></li>
                <li><Link to="/auth" className="text-gray-400 hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
                <p>&copy; 2024 SoulPet AI. All rights reserved.</p>
                <p className="mt-1">Made with ❤️ for pet lovers everywhere</p>
              </div>
              
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Discord</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;