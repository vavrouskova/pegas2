import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import Breadcrumbs from '@/components/_shared/Breadcrumbs';
import ContentSection from '@/components/_shared/ContentSection';
import FooterClaim from '@/components/_shared/FooterClaim';
import PageHeroSection from '@/components/_shared/PageHeroSection';
import TestimonialsSection from '@/components/_shared/TestimonialsSection';
import { Testimonial } from '@/components/_shared/TestimonialCard';
import TestimonialForm from '@/components/forms/testimonial/TestimonialForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('wrote-about-us');

  return {
    title: t('page-title'),
  };
}

// TODO: Replace with WordPress API call when napsaliPost type is available
const getDemoTestimonials = (): Testimonial[] => [
  {
    id: '1',
    date: '12. dubna 2026',
    greeting: 'Dobrý den,',
    content:
      'Poslední rozloučení s paní Hanou Novotnou se konalo v obřadní síni ve Strašnicích. Obřad byl laděn do světlých tónů, které odrážely radostné vzpomínky rodiny a přátel. Prostor zdobily jemné květiny v bílé a růžové barvě, zvolené tak, aby doplnily klidnou atmosféru.\n\nHosté přicházeli ve světlém oblečení, jak si rodina přála, a přinášeli drobné kytice či jednotlivé květy. Celé setkání proběhlo v tichosti a s úctou, s důrazem na zachování vzpomínek, které rodina i přátelé nesou ve svých srdcích.',
    signature: 'S úctou, A. N.',
    variant: 'light',
  },
  {
    id: '2',
    date: '5. dubna 2026',
    greeting: 'Vážený pane Hamane,',
    content:
      'rád bych Vám touto cestou poděkoval a zároveň se s Vámi podělil o svou osobní zkušenost.\n\nZnáme se z VIP A. C. v Č., a protože jsem se zúčastnil Vaší prezentace, rozhodl jsem se v těžké rodinné situaci obrátit právě na Vaší pohřební službu Pegas.',
    signature: 'S pozdravem, R. K.',
    variant: 'dark',
  },
  {
    id: '3',
    date: '29. března 2026',
    greeting: 'Dobrý den,',
    content: 'moc děkujeme za vše, co jste pro nás udělali. Nemáme slov.',
    signature: 'Rodina Šťastných',
    variant: 'light',
  },
  {
    id: 'promo-1',
    date: '',
    greeting: 'Rozloučení s mistrem Karlem Gottem',
    content: 'Podívejte se, jak probíhalo rozloučení s legendou české hudby.',
    signature: '',
    variant: 'promo',
    image: {
      src: 'https://wp.pohrebpegas.cz/cz/wp-content/uploads/sites/2/2026/01/pegas-gott.webp',
      alt: 'Rozloučení s Karlem Gottem',
    },
    promoLink: {
      href: '/reference-rozlouceni-s-mistrem-karlem-gottem',
      label: 'Přečíst celý příběh',
    },
  },
  {
    id: '4',
    date: '22. března 2026',
    greeting: 'Dobrá paní Kovářová,',
    content:
      'Poslední rozloučení s naší maminkou se konalo v obřadní síni ve Strašnicích. Obřad byl laděn do světlých tónů, které odrážely radostné vzpomínky rodiny a přátel. Prostor zdobily jemné květiny v bílé a růžové barvě, zvolené tak, aby doplnily klidnou atmosféru.\n\nHosté přicházeli ve světlém oblečení, jak si rodina přála, a přinášeli drobné kytice či jednotlivé květy. Celé setkání proběhlo v tichosti a s úctou.',
    signature: 'Se srdečným pozdravem, E. V.',
    variant: 'light',
    image: {
      src: 'https://wp.pohrebpegas.cz/cz/wp-content/uploads/sites/2/2025/12/pegas-fialova-kvetina2.webp',
      alt: 'Smuteční květiny',
    },
  },
  {
    id: '5',
    date: '14. března 2026',
    greeting: 'Vážený pane Hamane,',
    content:
      'rád bych Vám touto cestou poděkoval a zároveň se s Vámi podělil o svou osobní zkušenost.\n\nNavštívili jsme pobočku U Vinohradské nemocnice, kde se nám věnovala paní Barbora Kovářová. Rád bych vyjádřil své upřímné uznání za její mimořádně profesionální, lidský a vstřícný přístup. Paní Kovářová s námi zůstala i po své pracovní době, aby s námi vše důležité dojednala, a celou situaci nás velmi citlivě provedla.\n\nJeště jednou děkuji a vážím si kvality služeb, které poskytujete.\n\nTěším se brzy na viděnou.',
    signature: 'S úctou, M. C.',
    variant: 'light',
  },
  {
    id: '6',
    date: '7. března 2026',
    greeting: 'Dobrý den,',
    content:
      'chtěla bych Vám poděkovat za citlivý přístup při zajištění rozloučení s mým dědečkem. Prostor zdobily jemné květiny v bílé a růžové barvě, zvolené tak, aby doplnily klidnou atmosféru.',
    signature: 'H. P.',
    variant: 'light',
  },
  {
    id: '7',
    date: '28. února 2026',
    greeting: 'Vážení,',
    content:
      'chtěli bychom vyjádřit hluboké poděkování za důstojné rozloučení s naším tatínkem.\n\nZnáme se z VIP A. C. v Č., a protože jsem se zúčastnil Vaší prezentace, rozhodl jsem se v těžké rodinné situaci obrátit právě na Vaší pohřební službu Pegas.',
    signature: 'Rodina Benešových',
    variant: 'dark',
  },
  {
    id: '8',
    date: '19. února 2026',
    greeting: 'Dobrý den,',
    content: 'za celou rodinu děkujeme. Bylo to přesně tak, jak jsme si přáli.',
    signature: 'J. a M. Tomanovi',
    variant: 'light',
  },
  {
    id: '9',
    date: '10. února 2026',
    greeting: 'Milá paní Nováková,',
    content:
      'píši Vám s velkým zpožděním, ale chtěla jsem Vám ještě jednou poděkovat za Váš přístup. Pomohla jste nám v nejtěžší chvíli a my na to nikdy nezapomeneme.',
    signature: 'S vděčností, K. R.',
    variant: 'light',
  },
  {
    id: '10',
    date: '18. dubna 2026',
    greeting: 'Dobrý den,',
    content:
      'chtěla bych touto cestou poděkovat celému týmu pohřební služby Pegas za nesmírně citlivý a profesionální přístup při rozloučení s mým tatínkem. Od prvního telefonátu až po samotný obřad jsme cítili, že jsme v dobrých rukou.',
    signature: 'S vděčností, J. K.',
    variant: 'light',
  },
  {
    id: '11',
    date: '10. dubna 2026',
    greeting: 'Vážení,',
    content:
      'obracím se na Vás s poděkováním za uspořádání posledního rozloučení s naší maminkou. Celý obřad proběhl důstojně a přesně podle našich představ. Zvláště oceňuji trpělivost a empatii paní Novákové, která nás celým procesem provázela.\n\nDekorace, hudba i celková atmosféra byly přesně takové, jaké by si naše maminka přála. Děkujeme Vám za to, že jste nám v tak těžké chvíli ulehčili.',
    signature: 'Rodina Dvořákových',
    variant: 'dark',
  },
  {
    id: '12',
    date: '3. dubna 2026',
    greeting: 'Dobrý den,',
    content:
      'píši Vám, abych vyjádřil své upřímné díky za pomoc a podporu, kterou jste nám poskytli v těžkém období. Vaše pohřební služba se o vše postarala s maximální péčí a ohleduplností.',
    signature: 'S úctou, P. M.',
    variant: 'light',
    image: {
      src: 'https://wp.pohrebpegas.cz/cz/wp-content/uploads/sites/2/2025/10/pegas-smutecni-kvetiny12.webp',
      alt: 'Smuteční květinová výzdoba',
    },
  },
  {
    id: '13',
    date: '28. března 2026',
    greeting: 'Milý pane Hamane,',
    content:
      'dovolte mi, abych Vám i celému Vašemu týmu poděkoval za bezchybně zorganizované rozloučení s mým dědečkem. Bylo vidět, že každému detailu věnujete maximální pozornost.\n\nObřadní síň byla krásně připravena, květinová výzdoba byla nádherná a celý průběh ceremonie byl velmi důstojný. Dědeček by byl spokojený.',
    signature: 'S pozdravem, T. H.',
    variant: 'light',
  },
  {
    id: '14',
    date: '20. března 2026',
    greeting: 'Dobrý den,',
    content:
      'ráda bych poděkovala za profesionální přístup při zajištění pohřbu mé babičky. Oceňuji zejména to, že jste nám vyšli vstříc s termínem a pomohli nám se vším, co bylo potřeba zařídit.',
    signature: 'L. S.',
    variant: 'light',
  },
  {
    id: '15',
    date: '15. března 2026',
    greeting: 'Vážený pane Hamane,',
    content:
      'chci Vám touto cestou vyjádřit hluboký dík za vše, co jste pro naši rodinu udělali. V nejtěžší chvíli našeho života jste byli oporou a pomohli nám důstojně se rozloučit s naším blízkým.\n\nZvláštní poděkování patří paní Černé z pobočky na Praze 3, která se nám věnovala s nevšední lidskostí a trpělivostí.',
    signature: 'S hlubokou úctou, V. B.',
    variant: 'dark',
  },
  {
    id: '16',
    date: '8. března 2026',
    greeting: 'Dobrý den,',
    content: 'děkujeme za vše. Obřad byl krásný a důstojný, přesně takový, jaký jsme si přáli.',
    signature: 'Rodina Procházkových',
    variant: 'light',
  },
  {
    id: '17',
    date: '1. března 2026',
    greeting: 'Dobrý den,',
    content:
      'chtěli bychom vyjádřit upřímné poděkování za organizaci pohřbu naší tety. Přestože to pro nás bylo velmi těžké období, Váš tým nám pomohl zvládnout vše s klidem a důstojností.\n\nCelý obřad proběhl hladce, hudba i projevy byly přesně podle našich přání. Moc si vážíme Vaší práce.',
    signature: 'S díky, M. a J. Novotní',
    variant: 'light',
  },
];

