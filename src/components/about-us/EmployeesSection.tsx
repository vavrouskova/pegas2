'use client';

import { CarouselNavigation } from '@/components/_shared/CarouselNavigation';
import { FormattedText } from '@/components/_shared/FormattedText';
import LeavesAnimation from '@/components/_shared/LeavesAnimation';
import PersonCard from '@/components/_shared/PersonCard';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';
import { filterEmployeesByPosition } from '@/utils/helper';
import type { ZamestnanciPost } from '@/utils/wordpress-types';

const POSITION_TYPE_MANAGEMENT = 'company_management';

interface EmployeesSectionProps {
  employees: ZamestnanciPost[];
  managementTitle: string;
  teamTitle: string;
}

interface ManagementGridProps {
  employees: ZamestnanciPost[];
  title: string;
}

const ManagementGrid = ({ employees, title }: Readonly<ManagementGridProps>) => {
  if (employees.length === 0) return null;

  return (
    <div className='relative z-10 pb-16'>
      <div className='mx-auto max-w-7xl'>
        <FormattedText
          text={title}
          as='h2'
          className='mb-12'
        />
        <div className='grid grid-cols-[repeat(auto-fill,minmax(16.625rem,16.625rem))] gap-4 lg:gap-8'>
          {employees.map((employee) => (
            <PersonCard
              key={employee.id}
              person={employee}
              showQuote
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
    <div className='relative z-10 pt-16 pb-30'>
      <div className='mx-auto max-w-7xl'>
        <FormattedText
          text={title}
          as='h2'
          className='mb-12'
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
                <PersonCard person={employee} />
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
