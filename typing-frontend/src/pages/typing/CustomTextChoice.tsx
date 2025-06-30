import { useContext, useRef, useState } from "react";
import { LessonContext } from "../../store/LessonContext";
import { useNavigate } from "react-router-dom";
import { PreferenceContext } from "../../store/PreferenceContext";
import { useTranslation } from "react-i18next";

function CustomTextChoice() {

  const {t} = useTranslation();
  const [message, setMessage] = useState("");
  // const [customText, setCustomText] = useState("");
  const customTextRef = useRef<HTMLTextAreaElement>(null);
  const {setLessonText} = useContext(LessonContext);
  const {preference, updateCustomText, setTriggerPreferenceUpdate} = useContext(PreferenceContext);
  const navigate = useNavigate();

  function patchCustomText(currentCustomText: string) {
    fetch("http://localhost:8080/preference", {
      method: "PATCH",
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token") || ""
      },
      body: currentCustomText
    })
    .then(res => res.json())
    .then(json => {
      if (json.timestamp && json.status && json.error) {
        setMessage(json.error);
      } else {
        setLessonText(currentCustomText);
        updateCustomText(currentCustomText);
        navigate("/");
      }
    })
  }

  function setCustomTextToLesson(text: string) {
    fetch("http://localhost:8080/lesson", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token") || ""
      },
      body: text
    })
    .then(res => res.json())
    .then(json => {
      if (json.timestamp && json.status && json.error) {
        setMessage(json.error);
      } else {
        setTriggerPreferenceUpdate(pu => pu + 1);
        navigate("/");
      }
    })
  }

  function handleCustomTextEntry() {
    if (customTextRef.current === null) {
      console.log("Custom text was empty!");
      return;
    }
    const currentCustomText = customTextRef.current.value;
    patchCustomText(currentCustomText);
    setCustomTextToLesson(currentCustomText);
  }

  return (
    <div style={{
      margin: "5%"
      }}>
      {message}
      {/* <div>CustomTextChoice</div> */}
      <textarea style={{
      width: "300px",
      height: "150px"
      }} ref={customTextRef} defaultValue={preference?.customText}/> <br />
      <button onClick={() => handleCustomTextEntry()}>{t("nav.startnewlesson")}</button>
    </div>
  )
}

export default CustomTextChoice