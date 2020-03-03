import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Fab from '@material-ui/core/Fab';
import CreateIcon from '@material-ui/icons/Create';
import { defaultTheme } from '../variables/Constants';

export default function RecipeButtons() {
  const radioStyle = {
    position: 'fixed',
    width: '100vw',
    left: '0',
    bottom: '15px',
    zIndex: '2'
  };
  const fabStyle = {
    background: 'none',
    boxShadow: 'none',
    color: 'white',
    marginLeft:'5px'
  };

  const [value, setValue] = React.useState('Samples');

  const handleChange = event => {
    setValue(event.target.value);
  };

  return (
    <div>
      <div style={{
        position:'fixed',
        width:'100vw',
        height:'80px',
        bottom:'0',
        left:'0',
        backgroundImage:'linear-gradient(#202020, black)',
        zIndex:'1'
      }}/>
      <FormControl component="fieldset" style={radioStyle}>
        <RadioGroup
          value={value}
          onChange={handleChange}
          style={{justifyContent:'center'}}
          row
        >
          <FormControlLabel
            value="By Me"
            control={<Radio color="primary" />}
            label="By Me"
            labelPlacement="bottom"
            style={{
              color: value === "By Me"
                ? defaultTheme.palette.primary.main
                : 'white'
            }}
          />
          <FormControlLabel
            value="By Friends"
            control={<Radio color="primary" />}
            label="By Friends"
            labelPlacement="bottom"
            style={{
              color: value === "By Friends"
                ? defaultTheme.palette.primary.main
                : 'white'
            }}
          />
          <FormControlLabel
            value="Samples"
            control={<Radio color="primary" />}
            label="Samples"
            labelPlacement="bottom"
            style={{
              color: value === "Samples"
                ? defaultTheme.palette.primary.main
                : 'white'
            }}
          />
          <Fab style={fabStyle}>
            <CreateIcon style={{height:'40', width:'40'}}/>
          </Fab>
        </RadioGroup>
      </FormControl>
    </div>
  );
}