import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IWrapperProps {
  isVisible: boolean;
  isDraggingOver: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 200px;
  height: 200px;
  background-color: darkblue;
  color: white;
  font-size: 50px;
  transition: opacity ease-out 500ms, transform ease-out 100ms;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) => (props.isDraggingOver ? "scale(2)" : "scale(1)")};
`;

interface ITrashProps {
  type: string;
  isVisible: boolean;
}

function Trash({ type, isVisible }: ITrashProps) {
  return (
    <Droppable droppableId={type} type={type}>
      {(magic, info) => (
        <Wrapper
          isVisible={isVisible}
          isDraggingOver={Boolean(info.draggingOverWith)}
          ref={magic.innerRef}
          {...magic.droppableProps}
        >
          Trash
          {magic.placeholder}
        </Wrapper>
      )}
    </Droppable>
  );
}

export default Trash;
