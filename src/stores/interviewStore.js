import { makeAutoObservable } from 'mobx';

class InterviewStore {
    type = '';
    cameraReady = false;
    micReady = false;
    stream = '';
    countdown = 5;
    currentStep = 1;
    highContrast = false;
    audioLevel = 0;
    allReady = false;
    buttonActive = false;
    mockQuestions = { commonQuestions: [], resumeQuestions: [] };
    commonQuestions = [];
    resumeQuestions = [];
    activeTab = 'common';

    // 추가된 상태
    selectedQuestions = []; // 선택된 질문들을 관리할 배열
    openQuestion = null; // 현재 열려 있는 질문의 ID
    editMode = { id: null, type: null }; // 편집 중인 질문의 ID와 타입 (script 또는 keywords)
    tempEdit = { script: '', keywords: [] }; // 편집 중인 질문의 임시 저장 상태

    constructor() {
        makeAutoObservable(this);
        if (typeof window !== 'undefined') {
            this.loadInterviewData(); // 페이지 로드 시 데이터 복원
        }
    }
    
    // mockQuestions에서 commonQuestions와 resumeQuestions를 분리하는 함수
    parseMockQuestions() {
        if (this.mockQuestions && typeof this.mockQuestions === 'object') {
            this.commonQuestions = Array.isArray(this.mockQuestions.commonQuestions)
                ? this.mockQuestions.commonQuestions
                : [];
            this.resumeQuestions = Array.isArray(this.mockQuestions.resumeQuestions)
                ? this.mockQuestions.resumeQuestions
                : [];
        } else {
            this.commonQuestions = [];
            this.resumeQuestions = [];
        }
    }

    // mockQuestions 설정 및 로컬스토리지 저장
    setMockQuestions(mockQuestions) {
        this.mockQuestions = mockQuestions && typeof mockQuestions === 'object'
            ? mockQuestions
            : { commonQuestions: [], resumeQuestions: [] };

        this.parseMockQuestions(); // mockQuestions 설정 후 데이터 분리
        if (typeof window !== 'undefined') {
            localStorage.setItem('mockQuestions', JSON.stringify(mockQuestions));
        }
    }

    // 질문 선택 및 삭제
    toggleSelectedQuestion(id) {
        if (this.selectedQuestions.includes(id)) {
            this.selectedQuestions = this.selectedQuestions.filter(q => q !== id);
        } else {
            this.selectedQuestions.push(id);
        }
        console.log('선택된 질문들: ', this.selectedQuestions);
    }

    // 질문 열림 상태 설정
    setOpenQuestion(id) {
        this.openQuestion = id;
        console.log('열려 있는 질문 ID: ', this.openQuestion);
    }

    // 질문 편집 모드 설정
    setEditMode({ id, type }) {
        this.editMode = { id, type };
        console.log('편집 모드: ', this.editMode);
    }

    // 임시 편집 상태 설정
    setTempEdit({ script, keywords }) {
        this.tempEdit = { script, keywords };
        console.log('임시 편집 상태: ', this.tempEdit);
    }

    // 질문 저장
    saveQuestion({ id, script, keywords }) {
        const allQuestions = [...this.commonQuestions, ...this.resumeQuestions];
        const questionIndex = allQuestions.findIndex(q => q.id === id);
        if (questionIndex !== -1) {
            allQuestions[questionIndex].script = script;
            allQuestions[questionIndex].keywords = keywords;
        }
        console.log('질문 저장됨: ', allQuestions[questionIndex]);
        this.setEditMode({ id: null, type: null });
    }

    // 선택된 질문 초기화
    clearSelectedQuestions() {
        this.selectedQuestions = [];
        console.log('선택된 질문들이 초기화됨');
    }

    // 초기화 함수
    initializeInterviewStore() {
        this.type = '';
        if (typeof window !== 'undefined') {
            localStorage.removeItem('type');
        }
    }

    setType(type) {
        this.type = type;
        if (typeof window !== 'undefined') {
            localStorage.setItem('type', type);
        }
    }

    setCameraReady(cameraReady) {
        this.cameraReady = cameraReady;
        if (typeof window !== 'undefined') {
            localStorage.setItem('cameraReady', cameraReady);
        }
    }

    setMicReady(micReady) {
        this.micReady = micReady;
        if (typeof window !== 'undefined') {
            localStorage.setItem('micReady', micReady);
        }
    }

    setStream(stream) {
        this.stream = stream;
        if (typeof window !== 'undefined') {
            localStorage.setItem('stream', stream);
        }
    }

    setCountdown(countdown) {
        this.countdown = countdown;
        if (typeof window !== 'undefined') {
            localStorage.setItem('countdown', countdown);
        }
    }

    setCurrentStep(currentStep) {
        this.currentStep = currentStep;
        if (typeof window !== 'undefined') {
            localStorage.setItem('currentStep', currentStep);
        }
    }

    setHighContrast(highContrast) {
        this.highContrast = highContrast;
        if (typeof window !== 'undefined') {
            localStorage.setItem('highContrast', highContrast);
        }
    }

    setAudioLevel(audioLevel) {
        this.audioLevel = audioLevel;
    }

    setAllReady(allReady) {
        this.allReady = allReady;
        if (typeof window !== 'undefined') {
            localStorage.setItem('allReady', allReady);
        }
    }

    setButtonActive(buttonActive) {
        this.buttonActive = buttonActive;
        if (typeof window !== 'undefined') {
            localStorage.setItem('buttonActive', buttonActive);
        }
    }

    setActiveTab(activeTab) {
        this.activeTab = activeTab;
        if (typeof window !== 'undefined') {
            localStorage.setItem('activeTab', activeTab);
        }
    }

    // 로컬 스토리지에서 데이터 로드
    loadInterviewData() {
        if (typeof window !== 'undefined') {
            this.type = localStorage.getItem('type') || '';
            this.cameraReady = localStorage.getItem('cameraReady') === 'true';
            this.micReady = localStorage.getItem('micReady') === 'true';
            this.stream = localStorage.getItem('stream') || '';
            this.countdown = parseInt(localStorage.getItem('countdown'), 10) || 5;
            this.currentStep = parseInt(localStorage.getItem('currentStep'), 10) || 1;
            this.highContrast = localStorage.getItem('highContrast') === 'true';
            this.allReady = localStorage.getItem('allReady') === 'true';
            this.buttonActive = localStorage.getItem('buttonActive') === 'true';
            
            const storedMockQuestions = localStorage.getItem('mockQuestions');
            this.mockQuestions = storedMockQuestions ? JSON.parse(storedMockQuestions) : { commonQuestions: [], resumeQuestions: [] };
            this.parseMockQuestions();
        }
    }
}

const interviewStore = new InterviewStore();
export default interviewStore;