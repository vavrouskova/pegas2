'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

import { HeaderLink } from '@/components/header/HeaderContent';
import { cn } from '@/lib/utils';

interface MegamenuDropdownProps {
  items: HeaderLink[];
  isOpen: boolean;
}

export const MegamenuDropdown = ({ items, isOpen }: MegamenuDropdownProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className='absolute top-full left-0 z-50 min-w-[200px] pt-2'
        >
          <div className='bg-white-smoke rounded-sm py-4 shadow-lg'>
            <ul className='flex flex-col'>
              {items.map((item, index) => (
                <motion.li
                  key={item.id || item.href}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'text-secondary hover:text-primary block px-6 py-2 text-sm transition-colors duration-200',
                      index === 0 && 'font-cta'
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
