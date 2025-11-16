import React from 'react';
import { motion } from 'framer-motion';
import { MdOutlineArtTrack } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { HiOutlineSaveAs } from "react-icons/hi";

const About = () => {
  


   const mission = [
    {
      icon: <IoMdAddCircleOutline />,
      title: 'Add',
      description: ' Easily add your food items, including expiry dates, categories, and price.',
    },
    {
      icon: < MdOutlineArtTrack />,
      title: 'Track',
      description: 'Monitor your food inventory and receive notifications before items expire.',
    },
    {
      icon: <HiOutlineSaveAs />,
      title: 'Save',
      description: 'Save money by reducing food waste and making informed decisions about your grocery shopping.',
    }
   
  ];

  return (
    <div className="space-y-12 p-10 bg-[#122017] ">
      <section className="text-center py-20 rounded-2xl px-[100px] ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl text-white font-bold mb-4 ">About ReminEx</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            We're on a mission to reduce food waste and help you save money by keeping track
            of your products' expiry dates.
          </p>

        </motion.div>
      </section>

    
     <div></div>
      

      <div className=" text-white rounded-2xl p-12 text-center mt-[300px]">
        <h2 className="text-3xl font-bold mb-4">Our Story</h2>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed">
          Food Expiry Tracker was born from a simple observation: every household throws away
          hundreds of dollars worth of expired products each year. We believed technology could
          solve this problem. Today, we're proud to help thousands of families reduce waste,
          save money, and contribute to a more sustainable future.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 ">
        {mission.map((mission, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-xl shadow-lg  bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 hover:shadow-2xl"
          >
            <div className="text-[#38E07B]  text-3xl mb-4">{mission.icon}</div>
            <h3 className="text-xl text-white  font-bold mb-2">{mission.title}</h3>
            <p className="text-[#9EB7A8]">{mission.description}</p>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default About;