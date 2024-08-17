//**adminFaqPage.jsx */
import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, FormControl, InputLabel, Select, MenuItem, Box, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system'; 
import RegisterButton from '@/components/adminPage/adminRegisterButton';
import styles from '@/styles/adminPage/adminPage.module.css';
import NestedList from '@/components/adminPage/adminSideMenu';

const StyledSelect = styled(Select)({
    backgroundColor: '#4A90E2',
    color: 'white',
    fontWeight: 'bold',
    '& .MuiSelect-icon': {
        color: 'white',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#4A90E2',
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#4A90E2',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#4A90E2',
    },
});

const StyledMenuItem = styled(MenuItem)({
    backgroundColor: '#4A90E2',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: '#3A78D2',
    },
});

const StyledInputLabel = styled(InputLabel)({
    color: 'white',
    fontWeight: 'bold',
});

const AdminFaq = () => {
    // 하드코딩된 FAQ 데이터, 각 객체는 카테고리, 질문, 답변을 포함합니다.
    const faqs = [
        { id: 1, category: '계정 및 로그인', question: '비밀번호를 잊어버렸어요. 어떻게 재설정하나요?', answer: '비밀번호 재설정은 로그인 페이지에서 "비밀번호 찾기"를 클릭한 후, 이메일 주소를 입력하면 재설정 링크가 발송됩니다.' },
        { id: 2, category: 'AI 면접 준비', question: 'AI 면접에서 자주 나오는 질문은 무엇인가요?', answer: 'AI 면접에서 자주 나오는 질문은 자기소개, 장단점, 팀 프로젝트 경험 등이 있습니다.' },
        { id: 3, category: '기술 문제 해결', question: '면접 중 영상이 끊기는데 어떻게 해결하나요?', answer: '인터넷 연결 상태를 확인하고, 가능한 경우 유선 연결을 사용해 보세요. 그래도 문제가 지속되면 고객센터에 문의하세요.' },
        { id: 4, category: '결제 및 환불', question: '결제를 취소하고 싶어요. 어떻게 해야 하나요?', answer: '결제 취소는 결제 후 7일 이내에 가능합니다. 고객센터로 문의해 주세요.' },
        { id: 5, category: '기타', question: '사이트 이용 시간은 어떻게 되나요?', answer: '사이트는 24시간 운영됩니다. 언제든지 접속하셔서 AI 면접 연습을 할 수 있습니다.' },
        { id: 6, category: 'AI 면접 준비', question: '면접 결과는 언제 확인할 수 있나요?', answer: '면접 결과는 면접 완료 후 24시간 이내에 이메일로 발송됩니다.' },
        { id: 7, category: '기술 문제 해결', question: '사이트가 로딩되지 않아요. 어떻게 해야 하나요?', answer: '브라우저 캐시를 지우고 다시 시도해 보세요. 문제가 지속되면 다른 브라우저를 사용하거나 고객센터에 문의하세요.' },
        { id: 8, category: '결제 및 환불', question: '환불이 가능한가요?', answer: '환불은 결제 후 7일 이내에만 가능합니다. 자세한 사항은 이용약관을 참고하세요.' },
        { id: 9, category: '기타', question: 'AI 면접 연습을 위해 필요한 시스템 요구 사항은 무엇인가요?', answer: '최소 시스템 요구 사항은 최신 버전의 웹 브라우저와 안정적인 인터넷 연결입니다.' },
        { id: 10, category: '계정 및 로그인', question: '이메일 주소를 변경하고 싶어요. 어떻게 해야 하나요?', answer: '로그인 후, "내 정보" 페이지에서 이메일 주소를 변경할 수 있습니다.' },
        { id: 11, category: '계정 및 로그인', question: '아이디를 변경할 수 있나요?', answer: '아이디는 한 번 설정한 후에는 변경이 불가능합니다. 정확한 아이디를 설정해 주세요.' },
        { id: 12, category: 'AI 면접 준비', question: 'AI 면접에서는 어떤 유형의 질문을 받게 되나요?', answer: 'AI 면접에서는 상황 판단 능력, 문제 해결 능력, 그리고 성격 유형을 평가하는 질문을 받게 됩니다.' },
        { id: 13, category: '기술 문제 해결', question: '카메라가 작동하지 않아요. 어떻게 해야 하나요?', answer: '카메라 설정을 확인하고, 브라우저의 카메라 사용 권한을 허용해 주세요. 문제가 지속되면 고객센터에 문의하세요.' },
        { id: 14, category: '결제 및 환불', question: '할인 쿠폰은 어떻게 사용하나요?', answer: '결제 페이지에서 쿠폰 코드를 입력하면 할인이 자동으로 적용됩니다.' },
        { id: 15, category: '기타', question: '사이트 이용 중 문제가 발생하면 어떻게 하나요?', answer: '사이트 하단의 고객센터로 연락 주시면 신속히 도움을 드리겠습니다.' },
        { id: 16, category: 'AI 면접 준비', question: 'AI 면접 결과는 어떻게 분석되나요?', answer: 'AI 면접 결과는 표정, 목소리, 언어 등을 분석하여 종합적인 점수를 제공합니다.' },
        { id: 17, category: '기술 문제 해결', question: '음성이 제대로 녹음되지 않아요. 해결 방법이 있나요?', answer: '마이크 설정을 확인하고, 브라우저의 마이크 사용 권한을 허용해 주세요. 문제가 지속되면 고객센터에 문의하세요.' },
        { id: 18, category: '결제 및 환불', question: '결제 후 영수증을 받을 수 있나요?', answer: '결제 완료 후, 등록된 이메일로 영수증이 발송됩니다.' },
        { id: 19, category: '기타', question: 'AI 면접 연습 사이트는 모바일에서도 사용 가능한가요?', answer: '네, 모바일에서도 웹 브라우저를 통해 접근하여 AI 면접 연습을 할 수 있습니다.' },
        { id: 20, category: '계정 및 로그인', question: '회원 탈퇴는 어떻게 하나요?', answer: '회원 탈퇴는 "내 정보" 페이지에서 탈퇴 절차를 진행하실 수 있습니다. 탈퇴 후에는 모든 데이터가 삭제됩니다.' },
    ];

    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredFaqs, setFilteredFaqs] = useState(faqs);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const totalPages = Math.ceil(filteredFaqs.length / rowsPerPage);

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);
        if (category) {
            setFilteredFaqs(faqs.filter(faq => faq.category === category));
        } else {
            setFilteredFaqs(faqs);
        }
        setPage(0);
    };

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
    <div className={styles.container}>
        <div className={styles.sidebar}>
            <NestedList/>
        </div>
        <div className={styles.content}>
            <div style={{ padding: '20px' }}>
                <Box mb={3} display="flex" justifyContent="space-between">
                    <Typography variant="h4" gutterBottom>
                        자주 묻는 질문 (FAQ)
                    </Typography>
                    <RegisterButton to="/adminPage/adminFaqRegisterPage" />
                </Box>
                <Box mb={3}>
                    <FormControl fullWidth variant="outlined">
                        <StyledInputLabel>카테고리로 검색</StyledInputLabel>
                        <StyledSelect
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            label="카테고리로 검색"
                        >
                            <StyledMenuItem value="">
                                <em>전체</em>
                            </StyledMenuItem>
                            <StyledMenuItem value="계정 및 로그인">계정 및 로그인</StyledMenuItem>
                            <StyledMenuItem value="AI 면접 준비">AI 면접 준비</StyledMenuItem>
                            <StyledMenuItem value="기술 문제 해결">기술 문제 해결</StyledMenuItem>
                            <StyledMenuItem value="결제 및 환불">결제 및 환불</StyledMenuItem>
                            <StyledMenuItem value="기타">기타</StyledMenuItem>
                        </StyledSelect>
                    </FormControl>
                </Box>
                {filteredFaqs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(faq => (
                        <Accordion key={faq.id}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${faq.id}-content`}
                                id={`panel${faq.id}-header`}
                            >
                                <Typography variant="h6">{faq.category}: {faq.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))
                }

                {/* 페이지네이션 컨트롤 */}
                <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={() => handleChangePage(0)}
                        disabled={page === 0}
                        sx={{ marginRight: 2 }}
                    >
                        처음
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => handleChangePage(page - 1)}
                        disabled={page === 0}
                        sx={{ marginRight: 2 }}
                    >
                        이전
                    </Button>
                    <span>{page + 1} / {totalPages}</span>
                    <Button
                        variant="outlined"
                        onClick={() => handleChangePage(page + 1)}
                        disabled={page >= totalPages - 1}
                        sx={{ marginLeft: 2 }}
                    >
                        다음
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => handleChangePage(totalPages - 1)}
                        disabled={page >= totalPages - 1}
                        sx={{ marginLeft: 2 }}
                    >
                        마지막
                    </Button>
                    <Select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        sx={{ marginLeft: 2 }}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                    </Select>
                </Box>
            </div>
        </div>
    </div>
    );
};

export default AdminFaq;