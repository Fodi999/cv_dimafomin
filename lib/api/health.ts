import { apiFetch } from './base';

export const healthApi = {
  check: async () => {
    return apiFetch("/health");
  },
};
