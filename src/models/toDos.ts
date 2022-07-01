import { atom } from "recoil";
// import { loadToDos } from "./localStorage";

export interface IToDo {
  text: string;
  id: number;
}

export interface IToDoState {
  [key: string]: IToDo[];
}

export const TODOS_LS = "toDos";
export const TITLE_LS = "listTitle";

export const loadFromLocalStorage = (dataName: string) => {
  const loadedData = localStorage.getItem(dataName);
  if (!loadedData) return null;

  return JSON.parse(loadedData);
};

export const saveToLocalStorage = <T>(dataName: string, result: T) => {
  localStorage.setItem(dataName, JSON.stringify(result));
};

export const defaultToDos: IToDoState = {
  "To Do": [
    { text: "Go to Supermarket", id: 1 },
    { text: "Clean Living Room", id: 2 },
    { text: "Finish Homework", id: 3 },
  ],
  Doing: [{ text: "Learn English", id: 4 }],
  Done: [
    { text: "Call Mom", id: 5 },
    { text: "Exercise", id: 6 },
  ],
};

export const toDoState = atom<IToDoState>({
  key: "toDos",
  default: loadFromLocalStorage(TODOS_LS) ?? defaultToDos,
});

export const listTitleState = atom({
  key: "listTitle",
  default:
    loadFromLocalStorage(TITLE_LS) !== null
      ? loadFromLocalStorage(TITLE_LS).title
      : "My ToDo List",
});
