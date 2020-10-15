import React from 'react';
import Fab from '@material-ui/core/Fab';
import { defaultTheme } from '../../styles';
import { isMobile } from 'react-device-detect';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export default function ScrollButton({ isVisible, isLoggedIn }) {
  const buttonStyle = {
    color: 'black',
    background: defaultTheme.palette.primary.mainGradient
  }
  return (
    <div style={{
      position: 'fixed',
      display: isVisible ? 'initial' : 'none',
      right: isMobile || isLoggedIn ? '1.5%' : '27px',
      top: isLoggedIn ? '60px' : '80px',
      zIndex: isLoggedIn ? '2' : '3'
    }}>
      <Fab
        style={buttonStyle}
        size="small"
        onClick={() => {
          const id = isMobile ? 'root' : 'container';
          document.getElementById(id).scroll({ top: 0, left: 0, behavior: 'smooth' });
        }}
      >
        <KeyboardArrowUpIcon style={{ height:'25', width:'25' }}/>
      </Fab>
    </div>
  );
}