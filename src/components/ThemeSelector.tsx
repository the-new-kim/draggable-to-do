import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { saveToLocalStorage, themeState, THEME_LS } from "../models/atoms";

const Wrapper = styled.div`
  position: relative;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const CurrentColor = styled.div`
  width: 15px;
  height: 15px;
  background-color: ${(props) => props.theme.bgColor};
  border-radius: 50%;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  z-index: 101;
`;

const ThemeUl = styled.ul<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 10px;
  padding-top: 100%;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  transition: opacity 300ms ease-out;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};
`;

const ThemeLi = styled.li<{ $color: string }>`
  width: 15px;
  height: 15px;
  background-color: ${(props) => props.$color};
  border-radius: 50%;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;

  :not(:last-child) {
    margin-bottom: 10px;
  }
`;

function ThemeSelector() {
  const [themes, setThemes] = useRecoilState(themeState);
  const [listOpen, setListOpen] = useState(false);

  const toggleListOpen = () => setListOpen((prev) => !prev);

  const changeTheme = (themeIndex: number) => {
    setThemes((prev) => {
      let newArr = [...prev];
      const selectedTheme = newArr.splice(themeIndex, 1);
      return [selectedTheme[0], ...newArr];
    });
  };

  useEffect(() => saveToLocalStorage(THEME_LS, themes), [themes]);

  return (
    <Wrapper
      onMouseEnter={() => setListOpen(true)}
      onMouseLeave={() => setListOpen(false)}
    >
      <CurrentColor onClick={toggleListOpen} />

      <ThemeUl $isOpen={listOpen}>
        {themes.map((theme, index) =>
          index === 0 ? null : (
            <ThemeLi
              onClick={() => {
                changeTheme(index);
              }}
              $color={theme.bgColor}
              key={index}
            />
          )
        )}
      </ThemeUl>
    </Wrapper>
  );
}

export default ThemeSelector;
