import React, { useEffect, useState } from 'react';
import styles from '../../styles/chat/chattingCreateRoom.module.css';
import Avatar from '@mui/material/Avatar';
import SearchBar from './searchBar';
import { getAllUsers } from 'api/user';
import axios from 'axios';

const ChattingCreateRoom = ({ onBack, userStore, getChatroomList }) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const getAllUserList = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data);
            setFilteredUsers(response.data);
        }
        catch (error) {
            console.log('Error: ', error);
        }

    }

    useEffect(() => {
        getAllUserList()
    }, []);

    // const getSearchUserList = async (searchKeyword) => {
    //     try {
    //         const response = await axios.get('http://localhost:8080/api/chat/searchUsers', {
    //             params: {
    //                 query: searchKeyword
    //             }
    //         });
    //         setFilteredUsers(response.data); // 검색 결과를 상태에 저장
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // }

    const handleSearch = (searchKeyword) => {
        // getSearchUserList(searchKeyword);
        if (searchKeyword.trim() === '') {
            // 검색어가 비어 있으면 모든 유저를 다시 표시
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(
                (user) =>
                    user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchKeyword.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    const userListSelect = (id) => {
        if (selectedUserIds.includes(id)) {
            setSelectedUserIds(selectedUserIds.filter(userId => userId !== id));
        } else if (selectedUserIds.length < 10) {
            setSelectedUserIds([...selectedUserIds, id]);
        }
    };

    const createChattingRoom = async () => {
        if (selectedUserIds.length === 0) {
            setErrorMessage('최소 한 명 이상의 대화 상대를 선택해야 합니다.');
            return;
        }


        //여기에 채팅방 생성 ~~ 로직을 넣어야함 id값을 전달 (selectedUserIds)
        try {
            const newSelectedUserIds = [...selectedUserIds, userStore.id]; //선택된 유저 + 선택한 나 < 도 추가
            const response = await axios.post('http://localhost:8080/api/chat/createChatroom', newSelectedUserIds);
        } catch (error) {
            console.error('Error creating chatroom:', error);
        }

        getChatroomList();
        onBack();
    };

    return (
        <div className={styles.chattingCreateRoomContainer}>
            <div>
                <h1>대화상대 초대</h1>
            </div>

            <div className={styles.chattingCreateRoomSearchBar}>
                <SearchBar onSearch={handleSearch} />
            </div>

            <div className={styles.chattingCreateRoomUsersList}>

                {filteredUsers
                    .filter(user => user.id != userStore.id)
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
                                <div className={styles.chattingCreateRoomCheckBox}>
                                    <input
                                        type="checkbox"
                                        checked={selectedUserIds.includes(user.id)}
                                        onChange={() => userListSelect(user.id)}
                                        disabled={
                                            !selectedUserIds.includes(user.id) && selectedUserIds.length >= 10
                                        }
                                    />
                                </div>
                            </div>

                        </div>

                    ))}
            </div>


            <div className={styles.chattingCreateRoomFooter}>
                {errorMessage && (
                    <div className={styles.errorMessage}>
                        {errorMessage}
                    </div>
                )}
                <button onClick={createChattingRoom} className={styles.chattingCreateRoomSubmitButton}>
                    채팅방 생성
                </button>
            </div>


        </div>
    );
};

export default ChattingCreateRoom;
