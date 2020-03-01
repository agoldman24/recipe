export const RECIPE_TAB = "RECIPE_TAB";
export const SIGN_IN_TAB = "SIGN_IN_TAB";
export const SIGN_UP_TAB = "SIGN_UP_TAB";
export const SEARCH_TAB = "SEARCH_TAB";
export const WELCOME_TAB = "WELCOME_TAB";

export const defaultTheme = {
  palette: {
    type: 'dark',
    background: {
      default: '#202020'
    },
    primary: {
      main: '#ffe100',
      mainGradient: 'linear-gradient(to top right, #ff4000, yellow)'
    },
    secondary: {
      main: '#ff441f'
    }
  }
}

export const formTheme = theme => ({
  paper: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    background: defaultTheme.palette.primary.mainGradient,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
    zIndex: '3'
  },
  inputText: {
    fontSize: '16px'
  },
  inputTextLowercase: {
    fontSize: '16px',
    textTransform: 'lowercase'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: '#000000',
    fontWeight: 'bold',
    fontSize: '16px',
    fontFamily: 'Signika',
    background: defaultTheme.palette.primary.mainGradient
  }
});