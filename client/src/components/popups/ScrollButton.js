import React from 'react';
import Button from '@material-ui/core/Button';
import { defaultTheme } from '../../styles';
import { isMobile } from 'react-device-detect';

export default function ScrollButton({ scrollButtonTop, zIndex }) {
  const buttonStyle = {
    color: 'black',
    fontWeight: 'bold',
    borderRadius: '20px',
    background: defaultTheme.palette.primary.mainGradient
  }
  return (
    <div style={{
      position: 'fixed',
      width: '100vw',
      top: scrollButtonTop,
      textAlign: 'center',
      zIndex
    }}>
      <Button
        style={buttonStyle}
        onClick={() => {
          const id = !isMobile ? 'root' : 'container';
          document.getElementById(id).scroll({ top: 0, left: 0, behavior: 'smooth' });
        }}
      >
        Scroll to top
      </Button>
    </div>
  );
}