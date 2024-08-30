import React, { useEffect, useState } from 'react';
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

const EditPost = () => {
  const router = useRouter();
  const { id } = router.query; // useRouter를 통해 동적 파라미터 사용
  const [title, setTitle] = useState(''); // 제목 상태
  const [content, setContent] = useState(''); // 내용 상태
  const [fontSize, setFontSize] = useState(15);
  const [fontStyle, setFontStyle] = useState('normal');
  const [fontWeight, setFontWeight] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('none');
  const [textAlign, setTextAlign] = useState('left');
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    if(id){
    const fetchPost = async () => {
        try {
            const response = await fetch(`http://localhost:8080/bbs/${id}`);
            const data = await response.json();
            setTitle(data.title);
            setContent(data.content);
            // 필요시 fontSize, fontStyle, fontWeight, textDecoration, textAlign도 설정
        } catch (error) {
            console.error('Failed to fetch post:', error);
        }
    };

    fetchPost();
  }
}, [id]);

  const handleFontSizeChange = (e) => setFontSize(e.target.value);
  const toggleFontStyle = () => setFontStyle(fontStyle === 'normal' ? 'italic' : 'normal');
  const toggleFontWeight = () => setFontWeight(fontWeight === 'normal' ? 'bold' : 'normal');
  const toggleTextDecoration = () => setTextDecoration(textDecoration === 'none' ? 'underline' : 'none');
  const handleTextAlign = (align) => setTextAlign(align);
  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const updatedPost = {
      title,
      content,
      fontSize,
      fontStyle,
      fontWeight,
      textDecoration,
      textAlign,
    };
    try {
      await fetch(`http://localhost:8080/bbs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });
      router.push(`/bbs/postView?id=${id}`); // 수정 후 해당 포스트 상세 페이지로 이동
    } catch (error) {
      console.error('수정 실패:', error);
    }
  };


  return (
    <div className={sidebar.container}>
        
        <div className={sidebar.content}>
            <div className={styles['CreatePostbbsRegisterContainer']}>
                <h2 className={styles['CreatePostbbsRegisterTitle']}>게시글 수정</h2>
                <form onSubmit={handleSave}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>글 수정하기</Typography>
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
                                value={content}
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
                            <Button type="submit" className={styles['submit-button']}>수정</Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </div>
    </div>
  );

};

export default EditPost;