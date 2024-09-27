import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Typography, FormControl, Select, MenuItem, Box, Button, InputLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from '@/styles/adminPage/adminFaq.module.css';

const BbsFaq = ({ onPageChange, onRowsPerPageChange, rowsPerPage, page }) => {
    const [faqs, setFaqs] = useState([]);
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    // useEffect를 사용해 컴포넌트가 마운트될 때 FAQ 데이터를 가져옴
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/faq/all');
                // 카테고리명 기준으로 정렬 (ㄱㄴㄷ순)
                const sortedFaqs = response.data.sort((a, b) => 
                    a.faqCategory.localeCompare(b.faqCategory, 'ko', { sensitivity: 'base' })
                );
                setFaqs(sortedFaqs);
                setFilteredFaqs(sortedFaqs);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            }
        };

        fetchFaqs();
    }, []);

    // totalPages 계산
    const totalPages = Math.ceil(filteredFaqs.length / rowsPerPage);

    // 카테고리 변경 시 필터링
    const handleCategoryChangeInternal = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);
        if (category) {
            setFilteredFaqs(faqs.filter(faq => faq.faqCategory === category));
        } else {
            setFilteredFaqs(faqs);
        }
        onPageChange(0); // 카테고리 변경 시 페이지를 0으로 초기화
    };

    return (
        <div className={styles.adminFaqContainer}>
            {/* 페이지 헤더: 제목과 새 FAQ 등록 버튼 */}
            <Box mb={3} className={styles.adminFaqHeader}>
                <Typography variant="h3" gutterBottom>
                    자주 묻는 질문 (FAQ)
                </Typography>
            </Box>

            {/* 카테고리 검색 필터 */}
            <Box mb={3} className={styles.adminFaqCategorySearch}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel className={styles.adminFaqCategoryLabel}>카테고리를 선택하여 검색해보세요.</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChangeInternal}
                        label="카테고리로 검색"
                    >
                        <MenuItem value="">
                            <em>전체</em>
                        </MenuItem>
                        {faqs.reduce((uniqueCategories, faq) => {
                            if (!uniqueCategories.includes(faq.faqCategory)) {
                                uniqueCategories.push(faq.faqCategory);
                            }
                            return uniqueCategories;
                        }, []).map(category => (
                            <MenuItem key={category} value={category} className={styles.adminFaqMenuItem}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* FAQ 목록을 아코디언 형태로 렌더링 */}
            {filteredFaqs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // 페이지에 맞게 FAQ를 슬라이싱
                .map(faq => (
                    <Accordion key={faq.faqId}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel${faq.faqId}-content`}
                            id={`panel${faq.faqId}-header`}
                        >
                            <Typography variant="h6">{faq.faqCategory}: {faq.faqQuestion}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {faq.faqAnswer}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                ))
            }

            {/* 페이지네이션 컨트롤 */}
            <Box className={styles.adminFaqPaginationControl}>
                <Button
                    variant="outlined"
                    onClick={() => onPageChange(0)}
                    disabled={page === 0}
                    className={styles.adminFaqPaginationButton}
                >
                    처음
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 0}
                    className={styles.adminFaqPaginationButton}
                >
                    이전
                </Button>
                <span>{page + 1} / {totalPages}</span>
                <Button
                    variant="outlined"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    className={styles.adminFaqPaginationButton}
                >
                    다음
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => onPageChange(totalPages - 1)}
                    disabled={page >= totalPages - 1}
                    className={styles.adminFaqPaginationButton}
                >
                    마지막
                </Button>
                {/* 페이지당 표시할 행 수 선택 */}
                <Select
                    value={rowsPerPage}
                    onChange={onRowsPerPageChange}
                    className={styles.adminFaqRowsPerPageSelect}
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
