import { ParametersType } from '@/utils/types';

export const sendContactForm = async (body?: ParametersType) => {
  const response = await fetch('/api/v1/form-process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || `Form submission failed (${response.status})`);
  }

  return response.json();
};

/****************************************************/
