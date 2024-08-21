import React, { useRef, useEffect } from 'react';
import { RiUserHeartFill } from "react-icons/ri";
import styles from '../../styles/chat/chattingList.module.css';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { MessageSquareDiff, Settings } from 'lucide-react';
import Avatar from '@mui/material/Avatar';
import ChattingCreateRoom from './chattingCreateRoom';

const ChattingList = ({ lists, onChatClick, userInfo, users }) => {

    return (
        <div className={styles.chattingListContainer}>
            <div className={styles.chattingListHeader}>
                <div className={styles.chattingListTitle}>채팅방</div>
                <div className={styles.chattingListCreate}>
                    <button>
                        <MessageSquareDiff />
                    </button>
                </div>
                <div className={styles.chattingListSettings}>
                    <button>
                        <Settings />
                    </button>
                </div>
            </div>

            {lists.map((list, index) => (
                <div className={styles.chattingList} key={list.id} onClick={onChatClick}>

                    <div className={styles.chattingListProfile}>
                        {/* <AccountCircleRoundedIcon sx={{fontSize: 50}}/> */}
                        <Avatar src={userInfo.profile} sx={{ width: 50, height: 50 }} />
                    </div>
                    <div className={styles.chattingListContent}>
                        <div className={styles.chattingRoomTitle}>{list.title}</div>
                        <div className={styles.chattingRoomLastMessage}>{list.name} : {list.lastMessage}</div>
                    </div>
                </div>
            ))}

            

            <ChattingCreateRoom users={users}/>
            
            

        </div>
    );
};

export default ChattingList;