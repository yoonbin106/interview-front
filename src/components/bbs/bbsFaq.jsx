//adminFaq.jsx

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, FormControl, Select, MenuItem, Box, Button, InputLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '@/styles/bbs/bbsFaq.module.css';


const BbsFaq = ({ faqs, onPageChange, onRowsPerPageChange, rowsPerPage, page, totalPages, handleCategoryChange, selectedCategory }) => {
    return (
        <div className={styles.bbsFaqContainer}>
            {/* 페이지 헤더: 제목과 새 FAQ 등록 버튼 */}
            <Box mb={3} className={styles.bbsFaqHeader}>
                <Typography variant="h3" gutterBottom>
                    자주 묻는 질문 (FAQ)
                </Typography>
            </Box>

            {/* 카테고리 검색 필터 */}
            <Box mb={3} className={styles.bbsFaqCategorySearch}>
                <FormControl fullWidth variant="outlined">
                <InputLabel className={styles.bbsFaqCategoryLabel}>카테고리를 선택하여 검색해보세요.</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        label="카테고리로 검색"
                    >
                        <MenuItem value="">
                            <em>전체</em>
                        </MenuItem>
                        <MenuItem value="계정 및 로그인" className={styles.bbsFaqMenuItem}>계정 및 로그인</MenuItem>
                        <MenuItem value="AI 면접 준비" className={styles.bbsFaqMenuItem}>AI 면접 준비</MenuItem>
                        <MenuItem value="기술 문제 해결" className={styles.bbsFaqMenuItem}>기술 문제 해결</MenuItem>
                        <MenuItem value="결제 및 환불" className={styles.bbsFaqMenuItem}>결제 및 환불</MenuItem>
                        <MenuItem value="기타" className={styles.bbsFaqMenuItem}>기타</MenuItem>
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
            <Box className={styles.bbsFaqPaginationControl}>
                <Button
                    variant="outlined"
                    onClick={() => onPageChange(0)}
                    disabled={page === 0}
                    className={styles.bbsFaqPaginationButton}
                >
                    처음
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 0}
                    className={styles.bbsFaqPaginationButton}
                >
                    이전
                </Button>
                <span>{page + 1} / {totalPages}</span>
                <Button
                    variant="outlined"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    className={styles.bbsFaqPaginationButton}
                >
                    다음
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={page >= totalPages - 1}
                    className={styles.bbsFaqPaginationButton}
                >
                    마지막
                </Button>
                {/* 페이지당 표시할 행 수 선택 */}
                <Select
                    value={rowsPerPage}
                    onChange={onRowsPerPageChange}
                    className={styles.bbsFaqRowsPerPageSelect}
                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                </Select>
            </Box>
        </div>
    );
};

export default BbsFaq;