import React, { useRef, useEffect, useState } from 'react';
import { RiUserHeartFill } from "react-icons/ri";
import styles from '../../styles/chat/chattingList.module.css';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { MessageSquareDiff, Settings } from 'lucide-react';
import Avatar from '@mui/material/Avatar';
import ChattingCreateRoom from './chattingCreateRoom';

const ChattingList = ({ lists, onChatClick, userInfo, users }) => {

    const [isCreatingRoom, setIsCreatingRoom] = useState(false);

    const createRoomClick = () => {
        setIsCreatingRoom(true);
    };

    const backToChatList = () => {
        setIsCreatingRoom(false);
    };

    return (
        <div className={styles.chattingListContainer}>
            {!isCreatingRoom ? (
                <>
                    <div className={styles.chattingListHeader}>
                        <div className={styles.chattingListTitle}>채팅방</div>
                        <div className={styles.chattingListCreate}>
                            <button onClick={createRoomClick}>
                                <MessageSquareDiff />
                            </button>
                        </div>
                        <div className={styles.chattingListSettings}>
                            <button>
                                <Settings />
                            </button>
                        </div>
                    </div>

                    {lists.map((list) => (
                        <div className={styles.chattingList} key={list.id} onClick={() => onChatClick(list.id)}>
                            <div className={styles.chattingListProfile}>
                                <Avatar src={userInfo.profile} sx={{ width: 50, height: 50 }} />
                            </div>
                            <div className={styles.chattingListContent}>
                                <div className={styles.chattingRoomTitle}>{list.title}</div>
                                <div className={styles.chattingRoomLastMessage}>{list.name} : {list.lastMessage}</div>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div>
                    <button className={styles.chattingBackToListButton} onClick={backToChatList}>
                        <ArrowBackIosNewRoundedIcon />
                    </button>
                    <ChattingCreateRoom onBack={backToChatList} />
                    {/* users={users} */}
                </div>

            )}
        </div>


    );
};

export default ChattingList;