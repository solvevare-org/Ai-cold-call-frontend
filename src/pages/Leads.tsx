import React from 'react';
import { Search, Filter, MoreVertical, Mail, Phone, MapPin } from 'lucide-react';

const leadsData = [
  {
    id: 1,
    name: 'John Smith',
    company: 'Tech Solutions Inc',
    email: 'john.smith@techsolutions.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    status: 'New',
    lastContact: '2024-02-03',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    company: 'Healthcare Plus',
    email: 'sarah.j@healthcareplus.com',
    phone: '+1 (555) 234-5678',
    location: 'Los Angeles, USA',
    status: 'Contacted',
    lastContact: '2024-02-02',
  },
  {
    id: 3,
    name: 'Michael Chen',
    company: 'Global Finance Ltd',
    email: 'm.chen@globalfinance.com',
    phone: '+1 (555) 345-6789',
    location: 'Chicago, USA',
    status: 'Qualified',
    lastContact: '2024-02-01',
  },
];

const Leads = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search leads..."
            className="pl-10 pr-4 py-2 border rounded-lg w-80"
          />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add New Lead
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Company</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Location</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Last Contact</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {leadsData.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{lead.name}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{lead.company}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{lead.phone}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{lead.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm
                    ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' : ''}
                    ${lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${lead.status === 'Qualified' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{lead.lastContact}</td>
                <td className="px-6 py-4">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <MoreVertical className="h-5 w-5 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;