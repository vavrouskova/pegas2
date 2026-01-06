import { Suspense } from 'react';

import SentryExampleContent from '@/app/[locale]/sentry-example-page/SentryExampleContent';

// Opt out of static generation - Sentry SDK uses useSearchParams internally
export const dynamic = 'force-dynamic';

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SentryExampleContent />
    </Suspense>
  );
};

export default Page;
