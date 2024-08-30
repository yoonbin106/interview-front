import React, { useRef, useEffect, useState } from 'react';
import styles from '../../styles/chat/chattingList.module.css';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { MessageSquareDiff, Settings } from 'lucide-react';
import Avatar from '@mui/material/Avatar';
import ChattingCreateRoom from './chattingCreateRoom';
import MenuIcon from './menuIcon';
import axios from 'axios';

const ChattingList = ({ onChatClick, getChatroomId, userStore, users, chatRoomList, currentChatRoomId, getChatroomList }) => {

    const [isCreatingRoom, setIsCreatingRoom] = useState(false);

    const options = [
        { label: '채팅방 이름 수정', action: editChatroomTitle },
        { label: '채팅방 나가기', action: exitChatroom },
    ];

    // console.log('chatRoomList print: ', chatRoomList);
    // console.log('users.id: ', userStore.id, currentChatRoomId);
    const createRoomClick = () => {
        setIsCreatingRoom(true);
    };

    const backToChatList = () => {
        setIsCreatingRoom(false);
    };

    const editChatroomTitle  = async () => {}

    const exitChatroom = async () => {
        try {
            //const response = 
            console.log('[exitChatroom()] :', currentChatRoomId, userStore.id);
            const response = await axios.delete('http://localhost:8080/api/chat/exitChatroom', {
                params: {
                    currentChatRoomId: currentChatRoomId, 
                    userId: userStore.id
                }
            });
            console.log(response.data);

        } catch (error) {
            console.error('Error delete Chatroom:', error);
        }
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
                    {chatRoomList.length === 0 ? (
                        <div className={styles.noChatroom}>
                            참가 중인 채팅방이 존재하지 않습니다.
                        </div>
                    ) : (
                        chatRoomList.map((list) => (
                            <div
                                className={styles.chattingList}
                                key={list.id}
                                onClick={() => getChatroomId(list.id)}
                            >
                                <div className={styles.chattingListInside} onClick={() => onChatClick()}>
                                    <div className={styles.chattingListProfile}>
                                        <Avatar sx={{ width: 50, height: 50 }} />
                                    </div>
                                    <div className={styles.chattingListContent}>
                                        <div className={styles.chattingRoomTitle}>{list.chatRoomTitle}</div>
                                        <div className={styles.chattingRoomLastMessage}>테스트 : 테스트 마지막 메세지</div>
                                        {/* 마지막 메세지는 json으로 저장해야하나 했는데 그냥 메세지 하나하나 보낼때마다... 
                                    마지막 메세지의 id 값을 chatroomList의 last_message에 저장하고 출력해올때마다 스프링에서 또 받아오게
                                    그러면 뭔가 더 복잡해지나? chatroom 정보 가져올때 lastMessage의 id 값으로 chat_message 테이블을 또 조회해야하니까..
                                    id로 하지말고 값을 그냥 저장해야하나
                                     ? ?  ? ?  */}
                                    </div>
                                </div>

                                <div>
                                    <MenuIcon options={options} exitChatroom={exitChatroom}/>
                                </div>
                            </div>
                        ))
                    )}
                    {/* 
                    {chatRoomList.map((list) => (
                        <div className={styles.chattingList} key={list.id} onClick={() => onChatClick(list.id)}>
                            <div className={styles.chattingListProfile}>
                                <Avatar sx={{ width: 50, height: 50 }} /> 
                                
                            </div>
                            <div className={styles.chattingListContent}>
                                <div className={styles.chattingRoomTitle}>{list.chatRoomTitle}</div>
                                <div className={styles.chattingRoomLastMessage}>테스트 : 테스트 마지막 메세지</div>
                                
                            </div>
                        </div>
                    ))}
                     */}
                    {/* src={userInfo.profile} */}
                    {/* {list.name} : {list.lastMessage} */}
                </>
            ) : (
                <div>
                    <button className={styles.chattingBackToListButton} onClick={backToChatList}>
                        <ArrowBackIosNewRoundedIcon />
                    </button>
                    <ChattingCreateRoom onBack={backToChatList} userStore={userStore} getChatroomList={getChatroomList}/>
                    {/* users={users} */}
                </div>

            )}
        </div>


    );
};

export default ChattingList;