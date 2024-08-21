//adminFaq.jsx

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, FormControl, Select, MenuItem, Box, Button, InputLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '@/styles/adminPage/adminFaq.module.css';

const AdminFaq = ({ faqs, onPageChange, onRowsPerPageChange, rowsPerPage, page, totalPages, handleCategoryChange, selectedCategory }) => {
    return (
        <div className={styles.faqContainer}>
            {/* 페이지 헤더: 제목과 새 FAQ 등록 버튼 */}
            <Box mb={3} className={styles.faqHeader}>
                <Typography variant="h3" gutterBottom>
                    자주 묻는 질문 (FAQ)
                </Typography>
                <Button variant="contained" color="primary" href="/adminPage/adminFaqRegisterPage">
                    새 FAQ 등록
                </Button>
            </Box>

            {/* 카테고리 검색 필터 */}
            <Box mb={3} className={styles.faqCategorySearch}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel>카테고리로 검색</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        label="카테고리로 검색"
                    >
                        <MenuItem value="">
                            <em>전체</em>
                        </MenuItem>
                        <MenuItem value="계정 및 로그인" className={styles.faqMenuItem}>계정 및 로그인</MenuItem>
                        <MenuItem value="AI 면접 준비" className={styles.faqMenuItem}>AI 면접 준비</MenuItem>
                        <MenuItem value="기술 문제 해결" className={styles.faqMenuItem}>기술 문제 해결</MenuItem>
                        <MenuItem value="결제 및 환불" className={styles.faqMenuItem}>결제 및 환불</MenuItem>
                        <MenuItem value="기타" className={styles.faqMenuItem}>기타</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* FAQ 목록을 아코디언 형태로 렌더링 */}
            {faqs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // 페이지에 맞게 FAQ를 슬라이싱
                .map(faq => (
                    <Accordion key={faq.id}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${faq.id}-content`}
                            id={`panel${faq.id}-header`}
                        >
                            <Typography variant="h6">{faq.category}: {faq.question}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {faq.answer}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))
            }

            {/* 페이지네이션 컨트롤 */}
            <Box className={styles.faqPagination}>
                <Button
                    variant="outlined"
                    onClick={() => onPageChange(0)}
                    disabled={page === 0}
                    className={styles.faqPaginationButton}
                >
                    처음
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 0}
                    className={styles.faqPaginationButton}
                >
                    이전
                </Button>
                <span>{page + 1} / {totalPages}</span>
                <Button
                    variant="outlined"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    className={styles.faqPaginationButton}
                >
                    다음
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={page >= totalPages - 1}
                    className={styles.faqPaginationButton}
                >
                    마지막
                </Button>
                {/* 페이지당 표시할 행 수 선택 */}
                <Select
                    value={rowsPerPage}
                    onChange={onRowsPerPageChange}
                    className={styles.faqRowsPerPageSelect}
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                </Select>
            </Box>
        </div>
    );
};

export default AdminFaq;