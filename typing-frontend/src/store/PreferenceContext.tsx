import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { TextSize } from "../enums/TextSize";
import { Preference } from "../models/Preference";
import { AuthContext } from "./AuthContext";

// Gotten from ChatGPT
interface PreferenceContextType {
  preference?: Preference;
  setPreference: React.Dispatch<React.SetStateAction<Preference | undefined>>;
  updateCustomText: (newCustomText: string) => void;
  setTriggerPreferenceUpdate: React.Dispatch<React.SetStateAction<number>>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const PreferenceContext = createContext<PreferenceContextType>({
  preference: {
    "id": 0, 
    "person": {
      "id": 0, 
      "firstName": "", 
      "lastName": "", 
      "email": "", 
      "password": "", 
      "role": "BASIC_USER"}, 
    "currentLessonId": 0,
    "wantCommonWords": false,
    "customText": "",
    "wordsOnPage": 20, 
    "textSize": TextSize.MEDIUM
  },
  setPreference: () => {},
  updateCustomText: () => {},
  setTriggerPreferenceUpdate: () => {},
});

export const PreferenceContextProvider = ({ children }: { children: ReactNode }) => {

  const [preference, setPreference] = useState<Preference>();
  const [triggerPreferenceUpdate, setTriggerPreferenceUpdate] = useState(0);
  const {loggedIn} = useContext(AuthContext);

  useEffect(() => {
    if (sessionStorage.getItem("token") !== null) {
      console.log("preference useEffect hook ##########");
      fetch("http://localhost:8080/preference", {
        headers: {
          "Authorization": "Bearer " + sessionStorage.getItem("token") || ""
        }
      })
      .then(res => res.json())
      .then(json => {
        if (json.timestamp && json.status && json.error) {
          console.log(json.error);
        } else {
          setPreference(json);
        }
      });
    }
  }, [loggedIn, triggerPreferenceUpdate]);

  function updateCustomText(newCustomText: string) {
    if (preference === undefined) {
      console.log("Failed to updateCustomText.");
      return;
    }
    setPreference({...preference, customText: newCustomText});
  }


  return (
    <PreferenceContext.Provider value={{preference, setPreference, updateCustomText, setTriggerPreferenceUpdate}}>
      {children}
    </PreferenceContext.Provider>
  )
}
