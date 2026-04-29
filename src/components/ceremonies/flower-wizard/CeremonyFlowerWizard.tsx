'use client';

import { ArrowRight, Check, X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  BOUQUETS,
  Bouquet,
  RIBBON_COLORS,
  RIBBON_PRESETS,
  RibbonColorId,
  RibbonPresetId,
} from '@/data/bouquets';
import { cn } from '@/lib/utils';
import { Ceremony } from '@/types/ceremony';
import { formatCeremonyDate, formatCeremonyTime } from '@/utils/ceremonies/format';

interface CeremonyFlowerWizardProps {
  ceremony: Ceremony;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PaymentMethod = 'card' | 'transfer';

const TOTAL_STEPS = 4;

const formatPrice = (value: number) => `${value.toLocaleString('cs-CZ')} Kč`;

const CeremonyFlowerWizard = ({ ceremony, open, onOpenChange }: CeremonyFlowerWizardProps) => {
  const t = useTranslations('ceremonies.flower-wizard');
  const tBouquets = useTranslations('ceremonies.bouquets');
  const [step, setStep] = useState(1);
  const [bouquet, setBouquet] = useState<Bouquet | null>(null);
  const [ribbonColor, setRibbonColor] = useState<RibbonColorId>('purple');
  const [ribbonPreset, setRibbonPreset] = useState<RibbonPresetId>('none');
  const [ribbonCustom, setRibbonCustom] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>('card');

  const fullName = `${ceremony.person.firstName} ${ceremony.person.lastName}`;
  const dateLine = `${formatCeremonyDate(ceremony.startAt)} · ${formatCeremonyTime(ceremony.startAt)} · ${ceremony.venue.name}`;

  const ribbonText = useMemo(() => {
    if (ribbonPreset === 'none') return '';
    if (ribbonPreset === 'custom') return ribbonCustom.trim();
    return t(`ribbon-text.${ribbonPreset}`);
  }, [ribbonPreset, ribbonCustom, t]);

  const canContinue = useMemo(() => {
    if (step === 1) return !!bouquet;
    if (step === 3) return name.trim() && email.trim() && phone.trim() && consent;
    return true;
  }, [step, bouquet, name, email, phone, consent]);

  const handleContinue = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setBouquet(null);
      setRibbonColor('purple');
      setRibbonPreset('none');
      setRibbonCustom('');
      setMessage('');
      setName('');
      setEmail('');
      setPhone('');
      setConsent(false);
      setPayment('card');
    }, 300);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) handleClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent className='!fixed !inset-0 !top-0 !left-0 grid !h-[100dvh] !w-screen !max-w-none !translate-x-0 !translate-y-0 grid-rows-[auto_1fr_auto] gap-0 overflow-hidden border-0 bg-white p-0 sm:!rounded-none lg:!h-[min(92vh,900px)] lg:!w-[min(95vw,1180px)] lg:!top-1/2 lg:!left-1/2 lg:!-translate-x-1/2 lg:!-translate-y-1/2 lg:sm:!rounded-none'>
        <DialogTitle className='sr-only'>{t('step1.title')}</DialogTitle>

        <header className='flex items-start justify-between gap-4 px-6 pt-6 pb-4 lg:px-12 lg:pt-10'>
          <div className='flex flex-col gap-1.5'>
            <span className='font-text text-primary/60 text-xs tracking-[0.18em] uppercase'>
              {t('for-label')}
            </span>
            <h2 className='font-heading text-primary text-2xl lg:text-3xl'>{fullName}</h2>
            <span className='font-text text-primary text-sm'>{dateLine}</span>
          </div>
          <button
            type='button'
            onClick={handleClose}
            aria-label={t('close')}
            className='text-primary hover:opacity-70'
          >
            <X className='size-5' />
          </button>
        </header>

        <div className='px-6 lg:px-12'>
          <div className='flex items-center justify-end'>
            <span className='font-text text-primary/60 text-sm'>
              {t('step-progress', { current: step, total: TOTAL_STEPS })}
            </span>
          </div>
          <div className='bg-primary/10 mt-2 h-1 w-full'>
            <div
              className='bg-primary h-full transition-all duration-300'
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        <main className='overflow-y-auto px-6 py-8 lg:px-12 lg:py-10'>
          {step === 1 && (
            <Step1
              selectedId={bouquet?.id ?? null}
              onSelect={setBouquet}
            />
          )}
          {step === 2 && (
            <Step2
              ribbonColor={ribbonColor}
              setRibbonColor={setRibbonColor}
              ribbonPreset={ribbonPreset}
              setRibbonPreset={setRibbonPreset}
              ribbonCustom={ribbonCustom}
              setRibbonCustom={setRibbonCustom}
              message={message}
              setMessage={setMessage}
            />
          )}
          {step === 3 && (
            <Step3
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              consent={consent}
              setConsent={setConsent}
            />
          )}
          {step === 4 && (
            <Step4
              ceremony={ceremony}
              bouquet={bouquet!}
              ribbonColor={ribbonColor}
              ribbonText={ribbonText}
              message={message}
              name={name}
              email={email}
              phone={phone}
              payment={payment}
              setPayment={setPayment}
              fullName={fullName}
              tBouquets={tBouquets}
            />
          )}
        </main>

        <footer className='border-primary/10 flex items-center justify-between gap-4 border-t bg-white px-6 py-4 lg:px-12 lg:py-6'>
          {step === 1 ? (
            <span className='font-text text-primary text-sm'>
              {t('step1.special-prefix')}{' '}
              <a
                href='https://vazbykvetin.cz'
                target='_blank'
                rel='noopener noreferrer'
                className='font-heading underline underline-offset-4'
              >
                {t('step1.special-link')}
              </a>
            </span>
          ) : (
            <button
              type='button'
              onClick={() => setStep(step - 1)}
              className='font-text text-primary inline-flex items-center gap-2 text-sm hover:opacity-70'
            >
              <ArrowRight className='size-4 rotate-180' />
              {t('back')}
            </button>
          )}

          <div className='flex items-center gap-4 lg:gap-6'>
            {bouquet && (
              <span className='font-text text-primary/70 hidden text-sm sm:inline-flex sm:items-baseline sm:gap-2'>
                {t('total')}{' '}
                <strong className='font-heading text-primary text-base'>
                  {formatPrice(bouquet.price)}
                </strong>
              </span>
            )}
            <button
              type='button'
              onClick={handleContinue}
              disabled={!canContinue}
              className='bg-primary text-white-smoke font-heading inline-flex items-center gap-3 px-6 py-3 text-base transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 lg:px-8'
            >
              {step === TOTAL_STEPS ? t('submit') : t('continue')}
              <ArrowRight className='size-4' />
            </button>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
};

