import React, { useRef, useEffect, useState } from 'react';
import styles from '../../styles/chat/chattingList.module.css';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { MessageSquareDiff, Settings } from 'lucide-react';
import Avatar from '@mui/material/Avatar';
import ChattingCreateRoom from './chattingCreateRoom';

const ChattingList = ({ onChatClick, userStore, users, chatRoomList, getChatroomList }) => {

    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    
    console.log('chatRoomList print: ', chatRoomList);
    const createRoomClick = () => {
        setIsCreatingRoom(true);
    };

    const backToChatList = () => {
        getChatroomList();
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

                    {chatRoomList.map((list) => (
                        <div className={styles.chattingList} key={list.id} onClick={() => onChatClick(list.id)}>
                            <div className={styles.chattingListProfile}>
                                <Avatar sx={{ width: 50, height: 50 }} /> 
                                {/* src={userInfo.profile} */}
                            </div>
                            <div className={styles.chattingListContent}>
                                <div className={styles.chattingRoomTitle}>{list.chatRoomTitle}</div>
                                <div className={styles.chattingRoomLastMessage}>테스트 : 테스트 마지막 메세지</div>
                                {/* {list.name} : {list.lastMessage} */}
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div>
                    <button className={styles.chattingBackToListButton} onClick={backToChatList}>
                        <ArrowBackIosNewRoundedIcon />
                    </button>
                    <ChattingCreateRoom onBack={backToChatList} userStore={userStore}/>
                    {/* users={users} */}
                </div>

            )}
        </div>


    );
};

export default ChattingList;