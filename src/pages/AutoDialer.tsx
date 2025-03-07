import { useState } from 'react';
import { Users, BarChart2, Calendar, Settings as SettingsIcon } from 'lucide-react';

interface Campaign {
  id: number;
  name: string;
  status: string;
  progress: number;
  leads: number;
  calls: number;
  success: number;
  startDate: string;
  endDate: string;
}

const AutoDialer = () => {
  const [campaignsData, setCampaignsData] = useState<Campaign[]>([
    {
      id: 1,
      name: 'Test Campaign',
      status: 'Active',
      progress: 50,
      leads: 120,
      calls: 75,
      success: 40,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    },
  ]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: '',
    status: 'Active',
    progress: 0,
    leads: 0,
    calls: 0,
    success: 0,
    startDate: '',
    endDate: '',
  });
  
  // Add state to handle settings form visibility and form data
  const [showSettingsForm, setShowSettingsForm] = useState<boolean>(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [settingsData, setSettingsData] = useState({
    startTime: '',
    endTime: '',
    callsMade: 0,
    callDuration: 0,
  });

  const handleSettingsClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowSettingsForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettingsData((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSaveSettings = () => {
    if (selectedCampaign) {
      // You can save the settings data for the campaign here (e.g., make an API call to save the data).
      console.log('Saved settings:', { ...selectedCampaign, ...settingsData });
      setShowSettingsForm(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Render the settings form if it's visible */}
      {showSettingsForm && selectedCampaign && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Campaign Settings: {selectedCampaign.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={settingsData.startTime}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={settingsData.endTime}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Calls Made</label>
                <input
                  type="number"
                  name="callsMade"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={settingsData.callsMade}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Call Duration (in minutes)</label>
                <input
                  type="number"
                  name="callDuration"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={settingsData.callDuration}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mr-2"
                onClick={() => setShowSettingsForm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-blue-700"
                onClick={handleSaveSettings}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rendered Campaign Cards */}
      {campaignsData.map((campaign) => (
        <div key={campaign.id} className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
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
                ${campaign.status === 'Completed' ? 'bg-cyan-100 text-cyan-800' : ''}
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
                  className="h-full bg-cyan-600 rounded-full"
                  style={{ width: `${campaign.progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <button
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={() => handleSettingsClick(campaign)}
            >
              <SettingsIcon className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button className="px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100">
              Run this campaign
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AutoDialer;
