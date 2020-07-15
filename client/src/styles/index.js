import { isMobile } from 'react-device-detect';

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

export const textStyle = {
  fontWeight: 'bold',
  fontFamily: 'Signika',
  lineHeight: 1,
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
  padding: '10px 0'
}

export const nameBoxStyle = {
  display: 'inline-flex',
  paddingBottom: '20px'
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
  borderBottom:'2px solid #ffc800'
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
  width: !isMobile ? '90%' : '40%'
};

export const backButtonStyle = {
  background: 'none',
  boxShadow: 'none',
  color: 'white',
  position: 'fixed', top: '5px', left: '10px'
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

export const saveButtonStyle = {
  color: '#df52ff',
  border: '2px solid #df52ff'
}

export const cancelButtonStyle = {
  color: '#cccccc',
  border: '2px solid #cccccc'
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
  width: !isMobile ? '100%' : '60%',
  margin: 'auto'
}

export const rowStyle = {
  width: !isMobile ? '100%' : '50%',
  margin: 'auto',
  paddingTop: '20px'
}

export const fabStyle = {
  background: 'none',
  boxShadow: 'none',
  color: 'black',
};

export const blackIconStyle = {
  width: '30',
  height: '30',
  background: 'black',
  color: 'white',
  borderRadius: '50px'
};

export const darkBackgroundStyle = {
  position: 'fixed',
  top: '0',
  left: '0',
  height: '100vh',
  width: '100vw',
  zIndex: '4',
  background: 'rgba(0,0,0,0.7)'
}

export const whiteFadeBackgroundStyle = {
  position: 'absolute', top: '0', left: '0',
  width: '100%', height: '30%', verticalAlign: 'text-top',
  backgroundImage: 'linear-gradient(white, rgba(0,0,0,0))',
  color: 'black', fontWeight: 'bold'
}

export const detailStyle = {
  borderRadius: '0',
  width: !isMobile ? '100vw' : '500px',
  left: !isMobile ? '0' : 'calc(50vw - 250px)',
  height: '100vh',
  position: 'fixed',
  overflowY: 'auto',
  zIndex: '5',
  top: '0'
};

export const undetailedStyle = {
  borderRadius: '0',
  background: '#202020',
  boxShadow: 'none',
  width: !isMobile ? '100vw' : '30vw'
};

export const headerStyle = {
  background: 'white',
  color: 'black',
  padding: '16px 50px 0 16px'
}

export const titleStyle = {
  padding: '20px',
  fontFamily: 'Shadows Into Light',
  width: '50%'
}

export const sectionStyle = {
  marginLeft: '5%',
  width: '90%',
  fontSize: '16px',
  paddingBottom: '50%',
  lineHeight: '2'
}

export const radioLabelStyle = (state, dirType) => ({
  height: '25px',
  color: state.directions.type === dirType
    ? defaultTheme.palette.primary.main
    : 'white'
});