//adminAdminNoticeDetails.jsx

import React,{useState} from 'react';
import{Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,Paper,TextField,Typography,} from '@mui/material';
import {useRouter} from 'next/router';
import styles from '@/styles/adminPage/adminAdminNoticeDetails.module.css';
import sidebar from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

const AdminNoticeDetails=()=> {
    const router = useRouter();
    const [open,setOpen] = useState(false);
    const [isEditing,setIsEditing] = useState(false);
    const [editedNotice, setEditedNotice] = useState({
        title: '시스템 유지보수 안내 (9/30)',
        content: `안녕하세요. 9월 30일(월) 오전 2시부터 4시까지 시스템 유지보수가 진행될 예정입니다.\n`+
        `이 기간 동안 서비스가 일시적으로 중단될 수 있으니, 업무에 참고하시기 바랍니다.\n`+ 
        `유지보수가 완료되는 즉시 정상적으로 서비스가 재개됩니다.`,
        date: '2024-07-15',
    });

    //삭제 버튼 클릭 핸들러
    const handleDelete = () => {
        setOpen(true);
    }

    //삭제 확인 핸들러
    const handleConfirmDelete =() => {
        setOpen(false);
        alert('공지사항이 삭제되었습니다');
        router.push('/adminPage/adminAdminNoticePage');
    };

    //삭제 취소 핸들러
    const handleCancelDelete =() => {
        setOpen(false);
    };

    //수정 버튼 클릭 핸들러
    const handleEdit =()=>{
        setIsEditing(true);
    };

    //수정 완료 버튼 클릭 핸들러
    const handleSave =()=> {
        setIsEditing(false);
        alert('공지사항이 수정되었습니다.');
    };

    //입력 필드 값 변경 핸들러
    const handleChange =(event) => {
        const{name,value} = event.target;
        setEditedNotice((prevNotice) => ({
            ...prevNotice,
            [name]:value,
        }));
    };

    return (
        <div className={sidebar.container}>
        <div className={sidebar.sidebar}>
            <NestedList/>
        </div>
        <div className={sidebar.content}>
        <div className={styles.adminNoticeDetailsContainer}>
           <Paper elevation={3} className={styles.adminNoticeDetailsPaper}>
                <Typography variant="h6" gutterBottom className={styles.adminNoticeDetailsGrayText}>
                    [전체 공지사항]
                </Typography>
                <div className={styles.adminNoticeDetailsHeader}>
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
                    <p>{editedNotice.date}</p>
                </div>
                <div className={styles.adminNoticeDetailsContent}>
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
                <div className={styles.adminNoticeDetailsButtonsContainer}>
                    {isEditing ? (
                        <Button
                            variant="contained"
                            color="primary"
                            className={styles.adminNoticeDetailsSaveButton}
                            onClick={handleSave}
                        >
                            저장하기
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            className={styles.adminNoticeDetailsEditButton}
                            onClick={handleEdit}
                        >
                            수정하기
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        className={styles.adminNoticeDetailsDeleteButton}
                        onClick={handleDelete}
                    >
                        삭제하기
                    </Button>
                </div>

                {/* 삭제 확인 다이얼로그 */}
                <Dialog open={open} onClose={handleCancelDelete}>
                    <DialogTitle>공지사항 삭제</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
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
                <div className={styles.adminNoticeDetailsNavButtons}>
                    <Button>&lt; 이전글</Button>
                    <Button>다음글 &gt;</Button>
                </div>
            </Paper>
        </div>
        </div>
        </div>
    );
};

export default AdminNoticeDetails;