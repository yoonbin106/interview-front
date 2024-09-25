import React, { useState} from 'react';
import { Grid, TextField, Select, MenuItem, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import styles from '@/styles/adminPage/adminFaqRegister.module.css';
import axios from 'axios';

const AdminFaqRegister = () => {

    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(''); //카테고리 상태 추가
    const [isFocused, setIsFocused] = useState(false);

    const handleContentBlur = (e) => {
        setIsFocused(false);
        setContent(e.currentTarget.textContent);
    };

    const handleContentFocus = () => {
        setIsFocused(true);
    };
    //미리 지정된 카테고리 목록
    const categories = [
        '계정 및 로그인',
        'AI면접 준비',
        '기술 문제 해결',
        '결제 및 환불',
        '기타'
    ];

   
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
        <Card className={styles.faqRegisterCard} elevation={0}>
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
                    
                    
                    <Grid item xs={12}>
                        <div
                            contentEditable
                            style={{
                                border: '1px solid #ccc',
                                padding: '10px',
                                minHeight: '150px',
                                color: content.length === 0 && !isFocused ? 'gray':
                                'black',}}
                                onBlur={handleContentBlur}
                                onFocus={handleContentFocus}>
                                {content.length === 0 && !isFocused ? '내용을 입력하세요.':content}
                        </div>
                        <Typography variant="body2" className={styles.faqRegisterCharacterCount}>{content.length}/2000</Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions className={styles.faqRegisterButtonContainer}>
               <Button className={styles.faqRegisterButton}
               onClick={handleSubmit}>
                                등록하기
                            </Button>
                </CardActions>
        </Card>
    );
};

export default AdminFaqRegister;
