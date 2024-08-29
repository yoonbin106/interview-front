import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Typography, FormControl, Select, MenuItem, Box, Button, InputLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from '@/styles/adminPage/adminFaq.module.css';

const AdminFaq = ({ onPageChange, onRowsPerPageChange, rowsPerPage, page }) => {
    const [faqs, setFaqs] = useState([]);
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/faq/all');
                setFaqs(response.data);
                setFilteredFaqs(response.data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            }
        };

        fetchFaqs();
    }, []);

    const handleDeleteFaq = async (faqId) => {
        try {
            await axios.delete(`http://localhost:8080/api/faq/${faqId}`);
            setFaqs(prevFaqs => prevFaqs.filter(faq => faq.faqId !== faqId));
            setFilteredFaqs(prevFaqs => prevFaqs.filter(faq => faq.faqId !== faqId));
        } catch (error) {
            console.error('Error deleting FAQ:', error);
        }
    };

    const totalPages = Math.ceil(filteredFaqs.length / rowsPerPage);

    const handleCategoryChangeInternal = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);
        if (category) {
            setFilteredFaqs(faqs.filter(faq => faq.faqCategory === category));
        } else {
            setFilteredFaqs(faqs);
        }
        onPageChange(0);
    };

    return (
        <div className={styles.adminFaqContainer}>
            <Box mb={3} className={styles.adminFaqHeader}>
                <Typography variant="h3" gutterBottom>
                    자주 묻는 질문 (FAQ)
                </Typography>
                <Button variant="contained" color="primary" href="/adminPage/adminFaqRegisterPage">
                    새 FAQ 등록
                </Button>
            </Box>

            <Box mb={3} className={styles.adminFaqCategorySearch}>
                <FormControl fullWidth variant="outlined">
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChangeInternal}
                        displayEmpty
                        renderValue={
                            selectedCategory !== ""
                            ? undefined
                            : () => <Typography color="textSecondary">카테고리를 선택하여 검색해보세요.</Typography>
                        }
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

            {filteredFaqs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteFaq(faq.faqId)}
                                className={styles.adminFaqDeleteButton}
                            >
                                삭제
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                ))
            }

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

export default AdminFaq;