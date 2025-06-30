import { ChangeEvent, KeyboardEvent, RefObject, useContext, useState } from "react"
import TypedText from "./TypedText";
import { getWrongCharsBoolArray } from "../utils/TextBoxUtils";
import { WrongCharsContext } from "../store/WrongCharsContext";

function TypingTextBox( {baseText, inputRef, handlePageEnd, disabled, style} : {baseText: string, inputRef: RefObject<HTMLInputElement>, handlePageEnd: any, disabled: boolean, style: any}) {

  const [cursorIndex, setCursorIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [inputText, setInputText] = useState("");
  const [startTime, setStartTime] = useState<Date>();
  const [backspaces, setBackspaces] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  // const [mistakesMap, setMistakesMap] = useState<{ map: Map<string, number> }>({ map: new Map() });
  // const [correctsMap, setCorrectsMap] = useState<{ map: Map<string, number> }>({ map: new Map() });
  // const mistakesMap = new Map<string, number>();
  // const correctsMap = new Map<string, number>();
  const {wrongCharsPreviousState, updateWrongCharsPreviousState} = useContext(WrongCharsContext);

  // function getMistakesMapValue(key: string): number | undefined {
  //   return mistakesMap.map.get(key);
  // }

  // function updateMistakesMap(key: string, value: number): void {
  //   setMistakesMap(({ map }) => ({ map: map.set(key, value) }));
  // }

  // function checkMistakesMapValue(key: string): boolean | undefined {
  //   return mistakesMap.map.has(key);
  // }

  // function clearMistakesMap() {
  //   mistakesMap.map.clear();
  // }

  // function getCorrectsMapValue(key: string): number | undefined {
  //   return correctsMap.map.get(key);
  // }

  // function updateCorrectsMap(key: string, value: number): void {
  //   setCorrectsMap(({ map }) => ({ map: map.set(key, value) }));
  // }

  // function checkCorrectsMapValue(key: string): boolean | undefined {
  //   return correctsMap.map.has(key);
  // }

  // function clearCorrectsMap() {
  //   correctsMap.map.clear();
  // }

  if (baseText.length > 0 && cursorIndex === baseText.length) {
    setCursorIndex(0);
    setTypedText("");
    setBackspaces(0);
    setMistakes(0);
    if (startTime === undefined) {
      handlePageEnd(typedText, backspaces, mistakes, 0);  // , mistakesMap, correctsMap);
    } else {
      // console.log(correctsMap.map);
      handlePageEnd(typedText, backspaces, mistakes, new Date().getTime() - startTime.getTime());  // , mistakesMap, correctsMap);
    }
    // clearMistakesMap();
    // clearCorrectsMap();
  }

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const cursorInput = e.target.value;

    if (typedText === "" && cursorInput !== "") {
      console.log("resetting current time, backspaces and mistakes");
      setStartTime(new Date());
      setBackspaces(0);
      setMistakes(0);
    }
    // const wantedChar = baseText.charAt(cursorIndex);
    if (baseText.charAt(cursorIndex) !== "" && cursorInput.charAt(cursorInput.length-1) === baseText.charAt(cursorIndex)) {
      // if (checkCorrectsMapValue(wantedChar)) {
      //   updateCorrectsMap(wantedChar, getCorrectsMapValue(wantedChar)! + 1);
      //   console.log("adding extant char " + wantedChar + " to corrects");
      // } else {
      //   updateCorrectsMap(wantedChar, 1);
      //   console.log("adding new char " + wantedChar + " to corrects");
      // }
      setCursorIndex(ci => ci + 1);
      setTypedText(tt => tt + cursorInput);
      setInputText("");
    } else if (cursorInput.length == 2 && baseText.length > cursorIndex + 1 && cursorInput.charAt(1) === baseText.charAt(cursorIndex + 1)) {
      // const nextWantedChar = baseText.charAt(cursorIndex + 1);
      // if (checkCorrectsMapValue(nextWantedChar)) {
      //   updateCorrectsMap(nextWantedChar, getCorrectsMapValue(nextWantedChar)! + 1);
      //   console.log("adding extant char " + wantedChar + " to corrects from skip");
      // } else {
      //   updateCorrectsMap(nextWantedChar, 1);
      //   console.log("adding new char " + wantedChar + " to corrects from skip");
      // }
      setCursorIndex(ci => ci + 2);
      setTypedText(tt => tt + cursorInput);
      setInputText("");
    } else {
      // if (checkMistakesMapValue(wantedChar)) {
      //   updateMistakesMap(wantedChar, getMistakesMapValue(wantedChar)! + 1);
      //   console.log("adding extant char " + wantedChar + " to mistakes");
      // } else {
      //   updateMistakesMap(wantedChar, 1);
      //   console.log("adding new char " + wantedChar + " to mistakes");
      // }
      setInputText(cursorInput);
      console.log(e);
      if ("inputType" in e.nativeEvent && !["deleteContentBackward", "deleteWordBackward", "deleteContentForward", "deleteWordForward", "deleteByCut"].includes(String(e.nativeEvent.inputType))) {
        console.log("add one to mistakes for non-backspace input")
        setMistakes(mi => mi + 1);
      }
    }
  }

  function handleBackspace(e: KeyboardEvent<HTMLInputElement>) {
    if (inputText !== "" && e.code === "Backspace") {
      setBackspaces(bs => bs + 1);
    }
    if (typedText === "" || inputText !== "" || e.code !== "Backspace") {
      return;
    }
    if (e.ctrlKey) {
    console.log("ctrl + backspace");
    }
    else {
      const wrongCharsBoolArray = getWrongCharsBoolArray({typedText, baseText});
      updateWrongCharsPreviousState(wrongCharsBoolArray);
      if (!wrongCharsPreviousState?.length || wrongCharsBoolArray[wrongCharsBoolArray.length-1] == 0 || [0, 2].includes(wrongCharsPreviousState[wrongCharsBoolArray.length-1])) {
        setCursorIndex(ci => ci - 1);
      }
      setTypedText(tt => tt.substring(0, tt.length-1));
      setBackspaces(bs => bs + 1);
    }
  }
  
  return (
    <div className="typing-text-box" style={style}>
      <TypedText typedText={typedText} baseText={baseText}/>
      <input disabled={disabled} autoFocus ref={inputRef} type="text" className="typing-cursor" value={inputText} onKeyDown={e => handleBackspace(e)} onChange={e => handleInput(e)} placeholder=""/>
      <span className="base-text">{baseText.substring(cursorIndex)}</span>
    </div>
  )
}

export default TypingTextBox