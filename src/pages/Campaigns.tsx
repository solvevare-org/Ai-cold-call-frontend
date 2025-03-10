import { Search, Plus, BarChart2, Users, Calendar, Settings as SettingsIcon, Trash2, PauseCircle, PlayCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

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

interface CSVHeader {
  header: string;
  mappedTo: string;
}

const FIELD_MAPPING_OPTIONS = {
  name: ['Organization Name', 'Business Name', 'Office Name', 'CEO Name'],
  phone: ['Cell Phone', 'Office Phone', 'Business Phone', 'Contact Number'],
  email: ['Email Address', 'Business Email', 'Contact Email', 'Support Email'],
  website: ['Website URL', 'Business URL', 'Company Website']
};

const Campaigns = () => {
  const [campaignsData, setCampaignsData] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<number | null>(null);
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
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<CSVHeader[]>([]);
  const [showMapping, setShowMapping] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/campaigns');
        setCampaignsData(response.data);
      } catch (error) {
        console.error('Error fetching campaigns data:', error);
      }
    };

    fetchCampaigns();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCampaign((prevCampaign) => ({
      ...prevCampaign,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);
      
      // Read CSV headers
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const headers = text.split('\n')[0].split(',').map(header => header.trim());
        setCsvHeaders(headers.map(header => ({ header, mappedTo: '' })));
        setShowMapping(true);
      };
      reader.readAsText(file);
    }
  };

  const handleMappingChange = (headerIndex: number, mappedTo: string) => {
    setCsvHeaders(prevHeaders => {
      const newHeaders = [...prevHeaders];
      newHeaders[headerIndex] = { ...newHeaders[headerIndex], mappedTo };
      return newHeaders;
    });
  };

  const handleAddCampaign = async () => {
    if (!newCampaign.name || !newCampaign.startDate || !newCampaign.endDate) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newCampaign.name as string);
      formData.append('status', newCampaign.status as string);
      formData.append('startDate', newCampaign.startDate as string);
      formData.append('endDate', newCampaign.endDate as string);
      if (csvFile) {
        formData.append('csvFile', csvFile);
        formData.append('fieldMapping', JSON.stringify(csvHeaders));
      }

      const response = await axios.post('http://localhost:3001/api/campaigns', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setCampaignsData([...campaignsData, response.data]);
      setNewCampaign({
        name: '',
        status: 'Active',
        progress: 0,
        leads: 0,
        calls: 0,
        success: 0,
        startDate: '',
        endDate: '',
      });
      setCsvFile(null);
      setCsvHeaders([]);
      setShowMapping(false);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating new campaign:', error);
    }
  };

  const handleCampaignAction = async (campaignId: number, action: 'delete' | 'pause' | 'activate') => {
    try {
      await axios.put(`http://localhost:3001/api/campaigns/${campaignId}/${action}`);
      
      // Update local state based on action
      if (action === 'delete') {
        setCampaignsData(campaigns => campaigns.filter(c => c.id !== campaignId));
      } else {
        setCampaignsData(campaigns => campaigns.map(campaign => {
          if (campaign.id === campaignId) {
            return {
              ...campaign,
              status: action === 'pause' ? 'Paused' : 'Active'
            };
          }
          return campaign;
        }));
      }
      
      setShowSettings(null);
    } catch (error) {
      console.error(`Error ${action}ing campaign:`, error);
    }
  };

  const filteredCampaigns = campaignsData.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search campaigns..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 w-full md:w-auto"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-5 w-5" />
          <span>New Campaign</span>
        </button>
      </div>

      {showAddForm && (
  <>
    {/* Backdrop */}
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[50]" />

    {/* Modal */}
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl my-8 overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-semibold mb-4">Add New Campaign</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-3 py-2 border rounded-lg"
              value={newCampaign.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              className="w-full px-3 py-2 border rounded-lg"
              value={newCampaign.startDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              className="w-full px-3 py-2 border rounded-lg"
              value={newCampaign.endDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              className="w-full px-3 py-2 border rounded-lg"
              value={newCampaign.status}
              onChange={handleInputChange}
            >
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Import CSV</label>
            <input
              type="file"
              accept=".csv"
              className="w-full px-3 py-2 border rounded-lg"
              onChange={handleFileChange}
            />
          </div>

          {showMapping && csvHeaders.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="text-md font-semibold mb-3">Map CSV Fields</h3>
              <div className="space-y-4">
                {csvHeaders.map((header, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600 min-w-[150px]">
                      {header.header}
                    </span>
                    <select
                      className="flex-1 px-3 py-2 border rounded-lg"
                      value={header.mappedTo}
                      onChange={(e) => handleMappingChange(index, e.target.value)}
                    >
                      <option value="">Select field type</option>
                      <optgroup label="Name Fields">
                        {FIELD_MAPPING_OPTIONS.name.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Phone Fields">
                        {FIELD_MAPPING_OPTIONS.phone.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Email Fields">
                        {FIELD_MAPPING_OPTIONS.email.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Website Fields">
                        {FIELD_MAPPING_OPTIONS.website.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </optgroup>
                      <option value="skip">Skip this field</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mr-2"
            onClick={() => {
              setShowAddForm(false);
              setCsvHeaders([]);
              setShowMapping(false);
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
            onClick={handleAddCampaign}
          >
            Add Campaign
          </button>
        </div>
      </div>
    </div>
  </>
)}


      <div className="grid gap-6">
        {filteredCampaigns.map((campaign) => (
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
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setShowSettings(showSettings === campaign.id ? null : campaign.id)}
                >
                  <SettingsIcon className="h-3 w-3" />
                  <span>Settings</span>
                </button>
                
                {showSettings === campaign.id && (
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border py-1">
                    {campaign.status === 'Active' ? (
                      <button
                        className="w-full px-4 py-2 text-left text-yellow-600 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => handleCampaignAction(campaign.id, 'pause')}
                      >
                        <PauseCircle className="h-4 w-4" />
                        Pause Campaign
                      </button>
                    ) : (
                      <button
                        className="w-full px-4 py-2 text-left text-green-600 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => handleCampaignAction(campaign.id, 'activate')}
                      >
                        <PlayCircle className="h-4 w-4" />
                        Activate Campaign
                      </button>
                    )}
                    <button
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => handleCampaignAction(campaign.id, 'delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Campaign
                    </button>
                  </div>
                )}
              </div>
              <button className="px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100">
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