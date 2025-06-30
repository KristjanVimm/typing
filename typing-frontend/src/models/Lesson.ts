import { Person } from "./Person"

export type Lesson = {
  id?: number,
  text: string,
  bookmark: number,
  person: Person,
}