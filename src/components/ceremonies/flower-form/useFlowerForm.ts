import { useForm } from 'react-hook-form';

import { useFlowerSchema } from '@/components/ceremonies/flower-form/useFlowerSchema';
import { yupResolver } from '@hookform/resolvers/yup';

const handleSubmit = async (values: any) => {
  // eslint-disable-next-line no-console
  console.info('Flower order submitted', values);
  await new Promise((resolve) => setTimeout(resolve, 600));
};

export const useFlowerForm = () => {
  const formSchema = useFlowerSchema();

  const form = useForm({
    resolver: yupResolver(formSchema),
  });

  return { form, handleSubmit };
};
