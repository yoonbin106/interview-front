import React, { createContext, useContext, useState } from 'react';

const ChatRoomContext = createContext();

export const ChatRoomProvider = ({ children }) => {
    const [alarmChatroomId, setAlarmChatroomId] = useState(null);
    const [alarmUserId, setAlarmUserId] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <ChatRoomContext.Provider value={{ alarmChatroomId, setAlarmChatroomId, alarmUserId, setAlarmUserId, isChatOpen, setIsChatOpen }}>
            {children}
        </ChatRoomContext.Provider>
    );
};

export const useChatRoom = () => useContext(ChatRoomContext);