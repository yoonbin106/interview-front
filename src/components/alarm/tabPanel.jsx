import { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styles from '../../styles/alarm/tabPanel.module.css';

import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Button from '@mui/material/Button';
import axios from 'axios';

import { MessageSquareMore, ClipboardPen } from 'lucide-react';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <div className={styles.tabPanelContent}>{children}</div>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TabPanel({ userId, alarmList, setAlarmList, getAlarm }) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const deleteAlarm = (id) => {
        disableAlarm(id);
        // setAlarmList(alarmList.filter(alarm => alarm.id !== id));
        getAlarm(userId);
    };

    const readAllAlarm = () => {
        // console.log("모든 알람을 읽음 처리합니다.");
        readAllAlarms(userId);
        getAlarm(userId);
    };

    const deleteAllAlarms = () => {
        disableAllAlarms();
        getAlarm(userId);
    };

    const disableAlarm = async (id) => {
        try {
            const response = await axios.post('http://localhost:8080/api/alarm/disableAlarm',
                id,
                { headers: { 'Content-Type': 'application/json' } }
            );
            return response.data;
        } catch (error) {
            console.error('알람 지우기 처리 중 에러 발생:', error);
        }
    }

    const readAllAlarms = async (id) => {
        try {
            const response = await axios.post('http://localhost:8080/api/alarm/readAllAlarms',
                id,
                { headers: { 'Content-Type': 'application/json' } }
            );
            return response.data;
        } catch (error) {
            console.error('알람 지우기 처리 중 에러 발생:', error);
        }
    }

    const disableAllAlarms = async () => {
        let type = 'all';
        if (value == 1) {
            type = 'chat';
        } else if (value == 2) {
            type = 'bbs';
        }

        try {
            const response = await axios.post('http://localhost:8080/api/alarm/disableAllAlarms',
                { userId, type },
                { headers: { 'Content-Type': 'application/json' } }
            );
            return response.data;
        } catch (error) {
            console.error('알람 지우기 처리 중 에러 발생:', error);
        }
    }



    const chatAlarms = (alarmList || []).filter(alarm => alarm.type === 'chat');
    const bbsAlarms = (alarmList || []).filter(alarm => alarm.type === 'bbs');

    return (
        <div className={styles.tabPanelContainer}>
            <div className={styles.tabBarContainer}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ width: '100%' }} >
                    <Tab label="전체" {...a11yProps(0)} sx={{ flex: 1 }} />
                    <Tab label="채팅" {...a11yProps(1)} sx={{ flex: 1 }} />
                    <Tab label="게시판" {...a11yProps(2)} sx={{ flex: 1 }} />
                </Tabs>
            </div>

            <div className={styles.tabActions}>
                <Button size="small" color="secondary" onClick={readAllAlarm} className={styles.actionButton}>
                    모두 읽음
                </Button>
                <Button size="small" color="secondary" onClick={deleteAllAlarms} className={styles.actionButton}>
                    모두 지우기
                </Button>
            </div>

            <CustomTabPanel value={value} index={0}>
                <div className={styles.alarmContainer}>
                    {alarmList.length > 0 ? (
                        alarmList.map((alarm) => (
                            <div key={alarm.id} className={`${styles.alarmItem} ${alarm.isRead === 0 ? styles.unread : styles.read}`}>
                                <div className={styles.alarmText}>

                                    <div className={styles.alarmMessage}>
                                        {alarm.type === 'chat' ?
                                            <MessageSquareMore size={35} strokeWidth={2} />
                                            : <ClipboardPen size={35} strokeWidth={2} />}
                                    </div>
                                    <div className={styles.alarmMessageTitleWrapper}>
                                        <div className={styles.alarmTitle}>{alarm.title}</div>
                                        <div className={styles.alarmContent}>{alarm.content}</div>
                                    </div>

                                </div>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => deleteAlarm(alarm.id)}
                                    className={styles.deleteButton}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </div>
                        ))
                    ) : (
                        <div>전체 알림이 없습니다.</div>
                    )}
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <div className={styles.alarmContainer}>
                    {chatAlarms.length > 0 ? (
                        chatAlarms.map((alarm) => (
                            <div key={alarm.id} className={`${styles.alarmItem} ${alarm.isRead === 0 ? styles.unread : styles.read}`}>
                                <div className={styles.alarmText}>

                                    <div className={styles.alarmMessage}>
                                        {alarm.type === 'chat' ?
                                            <MessageSquareMore size={35} strokeWidth={2} />
                                            : <ClipboardPen size={35} strokeWidth={2} />}
                                    </div>
                                    <div className={styles.alarmMessageTitleWrapper}>
                                        <div className={styles.alarmTitle}>{alarm.title}</div>
                                        <div className={styles.alarmContent}>{alarm.content}</div>
                                    </div>

                                </div>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => deleteAlarm(alarm.id)}
                                    className={styles.deleteButton}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </div>
                        ))
                    ) : (
                        <div>채팅 알림이 없습니다.</div>
                    )}
                </div>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <div className={styles.alarmContainer}>
                    {bbsAlarms.length > 0 ? (
                        bbsAlarms.map((alarm) => (
                            <div key={alarm.id} className={`${styles.alarmItem} ${alarm.isRead === 0 ? styles.unread : styles.read}`}>
                                <div className={styles.alarmText}>

                                    <div className={styles.alarmMessage}>
                                        {alarm.type === 'chat' ?
                                            <MessageSquareMore size={35} strokeWidth={2} />
                                            : <ClipboardPen size={35} strokeWidth={2} />}
                                    </div>
                                    <div className={styles.alarmMessageTitleWrapper}>
                                        <div className={styles.alarmTitle}>{alarm.title}</div>
                                        <div className={styles.alarmContent}>{alarm.content}</div>
                                    </div>

                                </div>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => deleteAlarm(alarm.id)}
                                    className={styles.deleteButton}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </div>
                        ))
                    ) : (
                        <div>게시판 알림이 없습니다.</div>
                    )}
                </div>
            </CustomTabPanel>
        </div>
    );
}
