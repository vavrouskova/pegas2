'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import Logo from '@/components/header/Logo';
import Hamburger from '@/components/icons/Hamburger';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { getUniqueId } from '@/utils/helper';
import { Separator } from '@radix-ui/react-separator';

const MobileMenu = (props: any) => {
  const { headerLinks } = props;
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      shouldScaleBackground
      direction='right'
    >
      <DrawerTrigger asChild>
        <div
          className='group flex cursor-pointer transition-all duration-300 hover:opacity-50 lg:hidden'
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
                className='text-primary'
              >
                ✕
              </button>
            </DrawerClose>
          </DrawerTitle>
          <Separator className='bg-primary h-px w-full' />
        </DrawerHeader>

        <div className='flex flex-col gap-8 p-4'>
          {headerLinks.map((item: any) => (
            <Link
              key={getUniqueId('header-nav')}
              href={item.href as any}
              aria-label={item.name}
              className='font-heading block w-full text-left text-xl leading-none'
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;
