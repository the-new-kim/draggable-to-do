import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState, trashState } from "./atoms";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import Board from "./components/Board";
import Trash from "./components/Trash";

const Wrapper = styled.div`
  width: 100vw;
  height: auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px;
`;

const Form = styled.form`
  margin-bottom: 10px;
`;

const BoardsContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
`;

interface IForm {
  board: string;
}

function App() {
  const [boards, setBoards] = useRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();

  const [trashStatus, setTrashStatus] = useRecoilState(trashState);

  const onDragStart = (info: DropResult) => {
    setTrashStatus((allTrashes) => {
      return { ...allTrashes, [info.type]: !allTrashes[info.type] };
    });
  };

  const onDragEnd = (info: DropResult) => {
    console.log(info);
    setTrashStatus((allTrashes) => {
      return { ...allTrashes, [info.type]: !allTrashes[info.type] };
    });

    const { destination, source } = info;

    if (!destination) return;
    // moving boards

    if (destination.droppableId === "BOARD") {
      setBoards((allBoards) => {
        const boardNames = Object.keys(allBoards);

        boardNames.splice(source.index, 1);
        let newBoards = {};

        boardNames.map((boardName) => {
          newBoards = { ...newBoards, [boardName]: allBoards[boardName] };
        });

        return newBoards;
      });
    } else if (destination.droppableId === "CARD") {
      setBoards((allBoards) => {
        const copyBoard = [...allBoards[source.droppableId]];

        copyBoard.splice(source.index, 1);

        return { ...allBoards, [source.droppableId]: copyBoard };
      });
    } else if (destination.droppableId === "list") {
      setBoards((allBoards) => {
        const boardNames = Object.keys(allBoards);
        const sourceName = boardNames[source.index];

        boardNames.splice(source.index, 1);
        boardNames.splice(destination.index, 0, sourceName);

        let newBoards = {};

        boardNames.map((boardName) => {
          newBoards = { ...newBoards, [boardName]: allBoards[boardName] };
        });

        return newBoards;
      });
    }
    // moving card in a same board
    else if (destination.droppableId === source.droppableId) {
      setBoards((allBoards) => {
        const copyToDo = allBoards[source.droppableId][source.index];
        const copyBoard = [...allBoards[source.droppableId]];

        copyBoard.splice(source.index, 1);
        copyBoard.splice(destination.index, 0, copyToDo);

        return { ...allBoards, [source.droppableId]: copyBoard };
      });
    }
    // moving card form a board to the other board
    else if (destination.droppableId !== source.droppableId) {
      setBoards((allBoards) => {
        const copyToDo = allBoards[source.droppableId][source.index];
        const sourceBoard = [...allBoards[source.droppableId]];
        const targetBoard = [...allBoards[destination.droppableId]];

        sourceBoard.splice(source.index, 1);
        targetBoard.splice(destination.index, 0, copyToDo);

        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: targetBoard,
        };
      });
    }
  };

  const onValid = ({ board }: IForm) => {
    setBoards((allBoards) => {
      return { ...allBoards, [board]: [] };
    });

    setValue("board", "");
  };

  return (
    <Wrapper>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("board", { required: true })}
            type="text"
            placeholder="Create a List"
          />
        </Form>
        <Droppable droppableId="list" type="BOARD" direction="horizontal">
          {(magic) => (
            <BoardsContainer ref={magic.innerRef} {...magic.droppableProps}>
              {Object.keys(boards).map((board, index) => (
                <Board
                  board={board}
                  key={index}
                  toDos={boards[board]}
                  boardIndex={index}
                />
              ))}
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
