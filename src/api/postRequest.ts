import { ParametersType } from '@/utils/types';

export const sendContactForm = async (body?: ParametersType) => {
  const response = await fetch('/api/v1/form-process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.json();
};

/****************************************************/
