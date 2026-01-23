'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

interface MegamenuOverlayProps {
  isVisible: boolean;
}

const emptyUnsubscribe = () => {};
const subscribe = () => emptyUnsubscribe;
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const MegamenuOverlay = ({ isVisible }: MegamenuOverlayProps) => {
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.1,
          }}
          className='blend-multiply bg-overlay fixed inset-0 top-[var(--header-height,80px)] z-40 backdrop-blur-[10px]'
          aria-hidden='true'
        />
      )}
    </AnimatePresence>,
    document.body
  );
};
