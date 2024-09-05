import React, { useState, useEffect, useCallback } from 'react';
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
    // const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    // const [userInfo, setUserInfo] = useState({
    //     username: '',
    //     email: '',
    //     profile: ''
    // });
    const [chatRoomList, setChatRoomList] = useState([]);

    const { authStore, userStore } = useStores();
    const [users, setUsers] = useState([]); //getAllUsers()

    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const [currentChatRoomId, setCurrentChatRoomId] = useState(null); // 현재 선택된 채팅방의 ID

    const [lastMessage, setLastMessage] = useState('');
    const [lastMTopic, setLastMTopic] = useState('');

    // const getAllChatroomList = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8080/api/chat/allChatroomList'); 
    //         // 그대로 갖고오지말고 user id (나의 id) 전달해서 chatroomUsers 테이블에서 chatroom_id로 접근. 가져와서 그 findByID(chatroom_id)
    //         setChatRoomList(response.data);
    //     } catch (error) {
    //         console.error('Error fetching chat rooms:', error);
    //     }
    // };

    // const setLastMessage = (chatRoomId, message) => {
    //     setChatRoomList(prevChatRoomList =>
    //         prevChatRoomList.map(room =>
    //             room.id === chatRoomId ? { ...room, lastMessage: message } : room
    //         )
    //     );
    // };


    //getChatroomList
    const getChatroomList = async () => {
        try {
            const userId = userStore.id;
            console.log('typeof(userId): ', typeof(userId));
            const response = await axios.post('http://localhost:8080/api/chat/userChatrooms', 
                userId, 
                                                { headers: { 'Content-Type': 'application/json' } }
            );
            setChatRoomList(response.data);
            // console.log('response.data: ', response.data);
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    const getUserList = async () => {
        try{
            const response = await getAllUsers();
            setUsers(response.data);
        } 
        catch (error) {
            console.log('error: ', error);
        }
    }


    useEffect(() => {
        //이전 채팅 로딩
        // loadingPastChatting();

        //채팅방 목록 얻어오기
        // getAllChatroomList();
        getChatroomList();

        //모든 유저 목록 얻어오기
        getUserList();
    }, []);

    useEffect(() => {
        if (!client) {
            const mqttClient = mqtt.connect('mqtt://192.168.0.137:1884');

            mqttClient.on('connect', () => {
                //console.log('Connected to MQTT broker');
                setIsConnected(true);
            });

            mqttClient.on('message', (topic, message) => {
                // console.log('Received message:', message.toString());
                const receivedMessage = JSON.parse(message);

                const lastM = `${receivedMessage.sender} : ${receivedMessage.text}`;
                const lastMTopic = topic.split('/').pop();

                // console.log('lastM: ', lastM);
                // console.log('lastMTopic: ', lastMTopic);
                // setLastMessage(lastM);
                // setLastMTopic(lastMTopic);
                setChatRoomList(prevChatRoomList =>
                    prevChatRoomList.map(room =>
                        room.id == lastMTopic ? { ...room, lastMessage: lastM } : room
                    )
                );
                setMessages((prevMessages) => [...prevMessages, receivedMessage]);
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
        // console.log('useEffect 안의 subscribe 함수: ', chatRoomList);
        // chatRoomList.map((list) => {
        //     client.subscribe(`mqtt/chat/${list.id}`);
        // })
        if (client && currentChatRoomId) {
            const topic = `mqtt/chat/${currentChatRoomId}`;
            client.subscribe(topic);
            console.log(`Subscribed to topic: ${topic}`);

            return () => {
                client.unsubscribe(topic);
                console.log(`Unsubscribed from topic: ${topic}`);
            };
        }
    }, [client, currentChatRoomId]);
   
    useEffect(() => {
        if (currentChatRoomId) {
            setMessages([]);
            getPastChatting();
        }
    }, [currentChatRoomId]);

   
    //채팅방 구분만 안되고 그래도 왔다갔다 소통은 되는 코드
    // useEffect(() => {

    //     // mqtt 연결을 ChatMessage 쪽으로 옮기고 그곳에서 ChatroomList 안에 있는 id 값을 받아와서 그걸로 topic 설정해주기
    //     //topic을 chatroom의 id로 해주고 
    //     //chatroomList 도 다 출력하면 안되고 자기가 속해있는 ChatroomUsers 에서 판단... findByUserId...

    //     // MQTT 브로커에 연결
    //     try{
    //         const mqttClient = mqtt.connect('mqtt://192.168.0.137:1884'); // 또는 'ws://broker.hivemq.com:8000/mqtt' (웹소켓 사용 시)

    //         mqttClient.on('connect', () => {
    //             console.log('Connected to MQTT broker');
    //             setIsConnected(true);
    //             mqttClient.subscribe('mqtt/chat'); // 토픽
    //             // mqttClient.subscribe(`mqtt/chat/${currentChatRoomId}`);
    //         });
    
    //         mqttClient.on('message', (topic, message) => {
    //             console.log('Received message:', message.toString());
    //             // if (topic === 'mqtt/chat') {
    //             // if (topic === `mqtt/chat/83}`) {
    
    //                 const receivedMessage = JSON.parse(message);
    //                 if (message.sender !== userStore.username) {
    //                     setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    //                 }
    
    //             // }
    //         });
    
    //         mqttClient.on('error', (err) => {
    //             console.error('Connection error:', err);
    //         });
    
    //         mqttClient.on('close', () => {
    //             console.log('Disconnected from MQTT broker');
    //             setIsConnected(false);
    //         });
    
    //         setClient(mqttClient);
    
    //         return () => {
    //             if (mqttClient) {
    //                 mqttClient.end();
    //             }
    //         };
    //     }
    //     catch (error) {
    //         console.log('mqtt.connect Error: ', error);
    //     }
        
    //     // ========================================================================================

    //     // const websocketClient = new WebSocket('ws://192.168.0.137:8081/mqtt');
    //     // setClient(websocketClient);

    //     // websocketClient.onopen = () => {
    //     //     console.log("WebSocket connection established");
    //     // };

    //     // websocketClient.onmessage = (event) => {
    //     //     const message = JSON.parse(event.data);
    //     //     console.log("Received WebSocket message: ", message);
    //     //     setMessages((prevMessages) => [...prevMessages, message]);
    //     // };

    //     // websocketClient.onclose = () => {
    //     //     console.log("WebSocket connection closed");
    //     // };

    //     // return () => websocketClient.close();

    // }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    //chatroomList 전체를 클릭하든 케밥메뉴 클릭하든 아무튼 chatRoomId 얻어오기
    const getChatroomId = (chatRoomId) => {
        setCurrentChatRoomId(chatRoomId); // 선택된 채팅방 ID 저장
        // console.log('onChatClick() - currentChatRoomId: ', currentChatRoomId);
    }

    const onChatClick = () => {
        // setMessages([]); //채팅방 왔다갔다 하면 값 유지되는거 초기화 해버리기

        setIsChatOpen(true);
        // 채팅 하나하나 각각 눌렀을때 ?
        // getPastChatting();

    };

    const handleBackClick = () => {
        setIsChatOpen(false);
        setCurrentChatRoomId('');
        setMessages([]); //채팅방 왔다갔다 하면 값 유지되는거 초기화 해버리기
    };

    //currentChatRoomId : 선택된 채팅방 ID 값 저장돼있듬
    const getPastChatting = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/chat/getPastChatting', 
                currentChatRoomId, 
                { headers: { 'Content-Type': 'application/json' } });

            const pastMessages = response.data.map(chat => ({
                id: chat.id,
                text: chat.message,
                sender: chat.username,
                timestamp: chat.createdTime,
                senderId: chat.userId,
            }));

            // console.log(pastMessages);
            // console.log(userStore.id);

            pastMessages.map((pastMessage, index) => (
                setMessages(prev => [...prev, pastMessage])
            ));
            
        } catch (error) {
            console.error('Error get past chatting history:', error);
        }
    };



    const sendMessage = async () => {
        if (inputMessage.trim()) {

            const userMessage = { text: inputMessage, sender: userStore.username };
            // setMessages(prev => [...prev, userMessage]);

            // client.publish('mqtt/chat', JSON.stringify({ text: inputMessage, sender: userStore.username, timestamp: new Date() }));
            client.publish(`mqtt/chat/${currentChatRoomId}`, 
                JSON.stringify({ 
                    text: inputMessage, 
                    sender: userStore.username, 
                    timestamp: new Date(), 
                    senderId: userStore.id
                }));

            setInputMessage('');
        }
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className={`${styles.atchatWrapper} ${isDarkMode ? `${styles.darkMode}` : ''}`}>

            <div className={`${styles.chatContainer} ${isDarkMode ? styles.darkMode : ''}`}>
                <ChattingHeader closeChatting={closeChatting} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <div className={styles.chatContent}>

                    {!isChatOpen ? (
                        <ChattingList 
                            chatRoomList={chatRoomList} 
                            onChatClick={onChatClick} 
                            getChatroomId={getChatroomId}
                            getChatroomList={getChatroomList}
                            userStore={userStore} 
                            users={users} 
                            currentChatRoomId={currentChatRoomId} 
                            client={client} />
                    ) : (
                        <>
                            <div className={styles.chattingBackButtonWrapper}>
                                <button className={styles.chattingBackButton} onClick={handleBackClick}>
                                    <ArrowBackIosNewRoundedIcon />
                                </button>
                            </div>
                            <ChattingMessages messages={messages} userStore={userStore} />
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

