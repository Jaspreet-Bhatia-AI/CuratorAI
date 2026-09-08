import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { id: 1, title: "Fundamentals", desc: "Core concepts and basics." },
  { id: 2, title: "Intermediate", desc: "Building small projects." },
  { id: 3, title: "Advanced Topics", desc: "Deep dive into architecture." }
];

export default function Roadmap() {
  return (
    <div className="bg-google-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-google-purple shadow-[0_0_10px_#bbaaff]"></span>
        Learning Roadmap
      </h2>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        {steps.map((step, index) => (
          <motion.div 
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative flex items-center group is-active gap-4"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-google-dark text-gray-300 group-hover:text-google-purple group-hover:border-google-purple shadow-[0_0_15px_rgba(187,170,255,0.2)] shrink-0 z-10 transition-colors">
              {step.id}
            </div>
            
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-google-purple/50 transition-colors cursor-pointer backdrop-blur-md">
              <h3 className="font-medium text-white">{step.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
