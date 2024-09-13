import React, { useRef, useEffect, useState } from 'react';
import styles from '../../styles/chat/chattingList.module.css';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { MessageSquareDiff, Settings } from 'lucide-react';
import Avatar from '@mui/material/Avatar';
import ChattingCreateRoom from './chattingCreateRoom';
import MenuIcon from './menuIcon';
import axios from 'axios';
import Badge from '@mui/material/Badge';

const ChattingList = ({
    onChatClick,
    getChatroomId,
    userStore,
    chatRoomList,
    currentChatRoomId,
    getChatroomList,
    getChatroomTitle,
    chatRoomTitle,
    exitChatroom,
    getUsersInChatroom,
    usersInChatroom,
    chatAlarm,
}) => {

    const [isCreatingRoom, setIsCreatingRoom] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [newChatroomTitle, setNewChatroomTitle] = useState('');

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
            // getChatroomTitle();
        }

    }, [showEditModal]);

    useEffect(() => {
        // 이 코드가 없으면 채팅방 실시간 업데이트가 안됨 근데 있으면 무한루프 돌아
        // getChatroomList();
        chatRoomList.forEach((room) => {
            getUsersInChatroom(room.id);  // 각 채팅방에 대해 유저 목록을 가져옴
        });
    }, [chatRoomList]);

    // console.log('chatRoomList print: ', chatRoomList);
    // console.log('users.id: ', userStore.id, currentChatRoomId);
    const createRoomClick = () => {
        setIsCreatingRoom(true);
    };

    const backToChatList = () => {
        setIsCreatingRoom(false);
    };

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
                        (chatRoomList.sort((a, b) => new Date(b.updatedTime) - new Date(a.updatedTime))).map((list) => (
                            <div
                                className={styles.chattingList}
                                key={list.id}
                                onClick={() => getChatroomId(list.id)}
                            >
                                <div className={styles.chattingListInside} onClick={() => onChatClick(list.id)}>
                                    <div className={styles.chattingListProfile}>

                                        {usersInChatroom[list.id] && usersInChatroom[list.id].length == 1 ? (
                                            // 유저가 1명일 때
                                            <Avatar
                                                src={usersInChatroom[list.id][0].profileImage}
                                                sx={{ width: 50, height: 50 }}
                                            />
                                        ) : usersInChatroom[list.id] && usersInChatroom[list.id].length == 2 ? (
                                            <>
                                                <Avatar
                                                    src={usersInChatroom[list.id][0].profileImage}
                                                    sx={{ width: 30, height: 30, top: '5px', left: '0px' }}
                                                />
                                                <Avatar
                                                    src={usersInChatroom[list.id][1].profileImage}
                                                    sx={{ width: 30, height: 30, top: '-10px', left: '20px' }}
                                                />
                                            </>
                                        ) : usersInChatroom[list.id] && usersInChatroom[list.id].length == 3 ? (
                                            <>
                                                <Avatar
                                                    src={usersInChatroom[list.id][0].profileImage}
                                                    className="avatar"
                                                    style={{ width: 30, height: 30, top: '0px', left: '10px' }}
                                                />
                                                <Avatar
                                                    src={usersInChatroom[list.id][1].profileImage}
                                                    className="avatar"
                                                    style={{ width: 30, height: 30, top: '-10px', left: '0px' }}
                                                />
                                                <Avatar
                                                    src={usersInChatroom[list.id][2].profileImage}
                                                    className="avatar"
                                                    style={{ width: 30, height: 30, top: '-40px', left: '20px' }}
                                                />
                                            </>
                                        ) : usersInChatroom[list.id] && usersInChatroom[list.id].length >= 4 ? (
                                            <>
                                            <Avatar
                                                src={usersInChatroom[list.id][0].profileImage}
                                                className="avatar"
                                                style={{ width: 25, height: 25, top: '-0px', left: '0px' }}
                                            />
                                            <Avatar
                                                src={usersInChatroom[list.id][1].profileImage}
                                                className="avatar"
                                                style={{ width: 25, height: 25, top: '-25px', left: '25px' }}
                                            />
                                            <Avatar
                                                src={usersInChatroom[list.id][2].profileImage}
                                                className="avatar"
                                                style={{ width: 25, height: 25, top: '-25px', left: '0px' }}
                                            />
                                            <Avatar
                                                src={usersInChatroom[list.id][3].profileImage}
                                                className="avatar"
                                                style={{ width: 25, height: 25, top: '-50px', left: '25px' }}
                                            />
                                        </>
                                        ) : usersInChatroom[list.id] && usersInChatroom[list.id].length == 0 && (
                                            <Avatar sx={{ width: 50, height: 50 }}/>
                                        )}





                                        {/* <Avatar src={usersInChatroom[list.id]?.[0]?.profileImage} sx={{ width: 50, height: 50 }} /> */}


                                    </div>
                                    <div className={styles.chattingListContent}>
                                        <div className={styles.chattingRoomTitle}>{list.chatRoomTitle}</div>
                                        <div className={styles.chattingRoomLastMessage}>
                                            {list.lastMessage ? list.lastMessage : '채팅내역 없음'}
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className={styles.chattingListAlarmBadge}>
                                    <Badge badgeContent={chatAlarm.filter(alarm => alarm.chatroomId === list.id).length} color="error" sx={{marginRight: 3}}/>
                                    {/* <Badge badgeContent={getBadgeCount(list.id)} color="error" sx={{marginRight: 3}}/> */}
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
                                placeholder={chatRoomTitle}
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