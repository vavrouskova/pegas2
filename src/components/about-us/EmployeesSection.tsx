'use client';

import Image from 'next/image';

import { CarouselNavigation } from '@/components/_shared/CarouselNavigation';
import { FormattedText } from '@/components/_shared/FormattedText';
import LeavesAnimation from '@/components/_shared/LeavesAnimation';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';
import { cn } from '@/lib/utils';
import { filterEmployeesByPosition } from '@/utils/helper';
import type { ZamestnanciPost } from '@/utils/wordpress-types';

const POSITION_TYPE_MANAGEMENT = 'company_management';

interface EmployeesSectionProps {
  employees: ZamestnanciPost[];
  managementTitle: string;
  teamTitle: string;
}

interface EmployeeCardProps {
  employee: ZamestnanciPost;
  className?: string;
}

const EmployeeCard = ({ employee, className }: Readonly<EmployeeCardProps>) => {
  const { zamestnanciACF } = employee;
  const imageUrl = zamestnanciACF?.profileImage?.node?.sourceUrl;
  const imageAlt = zamestnanciACF?.profileImage?.node?.altText || employee.title || 'Employee';

  return (
    <article className={cn('group flex flex-col gap-4 max-lg:max-w-[16.625rem]', className)}>
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
        {employee.title && (
          <FormattedText
            text={employee.title}
            as='h3'
            className='font-heading text-xl'
          />
        )}
        {zamestnanciACF?.positionDescription && (
          <FormattedText
            text={zamestnanciACF.positionDescription}
            as='p'
            className='text-primary text-sm'
          />
        )}
      </div>
    </article>
  );
};

interface ManagementGridProps {
  employees: ZamestnanciPost[];
  title: string;
}

const ManagementGrid = ({ employees, title }: Readonly<ManagementGridProps>) => {
  if (employees.length === 0) return null;

  return (
    <div className='relative z-10 pt-40 pb-16'>
      <div className='mx-auto max-w-7xl'>
        <FormattedText
          text={title}
          as='h2'
          className='font-heading mb-12 text-3xl'
        />
        <div className='flex flex-wrap gap-4 lg:gap-8'>
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              className='w-full max-w-[16.625rem] min-w-[16.625rem]'
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface TeamCarouselProps {
  employees: ZamestnanciPost[];
  title: string;
}

const TeamCarousel = ({ employees, title }: Readonly<TeamCarouselProps>) => {
  const { currentIndex, setApi, carouselRef, setIsHovering, goToSlide } = useCarouselAutoplay();

  if (employees.length === 0) return null;

  return (
    <div className='relative z-10 pt-16 pb-40'>
      <div className='mx-auto max-w-7xl'>
        <FormattedText
          text={title}
          as='h2'
          className='font-heading mb-12 text-3xl'
        />
      </div>
      <div
        ref={carouselRef}
        className='relative -mr-4 sm:-mr-14 lg:mx-auto lg:max-w-7xl'
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Carousel
          opts={{ align: 'start', loop: true }}
          setApi={setApi}
        >
          <CarouselContent className='-ml-4 lg:-ml-8'>
            {employees.map((employee) => (
              <CarouselItem
                key={employee.id}
                className='basis-full pl-4 max-lg:max-w-[16.625rem] sm:basis-1/2 lg:basis-1/3 lg:pl-8 xl:basis-1/4'
              >
                <EmployeeCard employee={employee} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {employees.length > 1 && (
            <CarouselNavigation
              itemsCount={employees.length}
              currentIndex={currentIndex}
              onDotClick={goToSlide}
            />
          )}
        </Carousel>
      </div>
    </div>
  );
};

const EmployeesSection = ({ employees, managementTitle, teamTitle }: Readonly<EmployeesSectionProps>) => {
  const { management, team } = filterEmployeesByPosition(employees, POSITION_TYPE_MANAGEMENT);

  if (employees.length === 0) return null;

  return (
    <section className='section-container relative'>
      <LeavesAnimation
        leaves1ClassName='w-[44.6875rem] rotate-[-20deg]'
        motionDiv1ClassName='top-0 left-1/2 translate-x-[26rem]'
        leaves2ClassName='w-[34.8125rem] rotate-[260deg]'
        motionDiv2ClassName='top-64 left-1/2 translate-x-[34.5rem]'
      />
      <ManagementGrid
        employees={management}
        title={managementTitle}
      />
      <TeamCarousel
        employees={team}
        title={teamTitle}
      />
    </section>
  );
};

export default EmployeesSection;
