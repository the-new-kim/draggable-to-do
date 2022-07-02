import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import useOutsideClick from "../hooks/useOutsideClick";
import { listTitleState, saveToLocalStorage, TITLE_LS } from "../models/atoms";
import Clock from "./Clock";
import ThemeSelector from "./ThemeSelector";
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
    font-size: 1.3em;
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

    font-size: large;
    font-weight: bold;
  }
`;

const Notification = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  > *:not(:last-child) {
    margin-right: 10px;
  }
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
        <Clock />
        <ThemeSelector />
      </Notification>
    </Wrapper>
  );
}

export default Header;
