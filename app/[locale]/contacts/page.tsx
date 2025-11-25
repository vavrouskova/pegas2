import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import FooterClaim from '@/components/_shared/FooterClaim';
import PartnersSection from '@/components/_shared/PartnersSection';
import ContactForm from '@/components/forms/contact/ContactForm';
import ContactInfoSection from '@/components/contacts/ContactInfoSection';
import ContactPeopleSection from '@/components/contacts/ContactPeopleSection';
import { getContactPeople } from '@/api/wordpress-api';
import { getSeoDataByUri } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('contacts'));
}

const ContactsPage = async () => {
  const [t, contactPeople] = await Promise.all([getTranslations(), getContactPeople()]);

  return (
    <main className='max-w-container relative mx-auto'>
      <section className='px-4 sm:px-14'>
        <Breadcrumbs
          className='pb-18 lg:pb-43'
          pageTitle={t('contacts.page-title')}
        />
      </section>

      <ContactForm />

      <ContactInfoSection />

      <ContactPeopleSection
        people={contactPeople}
        title={t('contacts.people-section-title')}
      />

      <PartnersSection />

      <FooterClaim />
    </main>
  );
};

export default ContactsPage;
