import { useEffect, useState } from 'react';

function useMouseActivity() {
  const [hasMouseActivity, setHasMouseActivity] = useState<boolean>(false);

  useEffect(() => {
    if (hasMouseActivity) return;

    const handleMouseActivity = () => {
      setHasMouseActivity(true);
    };

    // Listen once for the first pointer interaction
    window.addEventListener('mousemove', handleMouseActivity, { once: true });
    window.addEventListener('touchstart', handleMouseActivity, { once: true });

    // Cleanup on unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseActivity);
      window.removeEventListener('touchstart', handleMouseActivity);
    };
  }, [hasMouseActivity]);

  return { hasMouseActivity, setHasMouseActivity };
}

export default useMouseActivity;
