import { isMobileOnly } from 'react-device-detect';

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

export const inputTheme = {
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
      main: '#fc8c03'
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
  },
  table: {
    margin: '50px 0'
  }
});

export const gridStyle = {
  alignItems: 'center',
  padding: '0 10px'
}

export const errorStyle = {
  textAlign: 'center',
  color: '#ff4621',
  paddingTop: '50px'
};

export const errorMessageStyle = {
  width: '35%',
  margin: 'auto',
  paddingRight: '10px',
  color: errorStyle.color
}

export const textStyle = {
  fontWeight: 'bold',
  fontFamily: 'Signika',
  lineHeight: 1,
}

export const centeredTextStyle = {
  width: '100%', textAlign: 'center', marginTop: '20px',
  marginBottom: isMobileOnly ? '100px' : '40px'
}

export const gradientTextStyle = {
  background: 'linear-gradient(to top right, #ff4000, yellow)',
	WebkitBackgroundClip: 'text',
	WebkitTextFillColor: 'transparent'
}

export const gradientTextStyle2 = {
  background: 'linear-gradient(to top right, yellow, #ff4000)',
  WebkitBackgroundClip: 'text',
	WebkitTextFillColor: 'transparent'
}

export const usernameStyle = {
  ...textStyle,
  fontFamily: 'Raleway',
  padding: '10px 0 20px 0'
}

export const nameStyle = {
  ...textStyle,
  fontSize: '24px',
  margin: 'auto',
  marginLeft: '20px'
}

export const columnStyle = {
  width: '25%',
  textAlign: 'center'
}

export const unselected = {
  paddingBottom: '10px'
}

export const selected = {
  paddingBottom: '10px',
  borderBottom: '2px solid #ffc800'
}

export const highlightedNumberStyle = {
  ...gradientTextStyle2,
  ...textStyle,
  fontSize: '40px'
};

export const unhighlightedNumberStyle = {
  ...textStyle,
  fontSize: '40px'
};

export const highlightedTextStyle = {
  ...textStyle,
  fontSize: '16px',
  fontWeight: 'normal',
  color: '#ffc800'
};

export const unhighlightedTextStyle = {
  ...textStyle,
  fontSize: '16px',
  fontWeight: 'normal'
};

export const buttonStyle = {
  border: '1px solid white',
  fontSize: '14px',
  padding: '2px',
  width: isMobileOnly ? '90%' : '40%'
};

export const backButtonStyle = {
  background: 'none',
  boxShadow: 'none',
  color: 'white',
  position: 'fixed',
  left: '0',
  zIndex: '5'
};

export const unfollowButtonStyle = {
  ...buttonStyle,
  float: 'right',
  margin: '0 5%',
  width: '60%'
}

export const followingButtonStyle = {
  float: 'right',
  fontSize: '16px',
  color: '#00d412'
}

export const deleteButtonStyle = {
  color: '#ff4621',
  border: '2px solid #ff4621'
}

export const cancelButtonStyle = {
  color: '#cccccc',
  border: '2px solid #cccccc'
}

export const addButtonStyle = {
  ...buttonStyle,
  width: '60%',
  margin: '10px auto 15px',
  color: '#45bbff',
  border: '2px solid #45bbff',
  borderRadius: '50px'
}

export const rightSideActionStyle = {
  float: 'right',
  width: isMobileOnly ? '40%' : '30%'
}

export const fullWidth = {
  width: '100%'
}

export const iconStyle = {
  width: '30',
  height: '30'
};

export const checkIconStyle = {
  width: '25',
  height: '25',
  verticalAlign: 'top',
  marginLeft: '5px',
  color: '#00d412'
}

export const tableStyle = {
  width: isMobileOnly ? '100%' : '60%',
  margin: 'auto'
}

export const rowStyle = {
  width: isMobileOnly ? '100%' : '50%',
  margin: 'auto',
  padding: '20px 0 15px'
}

export const fabStyle = {
  background: 'none',
  boxShadow: 'none',
  color: 'black',
};

export const iconButtonStyle = {
  ...fabStyle,
  color: 'white',
  float: 'right',
  height: '20px',
  width: '30px'
}

export const detailStyle = {
  borderRadius: '0',
  border: isMobileOnly ? 'none' : '1px solid grey',
  width: isMobileOnly ? '100vw' : '500px',
  left: isMobileOnly ? '0' : 'calc(50vw - 250px)',
  height: '100vh',
  position: 'fixed',
  overflowY: 'hidden',
  zIndex: '5',
  top: '0'
};

export const headerStyle = {
  width: '100%',
  textAlign: 'center',
  fontSize: '24px',
  fontFamily: 'Shadows Into Light',
  color: 'white'
}

export const titleStyle = {
  padding: '10px 0 5px 10px',
  fontFamily: 'Shadows Into Light',
  width: '50%'
}

export const sectionStyle = {
  margin: '3px 15px',
  fontSize: '12px',
  paddingBottom: '50%',
  lineHeight: '2'
}

export const containerStyle = {
  border: '1px solid rgb(118, 118, 118)',
  borderRadius: '5px',
  margin: '5px 10px',
  width: 'initial'
}

export const radioLabelStyle = (dirType, type) => ({
  height: '25px',
  color: dirType === type
    ? defaultTheme.palette.primary.main
    : 'white'
});

export const borderStyle = (focusedContainer, container, isErrored) => ({
  ...containerStyle,
  border: focusedContainer === container
    ? '2px solid #ffe100'
    : isErrored
      ? '1px solid ' + errorStyle.color
      : '1px solid white'
});

export const sectionTitleStyle = (focusedContainer, container) => ({
  float: 'left',
  color: focusedContainer === container
    ? defaultTheme.palette.primary.main
    : 'white',
  fontSize: '16px'
});

export const recipeButtonStyle = (value, currentVal) => ({
  borderTop: value === currentVal
    ? '3px solid ' + defaultTheme.palette.primary.main
    : 'none',
  color: value === currentVal ? defaultTheme.palette.primary.main : 'white'
})