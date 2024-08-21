//adminReportedFinPostDetails.jsx

import React from 'react';
import styles from '@/styles/adminPage/adminReportedFinPostDetails.module.css';
import { Button, Paper, Typography } from '@mui/material';

// 게시글 제목과 날짜를 표시하는 컴포넌트
function ReportedFinPostDetailsHeader({ title, date }) {
    return (
        <div>
            {/* 게시글 제목 */}
            <Typography variant="h5" className={styles.reportedFinPostDetailsH2} gutterBottom>
                {title}
            </Typography>
            {/* 게시글 작성 날짜 */}
            <Typography variant="subtitle1" className={styles.reportedFinPostDetailsDate} gutterBottom>
                작성일: {date}
            </Typography>
            {/* 구분선 */}
            <hr className={styles.reportedFinPostDetailsHr} />
        </div>
    );
}

// 게시글의 카테고리, 작성자, 내용 및 신고 정보를 표시하는 컴포넌트
function ReportedFinPostDetailsContent({ category, author, content, reportReason, reporter, reportDate }) {
    return (
        <div className={styles.reportedFinPostDetailsContent}>
            {/* 게시글 카테고리 */}
            <Typography variant="subtitle1" gutterBottom>
                카테고리: {category}
            </Typography>
            {/* 게시글 작성자 */}
            <Typography variant="subtitle1" gutterBottom>
                작성자: {author}
            </Typography>
            {/* 게시글 내용 */}
            <Typography variant="body1" style={{ marginTop: '20px', whiteSpace: 'pre-line' }}>
                {content}
            </Typography>
            <hr className={styles.reportedFinPostDetailsHr} />
            {/* 신고 사유 */}
            <Typography variant="subtitle1" gutterBottom>
                신고사유: {reportReason}
            </Typography>
            {/* 신고 사유 텍스트 영역 (읽기 전용) */}
            <textarea
                className={styles.reportedFinPostDetailsReasonInput}
                defaultValue={reportReason}
                readOnly
            />
            {/* 신고자 정보 */}
            <Typography variant="subtitle1" gutterBottom>
                신고자: {reporter}
            </Typography>
            {/* 신고 날짜 */}
            <Typography variant="subtitle1" gutterBottom>
                신고날짜: {reportDate}
            </Typography>
        </div>
    );
}

// 게시글 삭제, 숨김, 목록 버튼을 포함한 액션 버튼 컴포넌트
function ReportedFinPostDetailsActions({ onDelete, onHide, onBack }) {
    return (
        <div className={styles.reportedFinPostDetailsButtonContainer}>
            {/* 게시글 삭제 버튼 */}
            <Button className={styles.reportedFinPostDetailsDeleteButton} onClick={onDelete} variant="contained">
                게시글 삭제
            </Button>
            {/* 게시글 숨김 버튼 */}
            <Button className={styles.reportedFinPostDetailsHideButton} onClick={onHide} variant="contained">
                게시글 숨김
            </Button>
            {/* 뒤로가기 버튼 */}
            <Button className={styles.reportedFinPostDetailsBackButton} onClick={onBack} variant="contained">
                뒤로가기
            </Button>
        </div>
    );
}

// AdminReportedFinPostDetails 컴포넌트: 신고 처리 완료된 게시글의 세부 정보를 표시
export default function AdminReportedFinPostDetails({ post, onDelete, onHide, onBack }) {
    // 게시글이 없을 경우 메시지 출력
    if (!post) {
        return <Typography variant="h6">해당 게시글을 찾을 수 없습니다.</Typography>;
    }

    return (
        <Paper className={styles.reportedFinPostDetailsWrapper} elevation={3}>
            {/* 게시글 제목 및 날짜 */}
            <ReportedFinPostDetailsHeader title={post.title} date={post.date} />
            {/* 게시글 세부 내용 */}
            <ReportedFinPostDetailsContent 
                category={post.category}
                author={post.author}
                content={post.content}
                reportReason={post.reportReason} // 신고 사유
                reporter={post.reporter} // 신고자
                reportDate={post.reportDate} // 신고 날짜
            />
            {/* 게시글 액션 버튼 */}
            <ReportedFinPostDetailsActions 
                onDelete={onDelete}
                onHide={onHide}
                onBack={onBack}
            />
        </Paper>
    );
}