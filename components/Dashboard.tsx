import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';

interface DashboardProps {
  theme: 'dark' | 'light';
}

interface DashboardStats {
  topCards: Array<{
    label: string;
    value: string;
    change: string;
  }>;
  metrics: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    averageWin: string;
    averageLoss: string;
    maxDrawdown: string;
  };
}

interface ChartDataPoint {
  day: number;
  value: number;
}

interface ActivityItem {
  date: string;
  profit: string;
  drawdown: string;
}

export function Dashboard({ theme }: DashboardProps) {
  const isDark = theme === 'dark';
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch data from API
  const { data: statsData, loading: statsLoading } = useApi<DashboardStats>('/dashboard/stats');
  const { data: chartData, loading: chartLoading } = useApi<ChartDataPoint[]>('/dashboard/chart');
  const { data: activityData, loading: activityLoading } = useApi<ActivityItem[]>('/dashboard/activity');

  useEffect(() => {
    // Update date every 24 hours
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const topCards = statsData?.topCards || [];
  const metrics = statsData?.metrics || {
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    averageWin: '$0',
    averageLoss: '$0',
    maxDrawdown: '0%'
  };
  const tableData = activityData || [];
  const chartDataPoints = chartData || [];

  return (
    <div className={`p-8 min-h-screen ${isDark ? 'bg-gradient-to-br from-[#0D111C] via-[#0F1419] to-[#0C1C26]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statsLoading ? (
          [0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl p-6 ${
                isDark 
                  ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50' 
                  : 'bg-white border border-gray-200'
              } backdrop-blur-sm`}
            >
              <div className="animate-pulse">
                <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2 mb-3`}></div>
                <div className={`h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
                <div className={`h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/3`}></div>
              </div>
            </motion.div>
          ))
        ) : topCards.length > 0 ? (
          topCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl p-6 ${
                isDark 
                  ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50' 
                  : 'bg-white border border-gray-200'
              } backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>{card.label}</div>
                <div className={`mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{card.value}</div>
                <div className={`${card.change.startsWith('+') ? 'text-green-400' : card.change.startsWith('-') ? 'text-red-400' : isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {card.change}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No data available. Connect your trading bot to see stats.</p>
          </div>
        )}
      </div>

      {/* Chart and Table Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`lg:col-span-2 rounded-2xl p-6 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          } backdrop-blur-sm`}
        >
          <h3 className={`mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>30-Day Performance</h3>
          {chartLoading ? (
            <div className="flex items-center justify-center h-[300px]">
              <div className="animate-pulse text-center">
                <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Loading chart...</div>
              </div>
            </div>
          ) : chartDataPoints.length > 0 ? (
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartDataPoints}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7A5AFF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7A5AFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f2937' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="day" 
                    stroke={isDark ? '#6b7280' : '#9ca3af'}
                    tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
                  />
                  <YAxis 
                    stroke={isDark ? '#6b7280' : '#9ca3af'}
                    tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#7A5AFF" 
                    strokeWidth={2}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No chart data available</p>
            </div>
          )}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl p-6 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          } backdrop-blur-sm`}
        >
          <h3 className={`mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
          {activityLoading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} animate-pulse`}>
                  <div className={`h-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-2`}></div>
                  <div className={`h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/2`}></div>
                </div>
              ))}
            </div>
          ) : tableData.length > 0 ? (
            <div className="space-y-3">
              {tableData.map((row, index) => {
                const profitValue = parseFloat(row.profit);
                const profitColor = profitValue > 0 
                  ? 'text-green-400' 
                  : profitValue < 0 
                  ? 'text-red-400' 
                  : isDark ? 'text-gray-400' : 'text-gray-600';
                
                return (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg ${
                      isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                    } hover:bg-purple-500/10 transition-colors duration-200`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{row.date}</span>
                      <span className={profitColor}>
                        {row.profit}
                      </span>
                    </div>
                    <div className={`${isDark ? 'text-gray-500' : 'text-gray-500'}`}>DD: {row.drawdown}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No activity data</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`rounded-xl p-4 ${
            isDark 
              ? 'bg-gray-800/40 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          } hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300`}
        >
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Total Trades</div>
          <div className="text-purple-400">{statsLoading ? '...' : metrics.totalTrades}</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className={`rounded-xl p-4 ${
            isDark 
              ? 'bg-gray-800/40 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          } hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300`}
        >
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Winning Trades</div>
          <div className="text-green-400">{statsLoading ? '...' : metrics.winningTrades}</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`rounded-xl p-4 ${
            isDark 
              ? 'bg-gray-800/40 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          } hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300`}
        >
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Losing Trades</div>
          <div className="text-red-400">{statsLoading ? '...' : metrics.losingTrades}</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className={`rounded-xl p-4 ${
            isDark 
              ? 'bg-gray-800/40 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          } hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300`}
        >
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Average Win</div>
          <div className="text-cyan-400">{statsLoading ? '...' : metrics.averageWin}</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`rounded-xl p-4 ${
            isDark 
              ? 'bg-gray-800/40 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          } hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300`}
        >
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Average Loss</div>
          <div className="text-orange-400">{statsLoading ? '...' : metrics.averageLoss}</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className={`rounded-xl p-4 ${
            isDark 
              ? 'bg-gray-800/40 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          } hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300`}
        >
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Max Drawdown</div>
          <div className="text-pink-400">{statsLoading ? '...' : metrics.maxDrawdown}</div>
        </motion.div>
      </div>

      {/* Last Update Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className={`rounded-xl p-4 text-center ${
          isDark 
            ? 'bg-gray-800/20 border border-gray-700/30' 
            : 'bg-gray-50 border border-gray-200'
        }`}
      >
        <div className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Last Updated: {formatDate(currentDate)}
        </div>
      </motion.div>
    </div>
  );
}
