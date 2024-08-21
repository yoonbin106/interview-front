//adminAdminNoticeDetails.jsx

import React, { useState } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, TextField, Typography
} from '@mui/material';
import styles from '@/styles/adminPage/adminAdminNoticeDetails.module.css'; // 모듈 스타일을 import

const AdminAdminNoticeDetails = ({ noticeData, onSave, onDelete, onEdit }) => {
    const [open, setOpen] = useState(false); // 삭제 확인 다이얼로그의 열림 상태를 관리
    const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태를 관리
    const [editedNotice, setEditedNotice] = useState(noticeData); // 공지사항 데이터를 관리

    // 삭제 버튼 클릭 핸들러: 삭제 확인 다이얼로그를 엶
    const handleDelete = () => {
        setOpen(true);
    };

    // 삭제 확인 핸들러: 공지사항 삭제를 확인하고 다이얼로그를 닫음
    const handleConfirmDelete = () => {
        setOpen(false);
        onDelete();
    };

    // 삭제 취소 핸들러: 다이얼로그를 닫고 삭제를 취소함
    const handleCancelDelete = () => {
        setOpen(false);
    };

    // 수정 버튼 클릭 핸들러: 편집 모드로 전환
    const handleEdit = () => {
        setIsEditing(true);
    };

    // 수정 완료 버튼 클릭 핸들러: 편집 모드를 종료하고 변경 사항을 저장
    const handleSave = () => {
        setIsEditing(false);
        onSave(editedNotice);
    };

    // 입력 필드 값 변경 핸들러: 입력된 내용을 공지사항 데이터에 반영
    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditedNotice(prevNotice => ({
            ...prevNotice,
            [name]: value
        }));
    };

    // 공지사항 헤더 렌더링: 제목과 날짜를 표시
    const renderHeader = () => (
        <div className={styles.adminAdminNoticeDetailsHeader}>
            {isEditing ? (
                <TextField
                    fullWidth
                    variant="outlined"
                    label="제목"
                    name="title"
                    value={editedNotice.title}
                    onChange={handleChange}
                />
            ) : (
                <h2>{editedNotice.title}</h2>
            )}
            <p className={styles.adminAdminNoticeDetailsDate}>{editedNotice.date}</p>
        </div>
    );

    // 공지사항 내용 렌더링: 편집 모드에 따라 내용을 표시하거나 편집 가능하게 함
    const renderContent = () => (
        <div className={styles.adminAdminNoticeDetailsContent}>
            {isEditing ? (
                <TextField
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={10}
                    label="내용"
                    name="content"
                    value={editedNotice.content}
                    onChange={handleChange}
                />
            ) : (
                editedNotice.content
            )}
        </div>
    );

    // 공지사항 버튼 렌더링: 수정, 삭제 버튼을 표시하고, 편집 모드에서는 저장 버튼을 표시
    const renderButtons = () => (
        <div className={styles.adminAdminNoticeDetailsButtonsContainer}>
            {isEditing ? (
                <Button variant="contained" color="primary" className={styles.adminAdminNoticeSaveButton} onClick={handleSave}>
                    저장하기
                </Button>
            ) : (
                <Button variant="contained" className={styles.adminAdminNoticeEditButton} onClick={handleEdit}>
                    수정하기
                </Button>
            )}
            <Button variant="contained" className={styles.adminAdminNoticeDeleteButton} onClick={handleDelete}>
                삭제하기
            </Button>
        </div>
    );

    return (
        <div className={styles.adminAdminNoticeContent}>
            <div className={styles.adminAdminNoticeDetailsContainer}>
                <Paper elevation={3} className={styles.adminAdminNoticeDetailsPaper}>
                    <Typography variant="h6" gutterBottom className={styles.adminAdminNoticeDetailsDate}>
                        [전체 공지사항]
                    </Typography>
                    
                    {renderHeader()}
                    {renderContent()}
                    {renderButtons()}

                    {/* 삭제 확인 다이얼로그 */}
                    <Dialog open={open} onClose={handleCancelDelete}>
                        <DialogTitle className={styles.adminAdminNoticeDialogTitle}>공지사항 삭제</DialogTitle>
                        <DialogContent>
                            <DialogContentText className={styles.adminAdminNoticeDialogContentText}>
                                공지사항을 삭제하시겠습니까?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancelDelete} color="primary">
                                취소
                            </Button>
                            <Button onClick={handleConfirmDelete} color="secondary">
                                확인
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* 이전글 / 다음글 기능 */}
                    <div className={styles.adminAdminNoticeNavButtons}>
                        <Button>&lt; 이전글</Button>
                        <Button>다음글 &gt;</Button>
                    </div>
                </Paper>
            </div>
        </div>
    );
};

export default AdminAdminNoticeDetails;