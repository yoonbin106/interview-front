import React, { useRef, useEffect, useState } from 'react';
import styles from '../../styles/chat/chattingList.module.css';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { MessageSquareDiff, Settings } from 'lucide-react';
import Avatar from '@mui/material/Avatar';
import ChattingCreateRoom from './chattingCreateRoom';
import MenuIcon from './menuIcon';
import axios from 'axios';

const ChattingList = ({ 
    onChatClick, 
    getChatroomId, 
    userStore, 
    users, 
    chatRoomList, 
    currentChatRoomId, 
    getChatroomList,
    client,
 }) => {

    const [isCreatingRoom, setIsCreatingRoom] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [newChatroomTitle, setNewChatroomTitle] = useState('');
    const [currentChatRoomTitle, setCurrentChatRoomTitle] = useState('');

    const inputRef = useRef(null);

    // useEffect(() => {
    //     console.log('useEffect 안의 subscribe 함수: ', chatRoomList);
    //     chatRoomList.forEach((list) => {
    //         const topic = `mqtt/chat/test/${list.id}`;
    //         client.subscribe(topic);
    //     })
    // }, [client, chatRoomList]);

    useEffect(() => {

        if (showEditModal && inputRef.current) {
            inputRef.current.focus();
        }

        if (showEditModal) {
            getChatroomTitle();
        }

    }, [showEditModal]);

    // console.log('chatRoomList print: ', chatRoomList);
    // console.log('users.id: ', userStore.id, currentChatRoomId);
    const createRoomClick = () => {
        setIsCreatingRoom(true);
    };

    const backToChatList = () => {
        setIsCreatingRoom(false);
    };

    const exitChatroom = async () => {
        try {
            // const response = 
            // console.log('[exitChatroom()] :', currentChatRoomId, userStore.id);
            await axios.delete('http://localhost:8080/api/chat/exitChatroom', {
                params: {
                    currentChatRoomId: currentChatRoomId,
                    userId: userStore.id
                }
            });
            //채팅방 다시 불러와서 UI 갱신
            getChatroomList();

            client.unsubscribe(currentChatRoomId);
            console.log(`Unsubscribed from topic: ${currentChatRoomId}`);

        } catch (error) {
            console.error('채팅방 나가기 중 에러 발생:', error);
        }
    };

    const getChatroomTitle = async () => {
        console.log('[ChattingList.jsx] currentChatRoomId: ', currentChatRoomId);
        try {
            const response = await axios.get('http://localhost:8080/api/chat/getChatroomTitle', {
                params: {
                    id: currentChatRoomId
                }
            });
            // console.log('[getChatroomTitle()] - response.data: ', response.data);
            setCurrentChatRoomTitle(response.data);
        } catch (error) {
            console.error('채팅방 제목 가져오기 중 에러 발생:', error);
        }
    }

    const editChatroomTitle = async (newChatroomTitle) => {
        try {
            console.log('newChatroomTitle: ', newChatroomTitle);
            console.log('currentChatRoomId: ', currentChatRoomId);

            await axios.post('http://localhost:8080/api/chat/editChatroomTitle', {
                chatRoomId: currentChatRoomId,
                newTitle: newChatroomTitle
            });

        } catch (error) {
            console.error('채팅방 제목 수정 중 에러 발생: ', error);
        }
        setShowEditModal(false); // 모달 닫기
        getChatroomList(); //채팅방 리스트 갱신
    }

    const closeModal = (event) => {
        if (event.target === event.currentTarget) {
            setShowEditModal(false);
        }
    };

    const options = [
        { label: '채팅방 이름 수정', action: () => setShowEditModal(true) },
        { label: '채팅방 나가기', action: exitChatroom },
    ];

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
                                <div className={styles.chattingListInside} onClick={() => onChatClick(list.id)}>
                                    <div className={styles.chattingListProfile}>
                                        <Avatar sx={{ width: 50, height: 50 }} />
                                    </div>
                                    <div className={styles.chattingListContent}>
                                        <div className={styles.chattingRoomTitle}>{list.chatRoomTitle}</div>
                                        <div className={styles.chattingRoomLastMessage}>
                                            {list.lastMessage ? list.lastMessage : '채팅내역 없음'}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <MenuIcon options={options} />
                                </div>
                            </div>
                        ))
                    )}
                </>
            ) : (
                <div>
                    <button className={styles.chattingBackToListButton} onClick={backToChatList}>
                        <ArrowBackIosNewRoundedIcon />
                    </button>
                    <ChattingCreateRoom onBack={backToChatList} userStore={userStore} getChatroomList={getChatroomList} />
                    {/* users={users} */}
                </div>

            )}

            {showEditModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalTitle}>채팅방 제목 수정</div>
                        <div className={styles.modalInput}>
                            <input
                                type="text"
                                ref={inputRef}
                                onChange={(e) => setNewChatroomTitle(e.target.value)}
                                placeholder={currentChatRoomTitle}
                            />
                        </div>
                        <div className={styles.modalButton}>
                            <button onClick={() => setShowEditModal(false)}>취소</button>
                            <button onClick={() => editChatroomTitle(newChatroomTitle)}>수정</button>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChattingList;