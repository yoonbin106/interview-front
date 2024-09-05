import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Grid, Button, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import sidebar from '@/styles/bbs/bbsPage.module.css';
import styles from '@/styles/bbs/bbsCreatePost.module.css';

const EditPost = () => {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [existingFiles, setExistingFiles] = useState([]); // 기존 파일 목록
  const [filesToUpload, setFilesToUpload] = useState([]); // 새로 업로드할 파일 목록
  const [filesToRemove, setFilesToRemove] = useState([]); // 삭제할 파일 목록

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/bbs/${id}`);
          const data = response.data;
  
          console.log('API 응답 데이터:', data);  // 파일 리스트가 포함된 응답인지 확인
  
          setTitle(data.title);
          setContent(data.content);
  
           // 파일 목록이 객체 형태로 전달되므로, 파일 이름(키)을 추출
           const fileNames = data.files ? Object.keys(data.files) : [];
           setExistingFiles(fileNames); // 파일 이름만 저장
  
        } catch (error) {
          console.error('게시글 로드 실패:', error);
        }
      };
      fetchPost();
    }
  }, [id]);
  

  // 새 파일 선택 핸들러
  const handleFileChange = (event) => {
    setFilesToUpload(Array.from(event.target.files)); // 새로 업로드할 파일 설정
  };

  // 기존 파일 삭제 선택 핸들러
  const handleRemoveExistingFile = (fileName) => {
    if (filesToRemove.includes(fileName)) {
      setFilesToRemove(filesToRemove.filter((file) => file !== fileName)); // 선택 취소
    } else {
      setFilesToRemove([...filesToRemove, fileName]); // 삭제할 파일 목록에 추가
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
  
    // 현재 상태의 filesToRemove 배열 확인
    console.log("filesToRemove before sending:", filesToRemove);
  
    // 파일 업로드와 함께 전송할 FormData 생성
    const formData = new FormData();
    formData.append('title', title); // 제목 필드 추가
    formData.append('content', content); // 내용 필드 추가
  
    // 삭제할 파일 목록을 JSON 문자열로 변환하여 추가
    formData.append('filesToRemove', JSON.stringify(filesToRemove));
    
    // FormData에 추가된 삭제할 파일 목록 확인
    console.log("FormData with filesToRemove:", formData.get('filesToRemove'));
  
    // 새로 업로드할 파일들 추가
    filesToUpload.forEach((file) => {
      formData.append('files', file);
    });
  
    try {
      await axios.post(`http://localhost:8080/bbs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push(`/bbs/postView?id=${id}`); // 수정 후 해당 게시글 페이지로 이동
    } catch (error) {
      console.error('게시글 수정 실패:', error);
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="내용을 입력하세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  multiline
                  rows={8}
                />
                <Typography variant="body2" align="right" color="textSecondary">0/2000</Typography>
              </Grid>

              {/* 기존 파일 목록 표시 */}
              <Grid item xs={12}>
  <Typography variant="body1">기존 파일 (체크 시 삭제됨):</Typography>
  {existingFiles.length > 0 ? (
    existingFiles.map((fileName, index) => (
      <div key={index}>
        <FormControlLabel
          control={
            <Checkbox
              checked={filesToRemove.includes(fileName)}
              onChange={() => handleRemoveExistingFile(fileName)}
              color="primary"
            />
          }
          label={fileName}  // 파일 이름 표시
        />
      </div>
    ))
  ) : (
    <Typography variant="body2">기존 파일이 없습니다.</Typography>
  )}
</Grid>


              {/* 새로 추가할 파일 업로드 */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<AttachFileIcon />}
                >
                  파일첨부
                  <input type="file" hidden multiple onChange={handleFileChange} />
                </Button>
                {/* 업로드된 파일 이름 표시 */}
                {filesToUpload.map((file, index) => (
                  <Typography key={index} variant="body2">{file.name}</Typography>
                ))}
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
