// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    bgColor: string;
    boardBgColor: string;
    cardBgColor: string;
    cardFormBgColor: string;
    headerBgColor: string;
    headerHeight: number;
    textColorLight: string;
    textColor: string;
    borderRadius: string;
  }
}
