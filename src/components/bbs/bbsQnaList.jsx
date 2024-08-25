// bbsQnaList.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, TableHead } from '@mui/material';
import styles from '@/styles/bbs/bbsQnaList.module.css';

const BbsQnaList = () => {
  // 예시 데이터 (빈 배열이면 내역이 없는 경우로 처리)
  const qnaData = []; // 실제 데이터가 있을 경우 이 배열에 추가

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
                <TableCell align="center" className={styles.bbsQnaListHeaderCell}>작성자</TableCell>
                <TableCell align="center" className={styles.bbsQnaListHeaderCell}>작성날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qnaData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell align="center">{`[${row.category}]`}</TableCell>
                  <TableCell align="center" className={styles.bbsQnaListTitleCell}>
                    <a href={`/bbs/bbsQnaDetailsPage/${row.id}`} className={styles.bbsQnaListTableLink}>
                      {row.title}
                    </a>
                  </TableCell>
                  <TableCell align="center">{row.author}</TableCell>
                  <TableCell align="center">{row.date}</TableCell>
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