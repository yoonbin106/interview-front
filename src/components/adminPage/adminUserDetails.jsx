//**adminUserDetails.jsx

import React, { useState } from 'react';
import { Box, Grid, Typography, Paper, Avatar, TextField, Button } from '@mui/material';

const UserDetails = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    email: "meezi_@naver.com",
    password: "ict1234",
    emailVerified: "인증됨",
    gender: "여자",
    birth: "1995-11-07",
    address: "서울특별시 서초구 서초대로77길 41,4층(서초동,대동빌딩)",
    name: "최미지",
    phone: "010-2790-7021",
    createdAt: "2024-08-01",
    updatedAt: "2024-08-02",
    deletedAt: "", // 회원 탈퇴일
    lastLogin: "2024-08-09 19:51",
    profileImage: "",
  });

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    setEditMode(false);
    // 실제 데이터 저장 로직 추가
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleDeleteAccount = () => {
    if (typeof window !== 'undefined') {
      if(window.confirm("정말로 회원탈퇴를 하시겠습니까?")){
        alert("회원 탈퇴가 성공적으로 완료되었습니다.");
        window.location.href = "http://localhost:3000/adminPage/adminUserDetailsPage";
      }
    }

  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>개인 정보 수정</Typography>
      <Paper sx={{ p: 3, maxWidth: 800, width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              sx={{ width: 120, height: 120 }}
              src={user.profileImage}  // 프로필 이미지
              alt="User Profile"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>회원 정보</Typography>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="이름"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }} // 수정 모드에 따라 읽기 전용 설정
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="성별"
              name="gender"
              value={user.gender}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="생년월일"
              name="birth"
              value={user.birth}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="핸드폰번호"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="주소"
              name="address"
              value={user.address}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="이메일"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="이메일 인증여부"
              name="emailVerified"
              value={user.emailVerified}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="비밀번호"
              name="password"
              type="password"
              value={user.password}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="회원정보 생성날짜"
              name="createdAt"
              value={user.createdAt}
              InputProps={{ readOnly: true }} // 항상 읽기 전용
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="회원정보 수정날짜"
              name="updatedAt"
              value={user.updatedAt}
              InputProps={{ readOnly: true }} // 항상 읽기 전용
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="회원 탈퇴일"
              name="deletedAt"
              value={user.deletedAt}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="마지막 로그인 시간"
              name="lastLogin"
              value={user.lastLogin}
              InputProps={{ readOnly: true }} // 항상 읽기 전용
            />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={editMode ? handleSaveClick : handleEditClick}
              sx={{ mr: 2 }}
            >
              {editMode ? "회원정보저장" : "회원정보수정"}
            </Button>
            {editMode && (
              <Button variant="outlined" 
              color="secondary"
              onClick={handleDeleteAccount}>
                회원탈퇴
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserDetails;