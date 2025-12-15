import { useForm } from 'react-hook-form';

import { sendContactForm } from '@/api/postRequest';
import { useContactSchema } from '@/components/forms/contact/useSchema';
import { yupResolver } from '@hookform/resolvers/yup';

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
