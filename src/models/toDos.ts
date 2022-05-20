import { atom } from "recoil";
import { loadToDos } from "./localStorage";

export interface IToDo {
  text: string;
  id: number;
}

export interface IToDoState {
  [key: string]: IToDo[];
}

export const defaultToDos: IToDoState = {
  "To Do": [],
  Doing: [],
  Done: [],
};

export const toDoState = atom<IToDoState>({
  key: "toDos",
  default: loadToDos() ?? defaultToDos,
});
