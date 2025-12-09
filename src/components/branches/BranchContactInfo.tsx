import Link from 'next/link';

interface BranchContactInfoProps {
  phoneNumber?: string;
  email?: string;
}

const CONTACT_LINK_CLASS = 'text-primary text-lg underline hover:no-underline';

export const BranchContactInfo = ({ phoneNumber, email }: BranchContactInfoProps) => {
  if (!phoneNumber && !email) return null;

  return (
    <>
      {phoneNumber && (
        <div>
          <Link
            href={`tel:${phoneNumber.replace(/\s/g, '')}`}
            className={CONTACT_LINK_CLASS}
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
