import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { getPostupPosts } from '@/api/wordpress-api';
import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import FooterClaim from '@/components/_shared/FooterClaim';
import PageHeroSection from '@/components/_shared/PageHeroSection';
import { FaqItem } from '@/components/faq/FaqItem';
import ContactForm from '@/components/forms/contact/ContactForm';
import { getSeoDataByUri } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('routes');

  return getSeoDataByUri('page', t('contacts'));
}

const FaqPage = async () => {
  const [t, postupPosts] = await Promise.all([getTranslations(), getPostupPosts()]);

  return (
    <main className='max-w-container relative mx-auto'>
      <Breadcrumbs
        className='px-4 pb-18 md:px-14 lg:pb-43'
        pageTitle={t('faq.page-title')}
      />

      <PageHeroSection
        title={t('faq.page-title')}
        description={t('faq.description')}
        classNameSection='px-4 md:px-14 pb-25 lg:px-14'
        classNameContent='max-w-dynamic-content mx-auto'
      />

      <section className='px-4 md:px-14'>
        <div className='max-w-dynamic-content mx-auto'>
          {postupPosts.length > 0 && (
            <div className='flex flex-col gap-4'>
              {postupPosts.map((postup) => (
                <FaqItem
                  key={postup.id}
                  postup={postup}
                  buttonText={t('common.go-to-page')}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactForm />

      <FooterClaim />
    </main>
  );
};

export default FaqPage;
