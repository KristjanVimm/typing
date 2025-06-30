import { useCallback, useContext, useEffect, useState } from "react"
import TypingTextBox from "../../components/TypingTextBox";
import useFocus from "../../utils/useFocus";
import { LessonPage } from "../../models/LessonPage";
import { AuthContext } from "../../store/AuthContext";
import { v5 as uuidv5 } from 'uuid';
import { PreferenceContext } from "../../store/PreferenceContext";
import { useNavigate } from "react-router-dom";

function Typing() {
  const [message, setMessage] = useState("");
  const [endOfLesson, setEndOfLesson] = useState(false);
  const [prevSpeed, setPrevSpeed] = useState(0);
  const [prevAccuracy, setPrevAccuracy] = useState(0);
  const [currentPageText, setCurrentPageText] = useState("");
  const [nextPageText, setNextPageText] = useState("");
  const [inputRef, setInputFocus] = useFocus<HTMLInputElement>();
  const [triggerNextPage, setTriggerNextPage] = useState(0);
  const {preference} = useContext(PreferenceContext);
  const {loggedIn, myNameSpace} = useContext(AuthContext);
  const navigate = useNavigate();

  // Taken from stackoverflow. React hook to focus on the typing input upon "Enter" keypress.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === "Enter") {
        setInputFocus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setInputFocus]);

  const getCommonWords = useCallback((givenSetFunction: any) => {
    fetch("http://localhost:8080/common-words?numOfWords=" + preference?.wordsOnPage)
    .then(res => res.json())
    .then(json => {
      if (json.error && json.message && json.timestamp) {
        setMessage(json.error);
      } else {
        setEndOfLesson(false);
        if (json.text == "") {
          console.log("json.text was empty, triggering new load");
          setTriggerNextPage(np => np + 1);
        }
        givenSetFunction(json.text);
        console.log("Next page loaded");
      }
    })
  }, [preference?.wordsOnPage]);

  const getNextPage = useCallback((givenSetFunction: any, isPreload: boolean) => {
    fetch("http://localhost:8080/next-page?isPreload=" + isPreload, {
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token") || ""
      }
    })
    .then(res => res.json())
    .then(json => {
      if (json.error && json.message && json.timestamp) {
        setMessage(json.error);
      } else if (json.endOfLesson) {
        setMessage("End of lesson.");
        setEndOfLesson(true);
        givenSetFunction("");
      } else {
        setEndOfLesson(false);
        givenSetFunction(json.text);
        console.log("Next page loaded");
      }
    })
  }, []);

  const getTextForCurrentOrNextPage = useCallback((setCurrOrNextText: any, isPreload: boolean) => {
    if (!loggedIn) {
      navigate("/login");
      return ;
    }
    if (preference?.wantCommonWords) {
      getCommonWords(setCurrOrNextText);
    } else {
      getNextPage(setCurrOrNextText, isPreload);
    }
  }, [loggedIn, navigate, preference?.wantCommonWords, getCommonWords, getNextPage])

  useEffect(() => {
    getTextForCurrentOrNextPage(setCurrentPageText, false);
  }, [getTextForCurrentOrNextPage]);

  useEffect(() => {
    getTextForCurrentOrNextPage(setNextPageText, true);
  }, [getTextForCurrentOrNextPage, triggerNextPage]); // TODO put dependencies back?

  // getTextForCurrentOrNextPage(setCurrentPageText);

  // useEffect(() => {
  //   if (!loggedIn) {
  //     navigate("/login");
  //     return ;
  //   }
  //   if (preference?.wantCommonWords) {
  //     getCommonWords(setCurrentPageText);
  //   } else {
  //     getNextPage();
  //   }
  // }, [getCommonWords, getNextPage]);

  function handlePageEnd(typedText: string, backspaces: number, mistakes: number, duration: number) {  // , mistakesMap: {map: Map<string, number>}, correctsMap: {map: Map<string, number>}) {
    const lessonPage : LessonPage = {
      "typedText": typedText,
      "baseText": currentPageText,
      "backspaces": backspaces,
      "mistakes": mistakes,
      "duration": duration,
      // "mistakesMap": mistakesMap.map,
      // "correctsMap": correctsMap.map,
    };
    const custom_uuid = uuidv5(typedText+currentPageText+sessionStorage.getItem("token")+preference?.currentLessonId, myNameSpace);
    const custom_bookmark_uuid = uuidv5(typedText+currentPageText+sessionStorage.getItem("token")+preference?.currentLessonId+currentPageText.length, myNameSpace);
    console.log(custom_uuid);
    fetch("http://localhost:8080/lesson-page", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token") || "",
        "Content-Type": "application/json",
        "Idempotency-Key": custom_uuid,
      },
      body: JSON.stringify(lessonPage)
    })
    .then(() => {
      console.log("LessonPage successfully saved");
        fetch("http://localhost:8080/lesson-bookmark?bookmarkShift=" + currentPageText.length, {
          method: "PATCH",
          headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("token") || "",
            "Idempotency-Key": custom_bookmark_uuid,
          }});
          // console.log("Bookmark successfully moved");
          setPrevSpeed(currentPageText.trim().split(/\s+/).length * 60 / (duration/1000));
          setPrevAccuracy(100*(currentPageText.length - mistakes) / currentPageText.length);
          setCurrentPageText(nextPageText);
          setTriggerNextPage(prev => prev+1);
    })
  }

  return (
    <div>
      {message}
      <div>{prevSpeed.toFixed(2)} wpm</div>
      <div>{prevAccuracy.toFixed(2)} % accuracy</div>
      <TypingTextBox disabled={endOfLesson} baseText={currentPageText} inputRef={inputRef} handlePageEnd={handlePageEnd} style={{
      fontSize: preference?.textSize == "XLARGE" ? "X-LARGE" : preference?.textSize == "XXLARGE"? "XX-LARGE" : preference?.textSize
      }}/>
    </div>
  )
}

export default Typing