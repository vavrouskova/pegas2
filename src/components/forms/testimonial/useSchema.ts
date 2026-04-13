import { useTranslations } from 'next-intl';
import * as yup from 'yup';

export const useTestimonialSchema = () => {
  const t = useTranslations('forms');
  const tForm = useTranslations('wrote-about-us.form');

  return yup.object().shape({
    name: yup.string().required(t('errors.name_required')).label(t('fields.name')),
    email: yup.string().email(t('errors.invalid_email')).required(t('errors.email_required')).label(t('fields.email')),
    message: yup.string().required(tForm('errors.message_required')).label(tForm('fields.message')),
  });
};
