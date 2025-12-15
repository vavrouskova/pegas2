import { useTranslations } from 'next-intl';
import * as yup from 'yup';

export const useContactSchema = () => {
  const t = useTranslations('forms');

  return yup.object().shape({
    name: yup.string().required(t('errors.name_required')).label(t('fields.name')),
    email: yup.string().email(t('errors.invalid_email')).required(t('errors.email_required')).label(t('fields.email')),
    phone: yup
      .string()
      .matches(
        // eslint-disable-next-line security/detect-unsafe-regex
        /^(\+?\d{1,4}[\s-]?)?(\(?\d{1,4}\)?[\s-]?)?[\d\s-]{3,}$/,
        t('errors.invalid_phone')
      )
      .label(t('fields.phone')),
    message: yup.string().label(t('fields.message')),
    deceasedName: yup.string().label(t('fields.deceased-name')),
    deceasedDate: yup.string().label(t('fields.deceased-date')),
    deceasedPlace: yup.string().label(t('fields.deceased-place')),
    note: yup.string().label(t('fields.note')),
  });
};
