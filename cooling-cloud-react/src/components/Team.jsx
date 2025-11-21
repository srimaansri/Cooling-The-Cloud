import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

function Team() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const team = [
    {
      name: "Srimaan Sri Edara",
      role: "AI Engineer",
      description: "Built core optimization model with 10+ decision variables and complex constraints",
      skills: ["Python", "Pyomo", "GLPK", "React"],
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=srimaan",
      github: "https://github.com/srimaansri",
      linkedin: "https://www.linkedin.com/in/srimaanedara/",
      email: "edarasrimaansri@gmail.com"
    },
    {
      name: "Taimur Adam",
      role: "Computer Science",
      description: "Developed real-time electricity grid data pipeline from EIA API",
      skills: ["API Development", "PostgreSQL", "ETL", "Python"],
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=taimur",
      github: "https://github.com/taimuradam",
      linkedin: "https://www.linkedin.com/in/taimur-adam/",
      email: "taimur.adam1@gmail.com"
    },
    {
      name: "Aryan Srivastava",
      role: "Computer Science",
      description: "Integrated NOAA weather data for temperature-based optimization",
      skills: ["Data Analysis", "NOAA API", "Pandas", "Visualization"],
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=aryan",
      github: "https://github.com/ARYN26",
      linkedin: "https://www.linkedin.com/in/aryan-srivastava-772811250/",
      email: "aryanas5426@gmail.com"
    }
  ];

  return (
    <section id="team" className="relative py-32 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-accent-400 font-semibold text-lg">THE INNOVATORS</span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mt-4 mb-6">
            Meet the
            <span className="text-gradient block">Dream Team</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            2025 IISE Hackathon team combining expertise in optimization, data engineering, and cloud systems
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="glass-effect rounded-3xl p-8 card-hover h-full">
                {/* Avatar */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <img
                    src={member.image}
                    alt={member.name}
                    className="relative w-full h-full rounded-full bg-white/10"
                  />
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-accent-400 font-medium mb-4">{member.role}</p>
                  <p className="text-white/70 mb-6">{member.description}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {member.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4">
                    <motion.a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2 }}
                      className="text-white/60 hover:text-white transition"
                    >
                      <FaGithub className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2 }}
                      className="text-white/60 hover:text-white transition"
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                      href={`mailto:${member.email}`}
                      whileHover={{ scale: 1.2 }}
                      className="text-white/60 hover:text-white transition"
                    >
                      <FaEnvelope className="w-5 h-5" />
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hackathon Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center space-x-4 glass-effect rounded-full px-8 py-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
            <span className="text-white font-medium">
              🏆 2025 IISE Optimization Hackathon - Theme: Electricity in and to Arizona
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Team;