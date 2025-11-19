import { ApiResponse, makeApiCall } from '@/api/backendApi';
import { ParametersType } from '@/utils/types';

export const sendContactForm = async (body?: ParametersType): Promise<ApiResponse> =>
  makeApiCall('/wp-json/api/v1/form-process', {
    method: 'POST',
    body: JSON.stringify(body),
  });

/****************************************************/
