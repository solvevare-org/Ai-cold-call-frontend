// filepath: /c:/Users/Ahmer/Downloads/AI cold caller/project 2/react-frontend/src/apiService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Update with your backend URL

export const makeCall = async (callData: any) => {
  try {
    const response = await axios.post(`${API_URL}/call`, callData);
    return response.data;
  } catch (error) {
    console.error('Error making call:', error);
    throw error;
  }
};