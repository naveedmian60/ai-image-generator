import api from '../api/axios';

export const imageService = {
  async generateImage(data) {
    const response = await api.post('/images/generate', data);
    return response.data.generation;
  },

  async getGenerations({ page = 1, limit = 24, model = 'all', q = '' } = {}) {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (model && model !== 'all') params.append('model', model);
    if (q) params.append('q', q);

    const response = await api.get(`/images?${params.toString()}`);
    return response.data;
  },

  async getGenerationById(id) {
    const response = await api.get(`/images/${id}`);
    return response.data.generation;
  },

  async deleteGeneration(id) {
    const response = await api.delete(`/images/${id}`);
    return response.data;
  },

  async downloadImage(imageUrl, prompt, date) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image for download');
      }
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;

      // Meaningful formatted filename: pixelforge-generated-YYYY-MM-DD.png
      const dateStr = date
        ? new Date(date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);
      const safePromptSlug = (prompt || 'creation')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 20);

      link.download = `pixelforge-${safePromptSlug}-${dateStr}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
      return true;
    } catch (err) {
      console.error('Download error:', err);
      // Fallback: direct window open
      window.open(imageUrl, '_blank');
      return false;
    }
  }
};

export default imageService;

