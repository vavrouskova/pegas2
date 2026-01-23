# Thank You Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a dedicated thank you page that users are redirected to after successful form submission.

**Architecture:** New page at `/dekujeme` route, styled similarly to the 404 page. BaseForm modified to support optional redirect URL on success instead of inline message. Translations added to cs.json.

**Tech Stack:** Next.js App Router, next-intl, React

---

## Task 1: Add translations to cs.json

**Files:**
- Modify: `messages/cs.json:51-65` (routes section)
- Modify: `messages/cs.json:253-281` (forms section)

**Step 1: Add thank-you route to routes section**

In `messages/cs.json`, add the thank-you route after line 64:

```json
"thank-you": "dekujeme"
```

The routes section should look like:
```json
"routes": {
  "home": "uvod",
  "faq": "jak-postupovat",
  "services": "sluzby",
  "references": "reference",
  "blog": "blog",
  "about-us": "o-nas",
  "contacts": "kontakty",
  "gdpr": "zasady-ochrany-osobnich-udaju",
  "terms-of-use": "obchodni-podminky",
  "consumer-information": "informace-pro-spotrebitele",
  "cookies": "informace-o-vyuziti-cookies",
  "ceremony-variants": "smutecni-obrady",
  "funeral-essentials": "doplnkove-sluzby-a-produky",
  "thank-you": "dekujeme"
},
```

**Step 2: Update forms.success translations**

Update the `forms.success` object to match the screenshot design:

```json
"success": {
  "title": "Děkujeme.",
  "description": "Vaši zprávu jsme přijali.",
  "back_to_home_text": "Pokračovat na ",
  "back_to_home_link": "hlavní stránku"
}
```

**Step 3: Verify JSON syntax**

Run: `bun run lint`
Expected: No JSON parsing errors

**Step 4: Commit**

```bash
git add messages/cs.json
git commit -m "feat(i18n): add thank-you page translations"
```

---

## Task 2: Add route to i18n/routing.ts

**Files:**
- Modify: `i18n/routing.ts:14-38`

**Step 1: Add thank-you pathname**

Add the thank-you route before the catch-all `[slug]` route:

```typescript
'/thank-you': { cs: '/dekujeme' },
```

The pathnames object should include:
```typescript
export const pathnames = {
  '/': { cs: '/' },
  '/blog': { cs: '/blog' },
  '/about-us': { cs: '/o-nas' },
  '/faq': { cs: '/jak-postupovat' },
  '/services': { cs: '/sluzby' },
  '/references': { cs: '/reference' },
  '/references/[category]': { cs: '/reference/[category]' },
  '/contacts': { cs: '/kontakty' },
  '/gdpr': { cs: '/zasady-ochrany-osobnich-udaju' },
  '/cookies': { cs: '/informace-o-vyuziti-cookies' },
  '/consumer-information': { cs: '/informace-pro-spotrebitele' },
  '/thank-you': { cs: '/dekujeme' },
  '/[slug]': { cs: '/[slug]' },
} satisfies Pathnames<typeof locales>;
```

**Step 2: Verify TypeScript compiles**

Run: `bunx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add i18n/routing.ts
git commit -m "feat(i18n): add thank-you route pathname"
```

---

## Task 3: Create Thank You page component

**Files:**
- Create: `app/[locale]/thank-you/page.tsx`

**Step 1: Create the page file**

Create `app/[locale]/thank-you/page.tsx`:

```typescript
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';

import { FormattedText } from '@/components/_shared/FormattedText';
import { Link } from '@/i18n/routing';

interface ThankYouPageProps {
  params: Promise<{ locale: string }>;
}

const ThankYouPage = async ({ params }: ThankYouPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('forms');

  return (
    <main className='bg-white-smoke relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4 py-20'>
      <div className='flex flex-col items-center text-center'>
        <Image
          src='/images/leaf.webp'
          alt=''
          width={300}
          height={300}
          className='w-[300px]'
          priority
        />

        <FormattedText
          text={t('success.title')}
          as='h1'
          className='mb-12.5 text-5xl tracking-[0.37781rem]'
        />

        <div>
          <FormattedText
            text={t('success.description')}
            as='p'
            className='text-lg md:text-xl'
          />
          <FormattedText
            text={t('success.back_to_home_text')}
            as='span'
            className='text-lg md:text-xl'
          />
          <Link
            href='/'
            className='link font-text text-lg md:text-xl'
          >
            {t('success.back_to_home_link')}
          </Link>
          .
        </div>
      </div>
    </main>
  );
};

export default ThankYouPage;
```

