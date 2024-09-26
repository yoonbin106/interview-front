import React, { useState, useEffect } from 'react';
import { Button, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import dynamic from 'next/dynamic';
import styles from '@/styles/adminPage/adminAdminNoticeDetails.module.css'; // 첫 번째 코드의 스타일로 변경
import axios from 'axios';
import { useRouter } from 'next/router';
import 'react-quill/dist/quill.snow.css'; // Quill 기본 스타일 적용

// Quill.js 동적 import 설정
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AdminNoticeDetails = ({ noticeData }) => {
    const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
    const [editedNotice, setEditedNotice] = useState(noticeData || {}); // 수정 중인 공지사항 데이터 상태
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // 삭제 확인 다이얼로그 상태
    const router = useRouter();
    const { noticeId } = router.query;

    // 공지사항 데이터를 서버에서 가져오기
    useEffect(() => {
        if (!noticeData && noticeId) {
            const fetchNotice = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/notice/${noticeId}`);
                    setEditedNotice(response.data); // 가져온 공지사항 데이터를 상태로 저장
                } catch (error) {
                    console.error('Error fetching notice:', error);
                }
            };
            fetchNotice();
        }
    }, [noticeId, noticeData]);

    // 수정 모드로 전환
    const handleEdit = () => {
        setIsEditing(true);
    };

    // 수정된 공지사항 저장
    const handleSave = async () => {
        try {
            const updatedNotice = {
                noticeTitle: editedNotice.noticeTitle,
                noticeContent: editedNotice.noticeContent,
            };
            await axios.put(`http://localhost:8080/api/notice/${editedNotice.noticeId}`, updatedNotice);
            alert('공지사항이 성공적으로 수정되었습니다.');
            setIsEditing(false); // 수정 모드 해제
            router.push(`/adminPage/adminNoticeDetailsPage/${editedNotice.noticeId}`);
        } catch (error) {
            console.error('공지사항 수정 중 오류 발생:', error);
            alert('공지사항 수정에 실패했습니다.');
        }
    };

    // 삭제 버튼 클릭 시 삭제 확인 다이얼로그 표시
    const handleDelete = () => {
        setOpenDeleteDialog(true);
    };

    // 공지사항 삭제 처리
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/notice/${editedNotice.noticeId}`);
            alert('공지사항이 성공적으로 삭제되었습니다.');
            setOpenDeleteDialog(false);
            router.push('/adminPage/adminNoticePage'); // 삭제 후 공지사항 목록으로 이동
        } catch (error) {
            console.error('공지사항 삭제 중 오류 발생:', error);
            alert('공지사항 삭제에 실패했습니다.');
        }
    };

    // 삭제 취소 처리
    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
    };

    // 공지사항 목록으로 돌아가기
    const handleGoBack = () => {
        router.push('/adminPage/adminNoticePage');
    };

    // Quill 에디터 내용 변경 처리
    const handleChange = (value) => {
        setEditedNotice(prevNotice => ({
            ...prevNotice,
            noticeContent: value,
        }));
    };

    // 공지사항 데이터가 없을 경우 로딩 상태 표시
    if (!editedNotice.noticeTitle) {
        return <div>Loading...</div>;
    }

    // 공지사항 제목 렌더링
    const renderHeader = () => (
        <div className={styles.adminAdminNoticeDetailsHeader}>
            {isEditing ? (
                <TextField
                    fullWidth
                    variant="outlined"
                    label="제목"
                    name="noticeTitle"
                    value={editedNotice.noticeTitle || ''}
                    onChange={(e) =>
                        setEditedNotice(prevNotice => ({
                            ...prevNotice,
                            noticeTitle: e.target.value,
                        }))
                    }
                    inputProps={{ style: { fontWeight: 'bold', fontSize: '1.5rem' } }}
                />
            ) : (
                <h2 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{editedNotice.noticeTitle}</h2>
            )}
            <p className={styles.adminAdminNoticeDetailsDate}>
                {new Date(editedNotice.noticeCreatedTime).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </p>
        </div>
    );

    // 공지사항 내용 렌더링
    const renderContent = () => (
        <div className={styles.adminAdminNoticeDetailsContent}>
            {isEditing ? (
                <ReactQuill
                    value={editedNotice.noticeContent}
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
                <div dangerouslySetInnerHTML={{ __html: editedNotice.noticeContent }} />
            )}
        </div>
    );

    // 버튼 렌더링
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
                        [전체 공지사항]
                    </Typography>
                    {renderHeader()}
                    {renderContent()}
                    {renderButtons()}
                </Paper>

                {/* 공지사항 삭제 확인 다이얼로그 */}
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

export default AdminNoticeDetails;
