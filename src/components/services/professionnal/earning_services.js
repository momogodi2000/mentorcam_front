// services/earningsService.js
import backend_connection from '../backend_connection';

export const earningsService = {
  async getEarningsOverview() {
    const response = await backend_connection.get('/professional-earnings/');
    return response.data;
  },

  async getDetailedEarnings() {
    const response = await backend_connection.get('/professional-earnings/my_earnings/');
    return response.data;
  }
};
