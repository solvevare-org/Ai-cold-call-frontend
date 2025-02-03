import React from 'react';
import { Search, Filter, MessageSquare, User, Clock } from 'lucide-react';

const conversationsData = [
  {
    id: 1,
    leadName: 'John Smith',
    company: 'Tech Solutions Inc',
    lastMessage: 'Discussed product features and pricing options...',
    timestamp: '10 mins ago',
    status: 'Positive',
    duration: '12:45',
  },
  {
    id: 2,
    leadName: 'Sarah Johnson',
    company: 'Healthcare Plus',
    lastMessage: 'Scheduled a follow-up demo for next week...',
    timestamp: '2 hours ago',
    status: 'Neutral',
    duration: '08:30',
  },
  {
    id: 3,
    leadName: 'Michael Chen',
    company: 'Global Finance Ltd',
    lastMessage: 'Requested more information about enterprise plan...',
    timestamp: '1 day ago',
    status: 'Positive',
    duration: '15:20',
  },
];

const Conversations = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="pl-10 pr-4 py-2 border rounded-lg w-80"
          />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {conversationsData.map((conversation) => (
          <div key={conversation.id} className="bg-white rounded-lg shadow p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{conversation.leadName}</h3>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{conversation.company}</span>
                  </div>
                  <p className="mt-1 text-gray-600">{conversation.lastMessage}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{conversation.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{conversation.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm
                ${conversation.status === 'Positive' ? 'bg-green-100 text-green-800' : ''}
                ${conversation.status === 'Neutral' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${conversation.status === 'Negative' ? 'bg-red-100 text-red-800' : ''}
              `}>
                {conversation.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Conversations;