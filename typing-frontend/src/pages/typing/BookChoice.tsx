import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book } from "../../models/Book";
import { PreferenceContext } from "../../store/PreferenceContext";
import { useTranslation } from "react-i18next";

function BookChoice() {

  const {t} = useTranslation();
  const [message, setMessage] = useState("");
  const [books, setBooks] = useState<Book[]>();
  const navigate = useNavigate();
  const {setTriggerPreferenceUpdate} = useContext(PreferenceContext);

  useEffect(() => {
    fetch("http://localhost:8080/books")
    .then(res => res.json())
    .then(json => {
      if (json.error && json.message && json.timestamp) {
        setMessage(json.error);
      } else {
        setBooks(json);
      }
    })
  }, []);

  function setBookText(text: string) {
    // setLessonText(text);

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

  function startRandomWordsLesson() {
    fetch("http://localhost:8080/random-words-lesson", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token") || ""
      },
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

  return (
    <>
      {message}
      {/* <div>BookChoice</div> */}
      <table style={{
          margin: "5%"
          }}>
        <thead>
          <tr>
            <td>{t("nav.title")}</td>
            <td>{t("nav.author")}</td>
            <td>{t("nav.difficutly")}</td>
            {/* <td>Action</td> */}
          </tr>
        </thead>
        <tbody>
          {books?.map(book => {
            return <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.difficulty}</td>
              <td>
                <button onClick={() => setBookText(book.text)}>{t("nav.startnewlesson")}</button>
              </td>
            </tr>
          })}
        </tbody>
      </table>
      <button onClick={() => startRandomWordsLesson()}>{t("nav.typerandom")}</button>
    </>
  )
}

export default BookChoice