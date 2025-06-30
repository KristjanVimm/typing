import { KeyboardEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next';
import { EmailPassword } from "../../models/EmailPassword";
import { AuthContext } from "../../store/AuthContext";

function Login() {

  const [emailPassword, setEmailPassword] = useState<EmailPassword>({email: "", password: ""});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const {setRole, setLoggedIn, setLoading} = useContext(AuthContext);

  const {t} = useTranslation();

  const loginOnchange = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      login()
    }
    setEmailPassword({...emailPassword, password: e.currentTarget.value})
  }

  function login () {
    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(emailPassword)
    })
    .then(res => res.json())
    .then(json => {
      if (json.timestamp && json.status && json.error) {
        setMessage(json.error);
      } else {
        setLoggedIn(true);
        setRole(json.role);
        setLoading(false);
        sessionStorage.setItem("token", json.token);
        navigate("/");
      }
    })
  }

  return (
    <div>
      <div>{message}</div>
      <label>{t("nav.email")}</label>
      <input onChange={(e) => setEmailPassword({...emailPassword, email: e.target.value})} type="text" /> <br />
      <label>{t("nav.password")}</label>
      <input onKeyUp={(e) => loginOnchange(e)} type="password" /> <br />
      <button onClick={login}>{t("nav.login")}</button>
    </div>
  )
}

export default Login