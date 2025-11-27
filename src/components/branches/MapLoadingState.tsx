interface MapLoadingStateProps {
  message: string;
}

const MapLoadingState = ({ message }: MapLoadingStateProps) => {
  return (
    <div className='bg-muted flex h-full w-full items-center justify-center'>
      <p>{message}</p>
    </div>
  );
};

export default MapLoadingState;
