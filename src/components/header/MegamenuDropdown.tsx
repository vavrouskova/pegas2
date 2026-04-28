'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

import { HeaderLink } from '@/components/header/HeaderContent';
import { cn } from '@/lib/utils';

interface MegamenuDropdownProps {
  items: HeaderLink[];
  isOpen: boolean;
  navLeftOffset: number;
  headerHeight?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose?: () => void;
}

const emptyUnsubscribe = () => {};
const subscribe = () => emptyUnsubscribe;
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const MegamenuDropdown = ({
  items,
  isOpen,
  navLeftOffset,
  headerHeight,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: MegamenuDropdownProps) => {
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isMounted) return null;

  const columns = items.reduce<HeaderLink[][]>((acc, item) => {
    const colIndex = item.column ?? 0;
    if (!acc[colIndex]) acc[colIndex] = [];
    acc[colIndex].push(item);
    return acc;
  }, []);
  const renderedColumns = columns.filter((col) => col && col.length > 0);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className='bg-white-smoke fixed inset-x-0 top-[var(--header-height,80px)] z-50 py-6'
          style={headerHeight ? { top: headerHeight } : undefined}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div
            className='flex gap-24'
            style={{ paddingLeft: navLeftOffset }}
          >
            {renderedColumns.map((columnItems, colIndex) => (
              <ul
                key={colIndex}
                className='flex flex-col gap-1'
              >
                {columnItems.map((item, index) => (
                  <motion.li
                    key={item.id || item.href}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className='font-text text-secondary hover:text-primary inline-block py-1 text-sm transition-colors duration-200 hover:underline'
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
