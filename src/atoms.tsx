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
      { text: "j", id: 11 },
      { text: "s", id: 12 },
    ],
    Doing: [
      { text: "sdf", id: 1 },
      { text: "sdddd", id: 2 },
      { text: "sdf", id: 3 },
      { text: "sdaaddd", id: 4 },
      { text: "sddaaaaadd", id: 5 },
    ],
  },
});

// export enum TrashTypes {
//   "BOARD" = "BOARD",
//   "CARD" = "CARD",
// }

interface ITrashState {
  [key: string]: boolean;
}

export const trashState = atom<ITrashState>({
  key: "trashStatus",
  default: {
    BOARD: false,
    CARD: false,
  },
});
