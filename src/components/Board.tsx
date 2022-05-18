import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { IToDo, IToDoState, toDoState } from "../atoms";
import Card from "./Card";

const Wrapper = styled.div`
  background-color: lightcoral;
  padding: 10px;
  > * {
    margin-bottom: 10px;
  }
`;

const Title = styled.h1`
  font-weight: bold;
`;

const Form = styled.form`
  width: 100%;
`;

const ToDos = styled.div``;

interface IBoardProps {
  board: string;
  toDos: IToDo[];
}

interface IForm {
  toDo: string;
}

function Board({ board, toDos }: IBoardProps) {
  const setToDos = useSetRecoilState<IToDoState>(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    setToDos((allCategories) => {
      const allToDos = allCategories[board];
      const newToDo = { text: toDo, id: Date.now() };
      return {
        ...allCategories,
        [board]: [newToDo, ...allToDos],
      };
    });
    setValue("toDo", "");
  };

  return (
    <Wrapper>
      <Title>{board}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder="Create a List"
        />
      </Form>
      <Droppable droppableId={board}>
        {(magic) => (
          <ToDos ref={magic.innerRef} {...magic.droppableProps}>
            {toDos.map((toDo, index) => (
              <Card key={toDo.id} text={toDo.text} index={index} />
            ))}
            {magic.placeholder}
          </ToDos>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
