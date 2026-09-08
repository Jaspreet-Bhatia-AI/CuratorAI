import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function About() {
  const [formData, setFormData] = useState({ name: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending email via mailto
    const mailtoLink = `mailto:code4youbuddy@gmail.com?subject=Contact from ${formData.name}&body=${encodeURIComponent(formData.message)}`;
    window.location.href = mailtoLink;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 py-32 space-y-24"
    >
      {/* Intro Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-purple to-blue-400">Jaspreet Bhatia</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            I am a Full-Stack AI Developer and Cloud Engineer. My ultimate goal is to become an AI officer and robotics expert, building intelligent, scalable systems that push the boundaries of automation and artificial intelligence.
          </p>
          <div className="flex gap-4 pt-4">
            <a 
              href="https://github.com/Jaspreet-Bhatia-AI" 
              target="_blank" rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-colors border border-white/5"
            >
              GitHub Profile
            </a>
            <a 
              href="https://linkedin.com/in/jaspreet-bhatia-ai" 
              target="_blank" rel="noreferrer"
              className="bg-google-purple/20 hover:bg-google-purple/30 text-google-purple border border-google-purple/30 px-6 py-3 rounded-full font-medium transition-colors"
            >
              Connect on LinkedIn
            </a>
          </div>
        </div>
        
        <div className="relative aspect-square max-w-md mx-auto w-full">
          <div className="absolute inset-0 bg-gradient-to-tr from-google-purple to-blue-600 rounded-full blur-[100px] opacity-30"></div>
          <div className="relative h-full w-full bg-google-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Placeholder for Profile Picture */}
            <span className="text-6xl font-bold text-white/20">JB</span>
          </div>
        </div>
      </section>

      {/* Project Info & Contact */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold">About CuratorAI</h2>
          <p className="text-gray-400 leading-relaxed">
            CuratorAI is a next-generation platform designed to eliminate the noise of the internet. By leveraging advanced Large Language Models (LLMs) and custom YouTube scraping logic, it instantly architectures a perfect, customized learning roadmap or media playlist based purely on what you want to learn or hear.
          </p>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-google-purple"></span> Built with React & Framer Motion
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Powered by FastAPI & Python
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> AI logic driven by Groq
            </li>
          </ul>
        </div>

        <div className="bg-google-surface/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6">Get in touch</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-google-purple transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-google-purple transition-colors h-32 resize-none"
                placeholder="Let's build robots together..."
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-google-purple to-blue-600 hover:from-google-purple/80 hover:to-blue-600/80 text-white font-medium py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(187,170,255,0.3)]"
            >
              Send Message
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Directly connects to code4youbuddy@gmail.com
            </p>
          </form>
        </div>
      </section>
    </motion.div>
  );
}
