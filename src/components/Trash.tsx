import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

interface IWrapperProps {
  isVisible: boolean;
  isDraggingOver: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 15vw;
  height: 15vw;
  max-width: 100px;
  max-height: 100px;
  color: white;
  font-size: 50px;
  transition: opacity ease-out 500ms, transform ease-out 100ms;
  z-index: 10000;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) => (props.isDraggingOver ? "scale(1.5)" : "scale(1)")};

  svg {
    filter: drop-shadow(3px 5px 10px rgba(0, 0, 0, 0.6));
  }
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          {magic.placeholder}
        </Wrapper>
      )}
    </Droppable>
  );
}

export default Trash;
