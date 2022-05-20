import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IWrapperProps {
  isDragging: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  background-color: ${(props) => (props.isDragging ? "yellow" : "green")};
  padding: 10px;
  margin-bottom: 10px;
  width: ${(props) => (props.isDragging ? "fit-content" : "auto")};
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
        <Wrapper
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
          isDragging={info.isDragging}
        >
          {toDo}
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Card);
