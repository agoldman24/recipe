import React from 'react';
import Fab from '@material-ui/core/Fab';
import { defaultTheme } from '../../styles';
import { isMobileOnly } from 'react-device-detect';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export default function ScrollButton({ isVisible, isLoggedIn }) {
  const buttonStyle = {
    color: 'black',
    background: defaultTheme.palette.primary.mainGradient
  }
  return (
    <div style={{
      position: 'fixed',
      zIndex: '2',
      display: isVisible ? 'initial' : 'none',
      right: isMobileOnly ? '2%' : '20px',
      top: isLoggedIn ? '60px' : isMobileOnly ? '10px' : '60px',
    }}>
      <Fab
        style={buttonStyle}
        size="small"
        onClick={() => {
          const id = isMobileOnly ? 'root' : 'container';
          document.getElementById(id).scroll({ top: 0, left: 0, behavior: 'smooth' });
        }}
      >
        <KeyboardArrowUpIcon style={{ height:'25', width:'25' }}/>
      </Fab>
    </div>
  );
}