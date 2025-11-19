import { useForm } from 'react-hook-form';

import { sendContactForm } from '@/api/postRequest';

import { yupResolver } from '@hookform/resolvers/yup';
import { useContactSchema } from '@/components/forms/contact/useSchema';

const handleSubmit = async (values: any) => {
  await sendContactForm(values);
};

export const useContactForm = () => {
  const formSchema = useContactSchema();

  const form = useForm({
    resolver: yupResolver(formSchema),
  });

  return { handleSubmit, form };
};
