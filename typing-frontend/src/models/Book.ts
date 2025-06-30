import { TextDifficulty } from "../enums/TextDifficulty"

export type Book = {
  "author": string,
  "title": string,
  "difficulty": TextDifficulty,
  "text": string,
}