import { atom } from "recoil";

export interface IToDo {
  text: string;
  id: number;
}

export interface IToDoState {
  [key: string]: IToDo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDos",
  default: {
    "To Do": [
      { text: "j", id: 1 },
      { text: "s", id: 2 },
    ],
    Doing: [
      { text: "sdf", id: 1 },
      { text: "sdddd", id: 2 },
    ],
  },
});
