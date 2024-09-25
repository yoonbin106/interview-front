import React, { useState, useEffect } from 'react';
import { Button, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TableCell } from '@mui/material';
import dynamic from 'next/dynamic';
import styles from '@/styles/bbs/bbsCompanyNoticeDetails.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'react-quill/dist/quill.snow.css'; // Quill의 기본 스타일 적용

// Quill.js 동적 import 설정
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const BbsCompanyNoticeDetails = ({ companyNoticeData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCompanyNotice, setEditedCompanyNotice] = useState(companyNoticeData || {});
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const router = useRouter();
    const { companyNoticeId } = router.query;

    useEffect(() => {
        if (!companyNoticeData && companyNoticeId) {
            const fetchNotice = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/companynotice/${companyNoticeId}`);
                    setEditedCompanyNotice(response.data);
                } catch (error) {
                    console.error('Error fetching notice:', error);
                }
            };
            fetchNotice();
        }
    }, [companyNoticeId, companyNoticeData]);

    const handleGoBack = () => {
        router.push('/bbs/bbsCompanyNoticePage');
    };

    const handleChange = (value) => {
        setEditedCompanyNotice(prevNotice => ({
            ...prevNotice,
            companyNoticeContent: value
        }));
    };

    if (!editedCompanyNotice.companyNoticeTitle) {
        return <div>Loading...</div>;
    }

    const renderHeader = () => (
        <div className={styles.bbsCompanyNoticeDetailsHeader}>
          {isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              label="제목"
              name="adminNoticeTitle"
              value={editedCompanyNotice.companyNoticeTitle || ''}
              onChange={(e) =>
                setEditedCompanyNotice(prevNotice => ({
                  ...prevNotice,
                  companyNoticeTitle: e.target.value
                }))
              }
              inputProps={{ style: { fontWeight: 'bold', fontSize: '1.5rem' } }}
            />
          ) : (
            <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
              {editedCompanyNotice.companyNoticeTitle}
            </h2>
          )}
      
          {/* 작성일자와 작성자를 수평 배치 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <p className={styles.companyNoticeDetailsDate}>
                    {new Date(editedCompanyNotice.companyNoticeCreatedTime).toLocaleString('ko-KR', {
                        year: 'numeric',     
                        month: '2-digit',    
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false //24시간 형식
                    })}
                </p>
            <Typography variant="subtitle1" style={{ marginLeft: '1px' }}>
              작성자: {editedCompanyNotice.user?.username}
            </Typography>
          </div>
        </div>
      );
      

    const renderContent = () => (
        <div className={styles.bbsCompanyNoticeDetailsContent}>
            {isEditing ? (
                <ReactQuill
                    value={editedCompanyNotice.companyNoticeContent}
                    onChange={handleChange}
                    placeholder="내용을 입력하세요" // Placeholder 추가
                    modules={{
                        toolbar: [
                            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}, 
                            {'indent': '-1'}, {'indent': '+1'}],
                            ['link', 'image', 'video'],
                            ['clean']
                        ],
                    }}
                    formats={[
                        'header', 'font',
                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet', 'indent',
                        'link', 'image', 'video'
                    ]}
                />
            ) : (
                <div dangerouslySetInnerHTML={{ __html: editedCompanyNotice.companyNoticeContent }} />
            )}
        </div>
    );

   

    const renderButtons = () => (
        <div className={styles.bbsCompanyNoticeDetailsButtonsContainer}>
                <>
                   
                    <Button variant="contained" className={styles.bbsCompanyNoticeListButton} onClick={handleGoBack}>
                        목록으로 돌아가기
                    </Button>
                </>
        </div>
    );

    return (
        <div className={styles.bbsCompanyNoticeContent}>
            <div className={styles.bbsCompanyNoticeDetailsContainer}>
                <Paper elevation={3} className={styles.bbsCompanyNoticeDetailsPaper}>
                    <Typography variant="h6" gutterBottom className={styles.bbsCompanyNoticeDetailsDate}>
                        [기업 공지사항]
                    </Typography>
                    {renderHeader()}
                    {renderContent()}
                    {renderButtons()}
                </Paper>

                
            </div>
        </div>
    );
};

export default BbsCompanyNoticeDetails;
