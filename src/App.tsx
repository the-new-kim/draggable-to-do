import { ThemeProvider, createGlobalStyle } from "styled-components";
import { Helmet } from "react-helmet";
import reset from "styled-reset";
import Layout from "./Layout";
import { useRecoilValue } from "recoil";
import { themeState } from "./models/atoms";

const GlobalStyle = createGlobalStyle`
${reset}

* {
  box-sizing: border-box;
}

html,body {
  @media (max-width: 700px) {
    font-size: 0.9rem;
  }
}

html,body,input[type="text"] {
	font-family: "Roboto Flex", sans-serif;
  color: ${(props) => props.theme.textColor}
}

input {
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius};
  transition: background-color ease-out 300ms, box-shadow ease-out 300ms;
  padding: 10px;
  :focus {
    outline: 0;
    background-color: ${(props) => props.theme.cardBgColor};
    ::placeholder {
        /* color: #777777; */
      }
  }
}
`;

function App() {
  const themes = useRecoilValue(themeState);

  console.log(themes);

  return (
    <ThemeProvider theme={themes[0]}>
      <GlobalStyle />
      <Helmet>
        <title>Trello clone</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100;8..144,300;8..144,600&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Layout />
    </ThemeProvider>
  );
}

export default App;
