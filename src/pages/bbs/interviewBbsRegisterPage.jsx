// BbsRegisterPage.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Grid, Button, TextField, Select, MenuItem, IconButton, Typography } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import sidebar from '@/styles/bbs/bbsPage.module.css';
import styles from '@/styles/bbs/bbsCreatePost.module.css';
import NestedList from '@/components/bbs/bbsSidebar';
import { useStores } from '@/contexts/storeContext';
import { observer } from 'mobx-react-lite';

const BbsRegister = observer(() => {
    const router = useRouter();
    const { authStore, userStore } = useStores();
    const [title, setTitle] = useState(''); // 제목 상태
    const [content, setContent] = useState(''); // 내용 상태
    const [files, setFiles] = useState([]); // 파일 상태
    const [fontSize, setFontSize] = useState(15);
    const [fontStyle, setFontStyle] = useState('normal');
    const [fontWeight, setFontWeight] = useState('normal');
    const [textDecoration, setTextDecoration] = useState('none');
    const [textAlign, setTextAlign] = useState('left');
    const id = userStore.id;
    const handleFontSizeChange = (e) => setFontSize(e.target.value);
    const toggleFontStyle = () => setFontStyle(fontStyle === 'normal' ? 'italic' : 'normal');
    const toggleFontWeight = () => setFontWeight(fontWeight === 'normal' ? 'bold' : 'normal');
    const toggleTextDecoration = () => setTextDecoration(textDecoration === 'none' ? 'underline' : 'none');
    const handleTextAlign = (align) => setTextAlign(align);
    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('버튼 클릭');
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('id', id);
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]); // 파일 추가
        }
        try {
            const response = await axios.post('http://localhost:8080/bbs', formData);
            
            console.log('게시글 등록 성공:', response.data);
            router.push('/bbs/interviewBbsPage');
        } catch (error) {
            console.error('게시글 등록 실패:', error);
        }
    };
    
    

    return (
        <div className={sidebar.container}>
            <div className={sidebar.sidebar}>
                <NestedList />
            </div>
            <div className={sidebar.content}>
                <div className={styles['CreatePostbbsRegisterContainer']}>
                    <h2 className={styles['CreatePostbbsRegisterTitle']}>면접자 게시판</h2>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h5" gutterBottom>글 작성하기</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="제목을 입력하세요"
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Grid>
                            <Grid item container spacing={1} xs={12} alignItems="center">
                                <Grid item>
                                    <Typography variant="body1">글꼴 크기:</Typography>
                                </Grid>
                                <Grid item>
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
                                <Grid item>
                                    <IconButton onClick={toggleFontWeight}>
                                        <FormatBoldIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={toggleFontStyle}>
                                        <FormatItalicIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={toggleTextDecoration}>
                                        <FormatUnderlinedIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={() => handleTextAlign('left')}>
                                        <FormatAlignLeftIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={() => handleTextAlign('center')}>
                                        <FormatAlignCenterIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={() => handleTextAlign('right')}>
                                        <FormatAlignRightIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item>
                                    <IconButton onClick={() => handleTextAlign('justify')}>
                                        <FormatAlignJustifyIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="내용을 입력하세요"
                                    onChange={(e) => setContent(e.target.value)}
                                    multiline
                                    rows={8}
                                    style={{
                                        fontSize: `${fontSize}px`,
                                        fontStyle: fontStyle,
                                        fontWeight: fontWeight,
                                        textDecoration: textDecoration,
                                        textAlign: textAlign,
                                    }}
                                />
                                <Typography variant="body2" align="right" color="textSecondary">0/2000</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            component="label"
                                            startIcon={<AttachFileIcon />}
                                        >
                                            파일첨부
                                            <input type="file" hidden multiple onChange={handleFileChange}/>
                                        </Button>
                                        <Typography variant="body2" color="textSecondary">0/10MB</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" className={styles['submit-button']}>등록</Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </div>
        </div>
    );
});

export default BbsRegister;
