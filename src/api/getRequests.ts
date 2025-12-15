import { ApiResponse, makeApiCall } from '@/api/backendApi';
import { Category, ParametersType } from '@/utils/types';

export const getGeneralRequest = async (
  endpoint: string,
  // eslint-disable-next-line no-undef
  options?: RequestInit,
  parameters?: ParametersType
): Promise<ApiResponse> => {
  const baseOptions = options ?? {};
  const hasNoStore = (baseOptions as any).cache === 'no-store';
  const originalNext = (baseOptions as any).next ?? {};
  const hasExplicitRevalidate = (originalNext as any).revalidate !== undefined;

  // Avoid specifying both cache: 'no-store' and next.revalidate simultaneously
  // eslint-disable-next-line no-undef
  const mergedOptions: RequestInit =
    hasNoStore || hasExplicitRevalidate
      ? { ...baseOptions, next: { ...originalNext } }
      : { ...baseOptions, next: { ...originalNext, revalidate: 86_400 } };

  return makeApiCall(`/${process.env.DOMAIN_ID ?? '2'}/wp-json/wp/v2/${endpoint}`, mergedOptions, parameters);
};

/****************************************************/

export const getPages = async <T>(parameters?: ParametersType): Promise<ApiResponse<T[]>> =>
  getGeneralRequest(
    'pages',
    {
      method: 'GET',
    },
    parameters
  );

/****************************************************/

export const getCategories = async (parameters?: ParametersType): Promise<ApiResponse<Category[]>> =>
  getGeneralRequest(
    'categories',
    {
      method: 'GET',
    },
    parameters
  );

/****************************************************/
