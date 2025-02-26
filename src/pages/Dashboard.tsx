import { useState, useEffect } from 'react';
import { Phone, Users, Clock, UserCheck } from 'lucide-react';
import StatCard from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface HourlyData {
  hour: string;
  calls: number;
}

interface Campaign {
  name: string;
  calls: number;
  status: string;
}

const Dashboard = () => {
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([
    { hour: '9AM', calls: 30 },
    { hour: '10AM', calls: 45 },
    { hour: '11AM', calls: 35 },
    { hour: '12PM', calls: 50 },
    { hour: '1PM', calls: 60 },
    { hour: '2PM', calls: 40 },
    { hour: '3PM', calls: 55 },
    { hour: '4PM', calls: 45 },
    { hour: '5PM', calls: 65 },
    { hour: '6PM', calls: 58 },
    { hour: '7PM', calls: 42 },
    { hour: '8PM', calls: 48 },
  ]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { name: 'Tech Startups Outreach', calls: 450, status: 'Active' },
    { name: 'Healthcare Solutions', calls: 230, status: 'Active' },
    { name: 'Financial Services', calls: 680, status: 'Active' },
    { name: 'Retail Businesses', calls: 120, status: 'Active' },
  ]);

  useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/dashboard/hourly');
        setHourlyData(response.data);
      } catch (error) {
        console.error('Error fetching hourly data:', error);
      }
    };

    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/dashboard/campaigns');
        setCampaigns(response.data.filter((campaign: Campaign) => campaign.status === 'Active'));
      } catch (error) {
        console.error('Error fetching campaigns data:', error);
      }
    };

    fetchHourlyData();
    fetchCampaigns();
  }, []);

  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Implement time range change logic here
    console.log('Time range changed to:', event.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Phone}
          title="Active Calls"
          value="247"
          trend={{ value: '+12% from last hour', isPositive: true }}
        />
        <StatCard
          icon={UserCheck}
          title="Successful Calls"
          value="1,432"
          trend={{ value: '+8% from yesterday', isPositive: true }}
        />
        <StatCard
          icon={Clock}
          title="Avg. Call Duration"
          value="4:32"
          subtext="Within target range"
        />
        <StatCard
          icon={Users}
          title="Total Leads"
          value="3,890"
          trend={{ value: '+145 new today', isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Hourly Call Volume</h2>
            <select className="px-3 py-2 border rounded-lg text-sm" onChange={handleTimeRangeChange}>
              <option>Last 24 Hours</option>
              <option>Last Week</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#6CE3E1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Active Campaigns</h2>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{campaign.name}</span>
                  <span>{campaign.calls} calls</span>
                </div>
                <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-600 rounded-full"
                    style={{
                      width: `${(campaign.calls / 1000) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;