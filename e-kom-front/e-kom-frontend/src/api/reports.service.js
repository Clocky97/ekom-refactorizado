 import api from './api';


 export const getReports = async () => {
    const response = await api.get('/report');
    return response.data;
  }

 export const deleteReport = async (id) => {
    const response = await api.delete(`/report/${id}`);
    return response.data;
  }