import { useTranslations } from 'next-intl';
import * as yup from 'yup';

export const useFlowerSchema = () => {
  const t = useTranslations('ceremonies.flower-form');

  return yup.object().shape({
    name: yup.string().required(t('errors.name-required')).label(t('fields.name')),
    email: yup
      .string()
      .email(t('errors.invalid-email'))
      .required(t('errors.email-required'))
      .label(t('fields.email')),
    phone: yup
      .string()
      .required(t('errors.phone-required'))
      .matches(
        // eslint-disable-next-line security/detect-unsafe-regex
        /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?[\d\s-]{3,}$/,
        t('errors.invalid-phone')
      )
      .label(t('fields.phone')),
    bouquet: yup.string().required(t('errors.bouquet-required')).label(t('fields.bouquet')),
    ribbon: yup.string().label(t('fields.ribbon')),
    message: yup.string().label(t('fields.message')),
  });
};
