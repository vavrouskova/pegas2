import * as React from 'react';

function getStrictContext<T>(
  name?: string
  // eslint-disable-next-line no-unused-vars
): readonly [({ value, children }: { value: T; children?: React.ReactNode }) => React.JSX.Element, () => T] {
  const Context = React.createContext<T | undefined>(undefined);

  const Provider = ({ value: contextValue, children: contextChildren }: { value: T; children?: React.ReactNode }) => (
    <Context.Provider value={contextValue}>{contextChildren}</Context.Provider>
  );

  const useSafeContext = () => {
    const currentContextValue = React.useContext(Context);
    if (currentContextValue === undefined) {
      throw new Error(`useContext must be used within ${name ?? 'a Provider'}`);
    }
    return currentContextValue;
  };

  return [Provider, useSafeContext] as const;
}

export { getStrictContext };
