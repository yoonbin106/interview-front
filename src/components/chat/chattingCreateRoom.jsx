import React, { useRef, useEffect, useState } from 'react';
import styles from '../../styles/chat/chattingCreateRoom.module.css';
import Avatar from '@mui/material/Avatar';

const ChattingCreateRoom = ({ users }) => {

    const [selectedUserEmails, setSelectedUserEmails] = useState([]);

    const userListSelect = (id) => {
        if (selectedUserEmails.includes(id)) {
            setSelectedUserEmails(selectedUserEmails.filter(userId => userId !== id));
        } else if (selectedUserEmails.length < 10) {
            setSelectedUserEmails([...selectedUserEmails, id]);
        }
    };

    const getSelectedUsers = () => {
        console.log('Selected User Emails:', selectedUserEmails);
        // console.log('typeof(selectedUserEmails):', typeof(selectedUserEmails));
        // console.log('selectedUserEmails:', selectedUserEmails[1]);
        // Here you can add the logic to store or send the selected IDs to a server
    };

    return (
        <div className={styles.chattingCreateRoomContainer}>
            <div>
                <h1>대화상대 초대</h1>
            </div>

            <div className={styles.chattingCreateRoomUsersList}>
                {users.map(user => (
                    <div key={user.id} className={styles.chattingCreateRoomUserItem}>
                        <div className={styles.chattingCreateRoomUserProfile}>
                            <Avatar src={user.profile} sx={{ width: 50, height: 50 }} />
                        </div>
                        <div className={styles.chattingCreateRoomUserContent}>
                            <div className={styles.chattingCreateRoomUserInfo}>
                                {user.username} ({user.email})
                            </div>
                            <div className={styles.chattingCreateRoomCheckBox}>
                                <input
                                    type="checkbox"
                                    checked={selectedUserEmails.includes(user.email)}
                                    onChange={() => userListSelect(user.email)}
                                    disabled={
                                        !selectedUserEmails.includes(user.email) && selectedUserEmails.length >= 10
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={getSelectedUsers} className={styles.chattingCreateRoomSubmitButton}>
                대화상대 선택 완료
            </button>

        </div>
    );
};

export default ChattingCreateRoom;