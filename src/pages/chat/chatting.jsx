import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/chat/chatting.module.css';
import ChattingHeader from '../../components/chat/chattingHeader';
import ChattingMessages from '../../components/chat/chattingMessages';
import ChattingInputArea from '../../components/chat/chattingInputArea';
import mqtt from 'mqtt';
import ChattingList from 'components/chat/chattingList';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useStores } from '@/contexts/storeContext';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { getAllUsers } from 'api/user';


const Chatting = observer(({ closeChatting }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatRoomList, setChatRoomList] = useState([]);
    const [chatRoomTitle, setChatRoomTitle] = useState([]);
    const [chatAlarm, setChatAlarm] = useState([]);


    const { authStore, userStore, mqttStore } = useStores();
    const [users, setUsers] = useState([]); //getAllUsers()
    const [usersInChatroom, setUsersInChatroom] = useState([]);

    const [client, setClient] = useState(null); //mqttClient
    const [isConnected, setIsConnected] = useState(false);

    const [currentChatRoomId, setCurrentChatRoomId] = useState(null); // 현재 선택된 채팅방의 ID (전달용)
    const currentChatRoomIdRef = useRef(null); // 현재 선택된 채팅방의 ID 즉시 적용

    // const getAllChatroomList = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8080/api/chat/allChatroomList'); 
    //         // 그대로 갖고오지말고 user id (나의 id) 전달해서 chatroomUsers 테이블에서 chatroom_id로 접근. 가져와서 그 findByID(chatroom_id)
    //         setChatRoomList(response.data);
    //     } catch (error) {
    //         console.error('Error fetching chat rooms:', error);
    //     }
    // };

    //getChatroomList
    const getChatroomList = async () => {
        try {
            const userId = userStore.id;
            const response = await axios.post('http://localhost:8080/api/chat/userChatrooms',
                userId,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setChatRoomList(response.data);
            // console.log('response.data (ChatRoomList): ', response.data);
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    const getUserList = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data);
        }
        catch (error) {
            console.log('error: ', error);
        }
    }

    useEffect(() => {
        //채팅방 목록 얻어오기
        // getAllChatroomList();
        getChatroomList();

        //모든 유저 목록 얻어오기
        getUserList();

        //알람 목록 얻어오기
        getChatAlarm();

    }, []);

    const getChatAlarm = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/alarm/getChatAlarm',
                userStore.id,
                { headers: { 'Content-Type': 'application/json' } }
            );
            // console.log('[chatting.jsx] getChatAlarm(): ', response.data);
            // console.log('[chatting.jsx] getChatAlarm().length: ', response.data.length);
            // setAlarmList(response.data);
            // setBadgeCount(response.data.length);
            setChatAlarm(response.data);
            return response.data;
        } catch (error) {
            console.error('알람 가져오기 중 에러 발생:', error);
        }
    }

    useEffect(() => {
        if (!client) {
            const mqttClient = mqttStore.mqttClient;

            mqttClient.on('connect', () => {
                // console.log('Connected to MQTT broker');
                setIsConnected(true);
            });

            mqttClient.on('message', (topic, message) => {
                // console.log('메세지 받음');
                if (topic.startsWith('mqtt/chat/')) {
                    console.log('Received message:', message.toString());
                    const receivedMessage = JSON.parse(message);

                    const lastM = `${receivedMessage.sender} : ${receivedMessage.text}`;
                    const lastMTopic = topic.split('/').pop();

                    setChatRoomList(prevChatRoomList =>
                        prevChatRoomList.map(room =>
                            room.id == lastMTopic ? { ...room, lastMessage: lastM } : room
                        )
                    );
                    getChatroomList();

                    // console.log(receivedMessage);
                    // console.log(receivedMessage.chatroomId);

                    // if (receivedMessage && receivedMessage.chatroomId == currentChatRoomId) {
                    //채팅방에 들어가서 ! 채팅방 아이디값을 얻어왔을때만 그 채팅방에 해당하는 메세지만 화면에 setMessages하기
                    if (receivedMessage && receivedMessage.chatroomId == currentChatRoomIdRef.current) {
                        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                    }
                }
                if (topic.startsWith('mqtt/member/')) {
                    
                    const roomId = JSON.parse(message).chatroomId;
                    // if(message)
                    if(roomId == currentChatRoomIdRef.current){
                        readChatAlarmInChatroom(roomId);
                        
                    }
                    getChatAlarm();
        
                    
                }
            });

            mqttClient.on('error', (err) => {
                console.error('Connection error:', err);
            });

            mqttClient.on('close', () => {
                console.log('Disconnected from MQTT broker');
                setIsConnected(false);
            });

            setClient(mqttClient);
        }

    }, [client]);

    useEffect(() => {
        if (chatRoomList) {
            // console.log('useEffect 안의 subscribe 함수: ', chatRoomList);
            chatRoomList.forEach((list) => {
                const topic = `mqtt/chat/${list.id}`;
                client.subscribe(topic);
            })
        }

    }, [client, chatRoomList]);

    // useEffect(() => {
    //     // console.log('useEffect 안의 subscribe 함수: ', chatRoomList);
    //     // chatRoomList.map((list) => {
    //     //     client.subscribe(`mqtt/chat/${list.id}`);
    //     // })

    //     //아래는 채팅방 들어갔다가 나갈때 토픽 구독/해제 하는 코드

    //     if (client && currentChatRoomId) {
    //         const topic = `mqtt/chat/${currentChatRoomId}`;
    //         client.subscribe(topic);
    //         console.log(`Subscribed to topic: ${topic}`);

    //         return () => {
    //             client.unsubscribe(topic);
    //             console.log(`Unsubscribed from topic: ${topic}`);
    //         };
    //     }
    // }, [client, currentChatRoomId]);

    const readChatAlarmInChatroom = async (chatroomId) => {
        try {
            const response = await axios.post('http://localhost:8080/api/alarm/readChatAlarmInChatroom',
                { chatroomId: chatroomId, userId: userStore.id},
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log('[chatting.jsx] readChatAlarmInChatroom(): ', response.data);
            console.log('[chatting.jsx] readChatAlarmInChatroom().length: ', response.data.length);
            return response.data;
        } catch (error) {
            console.error('채팅방 들어가서 알람 읽기 중 에러 발생:', error);
        }
    }

    useEffect(() => {
        if (currentChatRoomIdRef.current) {
            readChatAlarmInChatroom(currentChatRoomIdRef.current);
            //채팅방으로 들어갔을 때 실행될 코드 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            setMessages([]);
            getPastChatting();
        }
    }, [currentChatRoomIdRef.current]);


    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    //chatroomList 전체를 클릭하든 케밥메뉴 클릭하든 아무튼 chatRoomId 얻어오기
    const getChatroomId = (chatRoomId) => {
        console.log('[getChatroomId() 호출]: ', chatRoomId);

        setCurrentChatRoomId(chatRoomId); // 선택된 채팅방 ID 저장
        currentChatRoomIdRef.current = chatRoomId;

        getChatroomTitle(chatRoomId);
    }

    const onChatClick = (chatRoomId) => {

        // getUsersInChatroom(chatRoomId);

        console.log('[onChatClick() 호출]: ', chatRoomId);
        currentChatRoomIdRef.current = chatRoomId; // Ref에 바로 값 저장
        setIsChatOpen(true);
    };

    const handleBackClick = () => {
        setIsChatOpen(false);
        getChatroomList();
        getChatAlarm();
        // setCurrentChatRoomId('');
        currentChatRoomIdRef.current = '';
        setMessages([]); //채팅방 왔다갔다 하면 값 유지되는거 초기화 해버리기
    };

    //currentChatRoomId : 선택된 채팅방 ID 값 저장돼있듬
    const getPastChatting = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/chat/getPastChatting',
                currentChatRoomIdRef.current,
                { headers: { 'Content-Type': 'application/json' } });

            const pastMessages = response.data.map(chat => ({
                id: chat.id,
                chatroomId: chat.chatroomId,
                text: chat.message,
                sender: chat.username,
                timestamp: chat.createdTime,
                senderId: chat.userId,
            }));

            // console.log('response.date: ', response.data);
            // console.log(pastMessages);
            // console.log(userStore.id);

            pastMessages.map((pastMessage, index) => (
                setMessages(prev => [...prev, pastMessage])
            ));

        } catch (error) {
            console.error('Error get past chatting history:', error);
        }
    };

    //채팅방에 있는 유저들의 id 값을 가져오기 (알람 목적)
    const getUserIdsForChatAlarm = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/chat/getUserIdsForChatAlarm', {
                params: {
                    id: currentChatRoomId,
                    userId: userStore.id
                },
            });
            console.log(response.data);
            return response.data;
        }
        catch (err) {
            console.log('선택한 채팅방에 참여 중인 유저 목록 얻어오기 중 에러 발생: ', err);
        }
    };

    //파이썬으로 채팅 값 보내는 함수
    const sendMessage = async () => {
        const userIdsForAlarm = await getUserIdsForChatAlarm();
        console.log('userIdsForAlarm: ', userIdsForAlarm);
        console.log('userIdsForAlarm[0]: ', userIdsForAlarm[0]);
        console.log('typeof(userIdsForAlarm): ', typeof (userIdsForAlarm));
        console.log('typeof(userIdsForAlarm[0]): ', typeof (userIdsForAlarm[0]));

        if (inputMessage.trim()) {

            const messageData = {
                text: inputMessage,
                chatroomId: currentChatRoomIdRef.current,
                sender: userStore.username,
                senderId: userStore.id.toString(),
                timestamp: new Date().toISOString(),
                type: 'chat',
                userIds: userIdsForAlarm

            };
            console.log('type: ', typeof userStore.id);
            console.log('messageData: ', messageData);
            try {
                // 파이썬 FastAPI 서버로 메시지 보내기
                await axios.post('http://192.168.0.137:8000/sendMessage', messageData);
                setInputMessage('');
            } catch (error) {
                console.error("메시지 전송 중 오류 발생:", error);
            }

            // MQTT publish 코드
            // client.publish(`mqtt/chat/${currentChatRoomIdRef.current}`, 
            //     JSON.stringify({ 
            //         text: inputMessage, 
            //         chatroomId: currentChatRoomIdRef.current,
            //         sender: userStore.username, 
            //         timestamp: new Date(), 
            //         senderId: userStore.id
            //     }));
        }
    };


    // 읽었을때 그거 처리 파이썬으로 보내고 거기서 isRead 1로 수정하고 mqtt로도 publish 해주기
    // 읽었을때 채팅방, 유저아이디 보내서 그걸루...isRead할 컬럼 찾기
    // readChatAlarmInChatroom => readChatMessage
    const readChatAlarm = async () => {

            const readChatMessageData = {
                type: 'chat',
                chatroomId: currentChatRoomIdRef.current,
                userId: userStore.id
            };

            try {
                await axios.post('http://192.168.0.137:8000/readChatAlarm', readChatMessageData);
            } catch (error) {
                console.error("메시지 읽음 처리 중 오류 발생:", error);
            }
        
    };



    const getChatroomTitle = async (chatRoomId) => {
        console.log('[ChattingList.jsx] currentChatRoomId: ', chatRoomId);
        try {
            const response = await axios.get('http://localhost:8080/api/chat/getChatroomTitle', {
                params: {
                    id: chatRoomId
                }
            });
            // console.log('[getChatroomTitle()] - response.data: ', response.data);
            // setCurrentChatRoomTitle(response.data);
            setChatRoomTitle(response.data);
            return response.data;
        } catch (error) {
            console.error('채팅방 제목 가져오기 중 에러 발생:', error);
        }
    }

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

    const getUsersInChatroom = async (chatRoomId) => {
        try {
            const response = await axios.get('http://localhost:8080/api/chat/getUsersInChatroom', {
                params: {
                    id: chatRoomId,
                    userId: userStore.id
                },
            });
            // console.log('getUsersInChatroom(): ', response.data);

            // setUsersInChatroom(response.data);

            setUsersInChatroom(prevState => ({
                ...prevState,   // 이전 상태를 유지하면서
                [chatRoomId]: response.data  // 해당 채팅방 ID에 맞는 유저 목록 저장
            }));

            return response.data;
        }
        catch (err) {
            console.log('선택한 채팅방에 참여 중인 유저 목록 얻어오기 중 에러 발생: ', err);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };
    //2024.09.11 추가
    const handleCloseChatting = () => {
        setIsChatOpen(false);
        setMessages([]);
        currentChatRoomIdRef.current = null;
        setCurrentChatRoomId(null);
        getChatroomList(); // 채팅방 목록 갱신
        closeChatting(); // SpeedDial 컴포넌트에서 전달받은 함수 호출
    };
    return (
        <div className={`${styles.atchatWrapper} ${isDarkMode ? `${styles.darkMode}` : ''}`}>

            <div className={`${styles.chatContainer} ${isDarkMode ? styles.darkMode : ''}`}>
                <ChattingHeader closeChatting={handleCloseChatting} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <div className={styles.chatContent}>

                    {!isChatOpen ? (
                        <ChattingList
                            chatRoomList={chatRoomList}
                            onChatClick={onChatClick}
                            getChatroomId={getChatroomId}
                            getChatroomList={getChatroomList}
                            userStore={userStore}
                            currentChatRoomId={currentChatRoomId}
                            client={client}
                            getChatroomTitle={getChatroomTitle}
                            chatRoomTitle={chatRoomTitle}
                            exitChatroom={exitChatroom}
                            getUsersInChatroom={getUsersInChatroom}
                            usersInChatroom={usersInChatroom} 
                            chatAlarm={chatAlarm} />
                    ) : (
                        <>
                            <div className={styles.chattingBackButtonWrapper}>
                                <button className={styles.chattingBackButton} onClick={handleBackClick}>
                                    <ArrowBackIosNewRoundedIcon />
                                </button>
                            </div>
                            <ChattingMessages
                                messages={messages}
                                userStore={userStore}
                                chatRoomTitle={chatRoomTitle}
                                users={users}
                                usersInChatroom={usersInChatroom}
                                currentChatRoomId={currentChatRoomId} />
                        </>
                    )}
                </div>
                {isChatOpen && (
                    <div className={styles.inputArea}>
                        <ChattingInputArea
                            inputMessage={inputMessage}
                            setInputMessage={setInputMessage}
                            sendMessage={sendMessage}
                            handleKeyPress={handleKeyPress}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});

export default Chatting;

