import React, { useState } from 'react';
import { Grid, TextField, Select, MenuItem, IconButton, Typography, Button } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import styles from '@/styles/adminPage/adminAdminNoticeRegister.module.css'; // 모듈 스타일을 import
import { useStores } from 'contexts/storeContext';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { useRouter } from 'next/router';

const AdminAdminNoticeRegister = observer(() => {
    const {userStore} = useStores();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();
    // 글꼴 속성들을 관리하는 상태 변수들
    const [fontSize, setFontSize] = useState(15); // 글꼴 크기
    const [fontStyle, setFontStyle] = useState('normal'); // 글꼴 스타일 (일반 또는 기울임꼴)
    const [fontWeight, setFontWeight] = useState('normal'); // 글꼴 굵기 (일반 또는 굵게)
    const [textDecoration, setTextDecoration] = useState('none'); // 글꼴 꾸밈 (밑줄)
    const [textAlign, setTextAlign] = useState('left'); // 텍스트 정렬 (왼쪽, 가운데, 오른쪽, 양쪽 정렬)
    
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    //제출 핸들러
    const handleSubmit = async() => {
        if (!title || !content) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }
  
        const adminAdminNoticeData = {
            adminNoticeTitle: title,
            adminNoticeContent: content,
            id: userStore.id
        };

        try {
            await axios.post('http://localhost:8080/api/adminnotice', adminAdminNoticeData);
            alert('관리자 공지사항이 성공적으로 등록되었습니다.');
            router.push('/adminPage/adminAdminNoticePage');
        } catch (error) {
            console.error('문의 등록 중 오류 발생:', error);
            alert('문의 등록에 실패했습니다.');
        }
    };

    // 글꼴 크기 변경 핸들러
    const handleFontSizeChange = (e) => setFontSize(e.target.value);

    // 글꼴 스타일 변경 핸들러 (일반 <-> 기울임꼴)
    const toggleFontStyle = () => setFontStyle(fontStyle === 'normal' ? 'italic' : 'normal');

    // 글꼴 굵기 변경 핸들러 (일반 <-> 굵게)
    const toggleFontWeight = () => setFontWeight(fontWeight === 'normal' ? 'bold' : 'normal');

    // 밑줄 꾸밈 토글 핸들러 (밑줄 <-> 없음)
    const toggleTextDecoration = () => setTextDecoration(textDecoration === 'none' ? 'underline' : 'none');

    // 텍스트 정렬 변경 핸들러 (왼쪽, 가운데, 오른쪽, 양쪽 정렬)
    const handleTextAlign = (align) => setTextAlign(align);

    return (
        <Grid container spacing={2} className={styles.adminAdminNoticeRegisterContainer}>
            {/* 제목 입력 필드 */}
            <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>글 작성하기</Typography>
            </Grid>
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
            {/* 글꼴 스타일 조정 컨트롤 */}
            <Grid item container spacing={1} xs={12} alignItems="center" className={styles.adminNoticeRegisterFontControls}>
                <Grid item className={styles.adminAdminNoticeRegisterFontControlItem}>
                    <Typography variant="body1">글꼴 크기:</Typography>
                </Grid>
                <Grid item className={styles.adminAdminNoticeRegisterFontControlItem}>
                    <Select
                        value={fontSize}
                        onChange={handleFontSizeChange}
                        variant="outlined"
                        size="small"
                    >
                        {[...Array(30).keys()].map(i => (
                            <MenuItem key={i} value={i + 10}>{i + 10}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item className={styles.adminAdminNoticeRegisterFontControlItem}>
                    <IconButton onClick={toggleFontWeight}>
                        <FormatBoldIcon />
                    </IconButton>
                </Grid>
                <Grid item className={styles.adminAdminNoticeRegisterFontControlItem}>
                    <IconButton onClick={toggleFontStyle}>
                        <FormatItalicIcon />
                    </IconButton>
                </Grid>
                <Grid item className={styles.adminAdminNoticeRegisterFontControlItem}>
                    <IconButton onClick={toggleTextDecoration}>
                        <FormatUnderlinedIcon />
                    </IconButton>
                </Grid>
                <Grid item className={styles.adminAdminNoticeRegisterFontControlItem}>
                    <IconButton onClick={() => handleTextAlign('left')}>
                        <FormatAlignLeftIcon />
                    </IconButton>
                </Grid>
                <Grid item className={styles.adminAdminNoticeRegisterFontControlItem}>
                    <IconButton onClick={() => handleTextAlign('center')}>
                        <FormatAlignCenterIcon />
                    </IconButton>
                </Grid>
                <Grid item className={styles.adminAdminNoticeRegisterFontControlItem}>
                    <IconButton onClick={() => handleTextAlign('right')}>
                        <FormatAlignRightIcon />
                    </IconButton>
                </Grid>
                <Grid item className={styles.adminAdminNoticeRegisterFontControlItem}>
                    <IconButton onClick={() => handleTextAlign('justify')}>
                        <FormatAlignJustifyIcon />
                    </IconButton>
                </Grid>
            </Grid>
            {/* 내용 입력 필드 */}
            <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={8}
                    placeholder="내용을 입력하세요"
                    onChange={handleContentChange}
                    className={styles.adminAdminNoticeRegisterContentInput}
                    style={{
                        fontSize: `${fontSize}px`,
                        fontStyle: fontStyle,
                        fontWeight: fontWeight,
                        textDecoration: textDecoration,
                        textAlign: textAlign,
                    }}
                    value={content}
                />
                <Typography variant="body2" align="right" color="textSecondary" className={styles.adminNoticeRegisterCharCount}>
                    {content.length}/2000
                </Typography>
                <Grid item xs={12} align="right">
                    <Button className={styles.adminAdminNoticeRegisterSubmitButton}
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

export default AdminAdminNoticeRegister;
