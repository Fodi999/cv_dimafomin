import { apiFetch } from './base';

export const contactApi = {
  sendMessage: async (data: {
    name: string;
    email: string;
    message: string;
  }) => {
    return apiFetch("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
