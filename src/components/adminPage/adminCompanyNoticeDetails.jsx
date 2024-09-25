import React, { useState, useEffect } from 'react';
import { Button, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import dynamic from 'next/dynamic';
import styles from '@/styles/adminPage/adminAdminNoticeDetails.module.css'; // 스타일을 AdminNoticeDetails와 동일하게
import axios from 'axios';
import { useRouter } from 'next/router';
import 'react-quill/dist/quill.snow.css'; // Quill의 기본 스타일 적용

// Quill.js 동적 import 설정
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AdminCompanyNoticeDetails = ({ companyNoticeData }) => {
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

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const updatedCompanyNotice = {
                companyNoticeTitle: editedCompanyNotice.companyNoticeTitle,
                companyNoticeContent: editedCompanyNotice.companyNoticeContent,
            };
            await axios.put(`http://localhost:8080/api/companynotice/${editedCompanyNotice.companyNoticeId}`, updatedCompanyNotice);
            alert('공지사항이 성공적으로 수정되었습니다.');
            setIsEditing(false);
            router.push(`/adminPage/adminCompanyNoticeDetailsPage/${editedCompanyNotice.companyNoticeId}`);
        } catch (error) {
            console.error('공지사항 수정 중 오류 발생:', error);
            alert('공지사항 수정에 실패했습니다.');
        }
    };

    const handleDelete = () => {
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/companynotice/${editedCompanyNotice.companyNoticeId}`);
            alert('공지사항이 성공적으로 삭제되었습니다.');
            setOpenDeleteDialog(false);
            router.push('/adminPage/adminCompanyNoticePage');
        } catch (error) {
            console.error('공지사항 삭제 중 오류 발생:', error);
            alert('공지사항 삭제에 실패했습니다.');
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    const handleGoBack = () => {
        router.push('/adminPage/adminCompanyNoticePage');
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
        <div className={styles.adminAdminNoticeDetailsHeader}>
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
                <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{editedCompanyNotice.companyNoticeTitle}</h2>
            )}
            <p className={styles.adminAdminNoticeDetailsDate}>
                {new Date(editedCompanyNotice.companyNoticeCreatedTime).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </p>
        </div>
    );

    const renderContent = () => (
        <div className={styles.adminAdminNoticeDetailsContent}>
            {isEditing ? (
                <ReactQuill
                    value={editedCompanyNotice.companyNoticeContent}
                    onChange={handleChange}
                    placeholder="내용을 입력하세요"
                    modules={{
                        toolbar: [
                            [{ 'header': '1' }, { 'header': '2' }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                            ['link', 'image', 'video'],
                            ['clean'],
                        ],
                    }}
                    formats={[
                        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
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
        <div className={styles.adminAdminNoticeDetailsButtonsContainer}>
            {isEditing ? (
                <Button variant="contained" className={styles.adminAdminNoticeSaveButton} onClick={handleSave}>
                    저장하기
                </Button>
            ) : (
                <>
                    <Button variant="contained" className={styles.adminAdminNoticeEditButton} onClick={handleEdit}>
                        수정하기
                    </Button>
                    <Button variant="contained" className={styles.adminAdminNoticeDeleteButton} onClick={handleDelete}>
                        삭제하기
                    </Button>
                    <Button variant="contained" className={styles.adminAdminNoticeListButton} onClick={handleGoBack}>
                        목록으로 돌아가기
                    </Button>
                </>
            )}
        </div>
    );

    return (
        <div className={styles.adminAdminNoticeContent}>
            <div className={styles.adminAdminNoticeDetailsContainer}>
                <Paper elevation={3} className={styles.adminAdminNoticeDetailsPaper}>
                    <Typography variant="h6" gutterBottom className={styles.adminAdminNoticeDetailsDate}>
                        [기업 공지사항]
                    </Typography>
                    {renderHeader()}
                    {renderContent()}
                    {renderButtons()}
                </Paper>

                <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
                    <DialogTitle>공지사항 삭제</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelDelete} color="primary">
                            취소
                        </Button>
                        <Button onClick={handleConfirmDelete} color="secondary">
                            삭제
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default AdminCompanyNoticeDetails;
