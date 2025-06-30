import { createContext, ReactNode, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const WrongCharsContext = createContext({
  wrongCharsPreviousState: [0],
  updateWrongCharsPreviousState: (value: number[]) => {console.log(value)},
});

export const WrongCharsContextProvider = ({ children }: { children: ReactNode }) => {

  const [wrongCharsPreviousState, setWrongCharsPreviousState] = useState<number[]>([]);

  function updateWrongCharsPreviousState(value: number[]) {
    setWrongCharsPreviousState(value);
  }

  return (
    <WrongCharsContext.Provider value={{wrongCharsPreviousState, updateWrongCharsPreviousState}}>
      {children}
    </WrongCharsContext.Provider>
  )
}
