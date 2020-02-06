import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import CreateIcon from '@material-ui/icons/Create';
import { defaultTheme } from '../variables/Constants';

export default function RecipeButtons() {
  const radioStyle = {
    position: 'fixed',
    width: '100vw',
    bottom: '3vh',
    zIndex: '2'
  };
  const buttonStyle = {
    borderRadius: '30%',
    margin: '0 10px'
  };

  const [value, setValue] = React.useState('Random');

  const handleChange = event => {
    setValue(event.target.value);
  };

  return (
    <FormControl component="fieldset" style={radioStyle}>
      <RadioGroup
        value={value}
        onChange={handleChange}
        style={{justifyContent:'center'}}
        row
      >
        <IconButton
          variant="outlined"
          size="large"
          style={buttonStyle}
        >
          <HomeIcon/>
        </IconButton>
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
          value="By Others"
          control={<Radio color="primary" />}
          label="By Others"
          labelPlacement="bottom"
          style={{
            color: value === "By Others"
              ? defaultTheme.palette.primary.main
              : 'white'
          }}
        />
        <FormControlLabel
          value="Random"
          control={<Radio color="primary" />}
          label="Random"
          labelPlacement="bottom"
          style={{
            color: value === "Random"
              ? defaultTheme.palette.primary.main
              : 'white'
          }}
        />
        <IconButton
          variant="outlined"
          size="large"
          style={buttonStyle}
        >
          <CreateIcon size="large"/>
        </IconButton>
      </RadioGroup>
    </FormControl>
  );
}