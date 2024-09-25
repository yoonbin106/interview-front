import React, { useState } from 'react';
import { Grid, Typography, Button, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import { useStores } from 'contexts/storeContext';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'react-quill/dist/quill.snow.css'; // Quill의 기본 스타일 적용
import styles from '@/styles/adminPage/adminNoticeRegister.module.css';

// Quill.js를 동적으로 import해 클라이언트에서만 로드되도록 설정
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AdminNoticeRegister = observer(() => {
    const { userStore } = useStores(); // MobX store에서 사용자 정보 가져오기
    const [title, setTitle] = useState(''); // 제목 상태
    const [content, setContent] = useState(''); // Quill.js 에디터의 내용 상태
    const [titleError, setTitleError] = useState(false); // 제목 입력 오류 상태
    const [contentError, setContentError] = useState(false); // 내용 입력 오류 상태
    const router = useRouter(); // Next.js의 라우터

    // 제목이 변경될 때 호출되는 핸들러
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        setTitleError(false); // 제목 입력 시 오류 상태 초기화
    };

    // Quill.js 에디터의 내용이 변경될 때 호출되는 핸들러
    const handleContentChange = (value) => {
        setContent(value); // Quill.js에서 입력된 HTML을 상태로 저장
        setContentError(false); // 내용 입력 시 오류 상태 초기화
    };

    // "등록하기" 버튼 클릭 시 실행되는 함수
    const handleSubmit = async () => {
        // 제목이 없을 때 경고
        if (!title) {
            setTitleError(true);
            alert('제목을 입력해주세요.');
            return;
        }

        // 내용이 없거나 기본 빈 텍스트일 때 경고
        if (!content || content === '<p><br></p>') {
            setContentError(true);
            alert('내용을 입력해주세요.');
            return;
        }

        // 서버로 전송할 데이터
        const adminNoticeData = {
            noticeTitle: title,
            noticeContent: content, // Quill.js가 생성한 HTML을 저장
            id: userStore.id // 사용자 ID (admin)
        };

        try {
            // 공지사항 등록 API 요청
            await axios.post('http://localhost:8080/api/notice', adminNoticeData);
            alert('관리자 공지사항이 성공적으로 등록되었습니다.');
            router.push('/adminPage/adminNoticePage'); // 공지사항 페이지로 이동
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
                    error={titleError} // 제목 오류 상태에 따른 에러 스타일
                    helperText={titleError && "제목을 입력해주세요"} // 오류 메시지 출력
                />
            </Grid>
            <Grid item xs={12}>
                {/* Quill.js 에디터 */}
                <ReactQuill
                    value={content}
                    onChange={handleContentChange}
                    placeholder="내용을 입력하세요" // 내용 입력 필드의 기본 문구
                    modules={{
                        toolbar: [
                            [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
                            [{ size: ['small', false, 'large', 'huge'] }], // 다양한 글씨 크기
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                            ['link', 'image', 'video'],
                            ['clean'] // 서식 초기화 버튼
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
                {/* Quill.js 에디터의 글자 수를 표시 */}
                <Typography
                    variant="body2"
                    align="right"
                    color="textSecondary"
                    className={styles.noticeRegisterCharCount}
                >
                    {content.length}/2000
                </Typography>
                {/* 등록하기 버튼 */}
                <Grid item xs={12} align="right">
                    <Button
                        className={styles.adminNoticeRegisterSubmitButton}
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit} // 클릭 시 handleSubmit 호출
                    >
                        등록하기
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
});

export default AdminNoticeRegister;
