import React, { useEffect } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { DroppableTypes } from "../models/atom.trash";
import { IToDo, toDoState } from "../models/atom.toDos";
import { saveToDos } from "../models/handle.localStorage";
import Card from "./Card";

const Wrapper = styled.div`
  background-color: lightcoral;
  display: flex;
  flex-direction: column;

  > * {
    padding: 10px;
  }
`;

const Title = styled.h1`
  font-weight: bold;
`;

const Form = styled.form`
  width: 100%;
`;

interface ICardsProps {
  cardIsDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

const Cards = styled.div<ICardsProps>`
  background-color: ${(props) =>
    props.cardIsDraggingOver
      ? "blue"
      : props.draggingFromThisWith
      ? "red"
      : "transparent"};
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
        [boardTitle]: [newToDo, ...allToDos],
      };
    });

    setValue("toDo", "");
  };

  useEffect(() => saveToDos(toDos), [toDos]);

  return (
    <Draggable draggableId={boardTitle} key={boardTitle} index={index}>
      {(magic) => (
        <Wrapper ref={magic.innerRef} {...magic.draggableProps}>
          <Title {...magic.dragHandleProps}>{boardTitle}</Title>

          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("toDo", { required: true })}
              type="text"
              placeholder="Create a List"
            />
          </Form>
          <Droppable droppableId={boardTitle} type={DroppableTypes.CARD}>
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
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Board);
