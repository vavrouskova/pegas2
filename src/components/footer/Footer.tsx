import { getTranslations } from 'next-intl/server';
import React from 'react';

import { getPobockyPosts } from '@/api/wordpress-api';
import { BranchLinks } from '@/components/footer/BranchLinks';
import DirectorateInfo from '@/components/footer/DirectorateInfo';
import { FooterNavLinks } from '@/components/footer/FooterNavLinks';
import { LogoAndContact } from '@/components/footer/LogoAndContact';

const Footer = async () => {
  const t = await getTranslations();
  const pobockyData = await getPobockyPosts();

  const navLinks = [
    { href: `/${t('routes.gdpr')}`, label: t('footer.gdpr') },
    { href: `/${t('routes.consumer-information')}`, label: t('footer.consumer-information') },
    { href: `/${t('routes.cookies')}`, label: t('footer.cookies') },
  ];

  return (
    <footer
      id='main-footer'
      className='bg-primary mx-auto px-9 py-10 md:px-14 md:pt-31 md:pb-15'
    >
      <div className='max-w-container grid gap-10 lg:grid-cols-3 lg:gap-4'>
        <div className='flex flex-col-reverse justify-between gap-11 md:flex-col md:gap-0'>
          <LogoAndContact nonstopText={t('common.nonstop')} />
        </div>

        <div>
          <BranchLinks
            title={t('footer.all-branches')}
            branches={pobockyData}
          />
        </div>

        <div className='flex flex-col justify-between'>
          <BranchLinks
            title={t('footer.nonstop-branches')}
            branches={pobockyData}
            filterNonstop
            maxWidth='19.5rem'
          />
          <DirectorateInfo />
        </div>
      </div>

      <FooterNavLinks
        links={navLinks}
        copyrightText={`© 2025 PEGAS | ${t('footer.copyright')}`}
      />
    </footer>
  );
};

export default Footer;
