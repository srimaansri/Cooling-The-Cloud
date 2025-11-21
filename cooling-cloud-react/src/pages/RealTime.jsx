import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FaWifi, FaSun, FaBolt, FaChartLine, FaSyncAlt, FaThermometerHalf, FaDollarSign } from 'react-icons/fa';
import { optimizationService } from '../services/api';

const RealTime = () => {
  const [realTimeData, setRealTimeData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  useEffect(() => {
    loadRealTimeData();
    checkConnection();

    const interval = autoRefresh ? setInterval(() => {
      loadRealTimeData();
    }, 30000) : null; // Refresh every 30 seconds

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedDate, autoRefresh]);

  const checkConnection = async () => {
    try {
      const response = await optimizationService.healthCheck();
      setConnectionStatus(response.supabase_connected ? 'connected' : 'disconnected');
    } catch (err) {
      setConnectionStatus('error');
    }
  };

  const loadRealTimeData = async () => {
    try {
      setLoading(true);
      const response = await optimizationService.getRealTimeData(selectedDate);
      if (response.success) {
        setRealTimeData(response.data);
      }
    } catch (err) {
      console.error('Error loading real-time data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-400';
      case 'disconnected':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected to Supabase';
      case 'disconnected':
        return 'Supabase Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Checking Connection...';
    }
  };

  // Prepare chart data
  const chartData = realTimeData
    ? Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        temperature: realTimeData.temperatures[i] || 0,
        elecPrice: realTimeData.electricity_prices[i] || 0,
      }))
    : [];

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
          <p className="text-gray-300 text-sm font-medium">Hour {label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.dataKey === 'temperature'
                ? `${entry.value.toFixed(1)}°F`
                : `$${entry.value.toFixed(2)}/MWh`}
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 mb-2">
                Real-Time Monitoring
              </h1>
              <p className="text-gray-400">Live data from Arizona electricity grid and weather stations</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center glass-effect-dark px-4 py-2 rounded-lg border border-primary-400/20">
                <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'} animate-pulse mr-2`} />
                <span className={`text-sm ${getConnectionColor()}`}>
                  {getConnectionText()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect-dark border border-primary-400/10 rounded-xl p-6 mb-6"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-primary-300 mb-2">
                  Data Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 bg-dark-800 border border-primary-400/30 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="mr-2 h-4 w-4 text-primary-400 focus:ring-primary-400 border-gray-600 rounded bg-dark-800"
                  />
                  <span className="text-sm text-gray-300">Auto-refresh (30s)</span>
                </label>
              </div>
            </div>
            <button
              onClick={loadRealTimeData}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-gray-100 rounded-md hover:from-primary-500 hover:to-accent-500 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 flex items-center space-x-2"
            >
              <FaSyncAlt className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Loading...' : 'Refresh Now'}</span>
            </button>
          </div>
        </motion.div>

        {loading && !realTimeData ? (
          <div className="text-center py-12">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-400"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-r-2 border-l-2 border-accent-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="mt-4 text-gray-400">Loading real-time data...</p>
          </div>
        ) : realTimeData ? (
          <>
            {/* Current Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-effect-dark border border-primary-400/10 rounded-xl p-6"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Current Temperature</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {realTimeData.metadata.max_temp?.toFixed(1)}°F
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-lg">
                    <FaThermometerHalf className="w-6 h-6 text-orange-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Range: {realTimeData.metadata.min_temp?.toFixed(1)}°F - {realTimeData.metadata.max_temp?.toFixed(1)}°F
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-effect-dark border border-primary-400/10 rounded-xl p-6"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Avg Electricity Price</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      ${realTimeData.metadata.avg_price?.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg">
                    <FaBolt className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">per MWh</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="glass-effect-dark border border-primary-400/10 rounded-xl p-6"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Peak Price</p>
                    <p className="text-2xl font-bold text-red-400">
                      ${realTimeData.metadata.peak_price?.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-lg">
                    <FaChartLine className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">per MWh</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-effect-dark border border-primary-400/10 rounded-xl p-6"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Off-Peak Price</p>
                    <p className="text-2xl font-bold text-green-400">
                      ${realTimeData.metadata.off_peak_price?.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                    <FaDollarSign className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">per MWh</p>
              </motion.div>
            </div>

            {/* Temperature Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-effect-dark border border-primary-400/10 rounded-xl p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 animate-pulse" />
                24-Hour Temperature Profile
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FB923C" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FB923C" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="hour"
                    stroke="rgba(255,255,255,0.5)"
                    label={{ value: 'Hour', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    label={{ value: 'Temperature (°F)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#FB923C"
                    fillOpacity={1}
                    fill="url(#colorTemp)"
                    name="Temperature"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Electricity Price Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-effect-dark border border-primary-400/10 rounded-xl p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
                <div className="w-2 h-2 bg-primary-400 rounded-full mr-3 animate-pulse" />
                24-Hour Electricity Pricing
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="hour"
                    stroke="rgba(255,255,255,0.5)"
                    label={{ value: 'Hour', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    label={{ value: 'Price ($/MWh)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="stepAfter"
                    dataKey="elecPrice"
                    stroke="#60A5FA"
                    strokeWidth={3}
                    name="Electricity Price"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Hourly Data Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-effect-dark border border-primary-400/10 rounded-xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-primary-400/20">
                <h3 className="text-lg font-semibold text-gray-300">Hourly Data Table</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="glass-effect-dark border-b border-primary-400/20">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                        Hour
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                        Temperature (°F)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                        Electricity Price ($/MWh)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                        Water Price ($/1000gal)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                        Optimal Cooling
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-400/10">
                    {chartData.map((hour, idx) => {
                      const waterPrice = realTimeData.water_prices?.[0] || 3.24;
                      const optimalCooling = hour.temperature > 100 && hour.elecPrice > 150 ? 'Water' : 'Chiller';

                      return (
                        <tr key={idx} className="hover:bg-primary-400/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                            {idx}:00
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {hour.temperature.toFixed(1)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            ${hour.elecPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            ${waterPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              optimalCooling === 'Water'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {optimalCooling}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTime;