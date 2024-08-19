import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styles from '@/styles/myPage/userInfo.module.css';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useStores } from '@/contexts/storeContext';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
  '&.first-column': {
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
  if (!birth) return '생일에 대한 정보가 없습니다';
  const [year, month, day] = birth.split('-');
  return `${year}년 ${month}월 ${day}일`;
};

const formatGender = (gender) => {
  return gender === 'men' ? '남자' : gender === 'women' ? '여자' : '성별에 대한 정보가 없습니다';
};

const formatPhone = (phone) => {
  return phone ? phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : '연락처에 대한 정보가 없습니다';
};

const formatAddress = (address) => {
  if (!address) return '주소에 대한 정보가 없습니다';
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

const UserInfo = observer(() => {
  const { userStore } = useStores(); // Access your MobX store

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
      username: userStore.username || '이름에 대한 정보가 없습니다',
      birth: userStore.birth ? formatBirthDate(userStore.birth) : '생일에 대한 정보가 없습니다',
      gender: userStore.gender ? formatGender(userStore.gender) : '성별에 대한 정보가 없습니다',
      phone: userStore.phone ? formatPhone(userStore.phone) : '연락처에 대한 정보가 없습니다',
      address: userStore.address ? formatAddress(userStore.address) : '주소에 대한 정보가 없습니다',
      email: userStore.email || '이메일에 대한 정보가 없습니다',
      profile: userStore.profile || '' // Assuming this is how you're storing the profile image URL or data
    });
  }, [userStore]);

  return (
    <section className={styles.formContact}>
      <div className={styles.profileContainer}>
        <h1 className={styles.profileTitle}>나의 정보</h1>
        <div className={styles.profileImage}>
          <Avatar src={userInfo.profile} sx={{ bgcolor: blue[200], width: '200px', height: '200px' }} />
        </div>

        <a href="/myPage/editUserInfo" className={styles.editProfileLink}>
          회원 정보 수정 <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
        </a>
      </div>

      <div className={styles.userInfoContent}>
        <TableContainer>
          <Table sx={{ minWidth: '700px', height: '224px', backgroundColor: 'white' }} aria-label="customized table">
            <TableBody sx={{ backgroundColor: 'white' }}>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" className="first-column" sx={{ height: '48px', backgroundColor: '#cdcdcd' }}>이름</StyledTableCell>
                <StyledTableCell>{userInfo.username}</StyledTableCell>
                <StyledTableCell component="th" scope="row" className="first-column" sx={{ height: '48px', backgroundColor: '#cdcdcd' }}>생년월일</StyledTableCell>
                <StyledTableCell>{userInfo.birth}</StyledTableCell>
                <StyledTableCell component="th" scope="row" className="first-column" sx={{ height: '48px', backgroundColor: '#cdcdcd' }}>성별</StyledTableCell>
                <StyledTableCell>{userInfo.gender}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" className="first-column" sx={{ height: '48px', backgroundColor: '#cdcdcd' }}>연락처</StyledTableCell>
                <StyledTableCell colSpan={5}>{userInfo.phone}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow >
                <StyledTableCell component="th" scope="row" className="first-column" sx={{ height: '80px', backgroundColor: '#cdcdcd' }}>주소</StyledTableCell>
                <StyledTableCell colSpan={5}>{userInfo.address}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell component="th" scope="row" className="first-column" sx={{ height: '48px', backgroundColor: '#cdcdcd' }}>이메일</StyledTableCell>
                <StyledTableCell colSpan={5}>{userInfo.email}</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
});

export default UserInfo;