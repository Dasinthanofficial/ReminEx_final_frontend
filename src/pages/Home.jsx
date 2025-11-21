import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { GiDoor } from 'react-icons/gi';
import { FaRobot } from "react-icons/fa";
import { GiNuclearWaste } from "react-icons/gi";
import hero from '../assets/hero.png';
import Snowfall from 'react-snowfall';

const Home = () => {
  const features = [
    {
      icon: <GiDoor className="w-10 h-10" />,
      title: 'Effortless Entry',
      description: 'Add items in seconds with smart manual entry or quick photo uploads.',
    },
    {
      icon: <FaRobot className="w-10 h-10" />,
      title: 'AI Chef Assistant',
      description: 'Get personalized recipes instantly based on ingredients expiring soon.',
    },
    {
      icon: <GiNuclearWaste className="w-10 h-10" />,
      title: 'Zero Waste Tracking',
      description: 'Visualize your impact with detailed reports on waste reduction and savings.',
    }
  ];

  return (
    <div className="bg-[#122017] min-h-screen font-sans text-white overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#38E07B] rounded-full mix-blend-multiply filter blur-[150px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[150px] opacity-10"></div>

        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-[#38E07B] text-sm font-semibold">
              <span className="w-2 h-2 bg-[#38E07B] rounded-full animate-pulse"></span>
              #1 Food Tracking App
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Stop Wasting. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38E07B] to-emerald-400">
                Start Saving.
              </span>
            </h1>
            
            <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
              Your smart kitchen companion. Track expiry dates, get AI recipes, and save hundreds of dollars a year by reducing food waste.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-[#38E07B] text-[#122017] font-bold rounded-xl hover:bg-[#2fc468] transition-all transform hover:scale-[1.02] shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
              >
                Get Started Free <FiArrowRight />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400 pt-4">
              <span className="flex items-center gap-2"><FiCheckCircle className="text-[#38E07B]" /> No credit card required</span>
              <span className="flex items-center gap-2"><FiCheckCircle className="text-[#38E07B]" /> Cancel anytime</span>
            </div>
          </motion.div>

          {/* Hero Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-[#38E07B] to-blue-600 rounded-3xl blur-2xl opacity-30"></div>
            <div className="relative bg-[#1a2c23] border border-white/10 rounded-3xl p-4 shadow-2xl backdrop-blur-xl">
               <img 
                 src={hero} 
                 alt="Dashboard Preview" 
                 className="rounded-2xl w-full h-auto shadow-lg border border-white/5"
               />
               
               {/* Floating Badge */}
               <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 1 }}
                 className="absolute -bottom-6 -left-6 bg-white text-[#122017] p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100"
               >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">🥬</div>
                  <div>
                    <p className="font-bold text-lg">Fresh Alert</p>
                    <p className="text-sm text-gray-500">Spinach expires in 2 days!</p>
                  </div>
               </motion.div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 relative overflow-hidden">
            <Snowfall color="#38E07B" snowflakeCount={40} style={{ opacity: 0.3 }} />
            
            <div className="grid md:grid-cols-3 gap-12 text-center relative z-10">
              <div>
                <h3 className="text-5xl font-bold text-[#38E07B] mb-2">10k+</h3>
                <p className="text-gray-300 font-medium">Active Users</p>
              </div>
              <div className="border-x border-white/10">
                <h3 className="text-5xl font-bold text-[#38E07B] mb-2">$500k+</h3>
                <p className="text-gray-300 font-medium">Money Saved</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold text-[#38E07B] mb-2">1M+</h3>
                <p className="text-gray-300 font-medium">Items Tracked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ReminEx?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">We combine smart technology with simple design to help you manage your kitchen effortlessly.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#38E07B]/30 transition-all group backdrop-blur-sm"
            >
              <div className="w-16 h-16 bg-[#38E07B]/10 rounded-2xl flex items-center justify-center text-[#38E07B] mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl bg-gradient-to-br from-[#38E07B] to-emerald-600 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-green-900/50">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-[#122017] mb-6">
              Ready to transform your kitchen?
            </h2>
            <p className="text-[#122017]/80 text-lg mb-10 max-w-2xl mx-auto font-medium">
              Join the movement today. Track your food, save money, and help the planet—all from one simple app.
            </p>
            <Link
              to="/register"
              className="inline-block bg-[#122017] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-black hover:scale-105 transition-all shadow-xl"
            >
              Start Your Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;