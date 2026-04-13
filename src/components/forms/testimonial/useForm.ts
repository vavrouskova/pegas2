import { useForm } from 'react-hook-form';

import { sendContactForm } from '@/api/postRequest';
import { useTestimonialSchema } from '@/components/forms/testimonial/useSchema';
import { yupResolver } from '@hookform/resolvers/yup';

const handleSubmit = async (values: any) => {
  await sendContactForm(values);
};

export const useTestimonialForm = () => {
  const formSchema = useTestimonialSchema();

  const form = useForm({
    resolver: yupResolver(formSchema),
  });

  return { handleSubmit, form };
};
