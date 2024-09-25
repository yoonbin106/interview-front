import React, { useState, useEffect } from 'react';
import { Button, Paper, TextField, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import styles from '@/styles/bbs/bbsNoticeDetails.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'react-quill/dist/quill.snow.css'; // Quill의 기본 스타일 적용

// Quill.js 동적 import 설정
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const BbsNoticeDetails = ({ noticeData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedNotice, setEditedNotice] = useState(noticeData || {});
    
    const router = useRouter();
    const { noticeId } = router.query;

    useEffect(() => {
        if (!noticeData && noticeId) {
            const fetchNotice = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/notice/${noticeId}`);
                    setEditedNotice(response.data);
                } catch (error) {
                    console.error('Error fetching notice:', error);
                }
            };
            fetchNotice();
        }
    }, [noticeId, noticeData]);

    


    const handleGoBack = () => {
        router.push('/bbs/noticePage');
    };

    const handleChange = (value) => {
        setEditedNotice((prevNotice) => ({
            ...prevNotice,
            noticeContent: value,
        }));
    };

    if (!editedNotice.noticeTitle) {
        return <div>Loading...</div>;
    }

    const renderHeader = () => (
        <div className={styles.noticeDetailsHeader}>
            {isEditing ? (
                <TextField
                    fullWidth
                    variant="outlined"
                    label="제목"
                    name="noticeTitle"
                    value={editedNotice.noticeTitle || ''}
                    onChange={(e) =>
                        setEditedNotice((prevNotice) => ({
                            ...prevNotice,
                            noticeTitle: e.target.value,
                        }))
                    }
                    inputProps={{ style: { fontWeight: 'bold', fontSize: '1.5rem' } }}
                />
            ) : (
                <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{editedNotice.noticeTitle}</h2>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p className={styles.noticeDetailsDate}>
                    {new Date(editedNotice.noticeCreatedTime).toLocaleString('ko-KR', {
                        year: 'numeric',     
                        month: '2-digit',    
                        day: '2-digit', 
                        hour: '2-digit',
                        minute: '2-digit', 
                        hour12: false //24시간 형식
                    })}
                </p>
                {editedNotice.user && (
                    <Typography variant="body1" className={styles.noticeDetailsAuthor}>
                        작성자: {editedNotice.user.username}
                    </Typography>
                )}
            </div>
        </div>
    );

    const renderContent = () => (
        <div className={styles.noticeDetailsContent}>
            {isEditing ? (
                <ReactQuill
                    value={editedNotice.noticeContent}
                    onChange={handleChange}
                    placeholder="내용을 입력하세요" // Placeholder 추가
                    modules={{
                        toolbar: [
                            [{ header: '1' }, { header: '2' }, { font: [] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                            ['link', 'image', 'video'],
                            ['clean'],
                        ],
                    }}
                    formats={[
                        'header', 'font', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet', 'indent',
                        'link', 'image', 'video'
                    ]}
                />
            ) : (
                <div className={styles.quillContent} dangerouslySetInnerHTML={{ __html: editedNotice.noticeContent }} />
            )}
        </div>
    );

    const renderButtons = () => (
        <div className={styles.noticeDetailsButtonsContainer}>
                <>
                    <Button variant="contained" className={styles.noticeListButton} onClick={handleGoBack}>
                        목록으로 돌아가기
                    </Button>
                </>
           
        </div>
    );

    return (
        <div className={styles.noticeContent}>
            <div className={styles.noticeDetailsContainer}>
                <Paper elevation={3} className={styles.noticeDetailsPaper}>
                    <Typography variant="h6" gutterBottom className={styles.noticeDetailsDate}>
                        [전체 공지사항]
                    </Typography>
                    {renderHeader()}
                    {renderContent()}
                    {renderButtons()}
                </Paper>

                
            </div>
        </div>
    );
};

export default BbsNoticeDetails;
