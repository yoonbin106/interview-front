import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { UserRoundPlus, Menu } from 'lucide-react';
import styles from '../../styles/chat/popOver.module.css';
import Avatar from '@mui/material/Avatar';


export default function PopOver({ usersInChatroom, userStore, currentChatRoomId }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <Menu aria-describedby={id} variant="contained" onClick={handleClick} />
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                slotProps={{
                    paper: {
                        style: {
                            marginLeft: -0,
                            marginTop: 10,
                            boxShadow: '1.5px 1.5px 3px 1px rgba(0, 0, 0, 0.3)',
                        },
                    },
                }}
                disableScrollLock={true}
            >
                <div className={styles.chatroomUsersListTitle}>
                    <h1>참여 중인 유저 목록</h1>
                </div>
                <div className={styles.chattingCreateRoomUsersList}>
                    {usersInChatroom[currentChatRoomId]
                        ?.filter(user => user.id != userStore.id)
                        .map(user => (
                            <div key={user.id} className={styles.chattingCreateRoomUserItem}>
                                <div className={styles.chattingCreateRoomUserProfile}>
                                    <Avatar src={user.profileImage} sx={{ width: 50, height: 50 }} />
                                    {/* src={userProfiles[user.email]} */}
                                </div>
                                <div className={styles.chattingCreateRoomUserContent}>
                                    <div className={styles.chattingCreateRoomUserInfo}>
                                        {user.username} ({user.email})
                                    </div>
                                    
                                </div>

                            </div>

                        ))}
                </div>
            </Popover>
        </div>
    );
}