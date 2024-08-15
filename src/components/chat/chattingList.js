import React, { useRef, useEffect } from 'react';
import { RiUserHeartFill } from "react-icons/ri";
import styles from '../../styles/chat/chattingList.module.css';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import Avatar from '@mui/material/Avatar';

const ChattingList = ({ lists, onChatClick, userInfo }) => {
    const listsEndRef = useRef(null);

    useEffect(() => {
        listsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [lists]);

    return (
        <div className={styles.chattingListContainer}>
            {lists.map((list, index) => (
                <div className={styles.chattingList} key={list.id} onClick={onChatClick}>
                    
                    <div className={styles.chattingListProfile}>
                        {/* <AccountCircleRoundedIcon sx={{fontSize: 50}}/> */}
                        <Avatar src={userInfo.profile} sx={{width: 50, height: 50}} />
                    </div>
                    <div className={styles.chattingListContent}>
                        <div className={styles.chattingListTitle}>{list.title}</div>
                        <div className={styles.chattingListLastMessage}>{list.name} : {list.lastMessage}</div>
                    </div>
                </div>
            ))}

            <div ref={listsEndRef} />
        </div>
    );
};

export default ChattingList;