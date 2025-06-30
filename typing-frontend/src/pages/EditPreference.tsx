import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { TextSize } from "../enums/TextSize";
import { $enum } from "ts-enum-util";
import { PreferenceContext } from "../store/PreferenceContext";
import { Statistics } from "../models/Statistics";
import { useTranslation } from "react-i18next";

function EditPreference() {

  const {t} = useTranslation();
  const [message, setMessage] = useState("");
  const [statistics, setStatistics] = useState<Statistics>();
  const {preference, setPreference} = useContext(PreferenceContext);
  const navigate = useNavigate();

  useEffect(() => {
      fetch("http://localhost:8080/statistics", {
        headers: {
          "Authorization": "Bearer " + sessionStorage.getItem("token") || ""
        },
      })
      .then(res => res.json())
      .then(json => {
        if (json.error && json.message && json.timestamp) {
          setMessage(json.error);
        } else {
          setStatistics(json);
        }
      })
    }, []);

  function edit() {

    console.log(preference);
    fetch("http://localhost:8080/preference", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + sessionStorage.getItem("token") || ""
      },
      body: JSON.stringify(preference)
    })
    .then(res => res.json())
    .then(json => {
      if (json.timestamp && json.status && json.error) {
        setMessage(json.error);
      } else {
        console.log("trying to navigate to typing..")
        navigate("/");
      }
    })
  }

  if (preference === undefined) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div>{message}</div>
      {/* <div>role: {preference.person.role}</div> */}
      {/* <label>ID</label> */}
      {/* <input disabled defaultValue={preference.person.id} type="text" /> <br /> */}
      <label>{t("nav.firstname")}</label>
      <input onChange={(e) => setPreference({...preference, person: {...preference.person, firstName: e.target.value}})} defaultValue={preference.person.firstName} type="text" /> <br />
      <label>{t("nav.lastname")}</label>
      <input onChange={(e) => setPreference({...preference, person: {...preference.person, lastName: e.target.value}})} defaultValue={preference.person.lastName} type="text" /> <br />
      <label>{t("nav.textsize")}</label>
      <select onChange={(e) => setPreference({...preference, textSize: TextSize[e.target.value as keyof typeof TextSize]})} defaultValue={preference.textSize} >
        {$enum(TextSize).map(v => {
          return <option key={v} value={v}>{v}</option>
        })}
      </select> <br />
      <label>{t("nav.wordsonpage")}</label>
      <select onChange={(e) => setPreference({...preference, wordsOnPage: Number(e.target.value)})} defaultValue={preference.wordsOnPage} >
        {[5,10,20,40,60,80].map(possibleValue =>
          <option key={possibleValue} value={possibleValue}>{possibleValue}</option>
        )}
      </select> <br />
      <button onClick={edit}>Edit</button>
      <br /> <br />
      <div>{t("nav.overallspeed")}: {statistics?.speed.toFixed(2)}</div>
      <div>{t("nav.overallaccuracy")}: {statistics?.accuracy.toFixed(2)}%</div>
    </div>
  )
}

export default EditPreference