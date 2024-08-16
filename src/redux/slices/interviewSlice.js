import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loadMockQuestions = createAsyncThunk(
  'interview/loadMockQuestions',
  async (selectedQuestions) => {
    // 기존의 모의 면접 질문 로직
      const mockQuestions = [
        { 
          id: 'c1', 
          question: "본인의 강점과 약점에 대해 말씀해주세요.",
          script: "저의 강점은 끈기와 열정입니다. 어려운 과제도 포기하지 않고 끝까지 해결하려 노력합니다. 약점은 때로 완벽주의적 성향을 보이는 것인데, 이를 개선하기 위해 중요도에 따라 우선순위를 설정하고 유연하게 대응하려 노력하고 있습니다.",
          keywords: ["끈기", "열정", "완벽주의", "우선순위 설정"]
        },
        { 
          id: 'c2', 
          question: "지원하신 직무에 관심을 갖게 된 계기는 무엇인가요?",
          script: "대학 시절 관련 프로젝트를 수행하면서 이 분야의 중요성과 발전 가능성을 깨달았습니다. 특히 기술이 사회에 미치는 긍정적인 영향력을 보며, 이 분야에서 전문성을 키워 의미 있는 변화를 만들고 싶다는 목표가 생겼습니다.",
          keywords: ["대학 프로젝트", "기술의 영향력", "전문성", "사회적 기여"]
        },
        { 
            id: 'c3', 
            question: "스트레스 상황을 어떻게 극복하시나요?",
            script: "저는 스트레스 상황에서 먼저 깊은 호흡을 통해 마음을 진정시킵니다. 그 후 문제의 원인을 파악하고 해결 방법을 단계별로 정리합니다. 운동이나 취미 활동을 통해 긍정적인 에너지를 얻는 것도 도움이 됩니다.",
            keywords: ["자기 조절", "문제 분석", "단계별 접근", "긍정적 활동"]
        },
        { 
            id: 'r1', 
            question: "가장 성공적이었던 프로젝트 경험에 대해 말씀해주세요.",
            script: "대학 4학년 때 진행한 AI 기반 환경 모니터링 시스템 개발 프로젝트가 가장 기억에 남습니다. 팀장으로서 프로젝트를 이끌며 팀원들의 강점을 최대한 활용했고, 결과적으로 학과 내 최우수 프로젝트로 선정되었습니다.",
            keywords: ["리더십", "팀워크", "AI 기술", "프로젝트 관리"]
        },
        { 
            id: 'r2', 
            question: "학창 시절 가장 열정적으로 임했던 활동은 무엇인가요?",
            script: "대학 동아리에서 진행한 지역 사회 봉사 활동이 가장 기억에 남습니다. 소외 계층 아동들을 위한 코딩 교육 프로그램을 기획하고 운영하면서, 지식 나눔의 가치와 사회적 책임감을 깊이 느낄 수 있었습니다.",
            keywords: ["봉사 활동", "코딩 교육", "사회적 책임", "리더십"]
        },
        { 
            id: 'r3', 
            question: "최근에 새롭게 습득한 기술이나 지식이 있다면 무엇인가요?",
            script: "최근 클라우드 컴퓨팅 기술에 대해 깊이 있게 공부하고 있습니다. AWS 자격증을 취득했으며, 실제 프로젝트에 클라우드 기술을 적용해 보며 실무 경험을 쌓고 있습니다. 이를 통해 확장성과 효율성 높은 시스템 구축 능력을 키우고 있습니다.",
            keywords: ["클라우드 컴퓨팅", "AWS", "자기 개발", "실무 적용"]
        }
      ];

      console.log("Selected questions for mock interview:", selectedQuestions);

       return selectedQuestions && selectedQuestions.length > 0
      ? selectedQuestions.map(id => mockQuestions.find(q => q.id === id) || { id, question: `질문 ${id}` })
      : mockQuestions;
  }
  );
    
  // 실전 면접 질문 로드 (OpenAI 통합을 가정)
