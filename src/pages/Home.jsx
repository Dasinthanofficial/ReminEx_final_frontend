import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiDoor } from 'react-icons/gi';
import { FaRobot } from "react-icons/fa";
import hero from '../assets/hero.png';
import Snowfall from 'react-snowfall'
import { GiNuclearWaste } from "react-icons/gi";


const Home = () => {
  const features = [
    {
      icon: <GiDoor className="w-8 h-8 " />,
      title: 'Effortless Entry',
      description: 'Easily add food items with a quick photo or manual entry.',
    },
    {
      icon: <FaRobot className="w-8 h-8" />,
      title: 'AI-Powered Suggestions',
      description: 'TGet smart recipe ideas to use up ingredients before they expire.',
    },
    {
      icon: <GiNuclearWaste className="w-8 h-8" />,
      title: 'Track Waste and Loss',
      description: 'Get smart recipe ideas to use up ingredients before they expire.',
    }

  ];

  return (

    <div className="space-y-16 bg-[#122017] p-10 ">
      {/* Hero Section */}
      <section className='relative'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
       <img src={hero} alt="" className='h-[700px] w-full rounded-xl' />
     
        </motion.div>
      </section>

      {/* Features Grid */}
      <section>

        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-md border border-white/30 rounded-xl p-6'>
         
        <h2 className="text-3xl font-bold text-white text-center mb-6">Ready To Stop Wasting And Start Saving </h2>
        <h4 className="text-xl font-sm text-center text-white mb-12">Our app makes it easy to track your food, get recipe suggestions, and see your impact. </h4>
        <div className='text-center mb-[60px]'>
        <Link
          to="/register"
          className="bg-[#38E07B] text-black px-8 py-3 rounded-lg text-lg  font-semibold hover:bg-[#FFA500] transition inline-block"
        >
          Start Tracking Now
        </Link>
        </div>
</div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 ">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="  p-6 rounded-xl shadow-lg  bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 hover:shadow-2xl "
            >
              <div className="text-[#38E07B] mb-4">{feature.icon}</div>
              <h3 className="text-xl text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-[#9EB7A8]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

     

      {/* CTA Section */}
      <section className="text-center py-12">
        <h2 className="text-3xl text-white font-bold mb-4">Ready to Start Saving?</h2>
        <p className="text-gray-600 text-white mb-8">Join thousands of users who are already reducing waste</p>
      
        <Link
          to="/register"
          className="bg-[#38E07B]  text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#FFA500] transition inline-block"
        >
          Start Your Free Account
        </Link>
       
        
      </section>

       {/* Stats Section */}
      <section className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl   text-white rounded-2xl p-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <Snowfall />
          <div>
            <h3 className="text-4xl text-[#38E07B] font-bold mb-2">1000+</h3>
            <p className="text-primary-100">Active Users</p>
          </div>
          <div>
            <h3 className="text-4xl  text-[#38E07B] font-bold mb-2">$50K+</h3>
            <p className="text-primary-100">Money Saved</p>
          </div>
          <div>
            <h3 className="text-4xl  text-[#38E07B] font-bold mb-2">5000+</h3>
            <p className="text-primary-100">Products Tracked</p>
          </div>
        </div>
      </section>
      
    </div>

  );
};

export default Home;