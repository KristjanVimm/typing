import { getWrongCharsBoolArray } from "../utils/TextBoxUtils";

// Display incorrectly typed characters as red and correctly typed characters as regular.
// Returns an array of <span> elements
function TypedText( {typedText, baseText} : {typedText: string, baseText: string}) {

  // Here we don't need to know the type of the error, only which characters are correct and which are not.
  function replaceTwosWithOnes(element: number, index: number, array: number[]) {
    if (element === 2) {
      array[index] = 1;
    } else {
      array[index] = element;
    }
  }

  const wrongCharsBoolArray = getWrongCharsBoolArray({typedText, baseText})
  wrongCharsBoolArray.forEach(replaceTwosWithOnes) 

  const outputHTML: JSX.Element[] = [];

  if (wrongCharsBoolArray[0] === 0) {
    let firstWrongCharIndex = wrongCharsBoolArray.indexOf(1);
    firstWrongCharIndex = firstWrongCharIndex === -1 ? typedText.length+1 : firstWrongCharIndex;
    outputHTML.push(<span key={firstWrongCharIndex}>{typedText.substring(0, firstWrongCharIndex)}</span>);
  }

  let startIndex = wrongCharsBoolArray.indexOf(1);
  startIndex = startIndex === -1 ? typedText.length+1 : startIndex;
  let endIndex = wrongCharsBoolArray.indexOf(0, startIndex);
  endIndex = endIndex === -1 ? typedText.length+1 : endIndex;

  while (startIndex <= typedText.length) {
    if (wrongCharsBoolArray[startIndex] === 1) {
      outputHTML.push(<span key={endIndex} className="wrong-text">{typedText.substring(startIndex, endIndex)}</span>)
    } else {
      outputHTML.push(<span key={endIndex}>{typedText.substring(startIndex, endIndex)}</span>)
    }
    startIndex = endIndex;
    endIndex = wrongCharsBoolArray.indexOf(Math.pow(0, wrongCharsBoolArray[endIndex]), endIndex);
    endIndex = endIndex === -1 ? typedText.length+1 : endIndex;
  }

  return (
    <span className="">{outputHTML}</span>
  )
}

export default TypedText