import React from 'react';
import { Button, Menu, MenuItem } from '@mui/material';

const InteractiveOptions = ({ options, onSelect }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option) => {
    onSelect(option);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleClick}>
        Select an option
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem key={index} onClick={() => handleSelect(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default InteractiveOptions;