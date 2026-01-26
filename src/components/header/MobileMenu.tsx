'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useRef, useSyncExternalStore, useState } from 'react';

import { HeaderLink } from '@/components/header/HeaderContent';
import Logo from '@/components/header/Logo';
import Hamburger from '@/components/icons/Hamburger';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { getMegamenuItemsFromData, MegamenuData } from '@/utils/data';

const noopUnsubscribe = () => {};
const emptySubscribe = () => noopUnsubscribe;
const getSnapshotTrue = () => true;
const getSnapshotFalse = () => false;

interface MobileMenuProps {
  headerLinks: HeaderLink[];
  megamenuData: MegamenuData;
}

const MobileMenu = ({ headerLinks, megamenuData }: MobileMenuProps) => {
  const pathname = usePathname();
  const previousPathnameReference = useRef(pathname);

  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshotTrue, getSnapshotFalse);

  const submenuItems = activeSubmenu ? getMegamenuItemsFromData(activeSubmenu, megamenuData) : undefined;

  const isActiveLink = (href: string) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';
    const hrefWithoutLocale = href.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/';

    if (hrefWithoutLocale === '/') {
      return pathWithoutLocale === '/';
    }
    return pathWithoutLocale.startsWith(hrefWithoutLocale);
  };

  // Close menu when pathname changes (navigation occurred)
  // eslint-disable-next-line react-hooks/refs
  if (mounted && previousPathnameReference.current !== pathname) {
    // eslint-disable-next-line react-hooks/refs
    previousPathnameReference.current = pathname;
    if (isOpen) {
      queueMicrotask(() => {
        setIsOpen(false);
        setActiveSubmenu(null);
      });
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setActiveSubmenu(null);
    }
  };

  const handleItemClick = (item: HeaderLink) => {
    const hasSubmenu = item.id && getMegamenuItemsFromData(item.id, megamenuData);
    if (hasSubmenu) {
      setActiveSubmenu(item.id!);
    } else {
      setIsOpen(false);
    }
  };

  const handleBack = () => {
    setActiveSubmenu(null);
  };

  // Prevent hydration mismatch by only rendering Drawer on client
  if (!mounted) {
    return (
      <div className='group flex cursor-pointer transition-all duration-300 hover:opacity-70 lg:hidden'>
        <Hamburger className='text-primary' />
      </div>
    );
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={handleOpenChange}
      shouldScaleBackground
      direction='right'
    >
      <DrawerTrigger asChild>
        <div
          className='group flex cursor-pointer transition-all duration-300 hover:opacity-70 lg:hidden'
          onClick={() => setIsOpen(true)}
        >
          <Hamburger className='text-primary' />
        </div>
      </DrawerTrigger>
      <DrawerContent
        position='right'
        className='bg-white-smoke'
      >
        <DrawerHeader className='h-auto space-y-6'>
          <DrawerTitle className='flex items-center justify-between'>
            <Logo />
            <DrawerClose asChild>
              <button
                aria-label='Close menu'
                className='text-primary text-2xl'
              >
                ✕
              </button>
            </DrawerClose>
          </DrawerTitle>
        </DrawerHeader>

        <div className='relative flex-1 overflow-hidden'>
          <AnimatePresence mode='wait'>
            {activeSubmenu ? (
              <motion.div
                key='submenu'
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className='flex flex-col gap-8 p-4'
              >
                <button
                  onClick={handleBack}
                  className='font-heading flex items-center gap-2 text-left text-xl leading-none transition-all duration-300 hover:opacity-70'
                >
                  <ChevronLeft className='h-5 w-5' />
                </button>
                {submenuItems?.map((item) => (
                  <Link
                    key={item.id || item.href}
                    href={item.href}
                    className={cn(
                      'block w-full text-left text-xl leading-none transition-all duration-300 hover:opacity-70',
                      isActiveLink(item.href) ? 'font-heading' : 'font-text'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key='main-menu'
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className='flex flex-col gap-8 p-4'
              >
                {headerLinks.map((item) => {
                  const hasSubmenu = item.id && getMegamenuItemsFromData(item.id, megamenuData);
                  const active = isActiveLink(item.href);
                  return hasSubmenu ? (
                    <button
                      key={item.id || item.href}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        'flex w-full items-center justify-between text-left text-xl leading-none transition-all duration-300 hover:opacity-70',
                        active ? 'font-heading' : 'font-text'
                      )}
                    >
                      {item.label}
                      <ChevronRight className='h-5 w-5' />
                    </button>
                  ) : (
                    <Link
                      key={item.id || item.href}
                      href={item.href}
                      className={cn(
                        'block w-full text-left text-xl leading-none transition-all duration-300 hover:opacity-70',
                        active ? 'font-heading' : 'font-text'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
