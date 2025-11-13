import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiHeart, FiUsers, FiAward } from 'react-icons/fi';

const About = () => {
  const values = [
    {
      icon: <FiTarget />,
      title: 'Our Mission',
      description: 'To help households worldwide reduce food waste and save money through intelligent tracking.',
    },
    {
      icon: <FiHeart />,
      title: 'Our Values',
      description: 'Sustainability, innovation, and user-centric design drive everything we do.',
    },
    {
      icon: <FiUsers />,
      title: 'Our Community',
      description: 'Join thousands of conscious consumers making a positive environmental impact.',
    },
    {
      icon: <FiAward />,
      title: 'Our Achievement',
      description: 'Helped save over $1M worth of food from being wasted since our launch.',
    },
  ];



   const mission = [
    {
      icon: <FiTarget />,
      title: 'Add',
      description: ' Easily add your food items, including expiry dates, categories, and price.',
    },
    {
      icon: <FiHeart />,
      title: 'Track',
      description: 'Monitor your food inventory and receive notifications before items expire.',
    },
    {
      icon: <FiUsers />,
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
      <div className="grid md:grid-cols-4 gap-8 ">
        {values.map((value, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#17231B] rounded-xl border-[#9EB7A8] border shadow-lg p-6 bg-[#17231B]"
          >
            <div className="text-primary-500 text-3xl mb-4">{value.icon}</div>
            <h3 className="text-xl text-[#9EB7A8]  font-bold mb-2">{value.title}</h3>
            <p className="text-[#9EB7A8]">{value.description}</p>
          </motion.div>
        ))}
      </div>

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
            className="bg-[#17231B] rounded-xl border-[#9EB7A8] border shadow-lg p-6 bg-[#17231B]"
          >
            <div className="text-primary-500 text-3xl mb-4">{mission.icon}</div>
            <h3 className="text-xl text-[#9EB7A8]  font-bold mb-2">{mission.title}</h3>
            <p className="text-[#9EB7A8]">{mission.description}</p>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default About;