import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ITEM_HEIGHT = 48;

export default function MenuIcon({ options, exitChatroom }) {
    // console.log('options: ', options);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const test = () => {
        console.log('아니 왜 안되냐고 제발');
        handleClose();
        exitChatroom();
    };

    

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                
                slotProps={{
                    paper: {
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                            marginLeft: -80,
                            marginTop: 0,
                            boxShadow: '1.5px 1.5px 3px 1px rgba(0, 0, 0, 0.3)',
                        },
                    },
                }}
                disableScrollLock={true} // 비활성화 안하면 ui 어긋남
            >
                {/* {options.map(({ label, action }) => (
                    <MenuItem key={label} onClick={() => handleMenuItemClick(action)}>
                        {label}
                    </MenuItem>
                ))} */}
                
                <MenuItem>
                    {options[0].label}
                </MenuItem>
                <MenuItem onClick={() => test()}>
                    {options[1].label}
                </MenuItem>
            </Menu>
        </div>
    );
}