import React, { useEffect } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { TrashTypes } from "../models/trash";
import { IToDo, toDoState } from "../models/toDos";
import { saveToDos } from "../models/localStorage";
import Card from "./Card";

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
  > h3 {
    font-weight: bold;
  }
`;

const Form = styled.form`
  width: 100%;

  > input {
    width: 100%;
    background-color: ${(props) => props.theme.formBgColor};
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border: none;
    transition: background-color ease-out 300ms, box-shadow ease-out 300ms;

    :focus {
      background-color: ${(props) => props.theme.cardBgColor};
      box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px,
        rgba(0, 0, 0, 0.24) 0px 1px 2px;
      outline: 0;
    }
  }
`;

interface ICardsProps {
  cardIsDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

const Cards = styled.div<ICardsProps>`
  /* background-color: ${(props) =>
    props.cardIsDraggingOver
      ? "blue"
      : props.draggingFromThisWith
      ? "red"
      : "transparent"}; */
  flex-grow: 1;
`;

interface IBoardProps {
  boardTitle: string;
  cards: IToDo[];
  index: number;
}

interface IForm {
  toDo: string;
}

function Board({ boardTitle, cards, index }: IBoardProps) {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    setToDos((allCategories) => {
      const allToDos = allCategories[boardTitle];
      const newToDo = { text: toDo, id: Date.now() };

      return {
        ...allCategories,
        [boardTitle]: [...allToDos, newToDo],
      };
    });

    setValue("toDo", "");
  };

  useEffect(() => saveToDos(toDos), [toDos]);

  return (
    <Draggable draggableId={boardTitle} key={boardTitle} index={index}>
      {(magic, info) => (
        <Wrapper
          ref={magic.innerRef}
          {...magic.draggableProps}
          isDragging={info.isDragging}
        >
          <Header {...magic.dragHandleProps}>
            <h3>{boardTitle}</h3>
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
          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("toDo", { required: true })}
              type="text"
              placeholder="Add a card"
            />
          </Form>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Board);