const Step1 = ({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (b: Bouquet) => void;
}) => {
  const t = useTranslations('ceremonies.flower-wizard.step1');
  const tBouquets = useTranslations('ceremonies.bouquets');

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <h3 className='font-heading text-primary text-2xl'>{t('title')}</h3>
        <p className='font-text text-primary/70 text-sm'>{t('description')}</p>
      </div>
      <ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5'>
        {BOUQUETS.map((b) => {
          const selected = selectedId === b.id;
          return (
            <li key={b.id}>
              <button
                type='button'
                onClick={() => onSelect(b)}
                className={cn(
                  'group flex h-full w-full flex-col gap-3 text-left transition-opacity duration-300 hover:opacity-90',
                  selected && 'ring-primary outline-2 outline-offset-2 outline-current'
                )}
                style={selected ? { outlineColor: 'var(--color-primary)' } : undefined}
              >
                <div className='bg-grey-warm relative aspect-square w-full overflow-hidden'>
                  <Image
                    src={b.image}
                    alt={tBouquets(b.nameKey)}
                    fill
                    sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw'
                    className='object-cover'
                  />
                  <div
                    aria-hidden='true'
                    className='bg-primary text-white-smoke absolute right-2 bottom-2 flex size-7 items-center justify-center'
                  >
                    <ZoomIn className='size-3.5' />
                  </div>
                </div>
                <div className='bg-grey-warm/40 flex flex-1 flex-col gap-1 px-3 py-3'>
                  <div className='flex flex-wrap items-baseline gap-x-2'>
                    <span className='font-heading text-primary text-base'>
                      {tBouquets(b.nameKey)}
                    </span>
                    <span className='font-text text-primary text-sm'>{formatPrice(b.price)}</span>
                  </div>
                  <span className='font-text text-primary/70 text-xs leading-snug'>
                    {tBouquets(b.descKey)}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const Step2 = ({
  ribbonColor,
  setRibbonColor,
  ribbonPreset,
  setRibbonPreset,
  ribbonCustom,
  setRibbonCustom,
  message,
  setMessage,
}: {
  ribbonColor: RibbonColorId;
  setRibbonColor: (c: RibbonColorId) => void;
  ribbonPreset: RibbonPresetId;
  setRibbonPreset: (p: RibbonPresetId) => void;
  ribbonCustom: string;
  setRibbonCustom: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
}) => {
  const t = useTranslations('ceremonies.flower-wizard.step2');
  const tRibbon = useTranslations('ceremonies.flower-wizard.ribbon-text');

  return (
    <div className='flex flex-col gap-8 lg:max-w-2xl'>
      <h3 className='font-heading text-primary text-2xl'>{t('title')}</h3>

      <section className='flex flex-col gap-3'>
        <span className='font-heading text-primary text-base'>{t('ribbon-color-label')}</span>
        <div className='flex items-center gap-3'>
          {RIBBON_COLORS.map((color) => (
            <button
              key={color.id}
              type='button'
              onClick={() => setRibbonColor(color.id)}
              aria-label={color.id}
              aria-pressed={ribbonColor === color.id}
              className={cn(
                'flex size-9 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105',
                ribbonColor === color.id && 'ring-primary ring-2 ring-offset-2'
              )}
              style={{ backgroundColor: color.hex }}
            >
              {ribbonColor === color.id && <Check className='text-white-smoke size-4' />}
            </button>
          ))}
        </div>
      </section>

      <section className='flex flex-col gap-3'>
        <span className='font-heading text-primary text-base'>{t('ribbon-text-label')}</span>
        <div className='flex flex-wrap items-center gap-2'>
          {RIBBON_PRESETS.map((preset) => {
            const active = ribbonPreset === preset.id;
            return (
              <button
                key={preset.id}
                type='button'
                onClick={() => setRibbonPreset(preset.id as RibbonPresetId)}
                className={cn(
                  'border-primary/30 font-text rounded-full border px-4 py-2 text-sm transition-colors',
                  active ? 'bg-primary text-white-smoke border-primary' : 'text-primary'
                )}
              >
                {tRibbon(preset.id)}
              </button>
            );
          })}
        </div>
        {ribbonPreset === 'custom' && (
          <input
            type='text'
            value={ribbonCustom}
            onChange={(event) => setRibbonCustom(event.target.value)}
            placeholder={t('custom-placeholder')}
            maxLength={80}
            className='border-primary/30 font-text text-primary placeholder:text-primary/40 mt-1 w-full max-w-md border bg-white px-4 py-2 text-sm outline-none'
          />
        )}
      </section>

      <section className='flex flex-col gap-3'>
        <span className='font-heading text-primary text-base'>{t('message-title')}</span>
        <p className='font-text text-primary/70 text-sm'>{t('message-help')}</p>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value.slice(0, 300))}
          placeholder={t('message-placeholder')}
          rows={4}
          className='border-primary/30 font-text text-primary placeholder:text-primary/40 w-full border bg-white px-4 py-3 text-sm outline-none'
        />
        <span className='font-text text-primary/60 text-xs'>
          {t('message-counter', { count: message.length })}
        </span>
      </section>
    </div>
  );
};

const Step3 = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  consent,
  setConsent,
}: {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  consent: boolean;
  setConsent: (v: boolean) => void;
}) => {
  const t = useTranslations('ceremonies.flower-wizard.step3');

  return (
    <div className='flex flex-col gap-6 lg:max-w-2xl'>
      <div className='flex flex-col gap-2'>
        <h3 className='font-heading text-primary text-2xl'>{t('title')}</h3>
        <p className='font-text text-primary/70 text-sm'>{t('description')}</p>
      </div>

      <label className='flex flex-col gap-1.5'>
        <span className='font-text text-primary text-sm'>
          {t('name-label')} <span className='text-primary/60'>*</span>
        </span>
        <input
          type='text'
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t('name-placeholder')}
          className='border-primary/30 font-text text-primary placeholder:text-primary/40 w-full border bg-white px-4 py-2.5 text-sm outline-none'
        />
      </label>

      <div className='grid gap-4 sm:grid-cols-2'>
        <label className='flex flex-col gap-1.5'>
          <span className='font-text text-primary text-sm'>
            {t('email-label')} <span className='text-primary/60'>*</span>
          </span>
          <input
            type='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t('email-placeholder')}
            className='border-primary/30 font-text text-primary placeholder:text-primary/40 w-full border bg-white px-4 py-2.5 text-sm outline-none'
          />
        </label>
        <label className='flex flex-col gap-1.5'>
          <span className='font-text text-primary text-sm'>
            {t('phone-label')} <span className='text-primary/60'>*</span>
          </span>
          <input
            type='tel'
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={t('phone-placeholder')}
            className='border-primary/30 font-text text-primary placeholder:text-primary/40 w-full border bg-white px-4 py-2.5 text-sm outline-none'
          />
        </label>
      </div>

      <label className='flex items-start gap-3'>
        <input
          type='checkbox'
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className='mt-0.5 size-4'
        />
        <span className='font-text text-primary text-sm'>{t('consent')}</span>
      </label>
    </div>
  );
};

