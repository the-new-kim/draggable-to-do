import { IToDoState } from "./toDos";

const TODOS_LS = "toDos";

export const loadToDos = () => {
  const loadedToDos = localStorage.getItem(TODOS_LS);
  if (!loadedToDos) return null;

  return JSON.parse(loadedToDos);
};

export const saveToDos = (result: IToDoState) => {
  localStorage.setItem(TODOS_LS, JSON.stringify(result));
};
