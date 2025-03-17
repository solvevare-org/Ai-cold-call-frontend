import { Search, Plus, BarChart2, Users, Calendar, Settings as SettingsIcon, Trash2, PauseCircle, PlayCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Campaign {
  _id: string; // Use _id for MongoDB ObjectId
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
  website: ['Website URL', 'Business URL', 'Company Website'],
  label: ['Label'],
  state: ['OR', 'OH', 'WA', 'CT', 'CA', 'NY', 'TX', 'FL'],
  lastContact: ['Last Contacted', 'Last Called', 'Last Emailed'],
  TimeZone: ['PST', 'EST', 'MDT'],
  niche: ['Web Design', 'Web Development', 'Web Agency', 'SEO Agency', 'Digital Marketing', 'Healthcare', 'Finance', 'Real Estate', 'Education'],
  status: ['Lead', 'Prospect', 'VM', 'Status', 'Directory', 'Not Interested', 'Follow Up', 'Meeting', 'Demo', 'Negotiation', 'Closed', 'Other'],
  other: ['notes', 'source', 'other'],
};

const Campaigns = () => {
  const [campaignsData, setCampaignsData] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<Set<string>>(new Set()); // Use Set<string> for _id
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
  const [showMapping, setShowMapping] = useState<boolean>(false);
  const [sampleData, setSampleData] = useState<string[][]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch campaigns on component mount
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/campaigns');
        setCampaignsData(response.data);
      } catch (error) {
        console.error('Error fetching campaigns data:', error);
        alert('Failed to fetch campaigns. Please try again.');
      }
    };

    fetchCampaigns();
  }, []);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSettings(new Set()); // Close all settings
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle input change for new campaign form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCampaign((prevCampaign) => ({
      ...prevCampaign,
      [name]: value,
    }));
  };

  // Handle CSV file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFile(file);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        const rows = text.split('\n').map((row) => row.trim()).filter((row) => row);
        const headers = rows[0].split(',').map((header) => header.trim());
        const sampleData = rows.slice(1, 4).map((row) => row.split(',').map((cell) => cell.trim()));

        const validColumns = headers.filter((_, colIndex) => sampleData.some((row) => row[colIndex]));

        setCsvHeaders(validColumns.map((header) => ({ header, mappedTo: '' })));
        setShowMapping(true);
        setSampleData(sampleData.map((row) => row.filter((_, colIndex) => validColumns.includes(headers[colIndex]))));
      };
      reader.readAsText(file);
    }
  };

  // Handle field mapping change
  const handleMappingChange = (headerIndex: number, mappedTo: string) => {
    setCsvHeaders((prevHeaders) => {
      const newHeaders = [...prevHeaders];
      newHeaders[headerIndex] = { ...newHeaders[headerIndex], mappedTo };
      return newHeaders;
    });
  };

  // Handle adding a new campaign
  const handleAddCampaign = async () => {
    if (!newCampaign.name || !newCampaign.startDate || !newCampaign.endDate || !csvFile || !newCampaign.status) {
      alert('Please fill in all required fields and upload a CSV file.');
      return;
    }

    if (new Date(newCampaign.endDate) < new Date(newCampaign.startDate)) {
      alert('End date must be later than start date.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', newCampaign.name);
      formData.append('status', newCampaign.status);
      formData.append('startDate', newCampaign.startDate);
      formData.append('endDate', newCampaign.endDate);
      formData.append('csvFile', csvFile);
      formData.append('fieldMapping', JSON.stringify(csvHeaders));

      const response = await axios.post('http://localhost:3001/api/campaigns', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        alert('Campaign created successfully!');
        setCampaignsData((prev) => [...prev, { ...newCampaign, _id: response.data.campaignId } as Campaign]);
        setNewCampaign({ name: '', status: '', progress: 0, leads: 0, calls: 0, success: 0, startDate: '', endDate: '' });
        setCsvFile(null);
        setCsvHeaders([]);
        setShowMapping(false);
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      if (axios.isAxiosError(error)) {
        alert(`Error: ${error.response?.data?.message || 'Something went wrong'}`);
      } else {
        alert('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle campaign actions (delete, pause, activate)
  const handleCampaignAction = async (campaignId: string, action: 'delete' | 'pause' | 'activate') => {
    try {
      console.log('Campaign ID:', campaignId); // Debugging
      await axios.put(`http://localhost:3001/api/campaigns/${campaignId}/${action}`);

      if (action === 'delete') {
        setCampaignsData((campaigns) => campaigns.filter((c) => c._id !== campaignId));
      } else {
        setCampaignsData((campaigns) =>
          campaigns.map((campaign) => {
            if (campaign._id === campaignId) {
              return {
                ...campaign,
                status: action === 'pause' ? 'Paused' : 'Active',
              };
            }
            return campaign;
          })
        );
      }

      setShowSettings(new Set()); // Close settings after action
    } catch (error) {
      console.error(`Error ${action}ing campaign:`, error);
      if (axios.isAxiosError(error)) {
        alert(`Error: ${error.response?.data?.message || 'Something went wrong'}`);
      } else {
        alert('Something went wrong');
      }
    }
  };

  // Filter campaigns based on search term
  const filteredCampaigns = campaignsData.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[200]">
          <div className="bg-white p-6 rounded-lg shadow-lg">Loading...</div>
        </div>
      )}

      {/* Search and Add Campaign Button */}
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

      {/* Add Campaign Modal */}
      {showAddForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[50]" />
          <div className="fixed inset-0 flex items-center justify-center z-[100]">
            <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl my-8 overflow-y-auto max-h-[90vh]">
              <h2 className="text-lg font-semibold mb-4">Add New Campaign</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form Fields */}
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

                {/* Field Mapping */}
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
                            {Object.entries(FIELD_MAPPING_OPTIONS).map(([category, options]) => (
                              <optgroup key={category} label={`${category.charAt(0).toUpperCase() + category.slice(1)} Fields`}>
                                {options.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                            <option value="skip">Skip this field</option>
                          </select>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700">Sample Data</h4>
                      <table className="min-w-full bg-white border">
                        <thead>
                          <tr>
                            {csvHeaders.map((header, index) => (
                              <th key={index} className="py-2 px-4 border-b">
                                {header.header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sampleData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="py-2 px-4 border-b">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
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

      {/* Campaign List */}
      <div className="grid gap-6">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign._id} className="bg-white rounded-lg shadow">
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
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    campaign.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : campaign.status === 'Paused'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-cyan-100 text-cyan-800'
                  }`}
                >
                  {campaign.status}
                </span>
              </div>

              {/* Progress Bar */}
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

              {/* Campaign Metrics */}
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

            {/* Settings Button and Dropdown */}
            <div className="px-6 py-4 border-t flex justify-end gap-4">
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => {
                    const newShowSettings = new Set(showSettings);
                    if (newShowSettings.has(campaign._id)) {
                      newShowSettings.delete(campaign._id);
                    } else {
                      newShowSettings.add(campaign._id);
                    }
                    setShowSettings(newShowSettings);
                  }}
                >
                  <SettingsIcon className="h-3 w-3" />
                  <span>Settings</span>
                </button>

                {showSettings.has(campaign._id) && (
                  <div ref={dropdownRef} className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border py-1">
                    {campaign.status === 'Active' ? (
                      <button
                        className="w-full px-4 py-2 text-left text-yellow-600 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => handleCampaignAction(campaign._id, 'pause')}
                      >
                        <PauseCircle className="h-4 w-4" />
                        Pause Campaign
                      </button>
                    ) : (
                      <button
                        className="w-full px-4 py-2 text-left text-green-600 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => handleCampaignAction(campaign._id, 'activate')}
                      >
                        <PlayCircle className="h-4 w-4" />
                        Activate Campaign
                      </button>
                    )}
                    <button
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => handleCampaignAction(campaign._id, 'delete')}
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