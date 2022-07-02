import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IWrapperProps {
  isDragging: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 10px;
  margin-bottom: 10px;
  border-radius: ${(props) => props.theme.borderRadius};

  transition: box-shadow ease-out 200ms;

  box-shadow: ${(props) =>
    props.isDragging
      ? "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px"
      : "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px"};
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
