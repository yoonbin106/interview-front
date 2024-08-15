import { createSlice } from '@reduxjs/toolkit';

const questionSlice = createSlice({
  name: 'questions',
  initialState: {
    activeTab: 'common',
    selectedQuestions: [],
    openQuestion: null,
    editMode: { id: null, type: null },
    tempEdit: { script: '', keywords: [] },
    questions: {
      common: [
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
      }
      ],
      resume: [
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
      ],
    },
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleSelectedQuestion: (state, action) => {
      const index = state.selectedQuestions.indexOf(action.payload);
      if (index !== -1) {
        state.selectedQuestions.splice(index, 1);
      } else {
        state.selectedQuestions.push(action.payload);
      }
    },
    clearSelectedQuestions: (state) => {
      state.selectedQuestions = [];
    },
    setOpenQuestion: (state, action) => {
      state.openQuestion = action.payload;
    },
    setEditMode: (state, action) => {
      state.editMode = action.payload;
    },
    setTempEdit: (state, action) => {
      state.tempEdit = action.payload;
    },
    saveQuestion: (state, action) => {
      const { id, script, keywords } = action.payload;
      const questionType = state.questions.common.find(q => q.id === id) ? 'common' : 'resume';
      const questionIndex = state.questions[questionType].findIndex(q => q.id === id);
      if (questionIndex !== -1) {
        state.questions[questionType][questionIndex] = {
          ...state.questions[questionType][questionIndex],
          script,
          keywords,
        };
      }
    },
    deleteKeyword: (state, action) => {
      const { id, keyword } = action.payload;
      const questionType = state.questions.common.find(q => q.id === id) ? 'common' : 'resume';
      const questionIndex = state.questions[questionType].findIndex(q => q.id === id);
      if (questionIndex !== -1) {
        state.questions[questionType][questionIndex].keywords = 
          state.questions[questionType][questionIndex].keywords.filter(k => k !== keyword);
      }
    },
  },
});

export const {
  setActiveTab,
  toggleSelectedQuestion,
  clearSelectedQuestions,
  setOpenQuestion,
  setEditMode,
  setTempEdit,
  saveQuestion,
  deleteKeyword,
} = questionSlice.actions;

export default questionSlice.reducer;