import React, { useState, useEffect } from 'react';
import styles from '@/styles/adminPage/adminPage.module.css';
import axios from 'axios';
import NestedList from 'components/adminPage/adminSideMenu';
import AdminFaq from 'components/adminPage/adminFaq';
import {withAdminAuth} from '@/utils/withAdminAuth';

const AdminFaqPage = () => {
    const [faqs,setFaqs] = useState([]);//FAQ데이터를 담는 상태
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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
    
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category) {
            setFilteredFaqs(faqs.filter(faq => faq.faqCategory === category));
        } else {
            setFilteredFaqs(faqs);
        }
        setPage(0);
    };
    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // 페이지를 초기화합니다.
    };

    const totalPages = Math.ceil(filteredFaqs.length / rowsPerPage);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <NestedList />
            </div>
            <div className={styles.content}>
                <AdminFaq 
                    faqs={filteredFaqs}
                    onPageChange={handleChangePage} 
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    totalPages={totalPages} // 여기에 totalPages를 전달
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange} //카테고리 필터링 핸들러 전달
                />
            </div>
        </div>
    );
};

export default withAdminAuth(AdminFaqPage);