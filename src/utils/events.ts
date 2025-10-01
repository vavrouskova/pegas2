const dispatch = (name: string) => {
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new CustomEvent(name));
  }
};

const listen = (name: string, callback: () => void) => {
  if (typeof document !== 'undefined') {
    document.addEventListener(name, callback);
  }
};

export const useEvents = (name?: string) => {
  const submitEvent = () => {
    dispatch(`event-${name}`);
  };

  const listenEvent = (callback: () => void) => {
    listen(`event-${name}`, callback);
  };

  return {
    submitEvent,
    listenEvent,
  };
};
