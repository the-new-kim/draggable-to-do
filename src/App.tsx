import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import { DragDropContext } from "react-beautiful-dnd";
import Board from "./components/Board";

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

  const onDragEnd = () => {};

  const onValid = ({ board }: IForm) => {
    setBoards((allBoards) => {
      return { ...allBoards, [board]: [] };
    });

    setValue("board", "");
  };

  return (
    <Wrapper>
      <DragDropContext onDragEnd={onDragEnd}>
        <Form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("board", { required: true })}
            type="text"
            placeholder="Create a List"
          />
        </Form>
        <BoardsContainer>
          {Object.keys(boards).map((cat, index) => (
            <Board board={cat} key={index} toDos={boards[cat]} />
          ))}
        </BoardsContainer>
      </DragDropContext>
    </Wrapper>
  );
}

export default App;
