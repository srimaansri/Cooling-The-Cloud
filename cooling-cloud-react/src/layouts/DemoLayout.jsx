import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaChartLine, FaHistory, FaChartBar, FaWifi, FaBars, FaTimes, FaArrowLeft, FaCloud } from 'react-icons/fa';
import { motion } from 'framer-motion';

function DemoLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', path: '/demo', icon: FaChartLine },
    { name: 'History', path: '/demo/history', icon: FaHistory },
    { name: 'Real-Time', path: '/demo/real-time', icon: FaWifi },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-dark-950 via-primary-950 to-dark-950 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 gradient-mesh-bg opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-t from-dark-950/80 to-transparent pointer-events-none" />

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0 relative z-20">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 glass-effect-dark border-r border-white/10">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              {/* Logo */}
              <div className="flex items-center justify-between px-4 mb-8">
                <motion.div
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative">
                    <FaCloud className="w-8 h-8 text-primary-400" />
                    <div className="absolute inset-0 w-8 h-8 bg-primary-400 blur-xl opacity-50 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-white">
                      Cooling<span className="text-gradient">Cloud</span>
                    </span>
                    <p className="text-xs text-primary-300 font-medium">Dashboard</p>
                  </div>
                </motion.div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/demo'}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-600/20 to-accent-600/20 text-white border border-primary-400/30'
                          : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                      }`
                    }
                  >
                    <item.icon className={`mr-3 h-5 w-5 transition-colors`} />
                    {item.name}
                    {item.path === '/demo' && (
                      <span className="ml-auto text-xs bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded-full">
                        Main
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Bottom Section */}
            <div className="flex-shrink-0 border-t border-white/10 p-4">
              <div className="flex flex-col space-y-3">
                <div className="text-xs text-white/40">
                  <p className="font-semibold text-primary-300">IISE 2025 Hackathon</p>
                  <p>Arizona Data Center Optimization</p>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center text-xs text-white/60 hover:text-white transition-colors group"
                >
                  <FaArrowLeft className="mr-2 h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <motion.div
            className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            className="relative flex-1 flex flex-col max-w-xs w-full glass-effect-dark"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 30 }}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full glass-effect"
              >
                <FaTimes className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Mobile navigation content - same as desktop */}
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center px-4 mb-8">
                <div className="relative">
                  <FaCloud className="w-8 h-8 text-primary-400" />
                  <div className="absolute inset-0 w-8 h-8 bg-primary-400 blur-xl opacity-50 animate-pulse" />
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold text-white">
                    Cooling<span className="text-gradient">Cloud</span>
                  </span>
                  <p className="text-xs text-primary-300 font-medium">Dashboard</p>
                </div>
              </div>
              <nav className="px-3 space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === '/demo'}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-600/20 to-accent-600/20 text-white border border-primary-400/30'
                          : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                      }`
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 border-t border-white/10 p-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-xs text-white/60 hover:text-white transition-colors"
              >
                <FaArrowLeft className="mr-2 h-3 w-3" />
                Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        {/* Mobile header */}
        <div className="md:hidden glass-effect-dark border-b border-white/10">
          <div className="flex justify-between items-center px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <FaBars className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <FaCloud className="w-6 h-6 text-primary-400 mr-2" />
              <span className="text-sm font-bold text-white">Dashboard</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <FaArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating particles - fewer for performance */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-400/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            transition={{
              duration: Math.random() * 30 + 20,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default DemoLayout;