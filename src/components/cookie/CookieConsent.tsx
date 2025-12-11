'use client';

import { useEffect } from 'react';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import * as Cookie from 'vanilla-cookieconsent';

import '@/styles/cookies.css';
import { sendGTMEventFunction } from '@/components/gtm/GoogleTagManagerComponent';
import useMouseActivity from '@/hooks/useMouseActivity';

const CookieConsent = () => {
  const { hasMouseActivity } = useMouseActivity();

  useEffect(() => {
    if (hasMouseActivity) {
      Cookie.run({
        onFirstConsent: ({ cookie }) => {
          sendGTMEventFunction({
            event: 'cc_cookie',
            action: 'first',
            accept_level: cookie.categories,
          });
        },
        onChange: ({ cookie }) => {
          sendGTMEventFunction({
            event: 'cc_cookie',
            action: 'change',
            accept_level: cookie.categories,
          });
        },
        // onConsent: ({ cookie }) => {
        //  sendGTMEventFunction({
        //    event: 'cc_cookie',
        //    action: 'consent',
        //    accept_level: cookie.categories,
        //  });
        // },

        guiOptions: {
          consentModal: {
            layout: 'box wide',
            position: 'bottom right',
            equalWeightButtons: false,
            flipButtons: true,
          },
          preferencesModal: {
            layout: 'box',
            position: 'right',
            equalWeightButtons: false,
            flipButtons: true,
          },
        },
        categories: {
          necessary: {
            readOnly: true,
          },
          analytics: {},
          marketing: {},
        },
        language: {
          autoDetect: 'browser',
          default: 'cz',
          translations: {
            cz: {
              consentModal: {
                title: 'Cookies a zpracování osobních údajů',
                description:
                  '<p>Pro personalizaci obsahu, reklamy a pro analytické účely využíváme soubory cookie a další služby.</p>' +
                  '<p>Informace o vašem používání webu sdílíme s partnery, kteří je mohou kombinovat s dalšími údaji vlivem využívání jejich služeb.</p>' +
                  '<p>Kliknutím na „Souhlasím“ nám udělujete povolení ke zpracování osobních údajů a cookies za účelem personalizovaného obsahu, reklamy a analytiky.</p>',
                closeIconLabel: '',
                acceptAllBtn: 'Souhlasím',
                acceptNecessaryBtn: 'Odmítám',
                showPreferencesBtn: 'Upravit preference',
                footer:
                  '<a href="/informace-o-vyuziti-cookies">Informace o využití cookies</a>\n<a href="/zasady-ochrany-osobnich-udaju">Zpracování osobních údajů</a>',
              },
              preferencesModal: {
                title: 'Nastavení preferencí cookies\t',
                closeIconLabel: 'Zavřít',
                acceptAllBtn: 'Souhlasím',
                acceptNecessaryBtn: 'Odmítám',
                savePreferencesBtn: 'Uložit preference',
                serviceCounterLabel: '',
                sections: [
                  {
                    title: 'Proč používáme Cookies 📢',
                    description:
                      'Pro personalizaci obsahu, reklamy a pro analytické účely využíváme soubory cookie a další služby. Informace o vašem používání webu sdílíme s partnery, kteří je mohou kombinovat s dalšími údaji vlivem využívání jejich služeb. Kliknutím na „Souhlasím“ nám udělujete povolení ke zpracování osobních údajů a cookies za účelem personalizovaného obsahu, reklamy a analytiky.',
                  },
                  {
                    title: 'Funkční cookies <span class="pm__badge">Vždy aktivní</span>',
                    description:
                      'Nutné cookies a služby jsou zásadní pro správné fungování a zobrazení webové stránky, umožňují základní navigaci či vyplňování formulářů nebo přihlašování do zabezpečených sekcí.\n',
                    linkedCategory: 'necessary',
                  },
                  {
                    title: 'Analytické',
                    description:
                      'Analytické soubory cookie a související služby jsou užitečné při sledování počtu návštěvníků a zjišťování zdrojů provozu, což nám umožňuje neustále zlepšovat výkon našeho webu.',
                    linkedCategory: 'analytics',
                  },
                  {
                    title: 'Marketingové',
                    description:
                      'Někteří z našich reklamních partnerů mohou nastavovat soubory cookie na našich webových stránkách. Udělením souhlasu můžeme cookies nebo další osobní informace (telefonní číslo, e-mail nebo adresa) využít k vytváření profilů založených na vašich zájmech a následnému zobrazování relevantní reklamy i na jiných webových stránkách prostřednictvím reklamních systémů jako je Meta Ads, Google Ads a Sklik.',
                    linkedCategory: 'marketing',
                  },
                ],
              },
            },
          },
        },
      });
    }
  }, [hasMouseActivity]);

  return null;
};

export default CookieConsent;
