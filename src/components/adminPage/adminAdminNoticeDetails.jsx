import React, { useState, useEffect } from 'react';
import { Button, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import dynamic from 'next/dynamic';
import styles from '@/styles/adminPage/adminAdminNoticeDetails.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'react-quill/dist/quill.snow.css'; // Quill의 기본 스타일 적용

// Quill.js 동적 import 설정
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AdminAdminNoticeDetails = ({ noticeData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedNotice, setEditedNotice] = useState(noticeData || {});
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const router = useRouter();
    const { adminNoticeId } = router.query;

    useEffect(() => {
        if (!noticeData && adminNoticeId) {
            const fetchNotice = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/adminnotice/${adminNoticeId}`);
                    setEditedNotice(response.data);
                } catch (error) {
                    console.error('Error fetching notice:', error);
                }
            };
            fetchNotice();
        }
    }, [adminNoticeId, noticeData]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const updatedNotice = {
                adminNoticeTitle: editedNotice.adminNoticeTitle,
                adminNoticeContent: editedNotice.adminNoticeContent,
            };
            await axios.put(`http://localhost:8080/api/adminnotice/${editedNotice.adminNoticeId}`, updatedNotice);
            alert('공지사항이 성공적으로 수정되었습니다.');
            setIsEditing(false);
            router.push(`/adminPage/adminAdminNoticeDetailsPage/${editedNotice.adminNoticeId}`);
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
            await axios.delete(`http://localhost:8080/api/adminnotice/${editedNotice.adminNoticeId}`);
            alert('공지사항이 성공적으로 삭제되었습니다.');
            setOpenDeleteDialog(false);
            router.push('/adminPage/adminAdminNoticePage');
        } catch (error) {
            console.error('공지사항 삭제 중 오류 발생:', error);
            alert('공지사항 삭제에 실패했습니다.');
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    const handleGoBack = () => {
        router.push('/adminPage/adminAdminNoticePage');
    };

    const handleChange = (value) => {
        setEditedNotice(prevNotice => ({
            ...prevNotice,
            adminNoticeContent: value
        }));
    };

    if (!editedNotice.adminNoticeTitle) {
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
                    value={editedNotice.adminNoticeTitle || ''}
                    onChange={(e) =>
                        setEditedNotice(prevNotice => ({
                            ...prevNotice,
                            adminNoticeTitle: e.target.value
                        }))
                    }
                    inputProps={{ style: { fontWeight: 'bold', fontSize: '1.5rem' } }}
                />
            ) : (
                <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{editedNotice.adminNoticeTitle}</h2>
            )}
            <p className={styles.adminAdminNoticeDetailsDate}>
                {new Date(editedNotice.adminNoticeCreatedTime).toLocaleString('ko-KR', {
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
                    value={editedNotice.adminNoticeContent}
                    onChange={handleChange}
                    placeholder="내용을 입력하세요"
                    modules={{
                        toolbar: [
                            [{ 'header': '1'}, {'header': '2'}],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                            ['link', 'image', 'video'],
                            ['clean']
                        ],
                    }}
                    formats={[
                        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet', 'indent',
                        'link', 'image', 'video'
                    ]}
                />
            ) : (
                <div dangerouslySetInnerHTML={{ __html: editedNotice.adminNoticeContent }} />
            )}
        </div>
    );

    const renderAuthor = () => (
        <div className={styles.adminAdminNoticeAuthor}>
            <Typography variant="subtitle1">작성자: {editedNotice.user?.username}</Typography>
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
                        [관리자 공지사항]
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

export default AdminAdminNoticeDetails;
