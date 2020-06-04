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
  alignItems:'center',
  padding: '0 10px'
}

export const errorStyle = {
  textAlign:'center',
  color:'#ff2200',
  paddingTop:'50px'
};

export const textStyle = {
  fontWeight:'bold',
  fontFamily:'Signika',
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
  fontFamily:'Raleway',
  padding:'10px 0'
}

export const nameBoxStyle = {
  display:'inline-flex',
  paddingBottom:'20px'
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
  fontSize:'40px'
};

export const unhighlightedNumberStyle = {
  ...textStyle,
  fontSize:'40px'
};

export const highlightedTextStyle = {
  ...textStyle,
  fontSize:'16px',
  fontWeight:'normal',
  color:'#ffc800'
};

export const unhighlightedTextStyle = {
  ...textStyle,
  fontSize:'16px',
  fontWeight:'normal'
};

export const buttonStyle = {
  border: '1px solid white',
  fontSize: '14px',
  padding: '2px',
  width: isMobile ? '90%' : '40%'
};

export const backButtonStyle = {
  background: 'none',
  boxShadow: 'none',
  color: 'white',
  position: 'fixed', top: '40px', left: '10px'
};

export const unfollowButtonStyle = {
  ...buttonStyle,
  float:'right',
  margin: '0 5%',
  width: '60%'
}

export const followingButtonStyle = {
  float:'right',
  fontSize:'16px',
  color:'#00d412'
}

export const iconStyle = {
  width:'25',
  height:'25'
};

export const checkIconStyle = {
  ...iconStyle,
  verticalAlign:'top',
  marginLeft:'5px',
  color:'#00d412'
}

export const tableStyle = {
  width: isMobile ? '100%' : '60%',
  margin: 'auto'
}

export const rowStyle = {
  width: isMobile ? '100%' : '50%',
  margin: 'auto',
  paddingTop: '20px'
}