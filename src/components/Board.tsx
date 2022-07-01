import React, { useEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { TrashTypes } from "../models/trash";
import {
  IToDo,
  IToDoState,
  saveToLocalStorage,
  toDoState,
  TODOS_LS,
} from "../models/toDos";
import Card from "./Card";
import useOutsideClick from "../hooks/useOutsideClick";

interface IWrapperProps {
  isDragging: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  height: fit-content;
  min-width: 250px;
  background-color: ${(props) => props.theme.boardBgColor};
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  border-radius: 10px;
  overflow: hidden;

  transition: box-shadow ease-out 200ms;
  box-shadow: ${(props) =>
    props.isDragging
      ? "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px"
      : "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;"};

  > * {
    padding: 10px;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;

  > h3 {
    font-weight: bold;
    cursor: pointer;
  }
`;

const TitleFormWrapper = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};
`;

const TitleForm = styled.form`
  width: 100%;

  > input {
    width: 100%;
    background-color: ${(props) => props.theme.cardFormBgColor};
    padding: 10px;
    border-radius: 5px;
    border: none;
    transition: background-color ease-out 300ms, box-shadow ease-out 300ms;
    font-weight: bold;
    :focus {
      background-color: ${(props) => props.theme.cardBgColor};
      box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px,
        rgba(0, 0, 0, 0.24) 0px 1px 2px;
      outline: 0;
    }
  }
`;

const CardForm = styled(TitleForm)`
  margin-bottom: 10px;
  > input {
    font-weight: normal;
  }
`;

interface ICardsProps {
  cardIsDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

const Cards = styled.div<ICardsProps>`
  flex-grow: 1;
`;

interface IBoardProps {
  boardTitle: string;
  cards: IToDo[];
  index: number;
}

interface ICardForm {
  toDo: string;
}

interface ITitleForm {
  title: string;
}

function Board({ boardTitle, cards, index }: IBoardProps) {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const [titleEditorOpen, setTitleEditorOpen] = useState(false);
  const {
    register: titleFormRegister,
    handleSubmit: titleFormHandleSubmit,
    setValue: titleFormSetValue,
    setFocus: titleFormSetFocus,
  } = useForm<ITitleForm>();
  const {
    register: cardFormRegister,
    handleSubmit: cardFormHandleSubmit,
    setValue: cardFormSetValue,
  } = useForm<ICardForm>();

  const onTitleValid = ({ title }: ITitleForm) => {
    // console.log(title, boardTitle, toDos);
    setTitleEditorOpen(false);
    setToDos((allBoards) => {
      const boardTitles = Object.keys(allBoards);

      let boardIndex: number | undefined;

      Object.entries(allBoards).map((board, index) => {
        if (board[0] === boardTitle) {
          boardIndex = index;
        }
      });

      if (typeof boardIndex === "undefined") return allBoards;

      boardTitles.splice(boardIndex, 1);
      boardTitles.splice(boardIndex, 0, title);

      let result = {};

      boardTitles.map((key) => {
        result = {
          ...result,
          [key]: key !== title ? allBoards[key] : allBoards[boardTitle],
        };
      });

      return result;
    });
    titleFormSetValue("title", "");
  };

  const onCardValid = ({ toDo }: ICardForm) => {
    setToDos((allBoards) => {
      const allCards = allBoards[boardTitle];
      const newCard = { text: toDo, id: Date.now() };

      return {
        ...allBoards,
        [boardTitle]: [...allCards, newCard],
      };
    });

    cardFormSetValue("toDo", "");
  };

  const toggleTitleEditorOpen = () => {
    setTitleEditorOpen((prev) => !prev);
  };

  const titleRef = useRef(null);

  const titleFormWrapperRef = useOutsideClick<
    HTMLDivElement,
    HTMLHeadingElement
  >(titleEditorOpen, toggleTitleEditorOpen, titleRef);

  useEffect(() => {
    titleFormSetFocus("title", {
      shouldSelect: titleEditorOpen,
    });
  }, [titleEditorOpen, titleFormSetFocus]);

  useEffect(() => saveToLocalStorage<IToDoState>(TODOS_LS, toDos), [toDos]);

  return (
    <Draggable draggableId={boardTitle} key={boardTitle} index={index}>
      {(magic, info) => (
        <Wrapper
          ref={magic.innerRef}
          {...magic.draggableProps}
          isDragging={info.isDragging}
        >
          <Header {...magic.dragHandleProps}>
            <TitleFormWrapper
              $isOpen={titleEditorOpen}
              ref={titleFormWrapperRef}
            >
              <TitleForm onSubmit={titleFormHandleSubmit(onTitleValid)}>
                <input
                  {...titleFormRegister("title", { required: true })}
                  type="text"
                  placeholder={boardTitle}
                />
              </TitleForm>
            </TitleFormWrapper>

            <h3 ref={titleRef} onClick={toggleTitleEditorOpen}>
              {boardTitle}
            </h3>
          </Header>
          <Droppable droppableId={boardTitle} type={TrashTypes.CARD}>
            {(magic, info) => (
              <Cards
                ref={magic.innerRef}
                cardIsDraggingOver={info.isDraggingOver}
                draggingFromThisWith={Boolean(info.draggingFromThisWith)}
                {...magic.droppableProps}
              >
                {cards.map((toDo, index) => (
                  <Card
                    key={toDo.id}
                    toDo={toDo.text}
                    index={index}
                    toDoId={toDo.id}
                  />
                ))}
                {magic.placeholder}
              </Cards>
            )}
          </Droppable>
          <CardForm onSubmit={cardFormHandleSubmit(onCardValid)}>
            <input
              {...cardFormRegister("toDo", { required: true })}
              type="text"
              placeholder="+ Add a Card"
            />
          </CardForm>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Board);
