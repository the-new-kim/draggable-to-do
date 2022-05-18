import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const ToDoItem = styled.div`
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
`;

interface IToDo {
  text: string;
  index: number;
}

function Card({ text, index }: IToDo) {
  return (
    <Draggable key={text} index={index} draggableId={text}>
      {(magic, info) => (
        <ToDoItem
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {text}
        </ToDoItem>
      )}
    </Draggable>
  );
}

export default Card;
