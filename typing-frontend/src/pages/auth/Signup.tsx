import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { Person } from "../../models/Person";
import { useTranslation } from 'react-i18next';

function Signup() {

  const [person, setPerson] = useState<Person>({firstName: "", lastName: "", email: "", password: "", role: "BASIC_USER"});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const {t} = useTranslation();


  function signup () {
    fetch("http://localhost:8080/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(person)
    })
    .then(res => res.json())
    .then(json => {
      if (json.timestamp && json.status && json.error) {
        setMessage(json.error);
      } else if (json.firstName && json.lastName && json.id) {
        navigate("/login");
      } else {
        console.log("UNEXPECTED RETURN");
      }
    })
  }

  return (
    <div>
      <div>{message}</div>
      <label>{t("nav.firstname")}</label>
      <input onChange={(e) => setPerson({...person, firstName: e.target.value})} value={person?.firstName} type="text" /> <br />
      <label>{t("nav.lastname")}</label>
      <input onChange={(e) => setPerson({...person, lastName: e.target.value})} type="text" /> <br />
      <label>{t("nav.email")}</label>
      <input onChange={(e) => setPerson({...person, email: e.target.value})} type="text" /> <br />
      <label>{t("nav.password")}</label>
      <input onChange={(e) => setPerson({...person, password: e.target.value})} type="text" /> <br />
      <button onClick={signup}>{t("nav.signup")}</button>
    </div>
  )
}

export default Signup