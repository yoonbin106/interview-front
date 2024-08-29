import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead } from '@mui/material';
import axios from 'axios';
import styles from '@/styles/bbs/bbsQnaList.module.css';

const BbsQnaList = () => {
  const [qnaData, setQnaData] = useState([]); // QnA 데이터를 저장하는 상태
  const [loading, setLoading] = useState(true); // 로딩 상태를 저장하는 상태
  const [error, setError] = useState(null); // 에러 상태를 저장하는 상태

  useEffect(() => {
    const fetchQnaData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/qna');
        setQnaData(response.data);
      } catch (error) {
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
        console.error('데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQnaData();
  }, []);


  if (error) {
    return <p>{error}</p>; // 오류가 발생했을 때 표시될 UI
  }

  return (
    <div className={styles.bbsQnaListContainer}>
      {qnaData.length === 0 ? (
        <div className={styles.bbsQnaListEmptyStateContainer}>
          <img
            src='../../images/no_inquiries.png' // 일러스트 이미지 경로
            alt="문의 내역 없음"
            className={styles.bbsQnaListIllustration}
          />
          <p className={styles.bbsQnaListEmptyText}>문의하신 내역이 없습니다.</p>
        </div>
      ) : (
        <TableContainer component={Paper} className={styles.bbsQnaListTableContainer}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell align="center" className={styles.bbsQnaListHeaderCell}>글 번호</TableCell>
                <TableCell align="center" className={styles.bbsQnaListHeaderCell}>카테고리</TableCell>
                <TableCell align="center" className={styles.bbsQnaListHeaderCell}>제목</TableCell>
                <TableCell align="center" className={styles.bbsQnaListHeaderCell}>내용</TableCell> 
                <TableCell align="center" className={styles.bbsQnaListHeaderCell}>작성날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qnaData.map((row) => (
                <TableRow key={row.qnaId}>
                  <TableCell align="center">{row.qnaId}</TableCell> {/* 글 번호 표시 */}
                  <TableCell align="center">{row.qnaCategory}</TableCell> {/* 카테고리 표시 */}
                  <TableCell align="center" className={styles.bbsQnaListTitleCell}>
                    <a href={`/bbs/bbsQnaDetailsPage/${row.qnaId}`} className={styles.bbsQnaListTableLink}>
                      {row.qnaTitle} {/* 제목 표시 */}
                    </a>
                  </TableCell>
                  <TableCell align="center">{row.qnaQuestion}</TableCell> {/* 수정: 문의 내용 표시 */}
                  <TableCell align="center">{row.qnaCreatedTime}</TableCell> {/* 작성 날짜 표시 */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default BbsQnaList;