**Step 2: Verify page renders**

1. Start dev server (if not running)
2. Navigate to `http://localhost:3000/dekujeme`
3. Expected: Page renders with leaf image, "Děkujeme." title, description text, and link to home

**Step 3: Commit**

```bash
git add app/[locale]/thank-you/page.tsx
git commit -m "feat(pages): add thank-you page"
```

---

## Task 4: Modify BaseForm to support redirect on success

**Files:**
- Modify: `src/components/form-components/BaseForm.tsx`

**Step 1: Add redirectUrl prop to interface**

Update the `BaseFormProps` interface:

```typescript
interface BaseFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (formValues: any) => Promise<any>;
  children?: React.ReactNode;
  form: UseFormReturn<any>;
  formName: string;
  className?: string;
  successText?: string;
  showGdprConsent?: boolean;
  redirectUrl?: string;
}
```

**Step 2: Import useRouter from next-intl routing**

Add import at top of file:

```typescript
import { useRouter } from '@/i18n/routing';
```

**Step 3: Add 'use client' directive if not present**

Ensure the file starts with:

```typescript
'use client';
```

**Step 4: Extract redirectUrl from props and initialize router**

Update the component:

```typescript
const BaseForm = (props: BaseFormProps) => {
  const { onSubmit, children, form, className, successText, showGdprConsent = true, redirectUrl } = props;

  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  // ... rest of state
```

**Step 5: Modify handleSubmit to redirect when redirectUrl is provided**

Update the handleSubmit function:

```typescript
const handleSubmit = async (values: any) => {
  try {
    setIsSending(true);
    await onSubmit(values);
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      setIsSubmitted(true);
    }
  } catch (error) {
    console.error('Form submission error:', error);
  } finally {
    setIsSending(false);
  }
};
```

**Step 6: Verify TypeScript compiles**

Run: `bunx tsc --noEmit`
Expected: No errors

**Step 7: Commit**

```bash
git add src/components/form-components/BaseForm.tsx
git commit -m "feat(forms): add redirectUrl prop to BaseForm"
```

---

## Task 5: Update ContactForm to redirect to thank-you page

**Files:**
- Modify: `src/components/forms/contact/ContactForm.tsx`

**Step 1: Add redirectUrl prop to BaseForm**

In the ContactForm component, update the BaseForm usage:

```tsx
<BaseForm
  onSubmit={async (values) => {
    await handleSubmit(values);
  }}
  form={form}
  formName='contact-form'
  redirectUrl='/thank-you'
>
```

Remove the `successText` prop since we're now redirecting.

**Step 2: Verify form submission redirects**

1. Navigate to a page with the contact form
2. Fill out required fields (name, email)
3. Submit the form
4. Expected: Redirect to `/dekujeme` page after successful submission

**Step 3: Commit**

```bash
git add src/components/forms/contact/ContactForm.tsx
git commit -m "feat(forms): redirect to thank-you page after contact form submission"
```

---

## Task 6: Run lint and type checks

**Files:**
- All modified files

**Step 1: Run ESLint**

Run: `bun run lint`
Expected: No errors

**Step 2: Run TypeScript check**

Run: `bunx tsc --noEmit`
Expected: No errors

**Step 3: Fix any issues found**

If errors are found, fix them before proceeding.

---

## Task 7: Final verification and commit

**Step 1: Test complete flow**

1. Navigate to `/kontakty` (contacts page with form)
2. Fill out name and email fields
3. Submit form
4. Verify redirect to `/dekujeme`
5. Verify page displays correctly with leaf image and proper text
6. Click "hlavní stránku" link
7. Verify redirect to home page

**Step 2: Create final commit if any fixes were made**

```bash
git add .
git commit -m "fix: address review feedback for thank-you page"
```

---

## Summary

This plan creates:
1. New thank-you page at `/dekujeme` route
2. Updated translations in cs.json
3. New route in i18n/routing.ts
4. Modified BaseForm to support redirect on success
5. Updated ContactForm to redirect after submission

Files created:
- `app/[locale]/thank-you/page.tsx`

Files modified:
- `messages/cs.json`
- `i18n/routing.ts`
- `src/components/form-components/BaseForm.tsx`
- `src/components/forms/contact/ContactForm.tsx`
