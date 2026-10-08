import api from '../api/axios';

export const modelService = {
  async getModels() {
    const response = await api.get('/models');
    return response.data.models;
  }
};

export default modelService;

