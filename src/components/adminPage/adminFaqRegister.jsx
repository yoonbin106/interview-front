import React, { useState} from 'react';
import { Grid, TextField, Select, MenuItem, IconButton, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import styles from '@/styles/adminPage/adminFaqRegister.module.css';
import axios from 'axios';

const AdminFaqRegister = () => {
    const [fontSize, setFontSize] = useState(15);
    const [fontStyle, setFontStyle] = useState('normal');
    const [fontWeight, setFontWeight] = useState('normal');
    const [textDecoration, setTextDecoration] = useState('none');
    const [textAlign, setTextAlign] = useState('left');
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(''); //카테고리 상태 추가
    
    //미리 지정된 카테고리 목록
    const categories = [
        '계정 및 로그인',
        'AI면접 준비',
        '기술 문제 해결',
        '결제 및 환불',
        '기타'
    ];

    const handleFontSizeChange = (e) => setFontSize(e.target.value);
    const toggleFontStyle = () => setFontStyle(fontStyle === 'normal' ? 'italic' : 'normal');
    const toggleFontWeight = () => setFontWeight(fontWeight === 'normal' ? 'bold' : 'normal');
    const toggleTextDecoration = () => setTextDecoration(textDecoration === 'none' ? 'underline' : 'none');
    const handleTextAlign = (align) => setTextAlign(align);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim() || !category) {
            alert('제목, 내용 및 카테고리를 모두 입력해주세요.');
            return;
        }
        const faqData = {
            faqQuestion: title,
            faqAnswer : content,
            faqCategory : category,
            faqCreatedTime: new Date(),
            faqEditedTime : new Date(),
        };
        console.log(faqData);

        try {
            await axios.post('http://localhost:8080/api/faq', faqData);
            alert('FAQ가 성공적으로 등록되었습니다.');
            window.location.href = 'http://localhost:3000/adminPage/adminFaqPage';
        }catch (error){
            console.error('Error submitting FAQ:',error);
            alert('FAQ 등록에 실패했습니다.');
        }
    };

    return (
        <Card className={styles.faqRegisterCard}>
            <CardContent>
                <Grid container spacing={2} className={styles.faqRegisterContainer}>
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom className={styles.faqRegisterTitle}>FAQ 작성하기</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Grid>
                    {/*카테고리 선택 드롭다운*/}
                    <Grid item xs={12}>
                        <Select
                            fullWidth
                            variant="outlined"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            displayEmpty>
                                <MenuItem value="" disabled>
                                    카테고리를 선택하세요
                                </MenuItem>
                                {categories.map((cat,index)=>(
                                    <MenuItem key={index} value={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select>
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
                                className={styles.faqRegisterFontSizeSelect}
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
                        <div
                            contentEditable
                            className={styles.faqRegisterTextField}
                            style={{
                                fontSize: `${fontSize}px`,
                                fontStyle: fontStyle,
                                fontWeight: fontWeight,
                                textDecoration: textDecoration,
                                textAlign: textAlign,
                                border: '1px solid #ccc',
                                padding: '10px',
                                minHeight: '150px',
                            }}
                            onBlur={(e) => setContent(e.currentTarget.textContent)}
                            placeholder="내용을 입력하세요"
                        ></div>
                        <Typography variant="body2" className={styles.faqRegisterCharacterCount}>{content.length}/2000</Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Grid item xs={12}>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handleSubmit}
                            >
                                등록하기
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
};

export default AdminFaqRegister;
