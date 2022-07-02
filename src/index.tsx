import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import App from "./App";
import { defaultTheme, pastelTheme, vintageTheme } from "./theme";
import { Helmet } from "react-helmet";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
${reset}

* {
  box-sizing: border-box;
}

html,body,input[type="text"] {
	font-family: "Roboto Flex", sans-serif;
  color: ${(props) => props.theme.textColor}
}
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  //   <React.StrictMode>
  <RecoilRoot>
    <ThemeProvider theme={pastelTheme}>
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
      <App />
    </ThemeProvider>
  </RecoilRoot>
  //   </React.StrictMode>
);
