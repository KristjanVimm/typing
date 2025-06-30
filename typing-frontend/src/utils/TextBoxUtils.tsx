
// For every character of user typed text, decide whether the 
// character was typed correctly or not, based on the original text and return an array of size {typedText.length}.
// Possible values in the returned array are:
//   0 -> no error
//   1 -> regular error: we were waiting for character X, but the user typed another character Y != X, and then typed the correct character X. Every character Y != X that
// was typed before typing the correct character X, will be flagged with 1 in the array.
//   2 -> special error: we were waiting for character X followed by character Y, but the user typed character Z != X, and then typed character Y. We then flag the 
// typed character Z != X with 2 in the array and flag the typed character Y with 0 in the array. This only allowes one character to be "skipped", not multiple.
export function getWrongCharsBoolArray({typedText, baseText} : {typedText: string, baseText: string}) {
  let baseTextIndex = 0;
  const wrongCharsBoolArray : number[] = [];
  for (let typedTextIndex = 0; typedTextIndex < typedText.length; typedTextIndex++) {
    if (typedText.charAt(typedTextIndex) === baseText.charAt(baseTextIndex)) {
      wrongCharsBoolArray.push(0); // 0 -> no error
      baseTextIndex += 1;
    } else if (typedText.charAt(typedTextIndex) === baseText.charAt(baseTextIndex + 1) && wrongCharsBoolArray[wrongCharsBoolArray.length-1] === 1) {
      wrongCharsBoolArray[wrongCharsBoolArray.length-1] = 2; // 2 -> special error
      wrongCharsBoolArray.push(0);
      baseTextIndex += 2;
    } else {
      wrongCharsBoolArray.push(1); // 1 -> regular error
    }
  }
  return wrongCharsBoolArray;
}
