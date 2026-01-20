'use client';

import Link from 'next/link';

import { pushContactClick } from '@/utils/datalayer';

interface BranchContactInfoProps {
  phoneNumber?: string;
  email?: string;
}

const CONTACT_LINK_CLASS = 'text-lg underline hover:no-underline';

export const BranchContactInfo = ({ phoneNumber, email }: BranchContactInfoProps) => {
  if (!phoneNumber && !email) return null;

  const handlePhoneClick = () => {
    if (phoneNumber) {
      pushContactClick(phoneNumber, 'Pobočky - Detail');
    }
  };

  return (
    <>
      {phoneNumber && (
        <div>
          <Link
            href={`tel:${phoneNumber.replace(/\s/g, '')}`}
            className={CONTACT_LINK_CLASS}
            onClick={handlePhoneClick}
          >
            {phoneNumber}
          </Link>
        </div>
      )}
      {email && (
        <div>
          <Link
            href={`mailto:${email}`}
            className={CONTACT_LINK_CLASS}
          >
            {email}
          </Link>
        </div>
      )}
    </>
  );
};
