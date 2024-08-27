import React, { useState, useEffect } from 'react';
import styles from '@/styles/adminPage/adminPage.module.css';
import BbsQnaSideMenu from 'components/bbs/bbsQnaSideMenu';
import BbsFaq from 'components/bbs/bbsFaq';

const BbsFaqPage = () => {
    const [filteredFaqs, setFilteredFaqs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                console.log("Fetching FAQs...");
                const response = await axios.get('http://localhost:8080/api/faq/all');
                setFaqs(response.data);
                setFilteredFaqs(response.data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            }
        };

        fetchFaqs();
    }, []);

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
                <BbsQnaSideMenu />
            </div>
            <div className={styles.content}>
                <BbsFaq 
                    faqs={filteredFaqs}
                    onPageChange={handleChangePage} 
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    totalPages={totalPages} // 여기에 totalPages를 전달
                    selectedCategory={selectedCategory}
                    setFilteredFaqs={setFilteredFaqs} // 카테고리 필터링을 위해 함수 전달
                    setSelectedCategory={setSelectedCategory} // 카테고리 상태를 위해 함수 전달
                />
            </div>
        </div>
    );
};

export default BbsFaqPage;