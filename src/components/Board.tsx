import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { IToDo, IToDoState, toDoState } from "../atoms";
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
  board: string;
  toDos: IToDo[];
  boardIndex: number;
}

interface IForm {
  toDo: string;
}

function Board({ board, toDos, boardIndex }: IBoardProps) {
  const setToDos = useSetRecoilState<IToDoState>(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    setToDos((allCategories) => {
      const allToDos = allCategories[board];
      const newToDo = { text: toDo, id: Date.now() };
      return {
        ...allCategories,
        [board]: [newToDo, ...allToDos],
      };
    });
    setValue("toDo", "");
  };

  return (
    <Draggable draggableId={board} key={board} index={boardIndex}>
      {(magic) => (
        <Wrapper ref={magic.innerRef} {...magic.draggableProps}>
          <Title {...magic.dragHandleProps}>{board}</Title>

          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("toDo", { required: true })}
              type="text"
              placeholder="Create a List"
            />
          </Form>
          <Droppable droppableId={board} type="CARD">
            {(magic, info) => (
              <Cards
                ref={magic.innerRef}
                cardIsDraggingOver={info.isDraggingOver}
                draggingFromThisWith={Boolean(info.draggingFromThisWith)}
                {...magic.droppableProps}
              >
                {toDos.map((toDo, index) => (
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
