import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCheckCircle, FaChartLine, FaRocket } from 'react-icons/fa';

function Solution() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const features = [
    {
      title: "Intelligent Load Shifting",
      description: "Automatically moves computational workloads away from expensive peak hours",
      improvement: "30% reduction in peak demand"
    },
    {
      title: "Dynamic Cooling Optimization",
      description: "Switches between water and air cooling based on real-time conditions",
      improvement: "45% less water usage"
    },
    {
      title: "Predictive Analytics",
      description: "AI-powered forecasting optimizes operations 24 hours in advance",
      improvement: "11% total cost reduction"
    }
  ];

  return (
    <section id="solution" className="relative py-32 px-6 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500 rounded-full filter blur-3xl animate-float animation-delay-400" />
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
          <span className="text-accent-400 font-semibold text-lg">OUR SOLUTION</span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mt-4 mb-6">
            Optimization
            <span className="text-gradient block">Reimagined</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Multi-objective optimization using real-time data from EIA and NOAA to make intelligent decisions every hour
          </p>
        </motion.div>

        {/* Solution Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="glass-effect rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Visual */}
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-primary-900/50 to-accent-900/50 rounded-2xl p-8 flex items-center justify-center">
                  {/* Animated Chart Placeholder */}
                  <div className="w-full h-full relative">
                    <svg viewBox="0 0 400 200" className="w-full h-full">
                      <motion.path
                        d="M 0 150 Q 100 100 200 120 T 400 80"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={inView ? { pathLength: 1 } : {}}
                        transition={{ duration: 2, delay: 0.5 }}
                      />
                      <defs>
                        <linearGradient id="gradient">
                          <stop offset="0%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#d946ef" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">-11%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Features */}
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="flex space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <FaCheckCircle className="w-6 h-6 text-green-400 mt-1" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-white/70 mb-2">{feature.description}</p>
                      <span className="text-accent-400 font-medium">
                        {feature.improvement}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              step: "01",
              title: "Data Collection",
              description: "Real-time integration with EIA grid data and NOAA weather forecasts"
            },
            {
              step: "02",
              title: "Optimization",
              description: "GLPK solver processes 10+ variables with complex constraints"
            },
            {
              step: "03",
              title: "Execution",
              description: "Automated implementation of optimal cooling and load strategies"
            }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-bold text-xl mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-white/60">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Solution;