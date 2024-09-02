//adminCompanyNoticeRegister.jsx

import React, { useState } from 'react';
import { Grid, Button, TextField, Select, MenuItem, IconButton, Typography } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import styles from '@/styles/adminPage/adminCompanyNoticeRegister.module.css'; // 모듈 스타일을 import

const AdminCompanyNoticeRegister = () => {
    // 글꼴 속성들을 관리하는 상태 변수들
    const [fontSize, setFontSize] = useState(15); // 글꼴 크기 상태
    const [fontStyle, setFontStyle] = useState('normal'); // 글꼴 스타일 (일반 또는 기울임꼴) 상태
    const [fontWeight, setFontWeight] = useState('normal'); // 글꼴 굵기 상태
    const [textDecoration, setTextDecoration] = useState('none'); // 텍스트 꾸밈 (밑줄) 상태
    const [textAlign, setTextAlign] = useState('left'); // 텍스트 정렬 상태

    // 글꼴 크기 변경 핸들러
    const handleFontSizeChange = (e) => setFontSize(e.target.value);

    // 글꼴 스타일 토글 핸들러 (일반 <-> 기울임꼴)
    const toggleFontStyle = () => setFontStyle(fontStyle === 'normal' ? 'italic' : 'normal');

    // 글꼴 굵기 토글 핸들러 (일반 <-> 굵게)
    const toggleFontWeight = () => setFontWeight(fontWeight === 'normal' ? 'bold' : 'normal');

    // 텍스트 밑줄 토글 핸들러 (밑줄 <-> 없음)
    const toggleTextDecoration = () => setTextDecoration(textDecoration === 'none' ? 'underline' : 'none');

    // 텍스트 정렬 변경 핸들러 (왼쪽, 가운데, 오른쪽, 양쪽 정렬)
    const handleTextAlign = (align) => setTextAlign(align);

    return (
        <Grid container spacing={2} className={styles.adminCompanyNoticeRegisterContainer}>
            {/* 페이지 제목 */}
            <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>글 작성하기</Typography>
            </Grid>
            {/* 제목 입력 필드 */}
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="제목을 입력하세요"
                    className={styles.adminCompanyNoticeRegisterTitleInput}
                />
            </Grid>
            {/* 글꼴 스타일 조정 컨트롤 */}
            <Grid item container spacing={1} xs={12} alignItems="center" className={styles.adminCompanyNoticeRegisterFontControls}>
                <Grid item className={styles.adminCompanyNoticeRegisterFontControlItem}>
                    <Typography variant="body1">글꼴 크기:</Typography>
                </Grid>
                <Grid item className={styles.adminCompanyNoticeRegisterFontControlItem}>
                    <Select
                        value={fontSize}
                        onChange={handleFontSizeChange}
                        variant="outlined"
                        size="small"
                    >
                        {/* 10에서 39까지의 글꼴 크기 옵션 생성 */}
                        {[...Array(30).keys()].map(i => (
                            <MenuItem key={i} value={i + 10}>{i + 10}</MenuItem>
                        ))}
                    </Select>
                </Grid>
                {/* 글꼴 굵기 버튼 */}
                <Grid item className={styles.adminCompanyNoticeRegisterFontControlItem}>
                    <IconButton onClick={toggleFontWeight}>
                        <FormatBoldIcon />
                    </IconButton>
                </Grid>
                {/* 글꼴 기울임 버튼 */}
                <Grid item className={styles.adminCompanyNoticeRegisterFontControlItem}>
                    <IconButton onClick={toggleFontStyle}>
                        <FormatItalicIcon />
                    </IconButton>
                </Grid>
                {/* 밑줄 버튼 */}
                <Grid item className={styles.adminCompanyNoticeRegisterFontControlItem}>
                    <IconButton onClick={toggleTextDecoration}>
                        <FormatUnderlinedIcon />
                    </IconButton>
                </Grid>
                {/* 텍스트 정렬 버튼들 */}
                <Grid item className={styles.adminCompanyNoticeRegisterFontControlItem}>
                    <IconButton onClick={() => handleTextAlign('left')}>
                        <FormatAlignLeftIcon />
                    </IconButton>
                </Grid>
                <Grid item className={styles.adminCompanyNoticeRegisterFontControlItem}>
                    <IconButton onClick={() => handleTextAlign('center')}>
                        <FormatAlignCenterIcon />
                    </IconButton>
                </Grid>
                <Grid item className={styles.adminCompanyNoticeRegisterFontControlItem}>
                    <IconButton onClick={() => handleTextAlign('right')}>
                        <FormatAlignRightIcon />
                    </IconButton>
                </Grid>
                <Grid item className={styles.adminCompanyNoticeRegisterFontControlItem}>
                    <IconButton onClick={() => handleTextAlign('justify')}>
                        <FormatAlignJustifyIcon />
                    </IconButton>
                </Grid>
            </Grid>
            {/* 내용 입력 필드 */}
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="내용을 입력하세요"
                    multiline
                    rows={8}
                    className={styles.adminCompanyNoticeRegisterContentInput}
                    style={{
                        fontSize: `${fontSize}px`,
                        fontStyle: fontStyle,
                        fontWeight: fontWeight,
                        textDecoration: textDecoration,
                        textAlign: textAlign,
                    }}
                />
                <Typography variant="body2" align="right" color="textSecondary" className={styles.adminCompanyNoticeRegisterCharCount}>0/2000</Typography>
            </Grid>
            {/* 파일 첨부 버튼 */}
            <Grid item xs={12}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<AttachFileIcon />}
                            className={styles.adminCompanyNoticeRegisterFileAttachButton}
                        >
                            파일첨부
                            <input type="file" hidden />
                        </Button>
                        <Typography variant="body2" color="textSecondary" className={styles.adminCompanyNoticeRegisterFileAttachText}>0/10MB</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AdminCompanyNoticeRegister;