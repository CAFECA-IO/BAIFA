import { request } from '@/lib/utils/request';
import { IApiResponse } from '@/lib/utils/response';

/**
 * Info: (20260130 - Julian) Generic API fetcher that handles the standard IApiResponse wrapper.
 * @param url The API endpoint URL
 * @param options Request options (query, headers, etc.)
 * @returns The payload from the API response
 * @throws Error if the request fails or success is false
 */
export const fetchApi = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await request<IApiResponse<T>>(url, options);

  if (!response.success || response.payload === null) {
    throw new Error(response.message || 'API request failed');
  }

  return response.payload;
};
