import { atom } from "recoil";
import { loadToDos } from "./handle.localStorage";

export interface IToDo {
  text: string;
  id: number;
}

export interface IToDoState {
  [key: string]: IToDo[];
}

const defaultToDos: IToDoState = {
  "To Do": [],
  Doing: [],
  Done: [],
};

export const toDoState = atom<IToDoState>({
  key: "toDos",
  default: loadToDos() ?? defaultToDos,
});
