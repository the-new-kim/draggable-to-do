import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const ToDoItem = styled.div`
  background-color: yellow;
  padding: 10px;
  margin-bottom: 10px;
`;

interface ICard {
  toDo: string;
  toDoId: number;
  index: number;
}

function Card({ toDo, index, toDoId }: ICard) {
  return (
    <Draggable key={toDo} index={index} draggableId={toDoId + ""}>
      {(magic, info) => (
        <ToDoItem
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDo}
        </ToDoItem>
      )}
    </Draggable>
  );
}

export default React.memo(Card);
