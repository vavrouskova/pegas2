import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';

import { getBranches, getContactPeople } from '@/api/wordpress-api';
import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import FooterClaim from '@/components/_shared/FooterClaim';
import PartnersSection from '@/components/_shared/PartnersSection';
import BranchesMapSection from '@/components/branches/BranchesMapSection';
import BranchesSection from '@/components/branches/BranchesSection';
import ContactInfoSection from '@/components/contacts/ContactInfoSection';
import ContactPeopleSection from '@/components/contacts/ContactPeopleSection';
import ContactForm from '@/components/forms/contact/ContactForm';
import { isMobileUserAgent } from '@/utils/helper';
import { getSeoDataByUri } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('contacts'));
}

const ContactsPage = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = isMobileUserAgent(userAgent);

  const [t, contactPeople, branches] = await Promise.all([getTranslations(), getContactPeople(), getBranches()]);

  return (
    <main className='max-w-container relative mx-auto'>
      <section className='px-4 lg:px-14'>
        <Breadcrumbs
          className='pb-23'
          pageTitle={t('contacts.page-title')}
        />
      </section>

      {!isMobile && (
        <BranchesMapSection
          branches={branches}
          title={t('contacts.map-section-title')}
        />
      )}

      <BranchesSection
        branches={branches}
        title={t('contacts.weekend-branches-section-title')}
        filterType='weekend'
        className='lg:pb-0!'
      />

      <BranchesSection
        branches={branches}
        title={t('contacts.showroom-branches-section-title')}
        filterType='showroom'
        className='lg:pb-0!'
      />

      <BranchesSection
        branches={branches}
        title={t('contacts.branches-section-title')}
      />

      <ContactForm />

      <ContactPeopleSection
        people={contactPeople}
        title={t('contacts.people-section-title')}
      />

      <ContactInfoSection />

      <PartnersSection />

      <FooterClaim />
    </main>
  );
};

export default ContactsPage;
