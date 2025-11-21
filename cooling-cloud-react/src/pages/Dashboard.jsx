import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FaBolt, FaWater, FaLeaf, FaChartLine, FaPlay, FaCalendarAlt, FaDatabase } from 'react-icons/fa';
import { optimizationService } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [useRealData, setUseRealData] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await optimizationService.getStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const runOptimization = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await optimizationService.runOptimization({
        date: selectedDate,
        use_real_data: useRealData,
        capacity_mw: 2000, // Fixed at 2000MW for Arizona total capacity
      });

      if (response.success) {
        setOptimizationResults(response.results);
      } else {
        setError(response.error || 'Optimization failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to run optimization');
    } finally {
      setLoading(false);
    }
  };

  const chartColors = {
    primary: '#60A5FA',
    accent: '#A78BFA',
    success: '#34D399',
    warning: '#FBBF24',
  };

  const customTooltipStyle = {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    border: '1px solid rgba(96, 165, 250, 0.3)',
    borderRadius: '8px',
    padding: '8px 12px',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={customTooltipStyle}>
          <p className="text-white/80 text-sm">{`Hour ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Data Center <span className="text-gradient">Optimization</span>
          </h1>
          <p className="text-white/60">Real-time optimization for Arizona data centers using AI-powered algorithms</p>
        </motion.div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: 'Total Records',
                value: stats.total_records?.toLocaleString(),
                icon: FaDatabase,
                color: 'from-blue-600 to-blue-700'
              },
              {
                label: 'Optimizations',
                value: stats.total_optimization_runs,
                icon: FaChartLine,
                color: 'from-purple-600 to-purple-700'
              },
              {
                label: '30-Day Savings',
                value: `$${stats.last_30_days_savings?.toFixed(0)}`,
                icon: FaBolt,
                color: 'from-green-600 to-green-700'
              },
              {
                label: 'Efficiency Rate',
                value: `${stats.avg_savings_percent?.toFixed(1)}%`,
                icon: FaLeaf,
                color: 'from-amber-600 to-amber-700'
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect-dark border border-white/10 rounded-xl p-6 hover:border-primary-400/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className="text-3xl font-bold text-white">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect-dark border border-white/10 rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <FaPlay className="mr-3 text-primary-400" />
            Run Optimization <span className="ml-3 text-sm text-white/40">(2000MW Arizona Capacity)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                <FaCalendarAlt className="inline mr-2" />
                Target Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                <FaDatabase className="inline mr-2" />
                Data Source
              </label>
              <select
                value={useRealData ? 'real' : 'demo'}
                onChange={(e) => setUseRealData(e.target.value === 'real')}
                className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-400 transition-colors"
              >
                <option value="real">Supabase Production</option>
                <option value="demo">Demo Data</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={runOptimization}
                disabled={loading}
                className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
                  loading
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 shadow-lg'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Optimizing...
                  </span>
                ) : (
                  'Run Optimization'
                )}
              </button>
            </div>
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg"
            >
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Results Section */}
        {optimizationResults && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-effect-dark border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-primary-400 rounded-full mr-3 animate-pulse" />
                  Cost Analysis
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Total Cost', value: `$${optimizationResults.summary.total_cost.toFixed(2)}`, color: 'text-white' },
                    { label: 'Electricity', value: `$${optimizationResults.summary.electricity_cost.toFixed(2)}`, color: 'text-blue-400' },
                    { label: 'Water', value: `$${optimizationResults.summary.water_cost.toFixed(2)}`, color: 'text-cyan-400' },
                    { label: 'Peak Demand', value: `${optimizationResults.summary.peak_demand_mw.toFixed(1)} MW`, color: 'text-yellow-400' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">{item.label}</span>
                      <span className={`font-semibold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-effect-dark border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse" />
                  Savings Impact
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Daily Savings', value: `$${optimizationResults.savings.daily_savings.toFixed(2)}`, accent: true },
                    { label: 'Annual Projection', value: `$${optimizationResults.savings.annual_savings.toFixed(0)}`, accent: true },
                    { label: 'Efficiency Gain', value: `${optimizationResults.savings.percentage_saved.toFixed(1)}%`, accent: true },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">{item.label}</span>
                      <span className={`font-semibold ${item.accent ? 'text-green-400' : 'text-white'}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-effect-dark border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse" />
                  Environmental
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Water Saved', value: `${optimizationResults.environmental.water_saved_gallons.toLocaleString()} gal`, color: 'text-blue-400' },
                    { label: 'CO₂ Avoided', value: `${optimizationResults.environmental.carbon_avoided_tons.toFixed(2)} tons`, color: 'text-emerald-400' },
                    { label: 'Peak Reduction', value: `${optimizationResults.environmental.peak_reduction_mw.toFixed(1)} MW`, color: 'text-orange-400' },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">{item.label}</span>
                      <span className={`font-semibold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Hourly Load Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-effect-dark border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Hourly Load Profile</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={optimizationResults.hourly_data}>
                    <defs>
                      <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="hour" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="batch_load_mw"
                      stroke="#60A5FA"
                      fillOpacity={1}
                      fill="url(#colorLoad)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Temperature & Price */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-effect-dark border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Temperature & Price Trends</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={optimizationResults.hourly_data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="hour" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="temperature_f"
                      stroke="#FBBF24"
                      name="Temperature (°F)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="electricity_price"
                      stroke="#A78BFA"
                      name="Price ($/MWh)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;