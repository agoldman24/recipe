import { isMobileOnly } from "react-device-detect";

export const defaultTheme = {
  palette: {
    type: "dark",
    background: {
      default: "#202020",
    },
    primary: {
      main: "#ffe100",
      mainGradient: "linear-gradient(to top right, #ff4000, yellow)",
    },
    secondary: {
      main: "#ff441f",
    },
  },
};

export const inputTheme = {
  palette: {
    type: "dark",
    background: {
      default: "#202020",
    },
    primary: {
      main: "#ffe100",
      mainGradient: "linear-gradient(to top right, #ff4000, yellow)",
    },
    secondary: {
      main: "#fc8c03",
    },
  },
};

export const formTheme = (theme) => ({
  paper: {
    margin: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    background: defaultTheme.palette.primary.mainGradient,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
    zIndex: "3",
  },
  inputText: {
    fontSize: "16px",
  },
  inputTextLowercase: {
    fontSize: "16px",
    textTransform: "lowercase",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "#000000",
    fontWeight: "bold",
    fontSize: "16px",
    fontFamily: "Signika",
    background: defaultTheme.palette.primary.mainGradient,
  },
  table: {
    margin: "50px 0",
  },
});

export const errorStyle = {
  textAlign: "center",
  color: "#ff4621",
  paddingTop: "50px",
};

export const errorMessageStyle = {
  width: "35%",
  margin: "auto",
  paddingRight: "10px",
  color: errorStyle.color,
};

export const inputStyle = {
  inputText: {
    fontSize: "16px",
    lineHeight: "1.5",
    padding: "15px 10px",
  },
  whiteRoot: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "16px",
      color: "white",
      marginTop: "-4px",
    },
  },
  redRoot: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: errorStyle.color,
      },
      "&:hover fieldset": {
        borderColor: errorStyle.color,
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "16px",
      color: "white",
      marginTop: "-4px",
    },
  },
  yellowRoot: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: defaultTheme.palette.primary.main,
      },
      "&:hover fieldset": {
        borderColor: defaultTheme.palette.primary.main,
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "16px",
      color: defaultTheme.palette.primary.main,
      marginTop: "-4px",
    },
  },
};

export const textStyle = {
  fontWeight: "bold",
  fontFamily: "Signika",
  lineHeight: 1,
};

export const centeredTextStyle = {
  width: "100%",
  height: "initial",
  textAlign: "center",
  margin: "20px 0 40px",
};

export const gradientTextStyle = {
  background: "linear-gradient(to top right, #ff4000, yellow)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

export const gradientTextStyle2 = {
  background: "linear-gradient(to top right, yellow, #ff4000)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

export const nameStyle = {
  ...textStyle,
  fontSize: "24px",
};

export const columnStyle = {
  width: "25%",
  textAlign: "center",
};

export const unselected = {
  paddingBottom: "10px",
};

export const selected = {
  paddingBottom: "10px",
  borderBottom: "2px solid #ffc800",
};

export const highlightedNumberStyle = {
  ...gradientTextStyle2,
  ...textStyle,
  fontSize: "35px",
};

export const unhighlightedNumberStyle = {
  ...textStyle,
  fontSize: "35px",
};

export const highlightedTextStyle = {
  ...textStyle,
  fontSize: "18px",
  fontFamily: "Open Sans Condensed",
  fontWeight: "bold",
  color: "#ffc800",
};

export const unhighlightedTextStyle = {
  ...textStyle,
  fontSize: "18px",
  fontFamily: "Open Sans Condensed",
  fontWeight: "normal",
};

export const roundedButtonStyle = {
  border: "1px solid white",
  borderRadius: "50px",
  fontSize: "14px",
  padding: "2px",
};

export const backButtonStyle = {
  background: "none",
  boxShadow: "none",
  color: "white",
  position: "fixed",
  left: "0",
  zIndex: "5",
};

export const unfollowButtonStyle = {
  ...roundedButtonStyle,
  float: "right",
  margin: "0 5%",
  color: "#00d412",
};

export const deleteButtonStyle = {
  color: "#ff4621",
  border: "2px solid #ff4621",
};

export const cancelButtonStyle = {
  color: "#cccccc",
  border: "2px solid #cccccc",
};

export const addButtonStyle = {
  ...roundedButtonStyle,
  width: "60%",
  margin: "10px auto 15px",
  color: "#45bbff",
  border: "2px solid #45bbff",
};

export const rightSideActionStyle = {
  float: "right",
  width: isMobileOnly ? "40%" : "30%",
};

export const fullWidth = {
  width: "100%",
};

export const iconStyle = {
  width: "30",
  height: "30",
};

export const checkIconStyle = {
  width: "25",
  height: "25",
  verticalAlign: "top",
  marginLeft: "5px",
  color: "#00d412",
};

export const tableStyle = {
  width: isMobileOnly ? "100%" : "50%",
  margin: "auto",
};

export const rowStyle = {
  width: "100%",
  padding: isMobileOnly ? "0" : "0 25%",
  paddingTop: "5px",
  background: "linear-gradient(to right, transparent, black, transparent)",
  zIndex: "9",
};

export const fabStyle = {
  background: "none",
  boxShadow: "none",
  color: "black",
};

export const iconButtonStyle = {
  ...fabStyle,
  color: "white",
  float: "right",
  height: "20px",
  width: "30px",
};

export const detailStyle = {
  margin: isMobileOnly ? "0" : "10px",
  borderRadius: isMobileOnly ? "0" : "20px",
  border: isMobileOnly ? "none" : "2px solid grey",
  width: isMobileOnly ? "100vw" : "500px",
  left: isMobileOnly ? "0" : "calc(50vw - 260px)",
  height: isMobileOnly ? "100vh" : "calc(100vh - 20px)",
  position: "fixed",
  overflowY: "hidden",
  zIndex: "5",
  top: "0",
};

export const headerStyle = {
  width: "100%",
  textAlign: "center",
  fontSize: "24px",
  fontFamily: "Shadows Into Light",
  color: "white",
};

export const titleStyle = {
  padding: "10px 0 5px 10px",
  fontFamily: "Shadows Into Light",
  width: "100%",
};

export const sectionStyle = {
  fontSize: "12.5px",
  lineHeight: "2",
  margin: "3px 15px",
  paddingBottom: isMobileOnly ? "50%" : "30%",
};

export const containerStyle = {
  border: "1px solid rgb(118, 118, 118)",
  borderRadius: "5px",
  margin: "5px 10px",
  width: "initial",
};

export const radioLabelStyle = (dirType, type) => ({
  height: "25px",
  color: dirType === type ? defaultTheme.palette.primary.main : "white",
});

export const borderStyle = (focusedContainer, container, isErrored) => ({
  ...containerStyle,
  border:
    focusedContainer === container
      ? "2px solid #ffe100"
      : isErrored
      ? "1px solid " + errorStyle.color
      : "1px solid white",
});

export const sectionTitleStyle = (focusedContainer, container) => ({
  float: "left",
  color:
    focusedContainer === container
      ? defaultTheme.palette.primary.main
      : "white",
  fontSize: "16px",
});

export const recipeButtonStyle = (value, currentVal) => ({
  border:
    value === currentVal
      ? "1px solid " + defaultTheme.palette.primary.main
      : "1px solid white",
  color: value === currentVal ? defaultTheme.palette.primary.main : "white",
  padding: "3px 10px",
  marginLeft: "5px",
});