export const loadRealQuestions = createAsyncThunk(
  'interview/loadRealQuestions',
  async (candidateData) => {
    // 여기서 OpenAI API를 호출하여 실제 질문을 생성할 수 있습니다.
    // 현재는 임시 데이터를 반환합니다.  
    const baseQuestions = [
      { 
        id: 'c1', 
        question: "본인의 강점과 약점에 대해 말씀해주세요.",
        script: "저의 강점은 끈기와 열정입니다. 어려운 과제도 포기하지 않고 끝까지 해결하려 노력합니다. 약점은 때로 완벽주의적 성향을 보이는 것인데, 이를 개선하기 위해 중요도에 따라 우선순위를 설정하고 유연하게 대응하려 노력하고 있습니다.",
        keywords: ["끈기", "열정", "완벽주의", "우선순위 설정"]
    },
    { 
      id: 'r1', 
      question: "귀하의 이력서에 언급된 프로젝트 X에 대해 자세히 설명해주시겠습니까?",
    },
    { 
      id: 'r2', 
      question: "자기소개서에서 언급하신 '혁신적인 문제 해결 방식'에 대해 구체적인 예를 들어주실 수 있나요?",
    }
  ]; // 임시 반환값
  
   // 꼬리 질문 생성 (실제로는 OpenAI가 생성할 내용)
   const followUpQuestions = baseQuestions.map(q => ({
    ...q,
    followUp: [
      { 
        id: `${q.id}-f1`, 
        question: `${q.question}에 대한 후속 질문 1`,
      },
      { 
        id: `${q.id}-f2`, 
        question: `${q.question}에 대한 후속 질문 2`,
      }
    ]
  }));
  return followUpQuestions;
  }
);

// loadQuestions 함수 수정
export const loadQuestions = createAsyncThunk(
  'interview/loadQuestions',
  async ({ interviewType, selectedQuestions, candidateData }, { dispatch }) => {
    console.log("loadQuestions called with:", { interviewType, selectedQuestions, candidateData });
    let result;
    if (interviewType === 'mock') {
      result = await dispatch(loadMockQuestions(selectedQuestions)).unwrap();
    } else if (interviewType === 'real') {
      result = await dispatch(loadRealQuestions(candidateData)).unwrap();
    } else {
      throw new Error(`Invalid interview type: ${interviewType}`);
    }
    console.log("loadQuestions result:", result);
    return result;
  }
);

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    type: null,
    cameraReady: false,
    micReady: false,
    stream: null,
    countdown: 5,
    currentStep: 1,
    highContrast: false,
    audioLevel: 0,
    allReady: false,
    questions: [],
    buttonActive: false,
    interviewData: null,
    status: 'idle', // 새로운 상태 추가
    error: null, // 에러 상태 추가
  },
  reducers: {
    setInterviewType: (state, action) => {
      state.type = action.payload;
    },
    setCameraReady: (state, action) => {
      state.cameraReady = action.payload;
    },
    setMicReady: (state, action) => {
      state.micReady = action.payload;
    },
    setStream: (state, action) => {
      state.stream = action.payload;
    },
    setCountdown: (state, action) => {
      state.countdown = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    toggleHighContrast: (state) => {
      state.highContrast = !state.highContrast;
    },
    setAudioLevel: (state, action) => {
      state.audioLevel = action.payload;
    },
    setAllReady: (state, action) => {
      state.allReady = action.payload;
    },
    setButtonActive: (state, action) => {
      state.buttonActive = action.payload;
    },
    setInterviewData: (state, action) => {
      state.interviewData = action.payload; // interviewData 상태 업데이트
    },
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(loadQuestions.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    })
    .addCase(loadQuestions.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.questions = action.payload;
      state.error = null;
    })
    .addCase(loadQuestions.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  },
});

export const {
  setInterviewType,
  setCameraReady,
  setMicReady,
  setStream,
  setCountdown,
  setCurrentStep,
  toggleHighContrast,
  setAudioLevel,
  setAllReady,
  setButtonActive,
  setInterviewData,
  setQuestions,
  setStatus,
  setError,
} = interviewSlice.actions;

export default interviewSlice.reducer;