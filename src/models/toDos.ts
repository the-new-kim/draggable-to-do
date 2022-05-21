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
  "To Do": [
    { text: "Go to supermarket", id: 1 },
    { text: "Clean living room", id: 2 },
    { text: "Finish homework", id: 3 },
  ],
  Doing: [{ text: "Plan wedding", id: 4 }],
  Done: [
    { text: "Pick up kids", id: 5 },
    { text: "Exercise", id: 6 },
  ],
};

export const toDoState = atom<IToDoState>({
  key: "toDos",
  default: loadToDos() ?? defaultToDos,
});
