import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./models/toDos";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import Board from "./components/Board";
import Trash from "./components/Trash";
import { useEffect } from "react";
import { saveToDos } from "./models/localStorage";
import { TrashTypes, trashState } from "./models/trash";

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
      return setToDos((allToDos) => {
        const boardTitles = Object.keys(allToDos);
        const sourceTitle = boardTitles[source.index];

        boardTitles.splice(source.index, 1);
        destination.droppableId === "list" &&
          boardTitles.splice(destination.index, 0, sourceTitle);
        let result = {};
        //typescript warns... better find other solution...
        boardTitles.map((boardName) => {
          result = { ...result, [boardName]: allToDos[boardName] };
        });

        return result;
      });
    }

    // moving card in a same board || remove card
    if (
      destination.droppableId === source.droppableId ||
      destination.droppableId === TrashTypes.CARD
    ) {
      return setToDos((allToDos) => {
        const copyToDo = allToDos[source.droppableId][source.index];
        const copyBoard = [...allToDos[source.droppableId]];

        copyBoard.splice(source.index, 1);
        destination.droppableId === source.droppableId &&
          copyBoard.splice(destination.index, 0, copyToDo);

        return { ...allToDos, [source.droppableId]: copyBoard };
      });
    }
    // moving card form a board to the other board
    if (destination.droppableId !== source.droppableId) {
      return setToDos((allToDos) => {
        const copyToDo = allToDos[source.droppableId][source.index];
        const sourceBoard = [...allToDos[source.droppableId]];
        const targetBoard = [...allToDos[destination.droppableId]];

        sourceBoard.splice(source.index, 1);
        targetBoard.splice(destination.index, 0, copyToDo);

        return {
          ...allToDos,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: targetBoard,
        };
      });
    }
  };

  const onValid = ({ board }: IForm) => {
    setToDos((allToDos) => {
      return { ...allToDos, [board]: [] };
    });

    setValue("board", "");
  };

  useEffect(() => saveToDos(toDos), [toDos]);

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
