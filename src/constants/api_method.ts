import { IApiMethod } from '@/interfaces/api_method';

export const API_METHOD: { [key: string]: IApiMethod } = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};
