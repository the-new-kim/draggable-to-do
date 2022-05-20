import { atom } from "recoil";

export enum DroppableTypes {
  "BOARD" = "BOARD",
  "CARD" = "CARD",
}

interface ITrashState {
  [key: string]: boolean;
}

export const trashState = atom<ITrashState>({
  key: "trashStatus",
  default: {
    [DroppableTypes.BOARD]: false,
    [DroppableTypes.CARD]: false,
  },
});
