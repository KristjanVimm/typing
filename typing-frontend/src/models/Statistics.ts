import { Person } from "./Person";

export type Statistics = {
  "id": number;
  "person": Person;
  "numWordsTyped": number;
  "numMillisecondsTyped": number;
  "speed": number;
  "numCharactersTyped": number;
  "numMistakes": number;
  "accuracy": number;
}