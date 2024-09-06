import React, { useState } from 'react';
import { Modal, Button, Radio, FormControl, FormControlLabel, RadioGroup, Typography, Checkbox, FormGroup } from '@mui/material';
import styles from '@/styles/bbs/reportModal.module.css'; // 모듈 CSS 사용
import axios from 'axios';


const ReportModal = ({open, onClose, postId, commentId, postAuthor, postContent }) => {
  const [reason, setReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState({
    defamation: false,
    illegalContent: false,
  });

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleAdditionalInfoChange = (event) => {
    setAdditionalInfo({
      ...additionalInfo,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async () => {
    if (reason) {
      try {
        const response = await axios.post('http://localhost:8080/bbs/report', {
          postId: postId ? postId : null,  // 게시물 ID가 없으면 null
          commentId: commentId ? commentId : null,  // 댓글 ID가 없으면 null
          reason: reason,
          additionalInfo: additionalInfo
        });
  
        alert('신고가 접수되었습니다.');
        onClose();
      } catch (error) {
        console.error('신고 실패:', error);
        alert('신고를 접수하는 중 오류가 발생했습니다.');
      }
    } else {
      alert('신고 사유를 선택해주세요.');
    }
  };
  

  

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.modalContent}>
        <Typography variant="h5" gutterBottom>신고하기</Typography>
        <Typography variant="subtitle1">작성자: {postAuthor}</Typography> {/* 동적으로 작성자 표시 */}
        <Typography variant="subtitle1">내용: {postContent}</Typography> {/* 동적으로 내용 표시 */}

        <FormControl component="fieldset" className={styles.formControl}>
          <Typography variant="subtitle2" gutterBottom>사유 선택</Typography>
          <RadioGroup value={reason} onChange={handleReasonChange}>
            <FormControlLabel value="스팸홍보" control={<Radio />} label="스팸홍보/도배입니다." />
            <FormControlLabel value="음란물" control={<Radio />} label="음란물입니다." />
            <FormControlLabel value="불법정보" control={<Radio />} label="불법정보를 포함하고 있습니다." />
            <FormControlLabel value="유해내용" control={<Radio />} label="청소년에게 유해한 내용입니다." />
            <FormControlLabel value="욕설" control={<Radio />} label="욕설/혐오/차별적 표현입니다." />
            <FormControlLabel value="개인정보노출" control={<Radio />} label="개인정보가 노출되었습니다." />
            <FormControlLabel value="불쾌한표현" control={<Radio />} label="불쾌한 표현이 있습니다." />
          </RadioGroup>
        </FormControl>

        {/* 추가 정보 입력 */}
        <Typography variant="subtitle2" gutterBottom>추가 사유 선택</Typography>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={additionalInfo.defamation} onChange={handleAdditionalInfoChange} name="defamation" />}
            label="명예훼손 또는 저작권이 침해되었습니다."
          />
          <FormControlLabel
            control={<Checkbox checked={additionalInfo.illegalContent} onChange={handleAdditionalInfoChange} name="illegalContent" />}
            label="불법촬영물이 포함되어 있습니다."
          />
        </FormGroup>

        <Button variant="contained" color="primary" onClick={handleSubmit} className={styles.submitButton}>신고하기</Button>
      </div>
    </Modal>
  );
};

export default ReportModal;
