import { createContext, ReactNode, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const LessonContext = createContext({
  lessonText: "",
  setLessonText: (value: string) => {console.log(value)},
});

export const LessonContextProvider = ({ children }: { children: ReactNode }) => {

  const [lessonText, setLessonText] = useState<string>("");

  return (
    <LessonContext.Provider value={{lessonText, setLessonText}}>
      {children}
    </LessonContext.Provider>
  )
}
