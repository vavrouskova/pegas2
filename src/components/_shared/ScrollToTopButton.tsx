'use client';

interface ScrollToTopButtonProps {
  label: string;
}

const ScrollToTopButton = ({ label }: ScrollToTopButtonProps) => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type='button'
      className='text-primary hover:text-primary/70 font-heading flex items-center gap-2 text-lg transition-colors'
      onClick={handleClick}
    >
      {label}
      <svg
        width='12'
        height='12'
        viewBox='0 0 12 12'
        fill='none'
        className='mb-0.5'
      >
        <path
          d='M6 10L6 2M6 2L2 6M6 2L10 6'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
