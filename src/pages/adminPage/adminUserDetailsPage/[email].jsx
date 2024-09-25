import React, { useRef, useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper, Avatar, TextField, Button, ButtonGroup } from '@mui/material';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite'; 
import { useStores } from '@/contexts/storeContext'; 
import styles from '@/styles/adminPage/adminUserDetails.module.css';
import axios from 'axios';

const AdminUserDetails = observer(() => {
  const [editMode, setEditMode] = useState(false); // 수정 모드 상태 관리
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [preview, setPreview] = useState(null); // 이미지 미리보기 상태
  const [fileName, setFileName] = useState(''); // 파일명 상태
  const [profileImage, setProfileImage] = useState(null); // 프로필 이미지 파일 상태
  
  const { viewUserStore } = useStores(); 
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
      viewUserStore.fetchUserByEmail(email); 
    }

    return () => {
      viewUserStore.clearViewedUser(); 
    };
  }, [email, viewUserStore]);

  //프로필 사진 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        alert('사진파일만 업로드 가능합니다.');
        setFileName('');
        setPreview(null);
        setProfileImage(null);
        return;
      }
      setFileName(file.name);
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName('');
      setPreview(null);
      setProfileImage(viewUserStore.viewedUser.profileImage);
    }
  };

  // handleInputChange: 텍스트 필드 값 변경 핸들러
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    viewUserStore.updateField(name, value); 
  };

  // 사용자 정보 저장 핸들러
  const handleSaveClick = async () => {
    setLoading(true); 
    try {
      const updatedUser = {
        email: viewUserStore.viewedUser.email,
        username: viewUserStore.viewedUser.username,
        address: viewUserStore.viewedUser.address,
        birth: viewUserStore.viewedUser.birth,
        profileImage: profileImage ? profileImage : viewUserStore.viewedUser.profileImage, 
      };

      const formData = new FormData();
      formData.append('email', updatedUser.email);
      formData.append('username', updatedUser.username);
      formData.append('address', updatedUser.address);
      formData.append('birth', updatedUser.birth);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      } else if (viewUserStore.viewedUser.profileImage) {
        // 기존 프로필 이미지를 유지하기 위해 서버로 전달
        formData.append('profileImage', viewUserStore.viewedUser.profileImage);
      } else {
        // 아무 이미지도 없을 경우에는 null을 보내지 않도록 할 수 있음
        console.log('프로필 이미지 없음: 새 이미지도 기존 이미지도 없습니다.');
      }

      await axios.post('http://localhost:8080/api/auth/edituser', formData);

      await viewUserStore.fetchUserByEmail(updatedUser.email);

      alert('사용자 정보가 성공적으로 업데이트되었습니다.');
      setEditMode(false);
    } catch (error) {
      alert('사용자 정보를 업데이트하는 중 오류가 발생했습니다.');
      console.error('오류 세부 사항:', error);
    } finally {
      setLoading(false);
    }
  };

  // 수정 모드 전환 핸들러
  const handleEditClick = () => {
    setEditMode(true);
  };

  // 사용자 비활성화 핸들러
  const handleDeactivateClick = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/deactivateUser', null, {
        params: { email: user.email },
      });
      alert(response.data);
      await viewUserStore.fetchUserByEmail(user.email);
    } catch (error) {
      console.error('사용자 비활성화 중 오류가 발생했습니다:', error);
      alert('비활성화 요청 중 오류가 발생했습니다.');
    }
  };

  // 사용자 활성화 핸들러
  const handleActivateClick = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/activateUser', null, {
        params: { email: user.email },
      });
      alert(response.data);
      await viewUserStore.fetchUserByEmail(user.email);
    } catch (error) {
      console.error('사용자 활성화 중 오류가 발생했습니다:', error);
      alert('활성화 요청 중 오류가 발생했습니다.');
    }
  };

  // 탈퇴 핸들러
  const handleDeleteClick = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/deleteUser', null, {
        params: { email: user.email },
      });
      alert(response.data);
      router.push('/adminPage/adminUserPage');
    } catch (error) {
      console.error('사용자 탈퇴 중 오류가 발생했습니다:', error);
      alert('탈퇴 요청 중 오류가 발생했습니다.');
    }
  };

  // 사용자의 정보가 로드되지 않았을 경우
  if (!viewUserStore.viewedUser) {
    return <Typography>사용자 정보를 불러오는 중입니다...</Typography>; 
  }

  const user = viewUserStore.viewedUser; 

  // isActivated 값을 숫자로 변환하여 비교
  const isActivated = Number(user.isActivated);

  // 배너 표시 로직 추가
  const renderBanner = () => {
    if (user.isDeleted === 1) {
      return <div className={styles.bannerDeleted}>탈퇴한 회원입니다</div>;
    } else if (user.isActivated === 0) {
      return <div className={styles.bannerDeactivated}>비활성화된 회원입니다</div>;
    }
    return null;
  };

    return (
    <Box className={styles.userDetailsContainer}>
      {/* 배너 */}
      {!loading && user.isDeleted ? ( // 로딩 중이 아닐 때만 배너 표시
        <Box className={styles.bannerDeleted}>탈퇴한 회원입니다</Box>
      ) : !loading && !user.isActivated ? (
        <Box className={styles.bannerDeactivated}>비활성화된 회원입니다</Box>
      ) : null}

      <Typography variant="h4" className={styles.userDetailsTitle}>
        {editMode ? '개인 정보 수정' : '개인 정보 조회'}
      </Typography>

      <Paper className={styles.userDetailsPaper}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              className={styles.userAvatar}
              src={preview || (user && user.profileImage ? `data:image/jpeg;base64,${user.profileImage}` : '')}
              alt="User Profile"
              sx={{ width: 200, height: 200 }}
            />
          </Grid>

          {editMode && (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <input
                type="file"
                accept="image/*"
                id="file-upload"
                className={styles.fileInput} 
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className={styles.fileUploadLabel}>
                프로필 사진 변경
              </label>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h6" className={styles.userInfoTitle}>
              회원 정보
            </Typography>
          </Grid>

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
              label="회원 탈퇴일"
              name="deletedAt"
              value={user.deletedTime ? formatDateTime(user.deletedTime) : '탈퇴하지 않음'}
              InputProps={{ readOnly: true }}
            />
          </Grid>

           {/* 버튼 그룹 */}
           <Grid item xs={12} className={styles.buttonGroupContainer}>
            <ButtonGroup variant="contained" aria-label="contained primary button group" className={styles.userDetailsButtonGroup}>
              {editMode ? (
                <Button onClick={handleSaveClick} className={styles.userDetailsButton}>
                  저장
                </Button>
              ) : (
                <Button onClick={handleEditClick} className={styles.userDetailsEditButton}>
                  회원정보수정
                </Button>
              )}
              {isActivated === 0 ? (
                <Button onClick={handleActivateClick} className={styles.userDetailsActivateButton}>
                  회원 활성화
                </Button>
              ) : (
                <Button onClick={handleDeactivateClick} className={styles.userDetailsDeactivateButton}>
                  회원 비활성화
                </Button>
              )}
              <Button onClick={handleDeleteClick} className={styles.userDetailsDeleteButton}>
                회원탈퇴
              </Button>
              <Button className={styles.userDetailsBackButton} onClick={() => router.push('/adminPage/adminUserPage')}>
                목록으로 돌아가기
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
});

export default AdminUserDetails;
