interface StepHeaderProps {
  title: string;
}

const StepHeader = ({ title }: StepHeaderProps) => (
  <h2 className='text-primary text-2xl font-normal lg:text-3xl'>{title}</h2>
);

export default StepHeader;
