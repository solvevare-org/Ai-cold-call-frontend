import { useState, useEffect, ChangeEvent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import StatCard from '../components/StatCard';
import { Phone, UserCheck, Clock, TrendingUp } from 'lucide-react';
import axios from 'axios';

const Analytics = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [conversionData, setConversionData] = useState([]);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/analytics/performance');
        setPerformanceData(response.data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    };

    const fetchConversionData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/analytics/conversion');
        setConversionData(response.data);
      } catch (error) {
        console.error('Error fetching conversion data:', error);
      }
    };

    fetchPerformanceData();
    fetchConversionData();
  }, []);

  const handleTimeRangeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    // Implement time range change logic here
    console.log('Time range changed to:', event.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Phone}
          title="Total Calls"
          value="750"
          trend={{ value: '+15% vs last week', isPositive: true }}
        />
        <StatCard
          icon={UserCheck}
          title="Conversion Rate"
          value="32%"
          trend={{ value: '+5% vs last week', isPositive: true }}
        />
        <StatCard
          icon={Clock}
          title="Avg. Call Time"
          value="4:32"
          subtext="Target: 5:00"
        />
        <StatCard
          icon={TrendingUp}
          title="Success Rate"
          value="68%"
          trend={{ value: '+3% vs last week', isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Weekly Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" name="Total Calls" fill="#6ce3e1" />
                <Bar dataKey="success" name="Successful Calls" fill="#a2f3f5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Conversion Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  name="Conversion Rate"
                  stroke="#a2f3f5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;