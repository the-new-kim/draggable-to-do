import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { IToDo, IToDoState, toDoState } from "../atoms";

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

interface ICategoryProps {
  category: string;
  toDos: IToDo[];
}

interface IForm {
  toDo: string;
}

function Category({ category, toDos }: ICategoryProps) {
  const setToDos = useSetRecoilState<IToDoState>(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    console.log(toDo);
    setToDos((allCategories) => {
      const allToDos = allCategories[category];
      const newToDo = { text: toDo, id: Date.now() };
      return {
        ...allCategories,
        [category]: [newToDo, ...allToDos],
      };
    });
    setValue("toDo", "");
  };

  return (
    <Wrapper>
      <Title>{category}</Title>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder="Create a List"
        />
      </Form>
      <ul>
        {toDos.map((toDo) => (
          <li key={toDo.id}>{toDo.text}</li>
        ))}
      </ul>
    </Wrapper>
  );
}

export default Category;
