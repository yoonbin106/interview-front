  import React, { useRef, useState } from 'react';
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
  import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
  import TextField from '@mui/material/TextField';
  import BorderColorIcon from '@mui/icons-material/BorderColor';
  import { getProfileImage, getUserByEmail } from 'api/user';
  import { useEffect } from 'react';
  import { observer } from 'mobx-react-lite';
  import { useStores } from '@/contexts/storeContext';
  import Snackbar from '@mui/material/Snackbar';
  import Alert from '@mui/material/Alert';
  import Box from '@mui/material/Box';
  import DateRangeIcon from '@mui/icons-material/DateRange';
  import { InputAdornment, Popover } from '@mui/material';
  import { useRouter } from 'next/router';
  import CircularProgress from '@mui/material/CircularProgress'; // 로딩 스피너
  import { useLoadDaumPostcodeScript, openPostcodePopup } from "@/api/getPostCode";
  import { IconButton } from '@mui/material';
  // import EditCalendarIcon from '@mui/icons-material/EditCalendar';

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    borderTop: '2px solid #dddddd',
    borderBottom: '2px solid #dddddd',
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
    },
    // 새로운 스타일 추가
    '&.first-column': {
      // backgroundColor: theme.palette.common.black,
      color: theme.palette.common.black,
      textAlign: 'center',
    },
    width: '150px',
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    borderBottom: '2px solid #dddddd',
    '&:last-child td, &:last-child th': {
      border: 0,
    },

  }));

  const EditUserInfo = observer(() => {
    const { userStore } = useStores(); 
    const router = useRouter();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showOverlay, setShowOverlay] = useState(false);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [postcode, setPostcode] = useState('');
    const [address, setAddress] = useState('');
    const [extraAddress, setExtraAddress] = useState('');
    const [specificAddress, setSpecificAddress] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [fileName, setFileName] = useState('');
    const [preview, setPreview] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);  // 파일 입력 필드에 대한 참조 생성

    const [userInfo, setUserInfo] = useState({
      username: '',
      birth: '',
      gender: '',
      phone: '',
      address: '',
      email: '',
      profile: ''
    });

    useLoadDaumPostcodeScript();

    useEffect(() => {
      handleUser();
    }, []);

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

    const parseAddress = (address) => {
      const postalCodePattern = /^\d{5}/; // 우편번호: 숫자 5자리
      const detailPattern = /\((.*?)\)$/; // 괄호 안의 내용
      // 우편번호 추출
      const postalCode = address.match(postalCodePattern)?.[0] || '';
      // 괄호 안의 내용 추출
      const detail = address.match(detailPattern)?.[0] || '';
      // 우편번호와 괄호 안의 내용을 제외한 나머지 주소 추출
      const addressWithoutPostalAndDetail = address.replace(postalCode, '').replace(detail, '').trim();
      // 기본 주소와 추가 상세 주소 추출
      const addressParts = addressWithoutPostalAndDetail.split(/\s(?=\S+$)/); 
      const basicAddress = addressParts[0] || ''; // 기본 주소 (서울 서초구 강남대로 48-3)
      const extraDetail = addressParts[1] || ''; // 추가 상세 주소 (1234 등)
      return {
        postalCode,
        basicAddress,
        extraDetail,
        detail
      };
    };

    const handleDateChange = (event) => {
      setBirthDate(event.target.value);
      setAnchorEl(null); // 날짜 선택 후 Popover를 닫습니다.
    };

    const handleIconClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const triggerFileInput = () => {
      fileInputRef.current.click(); // 파일 선택 창 열기
    };

    const open = Boolean(anchorEl);
    const id = open ? 'date-popover' : undefined;

    const handleUser = async () => {
      const email = localStorage.getItem('email'); // 예시: userStore.email 대신 localStorage 사용
      console.log("이메일", email);
      
      try {
        const findedUser = await getUserByEmail(email);
        console.log(findedUser);
        
        // 소셜 로그인 사용자인 경우 처리
        if (!findedUser.data.isGoogle && !findedUser.data.isKakao && !findedUser.data.isNaver) {
          const parsedAddress = parseAddress(findedUser.data.address || '');
          setBirthDate(findedUser.data.birth);
          setPreview(userStore.profile);
          setUserInfo({
            username: findedUser.data.username || '',
            birth: findedUser.data.birth ? formatBirthDate(userStore.birth) : '',
            gender: findedUser.data.gender ? formatGender(userStore.gender) : '',
            phone: findedUser.data.phone ? formatPhone(userStore.phone) : '',
            address: parsedAddress || '',
            email: findedUser.data.email || '',
            profile: userStore.profile || ''
          });
          setLoading(false); // 로딩 완료
        } else {
          setSnackbarMessage("소셜 로그인 사용자는 정보를 수정하실 수 없습니다");
          setShowOverlay(true);
          setOpenSnackbar(true);
          setTimeout(() => {
            setShowOverlay(false);
            router.push('/myPage');
          }, 2000); // 3초 후에 /myPage로 리다이렉트
        }
      } catch (error) {
        // 서버에서 404와 함께 메시지를 반환한 경우 처리
        if (error.response && error.response.status === 404) {
          setSnackbarMessage(error.response.data);  // 메시지를 설정
          setShowOverlay(true);
          setOpenSnackbar(true);
          setTimeout(() => {
            setShowOverlay(false);
            router.push('/myPage');
          }, 2000); // 3초 후에 /myPage로 리다이렉트
        } else {
          console.error("유저 정보를 가져오는 데 오류가 발생했습니다:", error);
        }
      }
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const validImageTypes = ['image/jpeg', 'image/png'];
        if (!validImageTypes.includes(file.type)) {
          alert('사진파일(png, jpg 등)만 업로드 가능합니다.');
          setFileName('');
          setPreview(null);
          setProfileImage(null);
          return;
        }
        setFileName(file.name);
        setProfileImage(file);  // 프로필 이미지를 상태로 저장
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFileName('');
        setPreview(null);
        setProfileImage(userStore.profile);
      }
    };
    const handleSubmit = async (event) => {
      event.preventDefault();

      const username = document.getElementById('name').value || userStore.username;
      const birth = birthDate || userStore.birth;
      const addressPostcode = postcode || userInfo.address;

      const nameRegex = /^[가-힣]+$/; // 한글만 허용하는 정규식
      if (!nameRegex.test(username)) {
        alert('이름은 한글만 입력 가능합니다.');
        return;
      }

      if (!birth) {
        alert('생년월일을 입력해 주세요.');
        return;
      }

      if (!addressPostcode) {
        alert('주소의 우편번호를 입력해 주세요.');
        return;
      }
      const formData = new FormData();
      formData.append('email', userInfo.email);
      formData.append('username', username);
      formData.append('address', `${postcode || userInfo.address.postalCode} ${address || userInfo.address.basicAddress} ${specificAddress || userInfo.address.extraDetail} ${extraAddress || userInfo.address.detail}`);
      formData.append('birth', birthDate || userStore.birth);

      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
    
      try {
        const response = await fetch('http://localhost:8080/api/auth/edituser', {
          method: 'POST',
          body: formData,
        });
        const changedProfile = await getProfileImage(userInfo.email, userStore);
        if (response.ok) {
          // 서버로부터 성공적인 응답을 받으면 userStore 업데이트
          const updatedUsername = document.getElementById('name').value || userStore.username;
          const updatedAddress = `${postcode || userInfo.address.postalCode} ${address || userInfo.address.basicAddress} ${specificAddress || userInfo.address.extraDetail} ${extraAddress || userInfo.address.detail}`;
          const updatedProfile = profileImage ? changedProfile : userStore.profile; // 프로필 이미지 URL 업데이트

          // userStore 값을 업데이트
          userStore.setUsername(updatedUsername);
          userStore.setAddress(updatedAddress);
          userStore.setBirth(birthDate || userStore.birth);
          userStore.setProfile(updatedProfile);
    
          // 성공 처리
          alert('유저 정보가 성공적으로 변경되었습니다.');
          router.push('/myPage');
        } else {
          // 오류 처리
          const errorMessage = await response.text();
          alert(`오류 발생: ${errorMessage}`);
        }
      } catch (error) {
        console.error('유저 정보를 수정하는 중 오류가 발생했습니다:', error);
      }
    };
    const handleCloseSnackbar = () => {
      setOpenSnackbar(false);
      setShowOverlay(false);
    };


    if (loading) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    return (
      <div>
        {showOverlay && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'white',
              zIndex: 1000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Snackbar
              open={openSnackbar}
              autoHideDuration={2000} // 2초 후 자동으로 닫힘
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'center', horizontal: 'center' }} // 화면 중앙에 위치
            >
              <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Box>
        )}
      <section className={styles.formContact}>
        <div className={styles.profileContainer}>
          <h1 className={styles.profileTitle}>나의 정보</h1>
          <div className={styles.profileImage} >
            <Avatar src={preview} sx={{ bgcolor: blue[200], width: '200px', height: '200px' }} />
            <div className={styles.editProfileIcon}>
            <IconButton onClick={triggerFileInput} sx={{ alignItems: 'end' }}>
              <BorderColorIcon />
            </IconButton>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
          </div>
        </div>
        <div className={styles.userInfoContent}>
          <TableContainer >
            <Table sx={{ minWidth: '700px', height: '224px', backgroundColor:'white',borderRadius:'8px'}} aria-label="customized table">
              <TableBody sx={{borderRadius:'8px'}}>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row" className="first-column"sx={{height:'48px',backgroundColor:'#eeeeee'}}>이름</StyledTableCell>
                  <StyledTableCell>
                    <TextField required id="name" defaultValue={userInfo.username} variant="standard" />
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row" className="first-column"sx={{height:'48px',backgroundColor:'#eeeeee'}}>성별</StyledTableCell>
                  <StyledTableCell>
                    <TextField required id="name" defaultValue={userInfo.gender} disabled variant="standard" />
                  </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                  <StyledTableCell component="th" scope="row" className="first-column" sx={{ height: '48px', backgroundColor: '#eeeeee' }}>
                    생년월일
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      required
                      id="birthDate"
                      value={birthDate}
                      variant="standard"
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleIconClick}>
                              <DateRangeIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={() => setAnchorEl(null)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                    >
                      <input
                        id="dateInput"
                        type="date"
                        onChange={handleDateChange}
                        value={birthDate}
                        style={{
                          padding: '10px',
                          border: 'none',
                          background: 'none',
                          outline: 'none',
                          fontSize: '16px',
                        }}
                      />
                    </Popover>
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row" className="first-column"sx={{height:'48px',backgroundColor:'#eeeeee'}}>연락처</StyledTableCell>
                  <StyledTableCell colSpan={5}>
                    <TextField required id="name" disabled defaultValue={userInfo.phone} variant="standard" InputProps={{ readOnly: true }}/>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row" className="first-column"sx={{height:'80px',backgroundColor:'#eeeeee'}}>주소</StyledTableCell>

                  <StyledTableCell colSpan={5}>
                    <TextField 
                      required 
                      id="postalCode" 
                      value={postcode || userInfo.address.postalCode} 
                      variant="standard" 
                      InputProps={{ readOnly: true }} 
                    />
                    <IconButton aria-label="editlocation">
                      <EditLocationAltIcon onClick={() => openPostcodePopup(setPostcode, setAddress, setExtraAddress)}/>
                    </IconButton>
                    <br />
                    <TextField 
                      sx={{ width: 500 }}
                      required 
                      id="basicAddress"
                      value={address || userInfo.address.basicAddress}
                      variant="standard"
                      InputProps={{ readOnly: true }}
                    /><br />
                    <TextField 
                      sx={{ width: 150 }} 
                      value={specificAddress || userInfo.address.extraDetail}
                      onChange={(e) => setSpecificAddress(e.target.value)} 
                      required 
                      id="extraDetail" 
                      variant="standard" 
                    />
                    <br />
                    <TextField 
                      sx={{ width: 500 }} 
                      required 
                      id="detail" 
                      value={extraAddress || userInfo.address.detail} 
                      variant="standard" 
                      InputProps={{ readOnly: true }} 
                    />
                  </StyledTableCell>

                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row" className="first-column"sx={{height:'48px',backgroundColor:'#eeeeee'}}>이메일</StyledTableCell>
                  <StyledTableCell colSpan={5}>
                    <TextField required id="name" defaultValue={userInfo.email} disabled variant="standard" InputProps={{ readOnly: true, }}/>
                  </StyledTableCell>
                </StyledTableRow>
              </TableBody>
            </Table>
          </TableContainer>


        </div>
        <div className={styles.buttonGroup}>
          <button
              type="button"
              className={styles.button}
              onClick={() => router.push('/myPage')}
            >
            <span className={styles.buttonText}>취소</span>
          </button>
          <button
              type="button"
              className={styles.button}
              onClick={handleSubmit}
            >
            <span className={styles.buttonText}>수정</span>
          </button>
        </div>
      </section>
      </div>
    );
  });

  export default EditUserInfo;