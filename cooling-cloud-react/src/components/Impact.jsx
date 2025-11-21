import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { FaDollarSign, FaWater, FaBolt, FaLeaf } from 'react-icons/fa';

function Impact() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const metrics = [
    {
      icon: <FaDollarSign />,
      value: 3676,
      suffix: "/day",
      label: "Cost Savings",
      color: "text-green-400"
    },
    {
      icon: <FaWater />,
      value: 31680,
      suffix: " gal",
      label: "Water Saved Daily",
      color: "text-blue-400"
    },
    {
      icon: <FaBolt />,
      value: 5,
      suffix: " MW",
      label: "Peak Reduction",
      color: "text-yellow-400"
    },
    {
      icon: <FaLeaf />,
      value: 26,
      suffix: "K tons",
      label: "CO₂ Reduced/Year",
      color: "text-emerald-400"
    }
  ];

  return (
    <section id="impact" className="relative py-32 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-accent-400 font-semibold text-lg">PROVEN RESULTS</span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mt-4 mb-6">
            Real Impact,
            <span className="text-gradient block">Real Savings</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Validated results from optimization of a 50MW Phoenix data center
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="glass-effect rounded-3xl p-8 card-hover">
                <div className={`text-4xl mb-4 ${metric.color}`}>{metric.icon}</div>
                <div className="text-4xl font-bold text-white mb-2">
                  {inView && (
                    <>
                      <CountUp
                        end={metric.value}
                        duration={2}
                        separator=","
                        prefix={metric.value > 1000 ? "" : "$"}
                      />
                      <span className="text-2xl">{metric.suffix}</span>
                    </>
                  )}
                </div>
                <div className="text-white/60">{metric.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scaling Impact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-effect rounded-3xl p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Scaling Across Arizona's 30+ Data Centers
            </h3>
            <p className="text-xl text-white/70">
              The potential when our solution is deployed statewide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <motion.div
                className="text-5xl font-bold text-gradient mb-2"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ type: "spring", delay: 0.8 }}
              >
                $41M
              </motion.div>
              <div className="text-white/70">Annual Savings</div>
            </div>
            <div className="text-center">
              <motion.div
                className="text-5xl font-bold text-gradient mb-2"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ type: "spring", delay: 0.9 }}
              >
                156M
              </motion.div>
              <div className="text-white/70">Gallons Water/Year</div>
            </div>
            <div className="text-center">
              <motion.div
                className="text-5xl font-bold text-gradient mb-2"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ type: "spring", delay: 1.0 }}
              >
                2.5%
              </motion.div>
              <div className="text-white/70">Grid Demand Reduction</div>
            </div>
          </div>

          {/* ROI Calculator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2 }}
            className="mt-12 p-8 bg-gradient-to-r from-primary-900/20 to-accent-900/20 rounded-2xl"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-2xl font-bold text-white mb-1">Return on Investment</div>
                <div className="text-white/70">Implementation pays for itself in</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400">60 days</div>
                <div className="text-white/60">Software-only solution</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Impact;