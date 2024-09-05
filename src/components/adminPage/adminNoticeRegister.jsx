import React, { useState } from 'react';
import { Grid, Typography, Button, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import { useStores } from 'contexts/storeContext';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'react-quill/dist/quill.snow.css'; // Quill의 기본 스타일 적용
import styles from '@/styles/adminPage/adminNoticeRegister.module.css';

// Quill.js를 동적 import로 클라이언트에서만 로드되도록 설정
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AdminNoticeRegister = observer(() => {
    const { userStore } = useStores();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');  // Quill.js의 content를 관리하기 위한 상태
    const [titleError, setTitleError] = useState(false);  // 제목 입력 오류 상태
    const [contentError, setContentError] = useState(false);  // 내용 입력 오류 상태
    const router = useRouter();

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        setTitleError(false);  // 제목을 입력하면 오류 상태 초기화
    };

    const handleContentChange = (value) => {
        setContent(value);  // Quill.js가 반환하는 HTML을 상태로 저장
        setContentError(false);  // 내용을 입력하면 오류 상태 초기화
    };

    const handleSubmit = async () => {
        if (!title) {
            setTitleError(true);
            alert('제목을 입력해주세요.');
            return;
        }

        if (!content || content === '<p><br></p>') {  // 내용이 비어있거나 기본 빈 텍스트일 경우
            setContentError(true);
            alert('내용을 입력해주세요.');
            return;
        }

        const adminNoticeData = {
            noticeTitle: title,
            noticeContent: content,  // Quill.js가 생성한 HTML을 저장
            id: userStore.id
        };

        try {
            await axios.post('http://localhost:8080/api/notice', adminNoticeData);
            alert('관리자 공지사항이 성공적으로 등록되었습니다.');
            router.push('/adminPage/adminNoticePage');
        } catch (error) {
            console.error('공지사항 등록 중 오류 발생:', error);
            alert('공지사항 등록에 실패했습니다.');
        }
    };

    return (
        <Grid container spacing={2} className={styles.adminNoticeRegisterContainer}>
            <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>글 작성하기</Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="제목을 입력하세요"
                    className={styles.adminNoticeRegisterTitleInput}
                    value={title}
                    onChange={handleTitleChange}
                    error={titleError}  // 오류 상태에 따라 에러 스타일 적용
                    helperText={titleError && "제목을 입력해주세요"}  // 오류 메시지 출력
                />
            </Grid>
            <Grid item xs={12}>
                <ReactQuill
                    value={content}
                    onChange={handleContentChange}
                    placeholder="내용을 입력하세요" // 여기서 placeholder 설정
                    modules={{
                        toolbar: [
                            [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
                            [{size: ['small', false, 'large', 'huge']}], // small, normal, large, huge 크기 선택 가능
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}, 
                            {'indent': '-1'}, {'indent': '+1'}],
                            ['link', 'image', 'video'],
                            ['clean']
                        ],
                    }}
                    formats={[
                        'header', 'font', 'size',
                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet', 'indent',
                        'link', 'image', 'video'
                    ]}
                    className={styles.adminNoticeRegisterContentInput}
                />
                {contentError && (
                    <Typography variant="body2" color="error">
                        내용을 입력해주세요.
                    </Typography>
                )}
                <Typography variant="body2" align="right" color="textSecondary" className={styles.noticeRegisterCharCount}>
                    {content.length}/2000
                </Typography>
                <Grid item xs={12} align="right">
                    <Button className={styles.adminNoticeRegisterSubmitButton}
                        variant="contained" 
                        color="primary" 
                        onClick={handleSubmit}
                    >
                        등록하기
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
});

export default AdminNoticeRegister;
