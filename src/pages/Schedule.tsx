import React, { useState, useEffect } from 'react';
import { User, Phone, X, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { format, parseISO, isValid } from 'date-fns';

interface ScheduleItem {
  _id: string;
  date: string;
  time: string;
  status: string;
  campaign: {
    _id: string;
    name: string;
  };
  totalCalls: number;
}

interface Campaign {
  _id: string;
  name: string;
}

interface Lead {
  [key: string]: any;
}

interface CallDetailsResponse {
  scheduleDetails: ScheduleItem[];
  leads: Lead[];
  totalLeads: number;
}

const Schedule = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState<boolean>(false);
  const [newSchedule, setNewSchedule] = useState<Omit<ScheduleItem, '_id' | 'campaign'> & { campaign: string }>({
    date: '',
    time: '',
    status: 'Scheduled',
    campaign: '',
    totalCalls: 0,
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [callDetails, setCallDetails] = useState<ScheduleItem[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Fetch schedules and campaigns on component mount
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/schedule');
        setScheduleData(response.data);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        setErrorMessage('Failed to load schedule data.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/campaigns');
        setCampaigns(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    fetchSchedule();
    fetchCampaigns();
  }, []);

  // Handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSchedule((prevSchedule) => ({
      ...prevSchedule,
      [name]: value,
    }));
  };

  // Handle campaign selection and fetch statuses
  const handleCampaignChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const campaignId = e.target.value;
    setNewSchedule((prevSchedule) => ({
      ...prevSchedule,
      campaign: campaignId,
    }));

    try {
      const response = await axios.get(`http://localhost:3001/api/schedule/${campaignId}/statuses`);
      const uniqueStatuses = Array.from(new Set(response.data));
      setStatuses(uniqueStatuses as string[]);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      setStatuses([]);
    }
  };

  // Fetch call details based on selected campaign and status
  const fetchCallDetails = async (campaignId: string, status: string) => {
    try {
      const response = await axios.get<CallDetailsResponse>(
        `http://localhost:3001/api/schedule/${campaignId}/calls?status=${status}`
      );
      setCallDetails(response.data.scheduleDetails);
      setLeads(response.data.leads);
    } catch (error) {
      console.error('Error fetching call details:', error);
      setErrorMessage('Failed to fetch call details.');
    }
  };

  // Handle form submission to schedule a new call
  const handleScheduleCall = async () => {
    if (!newSchedule.date || !newSchedule.time || !newSchedule.campaign || !newSchedule.totalCalls) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/schedule', newSchedule);
      setScheduleData([...scheduleData, response.data]);
      setNewSchedule({
        date: '',
        time: '',
        status: 'Scheduled',
        campaign: '',
        totalCalls: 0,
      });
      setShowScheduleForm(false);
      setErrorMessage('');
    } catch (error: any) {
      console.error('Error scheduling call:', error);
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(`Failed to schedule call: ${error.response.data.message || 'Server error'}`);
      } else {
        setErrorMessage(`Failed to schedule call: ${error.message}`);
      }
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    setShowScheduleForm(false);
    setErrorMessage('');
  };

  // Handle schedule item click to fetch and display call details
  const handleScheduleItemClick = (schedule: ScheduleItem) => {
    if (selectedSchedule?._id === schedule._id) {
      setSelectedSchedule(null);
    } else {
      setSelectedSchedule(schedule);
      fetchCallDetails(schedule.campaign._id, schedule.status);
    }
  };

  // Toggle row expansion
  const toggleRowExpand = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  // Helper function to safely format date and time
  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return 'Not scheduled';
    
    try {
      const dateTime = parseISO(`${date}T${time}`);
      return isValid(dateTime) ? format(dateTime, 'hh:mm a') : 'Invalid time';
    } catch (error) {
      console.error('Error formatting date/time:', error);
      return 'Invalid time';
    }
  };

  // Helper function to format date
  const formatDate = (date: string) => {
    if (!date) return 'No date';
    try {
      const parsedDate = parseISO(date);
      return isValid(parsedDate) ? format(parsedDate, 'MMM d, yyyy') : 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {errorMessage && !showScheduleForm && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{errorMessage}</div>
      )}

      {/* Schedule Call Button and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button
          className="w-full md:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          onClick={() => setShowScheduleForm(true)}
        >
          Schedule Call
        </button>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="w-full md:w-auto px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Day</button>
          <button className="w-full md:w-auto px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">Week</button>
          <button className="w-full md:w-auto px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Month</button>
        </div>
      </div>

      {/* Schedule Call Form */}
      {showScheduleForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold mb-4">Schedule Call</h2>
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {errorMessage}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Campaign*</label>
                <select
                  name="campaign"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  value={newSchedule.campaign}
                  onChange={handleCampaignChange}
                  required
                >
                  <option value="">Select a campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign._id} value={campaign._id}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status*</label>
                <select
                  name="status"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  value={newSchedule.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Total Calls*</label>
                <input
                  type="number"
                  name="totalCalls"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  value={newSchedule.totalCalls}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Date*</label>
                <input
                  type="date"
                  name="date"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  value={newSchedule.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Time*</label>
                <input
                  type="time"
                  name="time"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                  value={newSchedule.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                onClick={handleScheduleCall}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule List */}
      <div className="bg-white rounded-lg shadow divide-y">
        {scheduleData.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No scheduled calls found.</div>
        ) : (
          scheduleData.map((item) => (
            <div key={item._id}>
              <div 
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleScheduleItemClick(item)}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col items-center md:items-start">
                      <span className="text-lg font-semibold text-gray-900">
                        {formatDateTime(item.date, item.time)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Call</h3>
                      <div className="mt-1 flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{item.campaign?.name || 'Unknown Campaign'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm
                      ${item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                      ${item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                    `}>
                      {item.status}
                    </span>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRowExpand(item._id);
                      }}
                    >
                      {expandedRows.has(item._id) ? (
                        <ChevronUp className="h-5 w-5 text-cyan-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-cyan-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Lead Details */}
              {expandedRows.has(item._id) && (
                <div className="px-6 pb-6 bg-gray-50">
                  <div className="mt-4 overflow-x-auto">
                    <div className="text-sm font-medium mb-2">
                      Total Leads: {leads.length}
                    </div>
                    {leads.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            {Object.keys(leads[0]).map((header) => (
                              <th
                                key={header}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {leads.map((lead, index) => (
                            <tr key={index}>
                              {Object.keys(leads[0]).map((header) => (
                                <td
                                  key={`${index}-${header}`}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >
                                  {lead[header] || 'N/A'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-4 text-center text-gray-500">No leads found for this campaign.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Schedule;