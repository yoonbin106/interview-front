//adminCompanyNoticeDetails.jsx

import React, { useState } from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, TextField, Typography
} from '@mui/material';
import styles from '@/styles/adminPage/adminCompanyNoticeDetails.module.css'; // 모듈 스타일을 import

const AdminCompanyNoticeDetails = ({ noticeData, onSave, onDelete, onEdit }) => {
    const [open, setOpen] = useState(false); // 삭제 확인 다이얼로그의 열림 상태를 관리하는 상태 변수
    const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태를 관리하는 상태 변수
    const [editedNotice, setEditedNotice] = useState(noticeData); // 편집 중인 공지사항 데이터를 관리하는 상태 변수

    // 삭제 버튼 클릭 핸들러
    const handleDelete = () => {
        setOpen(true); // 삭제 확인 다이얼로그를 열음
    };

    // 삭제 확인 핸들러
    const handleConfirmDelete = () => {
        setOpen(false); // 삭제 확인 다이얼로그를 닫음
        onDelete(); // 부모 컴포넌트에서 제공된 onDelete 함수 호출
    };

    // 삭제 취소 핸들러
    const handleCancelDelete = () => {
        setOpen(false); // 삭제 확인 다이얼로그를 닫음
    };

    // 수정 버튼 클릭 핸들러
    const handleEdit = () => {
        setIsEditing(true); // 수정 모드로 전환
    };

    // 수정 완료 버튼 클릭 핸들러
    const handleSave = () => {
        setIsEditing(false); // 수정 모드를 종료
        onSave(editedNotice); // 부모 컴포넌트에서 제공된 onSave 함수 호출
    };

    // 입력 필드 값 변경 핸들러
    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditedNotice(prevNotice => ({
            ...prevNotice,
            [name]: value // 변경된 값을 상태에 업데이트
        }));
    };

    // 공지사항 헤더 렌더링
    const renderHeader = () => (
        <div className={styles.adminCompanyNoticeDetailsHeader}>
            {isEditing ? (
                <TextField
                    fullWidth
                    variant="outlined"
                    label="제목"
                    name="title"
                    value={editedNotice.title}
                    onChange={handleChange} // 제목 필드의 변경을 감지하여 상태 업데이트
                />
            ) : (
                <h2>{editedNotice.title}</h2> // 제목을 표시
            )}
            <p className={styles.adminCompanyNoticeDetailsDate}>{editedNotice.date}</p> {/* 날짜를 표시 */}
        </div>
    );

    // 공지사항 내용 렌더링
    const renderContent = () => (
        <div className={styles.adminCompanyNoticeDetailsContent}>
            {isEditing ? (
                <TextField
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={10}
                    label="내용"
                    name="content"
                    value={editedNotice.content}
                    onChange={handleChange} // 내용 필드의 변경을 감지하여 상태 업데이트
                />
            ) : (
                editedNotice.content // 내용을 표시
            )}
        </div>
    );

    // 공지사항 버튼 렌더링
    const renderButtons = () => (
        <div className={styles.adminCompanyNoticeDetailsButtonsContainer}>
            {isEditing ? (
                <Button variant="contained" color="primary" className={styles.adminCompanyNoticeSaveButton} onClick={handleSave}>
                    저장하기
                </Button>
            ) : (
                <Button variant="contained" className={styles.adminCompanyNoticeEditButton} onClick={handleEdit}>
                    수정하기
                </Button>
            )}
            <Button variant="contained" className={styles.adminCompanyNoticeDeleteButton} onClick={handleDelete}>
                삭제하기
            </Button>
        </div>
    );

    return (
        <div className={styles.adminCompanyNoticeDetailsContainer}>
            <Paper elevation={3} className={styles.adminCompanyNoticeDetailsPaper}>
                {/* 공지사항 유형을 표시하는 타이틀 */}
                <Typography variant="h6" gutterBottom className={styles.adminCompanyNoticeDetailsDate}>
                    [기업별 공지사항]
                </Typography>
                {renderHeader()} {/* 공지사항 헤더 렌더링 */}
                {renderContent()} {/* 공지사항 내용 렌더링 */}
                {renderButtons()} {/* 수정 및 삭제 버튼 렌더링 */}

                {/* 삭제 확인 다이얼로그 */}
                <Dialog open={open} onClose={handleCancelDelete}>
                    <DialogTitle className={styles.adminCompanyNoticeDialogTitle}>공지사항 삭제</DialogTitle>
                    <DialogContent>
                        <DialogContentText className={styles.adminCompanyNoticeDialogContentText}>
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
                <div className={styles.adminCompanyNoticeNavButtons}>
                    <Button>&lt; 이전글</Button>
                    <Button>다음글 &gt;</Button>
                </div>
            </Paper>
        </div>
    );
};

export default AdminCompanyNoticeDetails;