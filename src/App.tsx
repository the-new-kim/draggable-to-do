import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import {
  IToDoState,
  saveToLocalStorage,
  toDoState,
  TODOS_LS,
} from "./models/atoms";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import Board from "./components/Board";
import Trash from "./components/Trash";
import { useEffect } from "react";
import { TrashTypes, trashState } from "./models/atoms";
import Header from "./components/Header";

const Wrapper = styled.div`
  position: relative;
  background-color: ${(props) => props.theme.bgColor};
  overflow: hidden;
`;

const Form = styled.form`
  margin-bottom: 10px;
  height: fit-content;
  input {
    ::placeholder {
      transition: color ease-out 300ms;
      color: ${(props) => props.theme.textColorLight};
    }

    background-color: ${(props) => props.theme.boardFormBgColor};
    width: 100%;
    min-width: 250px;
    padding: 10px;
    border: none;
    border-radius: 10px;
    transition: background-color ease-out 300ms, box-shadow ease-out 300ms;

    :focus {
      background-color: ${(props) => props.theme.cardBgColor};
      box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px,
        rgba(0, 0, 0, 0.24) 0px 1px 2px;
      outline: 0;

      ::placeholder {
        color: #777777;
      }
    }
  }
`;

const BoardsContainer = styled.div`
  display: inline-flex;
  padding: ${(props) => `${props.theme.headerHeight + 20}px`} 20px 20px;
  width: 100vw;
  height: auto;
  min-height: 100vh;
  overflow: auto;
`;

interface IForm {
  board: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();

  const [trashStatus, setTrashStatus] = useRecoilState(trashState);

  const onDragStart = (info: DropResult) => {
    setTrashStatus((allTrashes) => {
      return { ...allTrashes, [info.type]: !allTrashes[info.type] };
    });
  };

  const onDragEnd = (info: DropResult) => {
    setTrashStatus((allTrashes) => {
      return { ...allTrashes, [info.type]: !allTrashes[info.type] };
    });

    const { destination, source } = info;
    if (!destination) return;

    // moving || removing Boards
    if (
      destination.droppableId === "list" ||
      destination.droppableId === TrashTypes.BOARD
    ) {
      return setToDos((allBoards) => {
        const boardTitles = Object.keys(allBoards);
        const sourceTitle = boardTitles[source.index];

        boardTitles.splice(source.index, 1);
        destination.droppableId === "list" &&
          boardTitles.splice(destination.index, 0, sourceTitle);
        let result = {};

        boardTitles.map(
          (boardName) =>
            (result = { ...result, [boardName]: allBoards[boardName] })
        );

        return result;
      });
    }

    // moving card in a same board || remove card
    if (
      destination.droppableId === source.droppableId ||
      destination.droppableId === TrashTypes.CARD
    ) {
      return setToDos((allBoards) => {
        const toDoCopy = allBoards[source.droppableId][source.index];
        const boardCopy = [...allBoards[source.droppableId]];

        boardCopy.splice(source.index, 1);
        destination.droppableId === source.droppableId &&
          boardCopy.splice(destination.index, 0, toDoCopy);

        return { ...allBoards, [source.droppableId]: boardCopy };
      });
    }
    // moving card form a board to the other board
    if (destination.droppableId !== source.droppableId) {
      return setToDos((allBoards) => {
        const toDoCopy = allBoards[source.droppableId][source.index];
        const sourceBoard = [...allBoards[source.droppableId]];
        const targetBoard = [...allBoards[destination.droppableId]];

        sourceBoard.splice(source.index, 1);
        targetBoard.splice(destination.index, 0, toDoCopy);

        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: targetBoard,
        };
      });
    }
  };

  const onValid = ({ board }: IForm) => {
    setToDos((allBoards) => {
      return { ...allBoards, [board]: [] };
    });

    setValue("board", "");
  };

  useEffect(() => saveToLocalStorage<IToDoState>(TODOS_LS, toDos), [toDos]);

  return (
    <Wrapper>
      <Header />
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable
          droppableId="list"
          type={TrashTypes.BOARD}
          direction="horizontal"
        >
          {(magic) => (
            <BoardsContainer ref={magic.innerRef} {...magic.droppableProps}>
              {Object.keys(toDos).map((boardTitle, index) => (
                <Board
                  boardTitle={boardTitle}
                  key={index}
                  cards={toDos[boardTitle]}
                  index={index}
                />
              ))}
              <Form onSubmit={handleSubmit(onValid)}>
                <input
                  {...register("board", { required: true })}
                  type="text"
                  placeholder="+ Add a List"
                />
              </Form>
              {magic.placeholder}
            </BoardsContainer>
          )}
        </Droppable>

        {Object.keys(trashStatus).map((trashType, index) => (
          <Trash
            key={index}
            type={trashType}
            isVisible={trashStatus[trashType]}
          />
        ))}
      </DragDropContext>
    </Wrapper>
  );
}

export default App;
