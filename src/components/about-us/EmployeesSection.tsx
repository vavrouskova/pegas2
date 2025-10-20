'use client';

import Image from 'next/image';

import { CarouselNavigation } from '@/components/_shared/CarouselNavigation';
import LeavesAnimation from '@/components/_shared/LeavesAnimation';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';
import { cn } from '@/lib/utils';
import type { ZamestnanciPost } from '@/utils/wordpress-types';

interface EmployeesSectionProps {
  employees: ZamestnanciPost[];
  managementTitle?: string;
  teamTitle?: string;
}

interface EmployeeCardProps {
  employee: ZamestnanciPost;
  className?: string;
}

const EmployeeCard = ({ employee, className }: EmployeeCardProps) => {
  const { zamestnanciACF } = employee;
  const imageUrl = zamestnanciACF?.profileImage?.node?.sourceUrl;
  const imageAlt = zamestnanciACF?.profileImage?.node?.altText || employee.title || 'Employee';

  return (
    <article className={cn('group flex flex-col gap-4', className)}>
      <div className='relative aspect-square w-full overflow-hidden'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
            className='object-cover'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gray-200'>
            <span className='text-gray-400'>No image</span>
          </div>
        )}
      </div>
      <div className='flex flex-col gap-1'>
        {employee.title && <h3 className='font-heading text-xl'>{employee.title}</h3>}
        {zamestnanciACF?.positionDescription && (
          <p className='text-primary text-sm'>{zamestnanciACF.positionDescription}</p>
        )}
      </div>
    </article>
  );
};

const EmployeesSection = ({
  employees,
  managementTitle = 'Vedení společnosti',
  teamTitle = 'Náš tým',
}: EmployeesSectionProps) => {
  const { currentIndex, setApi, carouselRef, setIsHovering, goToSlide } = useCarouselAutoplay();

  // Rozdělení zaměstnanců na vedení a ostatní
  const management = employees.filter((employee) => {
    const positionType = employee.zamestnanciACF?.positonType;
    return Array.isArray(positionType) && positionType.includes('company_management');
  });
  const team = employees.filter((employee) => {
    const positionType = employee.zamestnanciACF?.positonType;
    return !Array.isArray(positionType) || !positionType.includes('company_management');
  });

  if (employees.length === 0) {
    return null;
  }

  return (
    <section className='section-container relative'>
      <LeavesAnimation
        leaves1ClassName='w-[44.6875rem] rotate-[-20deg]'
        motionDiv1ClassName='top-0 left-1/2 translate-x-[26rem]'
        leaves2ClassName='w-[34.8125rem] rotate-[260deg]'
        motionDiv2ClassName='top-64 left-1/2 translate-x-[34.5rem]'
      />
      {/* Vedení společnosti */}
      {management.length > 0 && (
        <div className='relative z-10 pt-40 pb-16'>
          <div className='mx-auto max-w-7xl'>
            <h2 className='font-heading mb-12 text-3xl'>{managementTitle}</h2>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {management.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Carousel s ostatními zaměstnanci */}
      {team.length > 0 && (
        <div className='relative z-10 pt-16 pb-40'>
          <div className='mx-auto max-w-7xl'>
            <h2 className='font-heading mb-12 text-3xl'>{teamTitle}</h2>
          </div>
          <div
            ref={carouselRef}
            className='relative'
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Carousel
              opts={{ align: 'start', loop: true }}
              className='mx-auto max-w-7xl'
              setApi={setApi}
            >
              <CarouselContent className='-ml-4'>
                {team.map((employee) => (
                  <CarouselItem
                    key={employee.id}
                    className='basis-full pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4'
                  >
                    <EmployeeCard employee={employee} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {team.length > 1 && (
                <CarouselNavigation
                  itemsCount={team.length}
                  currentIndex={currentIndex}
                  onDotClick={goToSlide}
                />
              )}
            </Carousel>
          </div>
        </div>
      )}
    </section>
  );
};

export default EmployeesSection;
