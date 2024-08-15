import React from 'react';
import styles from '@/styles/myPage/userInfo.module.css';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import BorderColorIcon from '@mui/icons-material/BorderColor';
// import EditCalendarIcon from '@mui/icons-material/EditCalendar';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  // 새로운 스타일 추가
  '&.first-column': {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: 'center',
  },
  width: '150px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },

}));

const EditUserInfo = () => {
  return (
    <section className={styles.formContact}>
      <div className={styles.profileContainer}>
        <h1 className={styles.profileTitle}>나의 정보</h1>
        <div className={styles.profileImage} >
          <Avatar sx={{ bgcolor: blue[200], width: '200px', height: '200px' }} >YJE</Avatar>
          <div className={styles.editProfileIcon}>
            <BorderColorIcon sx={{ alignItems: 'end' }} />
          </div>
        </div>




      </div>

      <div className={styles.userInfoContent}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700, height: 350 }} aria-label="customized table">
            <TableBody>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" className="first-column">이름</StyledTableCell>
                <StyledTableCell>
                  <TextField required id="name" defaultValue="김과자" variant="standard" />
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" className="first-column">생년월일</StyledTableCell>
                <StyledTableCell>
                  {/* <EditCalendarIcon/> */}
                  <TextField required id="name" defaultValue="1999월 9월 99일" variant="standard" />
                </StyledTableCell>
                <StyledTableCell component="th" scope="row" className="first-column">성별</StyledTableCell>
                <StyledTableCell>
                  <TextField required id="name" defaultValue="여자" variant="standard" />
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" className="first-column">연락처</StyledTableCell>
                <StyledTableCell colSpan={5}>
                  <TextField required id="name" defaultValue="010-2222-3333" variant="standard" />
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" className="first-column">주소</StyledTableCell>

                <StyledTableCell colSpan={5} >
                  <TextField required id="name" defaultValue="(05050)" variant="standard" InputProps={{ readOnly: true, }} /><span>[우편번호 찾기 버튼 두기]</span><br />
                  <TextField sx={{ width: 500 }}
                    required id="name"
                    defaultValue="서울특별시 어쩌구 저쩌동 머머대로"
                    variant="standard"
                    InputProps={{ readOnly: true, }} />

                  <br />
                  <TextField sx={{ width: 500 }} required id="name" defaultValue="A동 1502호 상세주소 입력" variant="standard" />
                </StyledTableCell>

              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" className="first-column">이메일</StyledTableCell>
                <StyledTableCell colSpan={5}>
                  <TextField required id="name" defaultValue="example01@gmail.com" variant="standard" />
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>


      </div>
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.button}>
          <span className={styles.buttonText}>취소</span>
        </button>
        <button type="submit" className={styles.button}>
          <span className={styles.buttonText}>수정</span>
        </button>
      </div>




    </section>

  );
};

export default EditUserInfo;