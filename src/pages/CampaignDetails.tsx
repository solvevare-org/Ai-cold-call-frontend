import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Lead {
  [key: string]: any;
}

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [campaignName, setCampaignName] = useState<string>('');

  // Function to calculate max content length for each column
  const calculateMaxColumnWidths = () => {
    if (leads.length === 0) return {};

    const headers = Object.keys(leads[0]);
    const maxColumnWidths: { [key: string]: number } = {};

    headers.forEach((header) => {
      const headerLength = header.split('_')[0].length;

      const maxDataLength = Math.max(
        headerLength,
        ...leads.map((lead) => (lead[header] ? String(lead[header]).length : 4)) // Handle empty cells with 'null'
      );

      maxColumnWidths[header] = maxDataLength * 8; // 8px per character (adjust as needed)
    });

    return maxColumnWidths;
  };

  const columnWidths = calculateMaxColumnWidths();

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const campaignResponse = await axios.get(`http://localhost:3001/api/campaigns/${id}`);
        const formattedName = campaignResponse.data.name.split('_')[0];
        setCampaignName(formattedName);

        const leadsResponse = await axios.get(`http://localhost:3001/api/campaigns/${id}/leads`);
        setLeads(leadsResponse.data);

      } catch (error) {
        console.error('Error fetching campaign details:', error);
        alert('Failed to fetch campaign details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <h3 className="text-lg font-semibold mb-4">Leads for Campaign: {campaignName}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {leads.length > 0 && Object.keys(leads[0]).map((key) => (
                <th
                  key={key}
                  className="py-2 px-4 border border-gray-300 text-left text-sm font-medium text-gray-700"
                >
                  {key.split('_')[0]} {/* Extract part before first underscore */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {Object.keys(leads[0]).map((key, idx) => (
                    <td
                      key={idx}
                      className="py-2 px-4 border border-gray-300 text-sm text-gray-600 truncate"
                    >
                      {lead[key] ?? 'null'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={Object.keys(leads[0] || {}).length} className="py-4 text-center text-gray-500">
                  No leads available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignDetails;
