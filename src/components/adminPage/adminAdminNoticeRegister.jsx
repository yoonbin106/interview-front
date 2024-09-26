import React, { useState } from 'react';
import { Grid, Typography, Button, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import { useStores } from 'contexts/storeContext';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'react-quill/dist/quill.snow.css'; // Quill의 기본 스타일 적용
import styles from '@/styles/adminPage/adminAdminNoticeRegister.module.css';

// Quill.js를 동적 import로 클라이언트에서만 로드되도록 설정
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AdminAdminNoticeRegister = observer(() => {
    const { userStore } = useStores(); // MobX store에서 사용자 정보 가져오기
    const [title, setTitle] = useState(''); // 제목 상태
    const [content, setContent] = useState(''); // Quill.js의 content를 관리하기 위한 상태
    const router = useRouter(); // Next.js 라우터

    // 제목 입력 핸들러
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    // Quill.js 에디터의 내용 변경 핸들러
    const handleContentChange = (value) => {
        setContent(value); // Quill.js가 반환하는 HTML을 상태로 저장
    };

    // 등록 버튼 클릭 시 실행되는 함수
    const handleSubmit = async () => {
        if (!title || !content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        const adminAdminNoticeData = {
            adminNoticeTitle: title, // 제목 저장
            adminNoticeContent: content, // Quill.js가 생성한 HTML 저장
            id: userStore.id // 사용자 ID
        };

        try {
            // 관리자 공지사항 등록 API 호출
            await axios.post('http://localhost:8080/api/adminnotice', adminAdminNoticeData);
            alert('관리자 공지사항이 성공적으로 등록되었습니다.');
            router.push('/adminPage/adminAdminNoticePage'); // 공지사항 페이지로 이동
        } catch (error) {
            console.error('공지사항 등록 중 오류 발생:', error);
            alert('공지사항 등록에 실패했습니다.');
        }
    };

    return (
        <Grid container spacing={2} className={styles.adminAdminNoticeRegisterContainer}>
            <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                    글 작성하기
                </Typography>
            </Grid>

            {/* 제목 입력 필드 */}
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="제목을 입력하세요"
                    className={styles.adminAdminNoticeRegisterTitleInput}
                    value={title}
                    onChange={handleTitleChange}
                />
            </Grid>

            {/* Quill 에디터 */}
            <Grid item xs={12}>
                <ReactQuill
                    value={content}
                    onChange={handleContentChange}
                    placeholder="내용을 입력하세요"
                    modules={{
                        toolbar: [
                            [{ header: '1' }, { header: '2' }, { font: [] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                            ['link', 'image', 'video'],
                            ['clean']
                        ],
                    }}
                    formats={[
                        'header', 'font', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet', 'indent', 'link', 'image', 'video'
                    ]}
                    className={styles.adminAdminNoticeRegisterContentInput}
                    style={{
                        minHeight: '300px',
                        border: '1px solid #ccc',
                        padding: '10px',
                    }}
                />
                <Typography variant="body2" align="right" color="textSecondary" className={styles.noticeRegisterCharCount}>
                    {content.length}/2000
                </Typography>
            </Grid>

            {/* 등록 버튼 */}
            <Grid item xs={12} align="right">
                <Button
                    className={styles.adminAdminNoticeRegisterSubmitButton}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    등록하기
                </Button>
            </Grid>
        </Grid>
    );
});

export default AdminAdminNoticeRegister;
