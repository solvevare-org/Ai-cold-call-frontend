import React, { useState, useEffect } from 'react';
import { User, Phone } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

interface ScheduleItem {
  id: number;
  date: string;
  time: string;
  duration: string;
  leadName: string;
  company: string;
  type: string;
  status: string;
}

const Schedule = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState<boolean>(false);
  const [newSchedule, setNewSchedule] = useState<ScheduleItem>({
    id: 0,
    date: '',
    time: '',
    duration: '',
    leadName: '',
    company: '',
    type: 'Call',
    status: 'Scheduled',
  });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/schedule');
        console.log('Fetched schedule data:', response.data);
        setScheduleData(response.data);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        setErrorMessage('Failed to load schedule data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSchedule((prevSchedule) => ({
      ...prevSchedule,
      [name]: value,
    }));
  };

  const handleScheduleCall = async () => {
    if (!newSchedule.date || !newSchedule.time || !newSchedule.duration || !newSchedule.leadName || !newSchedule.company) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/schedule', newSchedule);
      console.log('Scheduled new call:', response.data);
      setScheduleData([...scheduleData, response.data]);
      setNewSchedule({
        id: 0,
        date: '',
        time: '',
        duration: '',
        leadName: '',
        company: '',
        type: 'Call',
        status: 'Scheduled',
      });
      setShowScheduleForm(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Error scheduling call:', error);
      setErrorMessage('Failed to schedule call.');
    }
  };

  const handleCancel = () => {
    setShowScheduleForm(false);
    setErrorMessage('');
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {loading ? (
        <div>Loading...</div>
      ) : errorMessage ? (
        <div className="text-red-500">{errorMessage}</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <button
              className="w-full md:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-blue-700"
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

          {showScheduleForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
                <h2 className="text-lg font-semibold mb-4">Schedule Call</h2>
                {errorMessage && (
                  <div className="text-red-500 mb-4">
                    {errorMessage}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Lead Name</label>
                    <input
                      type="text"
                      name="leadName"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={newSchedule.leadName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      name="company"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={newSchedule.company}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      name="date"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={newSchedule.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Time</label>
                    <input
                      type="time"
                      name="time"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={newSchedule.time}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Call Duration</label>
                    <input
                      type="text"
                      name="duration"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={newSchedule.duration}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 mr-2"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={handleScheduleCall}
                  >
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow divide-y">
            {scheduleData.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No scheduled calls.</div>
            ) : (
              scheduleData.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex flex-col items-center md:items-start">
                        <span className="text-lg font-semibold text-gray-900">{format(new Date(`${item.date}T${item.time}`), 'hh:mm a')}</span>
                        <span className="text-sm text-gray-500">{item.duration}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.type}</h3>
                        <div className="mt-1 flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{item.leadName}</span>
                          <span className="text-gray-400">•</span>
                          <span>{item.company}</span>
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
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Schedule;