import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Category from "./components/Category";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px;
`;

const Form = styled.form`
  margin-bottom: 10px;
`;

const CategoryContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 10px;
`;

interface IForm {
  category: string;
}

function App() {
  const [categories, setCategories] = useRecoilState(toDoState);
  const { register, handleSubmit, setValue } = useForm<IForm>();

  const onValid = ({ category }: IForm) => {
    setCategories((allCategories) => {
      return { ...allCategories, [category]: [] };
    });

    setValue("category", "");
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit(onValid)}>
        <input
          {...register("category", { required: true })}
          type="text"
          placeholder="Create a List"
        />
      </Form>
      <CategoryContainer>
        {Object.keys(categories).map((cat, index) => (
          <Category category={cat} key={index} toDos={categories[cat]} />
        ))}
      </CategoryContainer>
    </Wrapper>
  );
}

export default App;
