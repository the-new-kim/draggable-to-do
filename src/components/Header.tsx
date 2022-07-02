import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import useOutsideClick from "../hooks/useOutsideClick";
import { listTitleState, saveToLocalStorage, TITLE_LS } from "../models/atoms";
import { ThemeColors } from "../theme";
import Weather from "./Weather";

const Wrapper = styled.header`
  position: fixed;
  padding: 10px 20px;
  top: 0;
  left: 0;
  width: 100vw;
  height: ${(props) => `${props.theme.headerHeight}px`};
  background-color: ${(props) => props.theme.headerBgColor};
  color: ${(props) => props.theme.textColorLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  position: relative;
  > h1 {
    font-size: large;
    font-weight: bold;
    cursor: pointer;
    padding: 10px;
  }
`;

const TitleForm = styled.form<{ $isOpen: boolean }>`
  width: 100%;
  min-width: 200px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};
  > input {
    width: 100%;
    background-color: ${(props) => props.theme.cardFormBgColor};
    padding: 10px;
    border-radius: 5px;
    border: none;
    transition: background-color ease-out 300ms, box-shadow ease-out 300ms;
    font-size: large;
    font-weight: bold;
    :focus {
      background-color: ${(props) => props.theme.cardBgColor};
      box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px,
        rgba(0, 0, 0, 0.24) 0px 1px 2px;
      outline: 0;
    }
  }
`;

const Notification = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  > * {
    margin-right: 10px;
  }
`;

const ThemeSelector = styled.div`
  background-color: red;
`;

interface ITitleForm {
  title: string;
}

function Header() {
  const [titleEditorOpen, setTitleEditorOpen] = useState(false);

  const [listTitle, setListTitle] = useRecoilState(listTitleState);
  const { register, handleSubmit, setFocus, setValue } = useForm<ITitleForm>();

  const onValid = ({ title }: ITitleForm) => {
    setListTitle(title);
    setTitleEditorOpen(false);
    saveToLocalStorage<ITitleForm>(TITLE_LS, { title });
    setValue("title", "");
  };

  const toggleTitleEditorOpen = () => {
    setTitleEditorOpen((prev) => !prev);
  };

  const titleRef = useRef(null);

  const titleFormWrapperRef = useOutsideClick<
    HTMLFormElement,
    HTMLHeadingElement
  >(titleEditorOpen, toggleTitleEditorOpen, titleRef);

  useEffect(() => {
    setFocus("title", {
      shouldSelect: titleEditorOpen,
    });
  }, [titleEditorOpen, setFocus]);

  return (
    <Wrapper>
      <Title>
        <h1 onClick={toggleTitleEditorOpen} ref={titleRef}>
          {listTitle}
        </h1>
        <TitleForm
          $isOpen={titleEditorOpen}
          ref={titleFormWrapperRef}
          onSubmit={handleSubmit(onValid)}
        >
          <input
            {...register("title", { required: true })}
            type="text"
            placeholder={listTitle}
          ></input>
        </TitleForm>
      </Title>
      <Notification>
        <Weather />
        <ThemeSelector>
          {Object.values(ThemeColors).map((color) => (
            <div key={color} style={{ backgroundColor: color }}>
              {color}
            </div>
          ))}
        </ThemeSelector>
      </Notification>
    </Wrapper>
  );
}

export default Header;
