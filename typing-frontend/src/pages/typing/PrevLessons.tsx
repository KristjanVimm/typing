import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PreferenceContext } from "../../store/PreferenceContext";
import { Lesson } from "../../models/Lesson";
import { useTranslation } from "react-i18next";

function PrevLessons() {

  const {t} = useTranslation();
  const [message, setMessage] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>();
  const navigate = useNavigate();
  const {setTriggerPreferenceUpdate} = useContext(PreferenceContext);

  useEffect(() => {
    fetch("http://localhost:8080/person-lessons", {
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token") || ""
      },
    })
    .then(res => res.json())
    .then(json => {
      if (json.error && json.message && json.timestamp) {
        setMessage(json.error);
      } else {
        setLessons(json);
      }
    })
  }, []);

  function updateCurrentLesson(lessonId: number | undefined) {
    fetch("http://localhost:8080/current-lesson?lessonId=" + lessonId, {
      method: "PATCH",
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token") || "",
      }})
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

  return (
    <>
      {message}

      {lessons !== undefined && lessons.length > 0 ?
        <div>
      {/* <div>Previous Lessons</div> */}
      <table>
        <thead>
          <tr>
            <td>{t("nav.lessontext")}</td>
            <td>{t("nav.bookmark")}</td>
            {/* <td>{t("nav.action")}</td> */}
          </tr>
        </thead>
        <tbody>
          {lessons?.map(lesson => {
            return <tr key={lesson.id}>
              <td>{lesson.text.substring(0, 35) + "..."}</td>
              <td>{lesson.bookmark}</td>
              <td>
                <button onClick={() => updateCurrentLesson(lesson.id)}>{t("nav.continuethis")}</button>
              </td>
            </tr>
          })}
        </tbody>
      </table>
      </div>
      : <div>No previous lessons</div>}
    </>
  )
}

export default PrevLessons