import React from 'react';
import { Calendar as CalendarIcon, Clock, User, Phone } from 'lucide-react';

const scheduleData = [
  {
    id: 1,
    time: '09:00 AM',
    duration: '30 min',
    leadName: 'John Smith',
    company: 'Tech Solutions Inc',
    type: 'Follow-up Call',
    status: 'Scheduled',
  },
  {
    id: 2,
    time: '10:30 AM',
    duration: '45 min',
    leadName: 'Sarah Johnson',
    company: 'Healthcare Plus',
    type: 'Initial Contact',
    status: 'In Progress',
  },
  {
    id: 3,
    time: '02:00 PM',
    duration: '30 min',
    leadName: 'Michael Chen',
    company: 'Global Finance Ltd',
    type: 'Demo Call',
    status: 'Completed',
  },
];

const Schedule = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Schedule Call
          </button>
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
            <CalendarIcon className="h-5 w-5 text-gray-400" />
            <input type="date" className="text-gray-600" />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Day</button>
          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">Week</button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Month</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow divide-y">
        {scheduleData.map((item) => (
          <div key={item.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold text-gray-900">{item.time}</span>
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
        ))}
      </div>
    </div>
  );
};

export default Schedule;