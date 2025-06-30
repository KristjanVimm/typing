import { Person } from "./Person"
import { TextSize } from "../enums/TextSize"

export type Preference = {
  id?: number,
  person: Person,
  currentLessonId: number,
  wantCommonWords: boolean,
  customText: string,
  wordsOnPage: number,
  textSize: TextSize
}