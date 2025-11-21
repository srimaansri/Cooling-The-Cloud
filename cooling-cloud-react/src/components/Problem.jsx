import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaThermometerFull, FaWater, FaBolt } from 'react-icons/fa';

function Problem() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const problems = [
    {
      icon: <FaThermometerFull className="w-8 h-8" />,
      title: "Extreme Heat",
      value: "120°F",
      description: "Arizona summers push cooling systems to their limits, creating massive energy demand",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FaWater className="w-8 h-8" />,
      title: "Water Scarcity",
      value: "91%",
      description: "Critical drought conditions limit water availability for evaporative cooling systems",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaBolt className="w-8 h-8" />,
      title: "Peak Pricing",
      value: "$200/MWh",
      description: "Electricity costs triple during peak afternoon hours, crushing profit margins",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <section id="problem" className="relative py-32 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-accent-400 font-semibold text-lg">THE CHALLENGE</span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mt-4 mb-6">
            Arizona's Data Center
            <span className="text-gradient block">Crisis</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            30+ major data centers struggle with an impossible choice: expensive electricity or scarce water
          </p>
        </motion.div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative glass-effect rounded-3xl p-8 h-full card-hover">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${problem.color} mb-6`}>
                  {problem.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-2">{problem.title}</h3>
                <div className="text-4xl font-bold text-gradient mb-4">{problem.value}</div>
                <p className="text-white/70">{problem.description}</p>

                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Impact Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="glass-effect rounded-3xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-4">
              The Cost of Inaction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-3xl font-bold text-red-400">$450M</div>
                <div className="text-white/60 mt-2">Annual Wasted Energy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">1.2B</div>
                <div className="text-white/60 mt-2">Gallons Water/Year</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">850K</div>
                <div className="text-white/60 mt-2">Tons CO₂ Emissions</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Problem;