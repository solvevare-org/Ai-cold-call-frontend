import React from 'react';
import { Search, Plus, BarChart2, Users, Calendar, Settings as SettingsIcon } from 'lucide-react';

const campaignsData = [
  {
    id: 1,
    name: 'Tech Startups Outreach',
    status: 'Active',
    progress: 65,
    leads: 450,
    calls: 280,
    success: 180,
    startDate: '2024-01-15',
    endDate: '2024-03-15',
  },
  {
    id: 2,
    name: 'Healthcare Solutions',
    status: 'Paused',
    progress: 45,
    leads: 230,
    calls: 150,
    success: 89,
    startDate: '2024-02-01',
    endDate: '2024-04-01',
  },
  {
    id: 3,
    name: 'Financial Services',
    status: 'Active',
    progress: 80,
    leads: 680,
    calls: 520,
    success: 420,
    startDate: '2024-01-01',
    endDate: '2024-03-31',
  },
];

const Campaigns = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="pl-10 pr-4 py-2 border rounded-lg w-80"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5" />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="grid gap-6">
        {campaignsData.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                    <span>{campaign.startDate}</span>
                    <span>to</span>
                    <span>{campaign.endDate}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm
                  ${campaign.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                  ${campaign.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${campaign.status === 'Completed' ? 'bg-blue-100 text-blue-800' : ''}
                `}>
                  {campaign.status}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{campaign.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${campaign.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Total Leads</span>
                  </div>
                  <span className="text-lg font-semibold">{campaign.leads}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <BarChart2 className="h-4 w-4" />
                    <span className="text-sm">Calls Made</span>
                  </div>
                  <span className="text-lg font-semibold">{campaign.calls}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Successful</span>
                  </div>
                  <span className="text-lg font-semibold">{campaign.success}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-4">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <SettingsIcon className="h-4 w-4" />
                <span>Settings</span>
              </button>
              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;