const WroteAboutUsPage = async () => {
  const t = await getTranslations();
  const testimonials = getDemoTestimonials();

  return (
    <main className='max-w-container relative mx-auto'>
      <section className='px-4 sm:px-14'>
        <Breadcrumbs
          className='pb-18 lg:pb-43'
          pageTitle={t('wrote-about-us.page-title')}
          items={[{ label: t('references.page-title'), href: `/${t('routes.references')}` }]}
        />
        <PageHeroSection
          title={t('wrote-about-us.hero.title')}
          description={t('wrote-about-us.hero.description')}
        />
      </section>

      <section className='section-container relative'>
        <TestimonialsSection
          testimonials={testimonials}
          initialCount={6}
          batchSize={6}
          expandLabel={t('wrote-about-us.load-more')}
          collapseLabel={t('wrote-about-us.back-to-top')}
        />
      </section>

      <TestimonialForm />

      <ContentSection
        title={t('home.about-us.title')}
        description={t('home.about-us.description')}
        buttonText={t('home.about-us.button-text')}
        link={t('home.about-us.link')}
        imagePosition='left'
        image={{ src: '/images/about-us.webp', alt: t('home.about-us.alt') }}
      />

      <FooterClaim />
    </main>
  );
};

export default WroteAboutUsPage;
