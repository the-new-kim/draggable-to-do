import { atom } from "recoil";

export enum TrashTypes {
  "BOARD" = "BOARD",
  "CARD" = "CARD",
}

interface ITrashState {
  [key: string]: boolean;
}

export const trashState = atom<ITrashState>({
  key: "trashStatus",
  default: {
    [TrashTypes.BOARD]: false,
    [TrashTypes.CARD]: false,
  },
});
