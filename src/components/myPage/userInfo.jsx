import React, { useEffect, useState } from 'react';
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
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
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

const formatBirthDate = (birth) => {
  const [year, month, day] = birth.split('-');
  return `${year}년 ${month}월 ${day}일`;
};

const formatGender = (gender) => {
  return gender === 'men' ? '남자' : '여자';
};

const formatPhone = (phone) => {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};

const formatAddress = (address) => {
  const [zip, ...rest] = address.split(' ');
  const location = rest.slice(0, 4).join(' ');
  const detail = rest.slice(4).join(' ');
  return (
    <>
      {zip} <br />
      {location} <br />
      {detail.split(' ')[0]} <br />
      {detail.split(' ')[1]} <br />
    </>
  );
};

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    birth: '',
    gender: '',
    phone: '',
    address: '',
    email: '',
    profile: ''
  });

  useEffect(() => {
    setUserInfo({
      username: localStorage.getItem('username') || '',
      birth: localStorage.getItem('birth') ? formatBirthDate(localStorage.getItem('birth')) : '',
      gender: localStorage.getItem('gender') ? formatGender(localStorage.getItem('gender')) : '',
      phone: localStorage.getItem('phone') ? formatPhone(localStorage.getItem('phone')) : '',
      address: localStorage.getItem('address') ? formatAddress(localStorage.getItem('address')) : '',
      email: localStorage.getItem('email') || '',
      profile: localStorage.getItem('profile') || '' // Assuming this is how you're storing the profile image URL or data
    });
  }, []);

  return (
    <section className={styles.formContact}>
      <div className={styles.profileContainer}>
        <h1 className={styles.profileTitle}>나의 정보</h1>
        <div className={styles.profileImage}>
          <Avatar src={userInfo.profile} sx={{ bgcolor: blue[200], width: '200px', height: '200px' }} />
        </div>

        <a href="/myPage/editUserInfo" className={styles.editProfileLink}>
          회원 정보 수정 <ArrowForwardIosIcon sx={{ fontSize: 10 }} />
        </a>
      </div>

      <div className={styles.userInfoContent}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700, height: 350 }} aria-label="customized table">
            <TableBody>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" className="first-column">이름</StyledTableCell>
                <StyledTableCell>{userInfo.username}</StyledTableCell>
                <StyledTableCell component="th" scope="row" className="first-column">생년월일</StyledTableCell>
                <StyledTableCell>{userInfo.birth}</StyledTableCell>
                <StyledTableCell component="th" scope="row" className="first-column">성별</StyledTableCell>
                <StyledTableCell>{userInfo.gender}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" className="first-column">연락처</StyledTableCell>
                <StyledTableCell colSpan={5}>{userInfo.phone}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" className="first-column">주소</StyledTableCell>
                <StyledTableCell colSpan={5}>{userInfo.address}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" className="first-column">이메일</StyledTableCell>
                <StyledTableCell colSpan={5}>{userInfo.email}</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
};

export default UserInfo;