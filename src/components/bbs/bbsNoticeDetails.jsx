//adminNoticeDetails.jsx

import React,{useState} from 'react';
import{Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,Paper,TextField,Typography,} from '@mui/material';
import {useRouter} from 'next/router';
import styles from '@/styles/bbs/bbsNoticeDetails.module.css';
import sidebar from '@/styles/bbs/bbsPage.module.css';
import NestedList from '@/components/bbs/bbsSidebar';

const NoticeDetails=()=> {
    const router = useRouter();
    const [open,setOpen] = useState(false);
    const [isEditing,setIsEditing] = useState(false);
    const [editedNotice, setEditedNotice] = useState({
        title: '2024년 하반기 공휴일 안내',
        content: `안녕하세요.\n\n2024년 하반기 공휴일 일정을 안내드립니다.\n\n` +
            `1. 8월 15일 (목) : 광복절\n` +
            `2. 9월 13일 (금) ~ 9월 15일 (일) : 추석 연휴\n` +
            `3. 10월 3일 (목) : 개천절\n` +
            `4. 10월 9일 (수) : 한글날\n` +
            `5. 12월 25일 (수) : 성탄절\n\n` +
            `위 공휴일 동안 서비스 운영에 변동 사항이 있을 시 추가 공지를 통해 안내드리겠습니다.\n` +
            `고객 여러분의 많은 양해 부탁드리며, 행복한 휴일 보내시길 바랍니다.\n\n감사합니다.`,
        date: '2024-07-15',
    });

    

    //입력 필드 값 변경 핸들러
    const handleChange =(event) => {
        const{name,value} = event.target;
        setEditedNotice((prevNotice) => ({
            ...prevNotice,
            [name]:value,
        }));
    };

    // 목록 버튼 클릭 핸들러
    const handleGoToList = () => {
        router.push('/bbs/noticePage'); // 공지사항 목록 페이지로 리다이렉트
    };

    return (
        <div className={sidebar.container}>
        <div className={sidebar.sidebar}>
            <NestedList/>
        </div>
        <div className={sidebar.content}>
        <div className={styles.noticeDetailsContainer}>
           <Paper elevation={3} className={styles.noticeDetailsPaper}>
                <Typography variant="h6" gutterBottom className={styles.noticeDetailsGrayText}>
                    [전체 공지사항]
                </Typography>
                <div className={styles.noticeDetailsHeader}>
                    {isEditing ? (
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="제목"
                            name="title"
                            value={editedNotice.title}
                            onChange={handleChange}
                        />
                    ) : (
                        <h2>{editedNotice.title}</h2>
                    )}
                    <p>{editedNotice.date}</p>
                </div>
                <div className={styles.noticeDetailsContent}>
                    {isEditing ? (
                        <TextField
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={10}
                            label="내용"
                            name="content"
                            value={editedNotice.content}
                            onChange={handleChange}
                        />
                    ) : (
                        editedNotice.content
                    )}
                </div>
                

                {/* 이전글 / 다음글 기능 */}
                <div className={styles.noticeDetailsNavButtons}>
                    <Button>&lt; 이전글</Button>
                    <Button>다음글 &gt;</Button>
                </div>
                {/* 목록 버튼 추가 */}
                <div className={styles.noticeDetailsListButton}>
                    <Button variant="contained" color="primary" onClick={handleGoToList}>
                        목록
                    </Button>
                </div>
            </Paper>
        </div>
        </div>
        </div>
    );
};

export default NoticeDetails;