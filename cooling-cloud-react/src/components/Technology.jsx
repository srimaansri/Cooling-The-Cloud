import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  SiPython, SiReact, SiPostgresql, SiPlotly,
  SiTailwindcss, SiOpenai, SiNumpy, SiPandas
} from 'react-icons/si';
import { FaDatabase, FaChartLine, FaCloud, FaCodeBranch } from 'react-icons/fa';

function Technology() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const techStack = [
    {
      category: "Optimization Engine",
      techs: [
        { name: "Python", icon: <SiPython />, color: "text-yellow-400" },
        { name: "Pyomo", icon: <FaCodeBranch />, color: "text-blue-400" },
        { name: "GLPK Solver", icon: <FaChartLine />, color: "text-green-400" },
        { name: "NumPy", icon: <SiNumpy />, color: "text-blue-500" }
      ]
    },
    {
      category: "Data Pipeline",
      techs: [
        { name: "EIA API", icon: <FaDatabase />, color: "text-orange-400" },
        { name: "NOAA Data", icon: <FaCloud />, color: "text-cyan-400" },
        { name: "PostgreSQL", icon: <SiPostgresql />, color: "text-blue-600" },
        { name: "Pandas", icon: <SiPandas />, color: "text-purple-400" }
      ]
    },
    {
      category: "Visualization",
      techs: [
        { name: "React", icon: <SiReact />, color: "text-cyan-400" },
        { name: "Plotly", icon: <SiPlotly />, color: "text-purple-500" },
        { name: "Tailwind", icon: <SiTailwindcss />, color: "text-teal-400" },
        { name: "Streamlit", icon: <FaChartLine />, color: "text-red-400" }
      ]
    }
  ];

  const dataFlow = [
    { step: 1, name: "Data Ingestion", description: "Real-time weather & grid data" },
    { step: 2, name: "Processing", description: "Clean & normalize inputs" },
    { step: 3, name: "Optimization", description: "Multi-objective solving" },
    { step: 4, name: "Execution", description: "Implement decisions" }
  ];

  return (
    <section id="technology" className="relative py-32 px-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-accent-400 font-semibold text-lg">TECHNOLOGY STACK</span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mt-4 mb-6">
            Built with
            <span className="text-gradient block">Best-in-Class Tools</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Enterprise-grade technology stack designed for scalability and reliability
          </p>
        </motion.div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {techStack.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              className="glass-effect rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">{category.category}</h3>
              <div className="grid grid-cols-2 gap-4">
                {category.techs.map((tech, techIndex) => (
                  <motion.div
                    key={techIndex}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <span className={`text-2xl ${tech.color}`}>{tech.icon}</span>
                    <span className="text-white/80 text-sm">{tech.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Data Flow Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-effect rounded-3xl p-12"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Real-Time Data Pipeline
          </h3>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 transform -translate-y-1/2 hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {dataFlow.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{item.name}</h4>
                  <p className="text-white/60 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">&lt; 5 sec</div>
              <div className="text-white/60">Optimization Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-400">99.9%</div>
              <div className="text-white/60">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">Real-time</div>
              <div className="text-white/60">Data Updates</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Technology;