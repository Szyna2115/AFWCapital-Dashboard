import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useApi } from '../hooks/useApi';

interface AccountsProps {
  theme: 'dark' | 'light';
}

interface Account {
  id: string;
  name: string;
  balance: string;
  profit: string;
  roi: string;
  trend: 'up' | 'down';
  chartData: number[];
}

export function Accounts({ theme }: AccountsProps) {
  const isDark = theme === 'dark';
  const { data: accounts, loading } = useApi<Account[]>('/accounts');

  return (
    <div className={`p-8 min-h-screen ${isDark ? 'bg-gradient-to-br from-[#0D111C] via-[#0F1419] to-[#0C1C26]' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          Accounts
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
        >
          <Plus size={20} />
          Add Account
        </motion.button>
      </div>

      {/* Accounts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 ${
                isDark 
                  ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50' 
                  : 'bg-white border border-gray-200'
              } animate-pulse`}
            >
              <div className={`h-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4 w-1/2`}></div>
              <div className={`h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
              <div className="grid grid-cols-3 gap-3">
                <div className={`h-12 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                <div className={`h-12 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
                <div className={`h-12 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
              </div>
            </div>
          ))}
        </div>
      ) : !accounts || accounts.length === 0 ? (
        <div className="text-center py-16">
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>No accounts found</p>
          <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Connect your trading bot to add accounts</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {accounts.map((account, index) => {
            const chartData = account.chartData?.map((value, i) => ({ x: i, y: value })) || [];
          
          return (
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
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={`mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {account.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {account.balance}
                    </div>
                    {account.trend === 'up' ? (
                      <TrendingUp size={16} className="text-green-400" />
                    ) : (
                      <TrendingDown size={16} className="text-red-400" />
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className={`${isDark ? 'text-gray-500' : 'text-gray-500'} mb-1`}>Balance</div>
                      <div className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{account.balance}</div>
                    </div>
                    <div>
                      <div className={`${isDark ? 'text-gray-500' : 'text-gray-500'} mb-1`}>Profit</div>
                      <div className={account.profit.startsWith('+') ? 'text-green-400' : account.profit.startsWith('-') ? 'text-red-400' : isDark ? 'text-white' : 'text-gray-900'}>
                        {account.profit}
                      </div>
                    </div>
                    <div>
                      <div className={`${isDark ? 'text-gray-500' : 'text-gray-500'} mb-1`}>ROI</div>
                      <div className={account.roi.startsWith('+') ? 'text-green-400' : account.roi.startsWith('-') ? 'text-red-400' : isDark ? 'text-white' : 'text-gray-900'}>
                        {account.roi}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mini Chart */}
                {chartData.length > 0 && (
                  <div className="w-32 ml-6" style={{ height: '96px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <Line 
                          type="monotone" 
                          dataKey="y" 
                          stroke={account.trend === 'up' ? '#00FFB0' : '#FF4D6D'} 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        </div>
      )}
    </div>
  );
}
