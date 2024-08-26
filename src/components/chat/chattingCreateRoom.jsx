import React, { useEffect, useState } from 'react';
import styles from '../../styles/chat/chattingCreateRoom.module.css';
import Avatar from '@mui/material/Avatar';
import SearchBar from './searchBar';
import { getAllUsers, getProfileImage } from 'api/user';

const ChattingCreateRoom = ({ onBack }) => {
    const [users, setUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [userProfiles, setUserProfiles] = useState({});

    const getProfileImage = async (email) => {
        try {
            const response = await axios.get('/api/auth/profile-image', {
                params: { email },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 200) {
                setUserProfiles((prevProfiles) => ({
                    ...prevProfiles,
                    [email]: response.data, // 이메일을 키로, 이미지 URL을 값으로 저장
                }));
            }
        } catch (error) {
            console.error("프로필 이미지를 불러오는 중 오류가 발생했습니다:", error);
        }
    };


    const getAllUserList = async () => {
        try{
            const response = await getAllUsers();
            setUsers(response.data);
            console.log('테스트얌: ', response.data);
            console.log('테스트얌: ', response.data.profileImage);
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

        console.log('profile: ', users[0].profile);

        //여기에 채팅방 생성 ~~ 로직을 넣어야함 id값을 전달 (selectedUserIds)
        try {
            const response = await axios.post('http://localhost:8080/api/chat/createChatroom', {
                userIds: selectedUserIds
            });
            console.log('Chatroom created:', response.data);
        } catch (error) {
            console.error('Error creating chatroom:', error);
        }

        console.log('Selected User Ids:', selectedUserIds); //emails 값 얻어오기, selectedUserEmails에 저장돼있음
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

                {filteredUsers.map(user => (
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
                                    checked={selectedUserIds.includes(user.email)}
                                    onChange={() => userListSelect(user.email)}
                                    disabled={
                                        !selectedUserIds.includes(user.email) && selectedUserIds.length >= 10
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
