import { createContext, ReactNode, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({
  role: "",
  loggedIn: false,
  setRole: (value: string) => {console.log(value)},
  setLoggedIn: (value: boolean) => {console.log(value)},
  loading: true,
  setLoading: (value: boolean) => {console.log(value)},
  myNameSpace: "0e2560a9-d2bc-4d87-acba-5a267be428e3",
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {

  const [role, setRole] = useState("");
  // const [admin, setAdmin] = useState(sessionStorage.getItem("token") === "TOKEN123");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const myNameSpace = "0e2560a9-d2bc-4d87-acba-5a267be428e3";

  useEffect(() => {
    if (sessionStorage.getItem("token") !== null) {
      // fetch("http://localhost:8080/person?token=" + sessionStorage.getItem("token"))
      fetch("http://localhost:8080/person", {
        headers: {"Authorization": "Bearer " + sessionStorage.getItem("token") || ""}
      })
      .then(res => res.json())
      .then(json => {
        if (json.timestamp && json.status && json.error) {
          // viskame errori
        } else {
          // console.log()
          setLoggedIn(true);
          setRole(json.role);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    
  }, []);

  return (
    <AuthContext.Provider value={{role, loggedIn, setRole, setLoggedIn, loading, setLoading, myNameSpace}}>
      {children}
    </AuthContext.Provider>
  )
}
