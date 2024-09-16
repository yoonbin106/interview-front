import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Avatar, TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite'; // observer 가져오기
import { useStores } from '@/contexts/storeContext'; // useStores 훅 가져오기
import styles from '@/styles/adminPage/adminUserDetails.module.css';

const AdminUserDetails = observer(() => {
  const [editMode, setEditMode] = useState(false); // 수정 모드 상태 관리
  const [selectedFile, setSelectedFile] = useState(null); // 프로필 이미지 파일 상태
  const { viewUserStore } = useStores(); // viewUserStore 가져오기
  const router = useRouter();
  const { email } = router.query;

  // 날짜 및 시간을 맞춤형 형식으로 변환하는 함수
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const formattedTime = date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${formattedDate} ${formattedTime}`;
  };

  // 컴포넌트가 로드되었을 때 이메일이 존재하면 사용자를 가져옴
  useEffect(() => {
    if (email) {
      viewUserStore.fetchUserByEmail(email); // viewUserStore에서 사용자 정보 가져오기
    }

    // 컴포넌트가 언마운트 될 때 조회된 사용자 정보 초기화
    return () => {
      viewUserStore.clearViewedUser(); // 조회된 사용자 정보를 초기화
    };
  }, [email, viewUserStore]);

  // 입력값 변경 핸들러 (수정 모드에서 텍스트 필드 값 변경)
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    viewUserStore.updateField(name, value); // MobX 스토어에서 값 변경
  };

  // 이미지 파일 선택 핸들러
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // 사용자 정보 저장 핸들러
  const handleSaveClick = async () => {
    try {
      const updatedUser = {
        email: viewUserStore.viewedUser.email,
        username: viewUserStore.viewedUser.username,
        address: viewUserStore.viewedUser.address,
        birth: viewUserStore.viewedUser.birth,
        profileImage: selectedFile, // 업로드된 이미지 파일 처리
      };

      // 사용자 정보 업데이트 요청
      await viewUserStore.updateUserDetails(
        updatedUser.email,
        updatedUser.username,
        updatedUser.address,
        updatedUser.birth,
        updatedUser.profileImage // 이미지가 있으면 전송
      );

      // 사용자 정보 업데이트 후 다시 가져오기
      await viewUserStore.fetchUserByEmail(updatedUser.email);

      alert("사용자 정보가 성공적으로 업데이트되었습니다.");
      setEditMode(false); // 수정 모드 종료
    } catch (error) {
      alert("사용자 정보를 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  // 수정 모드 전환 핸들러
  const handleEditClick = () => {
    setEditMode(true);
  };

  // 사용자의 정보가 로드되지 않았을 경우
  if (!viewUserStore.viewedUser) {
    return <Typography>사용자 정보를 불러오는 중입니다...</Typography>; // 데이터가 없을 경우 로딩 메시지
  }

  const user = viewUserStore.viewedUser; // 조회된 사용자 정보 사용

  return (
    <Box className={styles.userDetailsContainer}>
      <Typography variant="h4" className={styles.userDetailsTitle}>
        {editMode ? "개인 정보 수정" : "개인 정보 조회"}
      </Typography>
      <Paper className={styles.userDetailsPaper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              className={styles.userAvatar}
              src={user.profileImage ? user.profileImage : '/default-avatar.png'} // 프로필 이미지가 Base64로 인코딩된 경우 처리
              alt="User Profile"
              sx={{ width: 200, height: 200 }}
            />
          </Grid>
          {editMode && (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="h6" className={styles.userInfoTitle}>
              회원 정보
            </Typography>
          </Grid>
          {/* 사용자 정보 입력 필드 */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="이름"
              name="username"
              value={user.username || ''}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="성별"
              name="gender"
              value={user.gender || ''}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="생년월일"
              name="birth"
              value={user.birth || ''}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="핸드폰번호"
              name="phone"
              value={user.phone || ''}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="주소"
              name="address"
              value={user.address || ''}
              onChange={handleInputChange}
              InputProps={{ readOnly: !editMode }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="이메일"
              name="email"
              value={user.email || ''}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="이메일 인증여부"
              name="emailVerified"
              value={user.isEmailVerified ? '인증됨' : '인증되지 않음'}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="회원정보 생성날짜"
              name="createdAt"
              value={formatDateTime(user.createdTime)}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="회원정보 수정날짜"
              name="updatedAt"
              value={formatDateTime(user.updatedTime)}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="회원 탈퇴일"
              name="deletedAt"
              value={user.deletedTime ? formatDateTime(user.deletedTime) : '탈퇴하지 않음'}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="마지막 로그인 시간"
              name="lastLogin"
              value={formatDateTime(user.lastLogin)}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* 버튼 컨트롤 */}
          <Grid item xs={12} className={styles.userDetailsGridContainer}>
            {editMode ? (
              <Button variant="contained" color="primary" onClick={handleSaveClick} className={styles.userDetailsButton}>
                저장
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleEditClick} className={styles.userDetailsButton}>
                수정
              </Button>
            )}
            <Button variant="outlined" className={styles.userDetailsBackButton} onClick={() => router.push('/adminPage/adminUserPage')}>
              목록으로 돌아가기
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
});

export default AdminUserDetails;
