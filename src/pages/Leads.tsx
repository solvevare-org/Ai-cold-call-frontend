import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Mail, Phone, MapPin, Trash2 } from 'lucide-react';
import axios from 'axios';

interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  lastContact: string;
}

const Leads = () => {
  const [leadsData, setLeadsData] = useState<Lead[]>([]);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: '',
    company: '',
    email: '',
    phone: '',
    location: '',
    status: 'New',
    lastContact: '',
  });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterTerm, setFilterTerm] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showDeleteOptions, setShowDeleteOptions] = useState<number | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/leads');
        setLeadsData(response.data);
      } catch (error) {
        console.error('Error fetching leads data:', error);
      }
    };

    fetchLeads();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLead((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const handleAddLead = async () => {
    if (!newLead.name || !newLead.company || !newLead.email || !newLead.phone || !newLead.location || !newLead.lastContact) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/leads', newLead);
      setLeadsData([...leadsData, response.data]);
      setNewLead({
        name: '',
        company: '',
        email: '',
        phone: '',
        location: '',
        status: 'New',
        lastContact: '',
      });
      setShowAddForm(false);
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding new lead:', error);
    }
  };

  const handleDeleteLead = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/leads/${id}`);
      setLeadsData(leadsData.filter((lead) => lead.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterTerm(e.target.value);
  };

  const toggleDeleteOptions = (id: number) => {
    setShowDeleteOptions((prev) => (prev === id ? null : id));
  };

  const filteredLeads = leadsData.filter((lead) => {
    return (
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterTerm === '' || lead.status.toLowerCase() === filterTerm.toLowerCase())
    );
  });

  const handleCancel = () => {
    setShowAddForm(false);
    setErrorMessage(' '); // Clear error message
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search leads..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Filter by status..."
            className="pl-4 pr-4 py-2 border rounded-lg w-full md:w-auto"
            value={filterTerm}
            onChange={handleFilterChange}
          />
          <button
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-blue-700 w-full md:w-auto"
            onClick={() => setShowAddForm(true)}
          >
            Add New Lead
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
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
            {filteredLeads.map((lead) => (
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
                  <div className="relative">
                    <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => toggleDeleteOptions(lead.id)}>
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </button>
                    {showDeleteOptions === lead.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                        <button
                          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left"
                          onClick={() => handleDeleteLead(lead.id)}
                        >
                          <Trash2 className="h-5 w-5 text-red-600" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Lead</h2>
            {errorMessage && (
              <div className="text-red-500 mb-4">
                {errorMessage}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newLead.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  name="company"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newLead.company}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newLead.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newLead.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newLead.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Last Contacted</label>
                <input
                  type="date"
                  name="lastContact"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newLead.lastContact}
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
                onClick={handleAddLead}
              >
                Add Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
