import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import {
  FaChartLine, FaWater, FaBolt, FaLeaf, FaRocket, FaDatabase,
  FaCloudSun, FaChartBar, FaArrowRight, FaCheckCircle,
  FaGithub, FaLinkedin, FaTwitter, FaEnvelope
} from 'react-icons/fa';
import {
  SiPython, SiReact, SiPostgresql, SiPlotly,
  SiTailwindcss, SiOpenai
} from 'react-icons/si';

// Components
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import Impact from './components/Impact';
import Technology from './components/Technology';
import Team from './components/Team';
import CTA from './components/CTA';
import Navigation from './components/Navigation';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-dark-950 via-primary-950 to-dark-950 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 gradient-mesh-bg opacity-30" />
      <div className="fixed inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-accent-500 transform origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navigation */}
      <Navigation isScrolled={isScrolled} />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <Problem />
        <Solution />
        <Impact />
        <Technology />
        <Team />
        <CTA />
      </main>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;