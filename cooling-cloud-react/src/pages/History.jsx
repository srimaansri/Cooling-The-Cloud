import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FaHistory, FaEye, FaTimes } from 'react-icons/fa';
import { optimizationService } from '../services/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(20);
  const [selectedRun, setSelectedRun] = useState(null);

  useEffect(() => {
    loadHistory();
  }, [limit]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await optimizationService.getHistory(limit);
      if (response.success) {
        setHistory(response.history || []);
      }
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'optimal':
        return 'text-green-400 bg-green-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/20';
      case 'running':
        return 'text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
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
                Optimization History
              </h1>
              <p className="text-gray-400">View past optimization runs and results</p>
            </div>
            <div className="flex items-center space-x-3 glass-effect-dark px-4 py-2 rounded-lg border border-primary-400/20">
              <FaHistory className="text-primary-400" />
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="bg-transparent text-gray-300 focus:outline-none"
              >
                <option value={10} className="bg-dark-900">10 runs</option>
                <option value={20} className="bg-dark-900">20 runs</option>
                <option value={50} className="bg-dark-900">50 runs</option>
                <option value={100} className="bg-dark-900">100 runs</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect-dark border border-primary-400/10 rounded-xl overflow-hidden"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="relative inline-block">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-400"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-r-2 border-l-2 border-accent-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <p className="mt-4 text-gray-400">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No optimization runs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="glass-effect-dark border-b border-primary-400/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                      Run Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                      Run Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                      Total Cost
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                      Savings
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                      Savings %
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                      Water Used
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                      Carbon Avoided
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-primary-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-400/10">
                  {history.map((run, index) => (
                    <motion.tr
                      key={run.run_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-primary-400/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {run.run_timestamp
                          ? format(new Date(run.run_timestamp), 'MMM dd, yyyy HH:mm')
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {run.run_name || 'Optimization Run'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(run.optimization_status)}`}>
                          {run.optimization_status || 'unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        ${run.total_cost?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                        ${run.cost_savings?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {run.cost_savings_percent?.toFixed(1) || '0.0'}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">
                        {run.total_water_usage_gallons?.toLocaleString() || '0'} gal
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400">
                        {run.carbon_avoided_tons?.toFixed(2) || '0.00'} tons
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedRun(run)}
                          className="text-primary-400 hover:text-primary-300 flex items-center space-x-1 transition-colors"
                        >
                          <FaEye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Detail Modal */}
        {selectedRun && (
          <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-effect-dark border border-primary-400/20 rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="px-6 py-4 border-b border-primary-400/20">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                    Optimization Details
                  </h3>
                  <button
                    onClick={() => setSelectedRun(null)}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-effect-dark rounded-lg p-4 border border-primary-400/10">
                    <h4 className="font-semibold text-primary-300 mb-3">Run Information</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Run ID:</dt>
                        <dd className="text-sm font-mono text-accent-300">{selectedRun.run_id?.slice(0, 8)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Timestamp:</dt>
                        <dd className="text-sm text-gray-300">
                          {format(new Date(selectedRun.run_timestamp), 'PPpp')}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Status:</dt>
                        <dd className="text-sm text-gray-300">{selectedRun.optimization_status}</dd>
                      </div>
                      {selectedRun.solver_name && (
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Solver:</dt>
                          <dd className="text-sm text-gray-300">{selectedRun.solver_name}</dd>
                        </div>
                      )}
                      {selectedRun.solver_time && (
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Solve Time:</dt>
                          <dd className="text-sm text-gray-300">{selectedRun.solver_time.toFixed(3)}s</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  <div className="glass-effect-dark rounded-lg p-4 border border-primary-400/10">
                    <h4 className="font-semibold text-primary-300 mb-3">Cost Analysis</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Total Cost:</dt>
                        <dd className="text-sm font-medium text-yellow-400">${selectedRun.total_cost?.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Electricity Cost:</dt>
                        <dd className="text-sm text-gray-300">${selectedRun.electricity_cost?.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Water Cost:</dt>
                        <dd className="text-sm text-gray-300">${selectedRun.water_cost?.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Baseline Cost:</dt>
                        <dd className="text-sm text-gray-300">${selectedRun.baseline_cost?.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Savings:</dt>
                        <dd className="text-sm font-medium text-green-400">
                          ${selectedRun.cost_savings?.toFixed(2)} ({selectedRun.cost_savings_percent?.toFixed(1)}%)
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div className="glass-effect-dark rounded-lg p-4 border border-primary-400/10">
                    <h4 className="font-semibold text-primary-300 mb-3">Resource Usage</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Water Used:</dt>
                        <dd className="text-sm text-blue-400">{selectedRun.total_water_usage_gallons?.toLocaleString()} gal</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Water Saved:</dt>
                        <dd className="text-sm text-cyan-400">{selectedRun.water_saved_gallons?.toLocaleString()} gal</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Peak Demand:</dt>
                        <dd className="text-sm text-orange-400">{selectedRun.peak_demand_mw?.toFixed(1)} MW</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="glass-effect-dark rounded-lg p-4 border border-primary-400/10">
                    <h4 className="font-semibold text-primary-300 mb-3">Environmental Impact</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Carbon Avoided:</dt>
                        <dd className="text-sm text-emerald-400">{selectedRun.carbon_avoided_tons?.toFixed(2)} tons CO₂</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Annual Projection:</dt>
                        <dd className="text-sm text-emerald-400">
                          {(selectedRun.carbon_avoided_tons * 365)?.toFixed(0)} tons CO₂/year
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;