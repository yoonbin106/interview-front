import React, { useState, useEffect, useCallback } from 'react';
import styles from '../../styles/chat/chatting.module.css';
import ChattingHeader from '../../components/chat/chattingHeader';
import ChattingMessages from '../../components/chat/chattingMessages';
import ChattingInputArea from '../../components/chat/chattingInputArea';
import mqtt from 'mqtt';
import ChattingList from 'components/chat/chattingList';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import Chat from './chat';





const Chatting = ({ closeChatting }) => {
    // const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);

    const [client, setClient] = useState(null);

    const [isChatOpen, setIsChatOpen] = useState(false);

    const [userInfo, setUserInfo] = useState({
        username: '',
        email: '',
        profile: ''
      });

    const lists = [
        {id: 1, name: '김길동', title: '2팀회의 방', lastMessage: '오류나요'},
        {id: 2, name: '최길동', title: '채팅방 제목2', lastMessage: '어쩌구 저쩌구'},


    ]

    useEffect(() => {
        setUserInfo({
            username: localStorage.getItem('username') || '',
            email: localStorage.getItem('email') || '',
            profile: localStorage.getItem('profile') || '' // Assuming this is how you're storing the profile image URL or data
          });

        // const mqttClient = mqtt.connect('wss://broker.hivemq.com:1883/ws/chat'); 
        // setClient(mqttClient);

        // mqttClient.on('connect', () => {
        //     console.log('MQTT connection established');
        //     mqttClient.subscribe('chat/messages', (err) => {
        //         if (!err) {
        //             console.log('Subscribed to chat/messages');
        //         }
        //     });
        // });

        // mqttClient.on('message', (topic, message) => {
        //     if (topic === 'chat/messages') {
        //         const receivedMessage = JSON.parse(message.toString());
        //         console.log('Received MQTT message: ', receivedMessage);
        //         setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        //     }
        // });

        // mqttClient.on('close', () => {
        //     console.log('MQTT connection closed');
        // });

        // return () => mqttClient.end();


        const websocketClient = new WebSocket('ws://localhost:8000/ws/chat');
        setClient(websocketClient);

        websocketClient.onopen = () => {
            console.log("WebSocket connection established");
        };

        websocketClient.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Received WebSocket message: ", message);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        websocketClient.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => websocketClient.close();
    }, []);

    // const startNewBot = useCallback(async () => {
    //     try {
    //         const response = await axios.post('/api/bot/chat', null, {
    //             params: { id: tempId }
    //         });
    //         console.log("New chat started with ID:", response.data.botId);
    //         setCurrentBotId(response.data.botId);
    //         setBotStartTime(new Date(response.data.createdTime));
    //         setBotEndTime(null);

    //         const greetingMessage = "안녕하세요! VIP 고객님을 위한 챗봇 서비스입니다. 무엇을 도와드릴까요?";
    //         setMessages([{ text: greetingMessage, sender: 'bot' }]);
    //     } catch (error) {
    //         console.error('Error starting new chat:', error);
    //         setMessages([{ text: "채팅 시작 중 오류가 발생했습니다.", sender: 'system' }]);
    //     }
    // }, [tempId]);

    // useEffect(() => {
    //     if (isOpen && !currentBotId) {
    //         console.log("Starting new chat");
    //         startNewBot();
    //     }
    // }, [isOpen, currentBotId, startNewBot]);

    // const saveJsonFile = async () => {
    //     try {
    //         const data = {
    //             botId: currentBotId,
    //             messages: messages,
    //             startTime: botStartTime,
    //             endTime: new Date()
    //         };

    //         await axios.post('/api/bot/save-json', data);
    //         console.log('Chat data saved successfully');
    //     } catch (error) {
    //         console.error('Error saving chat data:', error);
    //     }
    // };


    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev); // 다크 모드 상태를 전환
    };

    const handleChatClick = () => {
        setIsChatOpen(true); // 채팅 클릭 시 채팅창을 열림 상태로 설정
    };

    const handleBackClick = () => {
        setIsChatOpen(false); // 뒤로 가기 시 채팅 목록으로 돌아감
    };


    const sendMessage = async () => {
        if (inputMessage.trim()) {
            const userMessage = { text: inputMessage, sender: 'user' };
            setMessages(prev => [...prev, userMessage]);

            client.send(JSON.stringify({ text: inputMessage, timestamp: new Date() }));


            setInputMessage('');
            try {
                // const questionResponse = await axios.post('/api/bot/question', {
                //     content: inputMessage,
                //     botId: currentBotId
                // });

                // const answerResponse = await axios.post('/api/bot/answer', null, {
                //     params: { questionId: questionResponse.data.questionId }
                // });

                // const newBotMessage = {
                //     text: answerResponse.data.content,
                //     sender: 'bot',
                //     answerId: answerResponse.data.answerId
                // };
                if (inputMessage == '지금')
                    setMessages(prev => [...prev, { text: '상대방의 메세지', sender: 'bot' }]);
            } catch (error) {
                console.error('Error processing message:', error);
                setMessages(prev => [...prev, { text: "죄송합니다. 오류가 발생했습니다.", sender: 'bot' }]);
            }
        }
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };


    return (
        <div className={`${styles.atbotWrapper} ${isDarkMode ? `${styles.darkMode}` : ''}`}>

            <div className={`${styles.botContainer} ${isDarkMode ? styles.darkMode : ''}`}>
                <ChattingHeader closeChatting={closeChatting} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <div className={styles.botContent}>
                
                {!isChatOpen ? (
                        <ChattingList lists={lists} onChatClick={handleChatClick} userInfo={userInfo} />
                    ) : (
                        <>
                            <button className={styles.chattingBackButton} onClick={handleBackClick}>
                                <ArrowBackIosNewRoundedIcon/>
                            </button>
                            <ChattingMessages messages={messages} />
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
};

export default Chatting;