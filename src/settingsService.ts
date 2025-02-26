// filepath: /c:/Users/Ahmer/Downloads/AI cold caller/project 2/react-frontend/src/settingsService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Update with your backend URL

export const getSettings = async () => {
  try {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSettings = async (settingsData: any) => {
  try {
    const response = await axios.put(`${API_URL}/settings`, settingsData);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};