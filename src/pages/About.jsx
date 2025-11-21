import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiHeart, FiGlobe } from 'react-icons/fi';
import { MdOutlineArtTrack } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiOutlineSaveAs } from "react-icons/hi";

const About = () => {
  const mission = [
    {
      icon: <IoMdAddCircleOutline className="w-8 h-8" />,
      title: 'Add Effortlessly',
      description: 'Quickly catalogue your groceries with smart inputs for expiry dates, categories, and prices.',
    },
    {
      icon: <MdOutlineArtTrack className="w-8 h-8" />,
      title: 'Track Smartly',
      description: 'Get timely notifications before food spoils, ensuring you use what you buy.',
    },
    {
      icon: <HiOutlineSaveAs className="w-8 h-8" />,
      title: 'Save Sustainably',
      description: 'Cut down on waste, save money on groceries, and contribute to a greener planet.',
    }
  ];

  return (
    <div className="bg-[#122017] min-h-screen text-white font-sans overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative py-24 px-6">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#38E07B] rounded-full mix-blend-multiply filter blur-[150px] opacity-10 animate-pulse"></div>
        
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-[#38E07B]/10 border border-[#38E07B]/20 text-[#38E07B] text-sm font-bold uppercase tracking-wider mb-6">
              Our Mission
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Empowering you to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38E07B] to-emerald-400">
                waste less & live more.
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              ReminEx isn't just an app—it's a movement to change how we interact with our food, our wallets, and our environment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Story Section (Glassmorphism) */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p>
                    It started with a simple, frustrating realization: every week, perfectly good food was ending up in the bin. We realized this wasn't just our problem—it was a global issue costing families hundreds of dollars and harming the planet.
                  </p>
                  <p>
                    We built ReminEx to solve this. By combining simple tracking with smart notifications, we've helped thousands of families turn their kitchens into zero-waste zones.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StoryCard icon={<FiTarget />} label="Goal" value="Zero Waste" />
                <StoryCard icon={<FiHeart />} label="Impact" value="1M+ Saved" />
                <StoryCard icon={<FiGlobe />} label="Reach" value="Global" />
                <div className="bg-[#38E07B] rounded-2xl p-6 flex flex-col justify-center items-center text-[#122017]">
                   <span className="text-4xl font-bold">2024</span>
                   <span className="text-sm font-semibold uppercase">Established</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Values / How it Works */}
      <section className="py-20 px-6 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How We Help You</h2>
          <p className="text-gray-400">Three simple steps to a smarter kitchen.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {mission.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group p-8 rounded-3xl bg-[#1a2c23] border border-white/5 hover:bg-[#38E07B] hover:text-[#122017] transition-all duration-300 cursor-default"
            >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-[#38E07B] text-3xl mb-6 group-hover:bg-[#122017]/10 group-hover:text-[#122017] transition-colors">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400 group-hover:text-[#122017]/80 transition-colors leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

// Helper Component for Story Stats
const StoryCard = ({ icon, label, value }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
    <div className="text-[#38E07B] text-2xl mb-2">{icon}</div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
  </div>
);

export default About;