const Step4 = ({
  ceremony,
  bouquet,
  ribbonColor,
  ribbonText,
  message,
  name,
  email,
  phone,
  payment,
  setPayment,
  fullName,
  tBouquets,
}: {
  ceremony: Ceremony;
  bouquet: Bouquet;
  ribbonColor: RibbonColorId;
  ribbonText: string;
  message: string;
  name: string;
  email: string;
  phone: string;
  payment: PaymentMethod;
  setPayment: (p: PaymentMethod) => void;
  fullName: string;
  tBouquets: ReturnType<typeof useTranslations>;
}) => {
  const t = useTranslations('ceremonies.flower-wizard.step4');
  const tColors = useTranslations('ceremonies.ribbon-colors');
  const ribbonColorLabel = tColors(ribbonColor);

  return (
    <div className='flex flex-col gap-6 lg:max-w-3xl'>
      <div className='flex flex-col gap-2'>
        <h3 className='font-heading text-primary text-2xl'>{t('title')}</h3>
        <p className='font-text text-primary/70 text-sm'>{t('description')}</p>
      </div>

      <div className='bg-grey-warm/40 flex flex-col gap-5 p-5 lg:p-6'>
        <div className='flex items-start gap-4'>
          <div className='bg-grey-warm relative aspect-square size-20 shrink-0 overflow-hidden lg:size-24'>
            <Image
              src={bouquet.image}
              alt={tBouquets(bouquet.nameKey)}
              fill
              sizes='96px'
              className='object-cover'
            />
          </div>
          <div className='flex flex-col gap-0.5'>
            <span className='font-heading text-primary text-lg'>{tBouquets(bouquet.nameKey)}</span>
            <span className='font-text text-primary/70 text-sm'>
              {t('for-prefix')} {fullName} · {ceremony.venue.name}
            </span>
            <span className='font-heading text-primary mt-1 text-base'>
              {formatPrice(bouquet.price)}
            </span>
          </div>
        </div>

        <div className='border-primary/10 border-t pt-4'>
          <span className='font-text text-primary/60 text-xs tracking-[0.18em] uppercase'>
            {t('ribbon-section')}
          </span>
          <p className='font-text text-primary mt-1 text-sm'>
            {ribbonColorLabel}
            {ribbonText ? ` · „${ribbonText}"` : ` · ${t('ribbon-empty')}`}
          </p>
        </div>

        <div className='border-primary/10 border-t pt-4'>
          <span className='font-text text-primary/60 text-xs tracking-[0.18em] uppercase'>
            {t('message-section')}
          </span>
          <p className='font-text text-primary mt-1 text-sm whitespace-pre-line'>
            {message.trim() || '—'}
          </p>
        </div>

        <div className='border-primary/10 border-t pt-4'>
          <span className='font-text text-primary/60 text-xs tracking-[0.18em] uppercase'>
            {t('contact-section')}
          </span>
          <p className='font-text text-primary mt-1 text-sm'>{name}</p>
          <p className='font-text text-primary/70 text-sm'>
            {email} · {phone}
          </p>
        </div>
      </div>

      <section className='flex flex-col gap-3'>
        <span className='font-heading text-primary text-base'>{t('payment-title')}</span>
        <div className='flex flex-col gap-2'>
          {(['card', 'transfer'] as const).map((method) => (
            <label
              key={method}
              className={cn(
                'border-primary/20 flex cursor-pointer items-center gap-3 border bg-white px-4 py-3 transition-colors',
                payment === method && 'border-primary'
              )}
            >
              <input
                type='radio'
                name='payment'
                value={method}
                checked={payment === method}
                onChange={() => setPayment(method)}
                className='size-4'
              />
              <span className='font-text text-primary text-sm'>
                {t(`payment-${method}`)}
              </span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CeremonyFlowerWizard;
